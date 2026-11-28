import { JurorConfig, PitchData, TurnExchange } from "@/types/gauntlet";
import { Language } from "@/locales/i18n";
import { sanitizeUserInput, wrapInPromptQuarantine } from "@/lib/security";

export function buildObjectionPrompt(
  juror: JurorConfig,
  pitch: PitchData,
  lang: Language
): string {
  const jurorName = lang === "tr" ? juror.nameTr : juror.name;
  const jurorTitle = lang === "tr" ? juror.roleTitleTr : juror.roleTitle;
  const jurorMotto = lang === "tr" ? juror.mottoTr : juror.motto;
  const jurorTemplate = lang === "tr" ? juror.coreObjectionTemplateTr : juror.coreObjectionTemplate;

  return `You are playing the role of a merciless, skeptical boardroom judge in a startup pitch simulation called "The Gauntlet".
Character: ${jurorName}
Role: ${jurorTitle} (${juror.archetype})
Psychology: ${juror.psychology}
Motto: "${jurorMotto}"
Core Objection Style: "${jurorTemplate}"
Language: Respond strictly in ${lang === "tr" ? "natural Turkish" : "natural English"}.

Founder's Pitch:
${wrapInPromptQuarantine("pitch_name", pitch.productName, 120)}
${wrapInPromptQuarantine("pitch_oneliner", pitch.oneLiner, 400)}
${wrapInPromptQuarantine("pitch_audience", pitch.targetAudience, 150)}
${wrapInPromptQuarantine("pitch_pricing", pitch.pricingModel, 150)}

Task:
Generate a direct, highly customized, ruthless 2-3 sentence objection in simple, plain, punchy ${lang === "tr" ? "Turkish" : "English"} targeting this specific founder's product name and premise.
Be completely in character, skeptical, and demanding. Do NOT include greetings or polite fluff. Jump straight into the confrontation.`;
}

export function buildEvaluationPrompt(
  juror: JurorConfig,
  objection: string,
  userResponse: string,
  currentConviction: number,
  lang: Language
): string {
  const jurorName = lang === "tr" ? juror.nameTr : juror.name;
  const cleanObjection = sanitizeUserInput(objection, 600);
  const cleanUserResponse = sanitizeUserInput(userResponse, 1000);

  return `You are evaluating a founder's counter-argument in a brutal boardroom pitch simulation.
Judge: ${jurorName} (${juror.archetype})
Psychology: ${juror.psychology}
Fatal Trigger (instant loss if detected): ${juror.fatalTrigger}
Persuasion Key (required to convince): ${juror.persuasionKey}
Current Conviction: ${currentConviction}/100
Language: Respond strictly in ${lang === "tr" ? "Turkish" : "English"}.

Judge's Objection:
${wrapInPromptQuarantine("judge_objection", cleanObjection, 600)}

Founder's Counter-Response:
${wrapInPromptQuarantine("counter_response", cleanUserResponse, 1000)}

Evaluation Rules:
1. Did the founder directly address the psychological core of the objection?
2. If founder used empty buzzwords, clichés, or triggered the Fatal Trigger, penalize with negative scoreDelta (-20 to -35).
3. If founder gave a vague/partial answer without numbers or proof, award a small delta (-5 to +10) and stay skeptical.
4. If founder presented concrete data, risk mitigation, or hit the Persuasion Key, reward with positive scoreDelta (+25 to +40).
5. Provide the judge's realistic, unfiltered reaction in plain, accessible ${lang === "tr" ? "Turkish" : "English"} (1-3 sentences).

Respond ONLY with valid JSON in this exact structure:
{
  "jurorReaction": "string in ${lang === "tr" ? "Turkish" : "English"}",
  "scoreDelta": number (between -35 and 40),
  "isFatal": boolean
}`;
}

export function buildVerdictPrompt(
  pitch: PitchData,
  history: TurnExchange[],
  jurorStates: Record<string, { conviction: number }>,
  lang: Language
): string {
  const scores = Object.entries(jurorStates)
    .map(([id, st]) => `${id}: ${st.conviction}%`)
    .join(", ");

  const transcript = history
    .slice(0, 10)
    .map(
      (turn, idx) =>
        `Turn ${idx + 1} (${turn.jurorId}, delta ${turn.scoreDelta}, final ${turn.resultingConviction}%):
Objection: ${sanitizeUserInput(turn.objection, 300)}
Founder Reply: ${sanitizeUserInput(turn.userResponse, 400)}
Judge Reaction: ${sanitizeUserInput(turn.jurorReaction, 300)}`
    )
    .join("\n\n");

  return `You are the Chief Investment Partner summarizing a 5-judge startup pitch interrogation in "The Gauntlet".
Language: Respond strictly in ${lang === "tr" ? "natural Turkish" : "natural English"}.

Startup Pitch:
${wrapInPromptQuarantine("pitch_name", pitch.productName, 120)}
${wrapInPromptQuarantine("pitch_oneliner", pitch.oneLiner, 400)}
${wrapInPromptQuarantine("pitch_pricing", pitch.pricingModel, 150)}

Final Judge Scores: ${scores}

Interrogation Transcript:
${wrapInPromptQuarantine("transcript", transcript, 4000)}

Task:
Synthesize a sharp, brutally honest, specific executive verdict based strictly on the founder's actual replies above.
1. "valuationVerdict": A concise 5-10 word headline verdict in ${lang === "tr" ? "Turkish" : "English"}.
2. "lethalVulnerability": The single biggest weak spot exposed across their answers (1-2 concrete sentences referencing their actual pitch).
3. "strategicRemedy": The exact actionable fix they must make before pitching real customers or investors (1-2 concrete sentences).

Respond ONLY with valid JSON:
{
  "valuationVerdict": "string",
  "lethalVulnerability": "string",
  "strategicRemedy": "string"
}`;
}
