import { JurorConfig, PitchData, TurnExchange, VerdictSummary } from "@/types/gauntlet";
import { Language } from "@/locales/i18n";

function getClientHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const geminiKey = sessionStorage.getItem("gauntlet_gemini_key");
    const openaiKey = sessionStorage.getItem("gauntlet_openai_key");
    if (geminiKey) headers["x-gemini-key"] = geminiKey;
    if (openaiKey) headers["x-openai-key"] = openaiKey;
  }
  return headers;
}

export async function fetchJurorObjection(
  juror: JurorConfig,
  pitch: PitchData,
  lang: Language = "en"
): Promise<string> {
  try {
    const res = await fetch("/api/gauntlet", {
      method: "POST",
      headers: getClientHeaders(),
      body: JSON.stringify({
        action: "generate_objection",
        juror,
        pitch,
        lang,
      }),
    });
    if (!res.ok) throw new Error("Objection generation failed");
    const data = await res.json();
    return data.objection || (lang === "tr" ? juror.coreObjectionTemplateTr : juror.coreObjectionTemplate);
  } catch {
    return lang === "tr" ? juror.coreObjectionTemplateTr : juror.coreObjectionTemplate;
  }
}

export async function evaluateCounterResponse(
  juror: JurorConfig,
  pitch: PitchData,
  objection: string,
  userResponse: string,
  currentConviction: number,
  lang: Language = "en"
): Promise<{
  jurorReaction: string;
  scoreDelta: number;
  resultingConviction: number;
  isFatal: boolean;
}> {
  try {
    const res = await fetch("/api/gauntlet", {
      method: "POST",
      headers: getClientHeaders(),
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
    return await res.json();
  } catch {
    return {
      jurorReaction: lang === "tr" ? "Cevabınız kurul tarafından yetersiz bulundu." : "Your response was deemed insufficient by the judge.",
      scoreDelta: -15,
      resultingConviction: Math.max(0, currentConviction - 15),
      isFatal: false,
    };
  }
}

export async function fetchVerdictSummary(
  pitch: PitchData,
  history: TurnExchange[],
  jurorStates: Record<string, { conviction: number }>,
  lang: Language = "en"
): Promise<VerdictSummary> {
  try {
    const res = await fetch("/api/gauntlet", {
      method: "POST",
      headers: getClientHeaders(),
      body: JSON.stringify({
        action: "generate_verdict",
        pitch,
        history,
        jurorStates,
        lang,
      }),
    });
    if (!res.ok) throw new Error("Verdict generation failed");
    return await res.json();
  } catch {
    return {
      convincedCount: 1,
      rejectedCount: 4,
      averageConviction: 30,
      termSheetStatus: "REJECTED",
      valuationVerdict: lang === "tr" ? "Teklif Yok — Kurul Tarafından Reddedildi" : "No Deal — Dismissed from the Boardroom",
      lethalVulnerability: lang === "tr" ? "İtirazlara verilen yanıtlar operasyonel güven tesis edemedi." : "Responses failed to establish operational and financial trust.",
      strategicRemedy: lang === "tr" ? "Güvenlik protokollerini ve net ROI tablosunu somutlaştırın." : "Anchor your pitch to measurable ROI and strict zero-retention security.",
    };
  }
}
