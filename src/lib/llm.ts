import { JurorConfig, PitchData, TurnExchange, VerdictSummary } from "@/types/gauntlet";
import { Language } from "@/locales/i18n";
import { sanitizeUserInput, validateApiKeyFormat } from "@/lib/security";
import { buildEvaluationPrompt, buildObjectionPrompt, buildVerdictPrompt } from "@/lib/prompts";
import { simulateInitialObjection, simulateEvaluation, simulateVerdict } from "@/lib/simulation";

export type ExecutionMode = "byok-gemini" | "byok-openai" | "server-ai" | "offline";
export type FallbackReason = "invalid_key" | "rate_limited" | "provider_error" | "no_key";

export interface LlmMeta {
  mode: ExecutionMode;
  fallbackReason?: FallbackReason;
  quotaRemaining?: number;
  quotaLimit?: number;
}

const GEMINI_MODELS = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-flash-lite-latest"];
const OPENAI_MODEL = "gpt-4o-mini";
const CLIENT_TIMEOUT_MS = 20000;

export function getStoredByokKeys(): { geminiKey: string; openaiKey: string; hasValidKey: boolean } {
  if (typeof window === "undefined") {
    return { geminiKey: "", openaiKey: "", hasValidKey: false };
  }
  const geminiKey = (sessionStorage.getItem("gauntlet_gemini_key") || "").trim();
  const openaiKey = (sessionStorage.getItem("gauntlet_openai_key") || "").trim();
  const hasValidKey =
    (Boolean(geminiKey) && validateApiKeyFormat(geminiKey, "gemini")) ||
    (Boolean(openaiKey) && validateApiKeyFormat(openaiKey, "openai"));
  return { geminiKey, openaiKey, hasValidKey };
}

interface DirectCallResult {
  text: string | null;
  provider?: "byok-gemini" | "byok-openai";
  errorReason?: "invalid_key" | "rate_limited" | "provider_error";
}

async function callGeminiDirect(
  key: string,
  prompt: string,
  opts: { json?: boolean; maxTokens: number; temperature: number }
): Promise<{ text: string | null; errorReason?: "invalid_key" | "rate_limited" | "provider_error" }> {
  let lastError: "invalid_key" | "rate_limited" | "provider_error" = "provider_error";

  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": key,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              maxOutputTokens: opts.maxTokens,
              temperature: opts.temperature,
              thinkingConfig: { thinkingBudget: 0 },
              ...(opts.json ? { responseMimeType: "application/json" } : {}),
            },
          }),
          signal: AbortSignal.timeout(CLIENT_TIMEOUT_MS),
        }
      );
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          return { text: null, errorReason: "invalid_key" };
        }
        if (res.status === 400) {
          const errText = await res.text().catch(() => "");
          if (/API_KEY_INVALID|API key not valid/i.test(errText)) {
            return { text: null, errorReason: "invalid_key" };
          }
          lastError = "provider_error";
          continue;
        }
        if (res.status === 429) {
          lastError = "rate_limited";
          continue;
        }
        if (res.status === 404) {
          lastError = "provider_error";
          continue;
        }
        lastError = "provider_error";
        continue;
      }
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
      if (text) return { text };
      lastError = "provider_error";
    } catch {
      lastError = "provider_error";
    }
  }

  return { text: null, errorReason: lastError };
}

async function callOpenAIDirect(
  key: string,
  prompt: string,
  opts: { json?: boolean; maxTokens: number; temperature: number }
): Promise<{ text: string | null; errorReason?: "invalid_key" | "rate_limited" | "provider_error" }> {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: opts.maxTokens,
        temperature: opts.temperature,
        ...(opts.json ? { response_format: { type: "json_object" } } : {}),
      }),
      signal: AbortSignal.timeout(CLIENT_TIMEOUT_MS),
    });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        return { text: null, errorReason: "invalid_key" };
      }
      if (res.status === 429) {
        return { text: null, errorReason: "rate_limited" };
      }
      return { text: null, errorReason: "provider_error" };
    }
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim() || null;
    return text ? { text } : { text: null, errorReason: "provider_error" };
  } catch {
    return { text: null, errorReason: "provider_error" };
  }
}

/**
 * Direct Browser BYOK: Calls Gemini / OpenAI straight from the user's browser.
 * User keys NEVER touch the gauntlet.berkaysahin.net server.
 */
async function tryDirectByok(
  prompt: string,
  opts: { json?: boolean; maxTokens: number; temperature: number }
): Promise<DirectCallResult & { attempted: boolean }> {
  const { geminiKey, openaiKey } = getStoredByokKeys();
  if (!geminiKey && !openaiKey) {
    return { attempted: false, text: null };
  }

  let lastError: "invalid_key" | "rate_limited" | "provider_error" | undefined;

  if (geminiKey) {
    if (!validateApiKeyFormat(geminiKey, "gemini")) {
      lastError = "invalid_key";
    } else {
      const res = await callGeminiDirect(geminiKey, prompt, opts);
      if (res.text) {
        return { attempted: true, text: res.text, provider: "byok-gemini" };
      }
      lastError = res.errorReason;
    }
  }

  if (openaiKey) {
    if (!validateApiKeyFormat(openaiKey, "openai")) {
      lastError = "invalid_key";
    } else {
      const res = await callOpenAIDirect(openaiKey, prompt, opts);
      if (res.text) {
        return { attempted: true, text: res.text, provider: "byok-openai" };
      }
      lastError = res.errorReason;
    }
  }

  return { attempted: true, text: null, errorReason: lastError ?? "provider_error" };
}

export async function fetchServerAiStatus(): Promise<{
  serverAiAvailable: boolean;
  remaining: number;
  limit: number;
}> {
  try {
    const res = await fetch("/api/gauntlet", { method: "GET" });
    if (!res.ok) return { serverAiAvailable: false, remaining: 0, limit: 0 };
    return await res.json();
  } catch {
    return { serverAiAvailable: false, remaining: 0, limit: 0 };
  }
}

export async function fetchJurorObjection(
  juror: JurorConfig,
  pitch: PitchData,
  lang: Language = "en"
): Promise<{ objection: string } & LlmMeta> {
  // 1. Direct Browser BYOK first (zero server key exposure)
  const prompt = buildObjectionPrompt(juror, pitch, lang);
  const direct = await tryDirectByok(prompt, { maxTokens: 250, temperature: 0.8 });

  if (direct.text && direct.provider) {
    return {
      objection: sanitizeUserInput(direct.text, 500),
      mode: direct.provider,
    };
  }

  // If user explicitly provided a BYOK key and it failed, DO NOT silently mask it
  if (direct.attempted) {
    return {
      objection: simulateInitialObjection(juror, pitch, lang),
      mode: "offline",
      fallbackReason: direct.errorReason ?? "invalid_key",
    };
  }

  // 2. Server-side Free Live AI (rate-limited) or Offline Simulation
  try {
    const res = await fetch("/api/gauntlet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "generate_objection",
        juror,
        pitch,
        lang,
      }),
    });
    if (!res.ok) throw new Error("Objection generation failed");
    const data = await res.json();
    return {
      objection: data.objection || simulateInitialObjection(juror, pitch, lang),
      mode: data.mode || "offline",
      fallbackReason: data.fallbackReason,
      quotaRemaining: data.quotaRemaining,
      quotaLimit: data.quotaLimit,
    };
  } catch {
    return {
      objection: simulateInitialObjection(juror, pitch, lang),
      mode: "offline",
      fallbackReason: "provider_error",
    };
  }
}

export async function evaluateCounterResponse(
  juror: JurorConfig,
  pitch: PitchData,
  objection: string,
  userResponse: string,
  currentConviction: number,
  lang: Language = "en"
): Promise<
  {
    jurorReaction: string;
    scoreDelta: number;
    resultingConviction: number;
    isFatal: boolean;
  } & LlmMeta
> {
  const prompt = buildEvaluationPrompt(juror, objection, userResponse, currentConviction, lang);
  const direct = await tryDirectByok(prompt, { json: true, maxTokens: 300, temperature: 0.7 });

  if (direct.text && direct.provider) {
    try {
      const parsed = JSON.parse(direct.text);
      const rawDelta = typeof parsed.scoreDelta === "number" ? parsed.scoreDelta : 0;
      const delta = Math.max(-35, Math.min(40, Math.round(rawDelta)));
      const resultingConviction = Math.max(0, Math.min(100, currentConviction + delta));
      return {
        jurorReaction: sanitizeUserInput(String(parsed.jurorReaction ?? ""), 500),
        scoreDelta: delta,
        resultingConviction,
        isFatal: Boolean(parsed.isFatal),
        mode: direct.provider,
      };
    } catch {
      const sim = simulateEvaluation(juror, pitch, objection, userResponse, currentConviction, lang);
      return { ...sim, mode: "offline", fallbackReason: "provider_error" };
    }
  }

  if (direct.attempted) {
    const sim = simulateEvaluation(juror, pitch, objection, userResponse, currentConviction, lang);
    return { ...sim, mode: "offline", fallbackReason: direct.errorReason ?? "invalid_key" };
  }

  try {
    const res = await fetch("/api/gauntlet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "evaluate_response",
        juror,
        pitch,
        objection,
        userResponse,
        currentConviction,
        lang,
      }),
    });
    if (!res.ok) throw new Error("Evaluation failed");
    const data = await res.json();
    return {
      jurorReaction: data.jurorReaction,
      scoreDelta: data.scoreDelta,
      resultingConviction: data.resultingConviction,
      isFatal: Boolean(data.isFatal),
      mode: data.mode || "offline",
      fallbackReason: data.fallbackReason,
      quotaRemaining: data.quotaRemaining,
      quotaLimit: data.quotaLimit,
    };
  } catch {
    const sim = simulateEvaluation(juror, pitch, objection, userResponse, currentConviction, lang);
    return { ...sim, mode: "offline", fallbackReason: "provider_error" };
  }
}

export async function fetchVerdictSummary(
  pitch: PitchData,
  history: TurnExchange[],
  jurorStates: Record<string, { conviction: number }>,
  lang: Language = "en"
): Promise<VerdictSummary & LlmMeta> {
  const baseSummary = simulateVerdict(pitch, history, jurorStates, lang);

  if (history.length > 0) {
    const prompt = buildVerdictPrompt(pitch, history, jurorStates, lang);
    const direct = await tryDirectByok(prompt, { json: true, maxTokens: 400, temperature: 0.65 });

    if (direct.text && direct.provider) {
      try {
        const parsed = JSON.parse(direct.text);
        return {
          ...baseSummary,
          valuationVerdict: sanitizeUserInput(
            String(parsed.valuationVerdict || baseSummary.valuationVerdict),
            140
          ),
          lethalVulnerability: sanitizeUserInput(
            String(parsed.lethalVulnerability || baseSummary.lethalVulnerability),
            320
          ),
          strategicRemedy: sanitizeUserInput(
            String(parsed.strategicRemedy || baseSummary.strategicRemedy),
            320
          ),
          mode: direct.provider,
        };
      } catch {
        return { ...baseSummary, mode: "offline", fallbackReason: "provider_error" };
      }
    }

    if (direct.attempted) {
      return {
        ...baseSummary,
        mode: "offline",
        fallbackReason: direct.errorReason ?? "invalid_key",
      };
    }
  }

  try {
    const res = await fetch("/api/gauntlet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "generate_verdict",
        pitch,
        history,
        jurorStates,
        lang,
      }),
    });
    if (!res.ok) throw new Error("Verdict generation failed");
    const data = await res.json();
    return {
      ...baseSummary,
      ...data,
      mode: data.mode || "offline",
    };
  } catch {
    return { ...baseSummary, mode: "offline", fallbackReason: "provider_error" };
  }
}
