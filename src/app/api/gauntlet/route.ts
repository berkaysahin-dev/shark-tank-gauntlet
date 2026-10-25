import { NextRequest, NextResponse } from "next/server";
import { sanitizeUserInput, wrapInPromptQuarantine } from "@/lib/security";
import {
  simulateInitialObjection,
  simulateEvaluation,
  simulateVerdict,
} from "@/lib/simulation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, juror, pitch, objection, userResponse, currentConviction, history, jurorStates, lang } = body;
    const targetLang = lang === "tr" ? "tr" : "en";

    // Client-provided private API key from header, or server-side env (optional)
    const clientGeminiKey = req.headers.get("x-gemini-key") || process.env.GEMINI_API_KEY;

    // 1. Action: Generate initial objection
    if (action === "generate_objection") {
      if (!juror || !pitch) {
        return NextResponse.json({ error: "Missing juror or pitch data" }, { status: 400 });
      }

      if (clientGeminiKey) {
        try {
          const jurorName = targetLang === "tr" ? juror.nameTr : juror.name;
          const jurorTitle = targetLang === "tr" ? juror.roleTitleTr : juror.roleTitle;
          const jurorMotto = targetLang === "tr" ? juror.mottoTr : juror.motto;
          const jurorTemplate = targetLang === "tr" ? juror.coreObjectionTemplateTr : juror.coreObjectionTemplate;

          const prompt = `You are playing the role of a merciless, skeptical courtroom boardroom judge in a Shark Tank simulation called "The Gauntlet".
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

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${clientGeminiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: 250, temperature: 0.8 },
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (text) {
              return NextResponse.json({ objection: sanitizeUserInput(text, 500) });
            }
          }
        } catch {
          // Fall through to offline heuristic engine
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

      if (clientGeminiKey) {
        try {
          const jurorName = targetLang === "tr" ? juror.nameTr : juror.name;
          const prompt = `You are evaluating a founder's counter-argument in a brutal boardroom pitch simulation.
Judge: ${jurorName} (${juror.archetype})
Psychology: ${juror.psychology}
Fatal Trigger (instant loss if detected): ${juror.fatalTrigger}
Persuasion Key (required to convince): ${juror.persuasionKey}
Current Conviction: ${currentConviction}/100
Language: Respond strictly in ${targetLang === "tr" ? "Turkish" : "English"}.

Judge's Objection:
"${objection}"

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

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${clientGeminiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                  responseMimeType: "application/json",
                  maxOutputTokens: 300,
                  temperature: 0.7,
                },
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (rawJson) {
              const parsed = JSON.parse(rawJson);
              const delta = typeof parsed.scoreDelta === "number" ? parsed.scoreDelta : 0;
              const resultingConviction = Math.max(0, Math.min(100, currentConviction + delta));
              return NextResponse.json({
                jurorReaction: sanitizeUserInput(parsed.jurorReaction, 500),
                scoreDelta: delta,
                resultingConviction,
                isFatal: Boolean(parsed.isFatal),
              });
            }
          }
        } catch {
          // Fall through to offline heuristic
        }
      }

      // Offline simulation fallback
      const simResult = simulateEvaluation(juror, pitch, objection, cleanUserResponse, currentConviction, targetLang);
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
