import { NextRequest, NextResponse } from "next/server";
import { sanitizeUserInput, wrapInPromptQuarantine } from "@/lib/security";
import {
  simulateInitialObjection,
  simulateEvaluation,
  simulateVerdict,
} from "@/lib/simulation";

const GEMINI_MODEL = "gemini-2.5-flash";
const OPENAI_MODEL = "gpt-4o-mini";
const LLM_TIMEOUT_MS = 20000;

interface LlmKeys {
  gemini?: string;
  openai?: string;
}

interface GenerateOptions {
  json?: boolean;
  maxTokens: number;
  temperature: number;
}

async function callGemini(key: string, prompt: string, opts: GenerateOptions): Promise<string | null> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: opts.maxTokens,
          temperature: opts.temperature,
          // Gemini 2.5 spends output tokens on "thinking" by default; disable it
          // so short in-character replies are not truncated.
          thinkingConfig: { thinkingBudget: 0 },
          ...(opts.json ? { responseMimeType: "application/json" } : {}),
        },
      }),
      signal: AbortSignal.timeout(LLM_TIMEOUT_MS),
    }
  );
  if (!response.ok) return null;
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
}

async function callOpenAI(key: string, prompt: string, opts: GenerateOptions): Promise<string | null> {
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
  if (!response.ok) return null;
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
}

/** Tries Gemini first, then OpenAI. Returns null so callers fall back to the offline simulator. */
async function generateText(keys: LlmKeys, prompt: string, opts: GenerateOptions): Promise<string | null> {
  if (keys.gemini) {
    try {
      const text = await callGemini(keys.gemini, prompt, opts);
      if (text) return text;
    } catch {
      // try next provider
    }
  }
  if (keys.openai) {
    try {
      const text = await callOpenAI(keys.openai, prompt, opts);
      if (text) return text;
    } catch {
      // fall through to offline simulator
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, juror, pitch, objection, userResponse, history, jurorStates, lang } = body;
    const targetLang = lang === "tr" ? "tr" : "en";
    const rawConviction = Number(body.currentConviction);
    const currentConviction = Number.isFinite(rawConviction) ? Math.max(0, Math.min(100, rawConviction)) : 50;

    // Client-provided private API keys (BYOK) from headers, or optional server-side env defaults.
    const keys: LlmKeys = {
      gemini: req.headers.get("x-gemini-key") || process.env.GEMINI_API_KEY || undefined,
      openai: req.headers.get("x-openai-key") || process.env.OPENAI_API_KEY || undefined,
    };
    const hasLlm = Boolean(keys.gemini || keys.openai);

    // 1. Action: Generate initial objection
    if (action === "generate_objection") {
      if (!juror || !pitch) {
        return NextResponse.json({ error: "Missing juror or pitch data" }, { status: 400 });
      }

      if (hasLlm) {
        const jurorName = targetLang === "tr" ? juror.nameTr : juror.name;
        const jurorTitle = targetLang === "tr" ? juror.roleTitleTr : juror.roleTitle;
        const jurorMotto = targetLang === "tr" ? juror.mottoTr : juror.motto;
        const jurorTemplate = targetLang === "tr" ? juror.coreObjectionTemplateTr : juror.coreObjectionTemplate;

        const prompt = `You are playing the role of a merciless, skeptical boardroom judge in a startup pitch simulation called "The Gauntlet".
Character: ${jurorName}
Role: ${jurorTitle} (${juror.archetype})
Psychology: ${juror.psychology}
Motto: "${jurorMotto}"
Core Objection Style: "${jurorTemplate}"
Language: Respond strictly in ${targetLang === "tr" ? "natural Turkish" : "natural English"}.

Founder's Pitch:
${wrapInPromptQuarantine("pitch_name", pitch.productName)}
${wrapInPromptQuarantine("pitch_oneliner", pitch.oneLiner)}
${wrapInPromptQuarantine("pitch_audience", pitch.targetAudience)}
${wrapInPromptQuarantine("pitch_pricing", pitch.pricingModel)}

Task:
Generate a direct, highly customized, ruthless 2-3 sentence objection in simple, plain, punchy ${targetLang === "tr" ? "Turkish" : "English"} targeting this specific founder's product name and premise.
Be completely in character, skeptical, and demanding. Do NOT include greetings or polite fluff. Jump straight into the confrontation.`;

        const text = await generateText(keys, prompt, { maxTokens: 250, temperature: 0.8 });
        if (text) {
          return NextResponse.json({ objection: sanitizeUserInput(text, 500) });
        }
      }

      // Offline simulation fallback
      const objectionText = simulateInitialObjection(juror, pitch, targetLang);
      return NextResponse.json({ objection: objectionText });
    }

    // 2. Action: Evaluate user counter-response
    if (action === "evaluate_response") {
      if (!juror || !pitch || !userResponse) {
        return NextResponse.json({ error: "Missing evaluation inputs" }, { status: 400 });
      }

      const cleanUserResponse = sanitizeUserInput(userResponse, 1000);
      const cleanObjection = sanitizeUserInput(typeof objection === "string" ? objection : "", 600);

      if (hasLlm) {
        const jurorName = targetLang === "tr" ? juror.nameTr : juror.name;
        const prompt = `You are evaluating a founder's counter-argument in a brutal boardroom pitch simulation.
Judge: ${jurorName} (${juror.archetype})
Psychology: ${juror.psychology}
Fatal Trigger (instant loss if detected): ${juror.fatalTrigger}
Persuasion Key (required to convince): ${juror.persuasionKey}
Current Conviction: ${currentConviction}/100
Language: Respond strictly in ${targetLang === "tr" ? "Turkish" : "English"}.

Judge's Objection:
${wrapInPromptQuarantine("judge_objection", cleanObjection)}

Founder's Counter-Response:
${wrapInPromptQuarantine("counter_response", cleanUserResponse)}

Evaluation Rules:
1. Did the founder directly address the psychological core of the objection?
2. If founder used empty buzzwords, clichés, or triggered the Fatal Trigger, penalize with negative scoreDelta (-20 to -35).
3. If founder presented concrete data, risk mitigation, or hit the Persuasion Key, reward with positive scoreDelta (+25 to +40).
4. Provide the judge's realistic, unfiltered reaction in plain, accessible ${targetLang === "tr" ? "Turkish" : "English"} (1-3 sentences).

Respond ONLY with valid JSON in this exact structure:
{
  "jurorReaction": "string in ${targetLang === "tr" ? "Turkish" : "English"}",
  "scoreDelta": number (between -35 and 40),
  "isFatal": boolean
}`;

        const rawJson = await generateText(keys, prompt, { json: true, maxTokens: 300, temperature: 0.7 });
        if (rawJson) {
          try {
            const parsed = JSON.parse(rawJson);
            const rawDelta = typeof parsed.scoreDelta === "number" ? parsed.scoreDelta : 0;
            const delta = Math.max(-35, Math.min(40, Math.round(rawDelta)));
            const resultingConviction = Math.max(0, Math.min(100, currentConviction + delta));
            return NextResponse.json({
              jurorReaction: sanitizeUserInput(String(parsed.jurorReaction ?? ""), 500),
              scoreDelta: delta,
              resultingConviction,
              isFatal: Boolean(parsed.isFatal),
            });
          } catch {
            // Malformed model output: fall through to offline heuristic
          }
        }
      }

      // Offline simulation fallback
      const simResult = simulateEvaluation(juror, pitch, cleanObjection, cleanUserResponse, currentConviction, targetLang);
      return NextResponse.json(simResult);
    }

    // 3. Action: Generate final verdict dossier
    if (action === "generate_verdict") {
      const summary = simulateVerdict(pitch, history || [], jurorStates || {}, targetLang);
      return NextResponse.json(summary);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}
