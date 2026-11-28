import { NextRequest, NextResponse } from "next/server";
import { sanitizeUserInput } from "@/lib/security";
import { buildEvaluationPrompt, buildObjectionPrompt, buildVerdictPrompt } from "@/lib/prompts";
import { checkAndConsumeFreeAiQuota, extractClientIp, peekFreeAiQuota } from "@/lib/rateLimit";
import {
  simulateInitialObjection,
  simulateEvaluation,
  simulateVerdict,
} from "@/lib/simulation";
import { JurorConfig, PitchData, TurnExchange } from "@/types/gauntlet";
import { Language } from "@/locales/i18n";

const GEMINI_MODELS = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-flash-lite-latest"];
const OPENAI_MODEL = "gpt-4o-mini";
const LLM_TIMEOUT_MS = 20000;
const MAX_BODY_BYTES = 32 * 1024; // 32 KB strict request cap
const MAX_HISTORY_ITEMS = 10;

interface GenerateOptions {
  json?: boolean;
  maxTokens: number;
  temperature: number;
}

interface ProviderCallResult {
  text: string | null;
  errorType?: "invalid_key" | "rate_limited" | "provider_error";
}

async function callServerGemini(key: string, prompt: string, opts: GenerateOptions): Promise<ProviderCallResult> {
  let lastError: "invalid_key" | "rate_limited" | "provider_error" = "provider_error";

  for (const model of GEMINI_MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              maxOutputTokens: opts.maxTokens,
              temperature: opts.temperature,
              thinkingConfig: { thinkingBudget: 0 },
              ...(opts.json ? { responseMimeType: "application/json" } : {}),
            },
          }),
          signal: AbortSignal.timeout(LLM_TIMEOUT_MS),
        }
      );
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) return { text: null, errorType: "invalid_key" };
        if (response.status === 429) {
          lastError = "rate_limited";
          continue;
        }
        lastError = "provider_error";
        continue;
      }
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
      if (text) return { text };
      lastError = "provider_error";
    } catch {
      lastError = "provider_error";
    }
  }

  return { text: null, errorType: lastError };
}

async function callServerOpenAI(key: string, prompt: string, opts: GenerateOptions): Promise<ProviderCallResult> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: opts.maxTokens,
        temperature: opts.temperature,
        ...(opts.json ? { response_format: { type: "json_object" } } : {}),
      }),
      signal: AbortSignal.timeout(LLM_TIMEOUT_MS),
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) return { text: null, errorType: "invalid_key" };
      if (response.status === 429) return { text: null, errorType: "rate_limited" };
      return { text: null, errorType: "provider_error" };
    }
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() || null;
    return { text };
  } catch {
    return { text: null, errorType: "provider_error" };
  }
}

async function generateWithServerKeys(
  prompt: string,
  opts: GenerateOptions
): Promise<ProviderCallResult> {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();

  if (geminiKey) {
    const res = await callServerGemini(geminiKey, prompt, opts);
    if (res.text) return res;
    if (!openaiKey) return res;
  }
  if (openaiKey) {
    return await callServerOpenAI(openaiKey, prompt, opts);
  }
  return { text: null };
}

export async function GET(req: NextRequest) {
  const serverAiAvailable = Boolean(
    process.env.GEMINI_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim()
  );
  if (!serverAiAvailable) {
    return NextResponse.json({
      serverAiAvailable: false,
      remaining: 0,
      limit: 0,
    });
  }
  const ip = extractClientIp(req.headers);
  const quota = await peekFreeAiQuota(ip);
  return NextResponse.json({
    serverAiAvailable: quota.globalRemaining > 0,
    remaining: quota.remaining,
    limit: quota.limit,
  });
}

export async function POST(req: NextRequest) {
  try {
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const rawText = await req.text();
    if (Buffer.byteLength(rawText, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const body = JSON.parse(rawText);
    const { action, juror, pitch, objection, userResponse, history, jurorStates, lang } = body as {
      action?: string;
      juror?: JurorConfig;
      pitch?: PitchData;
      objection?: string;
      userResponse?: string;
      history?: TurnExchange[];
      jurorStates?: Record<string, { conviction: number }>;
      lang?: string;
      currentConviction?: unknown;
    };

    const targetLang: Language = lang === "tr" ? "tr" : "en";
    const rawConviction = Number(body.currentConviction);
    const currentConviction = Number.isFinite(rawConviction)
      ? Math.max(0, Math.min(100, rawConviction))
      : 50;

    const hasServerKeys = Boolean(
      process.env.GEMINI_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim()
    );

    let canUseServerAi = false;
    let fallbackReason: "no_key" | "rate_limited" | "provider_error" | undefined = hasServerKeys
      ? undefined
      : "no_key";
    let quotaRemaining = 0;
    let quotaLimit = 0;

    if (hasServerKeys && (action === "generate_objection" || action === "evaluate_response" || action === "generate_verdict")) {
      const ip = extractClientIp(req.headers);
      const quota = await checkAndConsumeFreeAiQuota(ip);
      quotaRemaining = quota.remaining;
      quotaLimit = quota.limit;
      if (quota.allowed) {
        canUseServerAi = true;
      } else {
        fallbackReason = "rate_limited";
      }
    }

    // 1. Action: Generate initial objection
    if (action === "generate_objection") {
      if (!juror || !pitch) {
        return NextResponse.json({ error: "Missing juror or pitch data" }, { status: 400 });
      }

      if (canUseServerAi) {
        const prompt = buildObjectionPrompt(juror, pitch, targetLang);
        const result = await generateWithServerKeys(prompt, { maxTokens: 250, temperature: 0.8 });
        if (result.text) {
          return NextResponse.json({
            objection: sanitizeUserInput(result.text, 500),
            mode: "server-ai",
            quotaRemaining,
            quotaLimit,
          });
        }
        fallbackReason = result.errorType === "rate_limited" ? "rate_limited" : "provider_error";
      }

      const objectionText = simulateInitialObjection(juror, pitch, targetLang);
      return NextResponse.json({
        objection: objectionText,
        mode: "offline",
        fallbackReason,
        quotaRemaining,
        quotaLimit,
      });
    }

    // 2. Action: Evaluate user counter-response
    if (action === "evaluate_response") {
      if (!juror || !pitch || !userResponse) {
        return NextResponse.json({ error: "Missing evaluation inputs" }, { status: 400 });
      }

      const cleanUserResponse = sanitizeUserInput(userResponse, 1000);
      const cleanObjection = sanitizeUserInput(typeof objection === "string" ? objection : "", 600);

      if (canUseServerAi) {
        const prompt = buildEvaluationPrompt(
          juror,
          cleanObjection,
          cleanUserResponse,
          currentConviction,
          targetLang
        );
        const result = await generateWithServerKeys(prompt, {
          json: true,
          maxTokens: 300,
          temperature: 0.7,
        });
        if (result.text) {
          try {
            const parsed = JSON.parse(result.text);
            const rawDelta = typeof parsed.scoreDelta === "number" ? parsed.scoreDelta : 0;
            const delta = Math.max(-35, Math.min(40, Math.round(rawDelta)));
            const resultingConviction = Math.max(0, Math.min(100, currentConviction + delta));
            return NextResponse.json({
              jurorReaction: sanitizeUserInput(String(parsed.jurorReaction ?? ""), 500),
              scoreDelta: delta,
              resultingConviction,
              isFatal: Boolean(parsed.isFatal),
              mode: "server-ai",
              quotaRemaining,
              quotaLimit,
            });
          } catch {
            fallbackReason = "provider_error";
          }
        } else {
          fallbackReason = result.errorType === "rate_limited" ? "rate_limited" : "provider_error";
        }
      }

      const simResult = simulateEvaluation(
        juror,
        pitch,
        cleanObjection,
        cleanUserResponse,
        currentConviction,
        targetLang
      );
      return NextResponse.json({
        ...simResult,
        mode: "offline",
        fallbackReason,
        quotaRemaining,
        quotaLimit,
      });
    }

    // 3. Action: Generate final verdict dossier
    if (action === "generate_verdict") {
      if (!pitch) {
        return NextResponse.json({ error: "Missing pitch data" }, { status: 400 });
      }
      const boundedHistory = Array.isArray(history) ? history.slice(0, MAX_HISTORY_ITEMS) : [];
      const safeStates = jurorStates && typeof jurorStates === "object" ? jurorStates : {};
      const baseSummary = simulateVerdict(pitch, boundedHistory, safeStates, targetLang);

      if (canUseServerAi && boundedHistory.length > 0) {
        const prompt = buildVerdictPrompt(pitch, boundedHistory, safeStates, targetLang);
        const result = await generateWithServerKeys(prompt, {
          json: true,
          maxTokens: 400,
          temperature: 0.65,
        });
        if (result.text) {
          try {
            const parsed = JSON.parse(result.text);
            return NextResponse.json({
              ...baseSummary,
              valuationVerdict: sanitizeUserInput(String(parsed.valuationVerdict || baseSummary.valuationVerdict), 140),
              lethalVulnerability: sanitizeUserInput(String(parsed.lethalVulnerability || baseSummary.lethalVulnerability), 320),
              strategicRemedy: sanitizeUserInput(String(parsed.strategicRemedy || baseSummary.strategicRemedy), 320),
              mode: "server-ai",
              quotaRemaining,
              quotaLimit,
            });
          } catch {
            fallbackReason = "provider_error";
          }
        }
      }

      return NextResponse.json({
        ...baseSummary,
        mode: "offline",
        fallbackReason,
        quotaRemaining,
        quotaLimit,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}
