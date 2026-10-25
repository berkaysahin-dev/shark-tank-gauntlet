"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PitchSetup } from "@/components/PitchSetup";
import { BoardroomArena } from "@/components/BoardroomArena";
import { VerdictDossier } from "@/components/VerdictDossier";
import { KeySettingsModal } from "@/components/KeySettingsModal";
import {
  PitchData,
  TurnExchange,
  JurorRuntimeState,
  VerdictSummary,
} from "@/types/gauntlet";
import { Language } from "@/locales/i18n";
import { fetchVerdictSummary } from "@/lib/llm";

type GauntletStage = "SETUP" | "ARENA" | "VERDICT";

export default function HomePage() {
  const [lang, setLang] = useState<Language>("en");
  const [stage, setStage] = useState<GauntletStage>("SETUP");
  const [pitch, setPitch] = useState<PitchData | null>(null);
  const [history, setHistory] = useState<TurnExchange[]>([]);
  const [jurorStates, setJurorStates] = useState<Record<string, JurorRuntimeState>>({});
  const [verdict, setVerdict] = useState<VerdictSummary | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  useEffect(() => {
    // Detect browser preference or saved preference
    if (typeof window !== "undefined") {
      let initialLang: Language = "en";
      const savedLang = localStorage.getItem("gauntlet_lang") as Language;
      if (savedLang === "en" || savedLang === "tr") {
        initialLang = savedLang;
      } else {
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith("tr")) {
          initialLang = "tr";
        }
      }
      setLang(initialLang);
      document.documentElement.lang = initialLang;
    }
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("gauntlet_lang", newLang);
      document.documentElement.lang = newLang;
    }
  };

  const handleStartGauntlet = (newPitch: PitchData) => {
    setPitch(newPitch);
    setStage("ARENA");
  };

  const handleFinishGauntlet = async (
    allHistory: TurnExchange[],
    finalJurorStates: Record<string, JurorRuntimeState>
  ) => {
    if (!pitch) return;
    setHistory(allHistory);
    setJurorStates(finalJurorStates);

    const summary = await fetchVerdictSummary(pitch, allHistory, finalJurorStates, lang);
    setVerdict(summary);
    setStage("VERDICT");
  };

  const handleReset = () => {
    setStage("SETUP");
    setPitch(null);
    setHistory([]);
    setJurorStates({});
    setVerdict(null);
  };

  return (
    <div className="min-h-screen flex flex-col studio-stage-bg text-slate-100 relative">
      <Header
        lang={lang}
        onLanguageChange={handleLanguageChange}
        onOpenKeys={() => setIsKeyModalOpen(true)}
        onReset={handleReset}
        isInDuel={stage !== "SETUP"}
      />

      <main className="flex-1 flex flex-col justify-center">
        {stage === "SETUP" && (
          <PitchSetup lang={lang} onStartGauntlet={handleStartGauntlet} />
        )}

        {stage === "ARENA" && pitch && (
          <BoardroomArena
            pitch={pitch}
            lang={lang}
            onFinishGauntlet={handleFinishGauntlet}
          />
        )}

        {stage === "VERDICT" && pitch && verdict && (
          <VerdictDossier
            pitch={pitch}
            history={history}
            jurorStates={jurorStates}
            verdict={verdict}
            lang={lang}
            onReset={handleReset}
          />
        )}
      </main>

      <Footer lang={lang} />

      <KeySettingsModal
        isOpen={isKeyModalOpen}
        lang={lang}
        onClose={() => setIsKeyModalOpen(false)}
      />
    </div>
  );
}
