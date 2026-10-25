"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, ArrowRight, CornerDownLeft, Sparkles, AlertOctagon, MessageSquare, Check, X } from "lucide-react";
import { PitchData, JurorRuntimeState, TurnExchange } from "@/types/gauntlet";
import { JURORS } from "@/config/personas";
import { Language, translations } from "@/locales/i18n";
import { JurorSeat } from "./JurorSeat";
import { SharkAvatar } from "./SharkAvatar";
import { fetchJurorObjection, evaluateCounterResponse } from "@/lib/llm";
import { playGavel, playBuzzer, playDealChime, playTurnTick } from "@/lib/audio";

interface BoardroomArenaProps {
  pitch: PitchData;
  lang: Language;
  onFinishGauntlet: (history: TurnExchange[], jurorStates: Record<string, JurorRuntimeState>) => void;
}

export const BoardroomArena: React.FC<BoardroomArenaProps> = ({
  pitch,
  lang,
  onFinishGauntlet,
}) => {
  const t = translations[lang].arena;
  const isTr = lang === "tr";

  const [activeJurorIndex, setActiveJurorIndex] = useState(0);
  const [jurorStates, setJurorStates] = useState<Record<string, JurorRuntimeState>>(() => {
    const initial: Record<string, JurorRuntimeState> = {};
    JURORS.forEach((j) => {
      initial[j.id] = {
        conviction: j.initialConviction,
        status: "AWAITING",
        currentObjection: "",
        history: [],
      };
    });
    return initial;
  });

  const [counterResponse, setCounterResponse] = useState("");
  const [isLoadingObjection, setIsLoadingObjection] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [lastExchange, setLastExchange] = useState<TurnExchange | null>(null);
  const [allHistory, setAllHistory] = useState<TurnExchange[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeJuror = JURORS[activeJurorIndex];
  const activeState = jurorStates[activeJuror.id];

  // Fetch or load objection when active juror changes
  useEffect(() => {
    let isMounted = true;

    async function loadObjection() {
      if (!activeState.currentObjection) {
        setIsLoadingObjection(true);
        const obj = await fetchJurorObjection(activeJuror, pitch, lang);
        if (isMounted) {
          setJurorStates((prev) => ({
            ...prev,
            [activeJuror.id]: {
              ...prev[activeJuror.id],
              currentObjection: obj,
              status: "ACTIVE",
            },
          }));
          setIsLoadingObjection(false);
          playTurnTick();
        }
      }
    }

    loadObjection();
    setLastExchange(null);
    setCounterResponse("");

    return () => {
      isMounted = false;
    };
  }, [activeJurorIndex, activeJuror.id, activeState.currentObjection, pitch, lang]);

  // Quick Tactic Chips specific to current Juror (Clean text tags, zero emojis)
  const getTacticSuggestions = () => {
    switch (activeJuror.id) {
      case "cfo-penny-pincher":
        return isTr
          ? [
              { label: "30 Günlük ROI", text: "Bu sistem haftada 8 saat personel iş gücünü kurtararak doğrudan saatlik maliyet üzerinden 30 günde kendini amorti eder." },
              { label: "Hatasız Otomasyon", text: "Kırılgan tablo formülleri ve insan hatası yerine tüm hesaplamaları sıfır riskle otomatikleştirir." },
            ]
          : [
              { label: "30-Day Payback", text: "This saves 8 hours of payroll every week per seat, paying for itself within 20 business days on direct labor recovery." },
              { label: "Formula Audit", text: "Unlike brittle spreadsheet formulas, this eliminates human reconciliation errors and audits all books automatically." },
            ];
      case "paranoid-ciso":
        return isTr
          ? [
              { label: "Sıfır Veri Tutma", text: "Sistemimiz 'Zero-Data Retention' politikasıyla çalışır; istemci tarafında şifrelenir ve sunucularımızda hiçbir veri saklanmaz." },
              { label: "VPC ve KVKK Uyumu", text: "Tüm altyapımız SOC2 Type II ve KVKK/GDPR uyumlu VPC izolasyonunda çalışır, tek bir bayt veri üçüncü partilerle paylaşılmaz." },
            ]
          : [
              { label: "Zero-Data Retention", text: "We enforce zero client data retention and client-side encryption. No proprietary information ever touches multi-tenant storage." },
              { label: "VPC Isolation", text: "Full enterprise VPC isolation, strict SOC2 Type II compliance roadmap, and complete local audit logging." },
            ];
      case "friction-phobic":
        return isTr
          ? [
              { label: "Sıfır Yeni Sekme", text: "Ekibiniz yeni bir panel açmaz. Tüm işlemler doğrudan mevcut Slack ve e-posta akışınızın içinde tek tıkla tamamlanır." },
              { label: "Eğitim Videosuz Kurulum", text: "10 saniyede çalışmaya başlar, hiçbir eğitim videosu veya karmaşık onboarding gerektirmez." },
            ]
          : [
              { label: "Headless Native", text: "Zero new tabs required. Everything executes silently inside your existing Slack, email, and daily workflows." },
              { label: "Zero Onboarding", text: "Runs autonomously in under 30 seconds with zero onboarding webinars or complex dashboards." },
            ];
      case "incumbent-loyalist":
        return isTr
          ? [
              { label: "10 Kat Hızlı Odak", text: "Pazar liderinin 50 gereksiz özelliği var; biz tek bir kritik problemi onların 10 katı hızında ve 1 dakikada çözüyoruz." },
              { label: "1 Tıkla Veri Göçü", text: "Eski sistemdeki tüm geçmiş verilerinizi 1 tıkla aktarıyoruz, sıfır kilitlenme (lock-in) ve kesintisiz geçiş garantisi." },
            ]
          : [
              { label: "10x Sharp Wedge", text: "The legacy leader is bloated with 100 unused menus. We execute this exact core workflow 10x faster with zero latency." },
              { label: "1-Click Migration", text: "Automated 1-click import from legacy market tools with zero vendor lock-in and seamless fallback." },
            ];
      case "hype-tourist":
        return isTr
          ? [
              { label: "Pasif Sabah Özeti", text: "Her sabah panele girmenize gerek kalmadan, işinize yarayan kritik özeti e-postanıza hazır getirir." },
              { label: "Sıfır Bildirim Kirliliği", text: "Gereksiz bildirim yağmuru yok; sadece doğrudan aksiyon gerektiren anlarda sessizce devreye girer." },
            ]
          : [
              { label: "Ambient Delivery", text: "Delivers effortless, ready-to-use summaries directly into your morning routine without requiring you to open an app." },
              { label: "Zero Notification Spam", text: "Zero annoying push alerts; it produces continuous passive background value you notice automatically." },
            ];
      default:
        return [];
    }
  };

  // Handle counter response submit
  const handleSubmitCounter = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!counterResponse.trim() || isEvaluating) return;

    setIsEvaluating(true);
    const fallbackTemplate = isTr ? activeJuror.coreObjectionTemplateTr : activeJuror.coreObjectionTemplate;
    const objectionText = activeState.currentObjection || fallbackTemplate;

    const evalResult = await evaluateCounterResponse(
      activeJuror,
      pitch,
      objectionText,
      counterResponse.trim(),
      activeState.conviction,
      lang
    );

    const resultingConviction = evalResult.resultingConviction;
    const isConvinced = resultingConviction >= 65;
    const isRejected = resultingConviction <= 20 || evalResult.isFatal;

    if (isConvinced) {
      playDealChime();
    } else if (isRejected) {
      playBuzzer();
    } else {
      playGavel();
    }

    const exchange: TurnExchange = {
      jurorId: activeJuror.id,
      objection: objectionText,
      userResponse: counterResponse.trim(),
      jurorReaction: evalResult.jurorReaction,
      scoreDelta: evalResult.scoreDelta,
      resultingConviction,
      isFatal: evalResult.isFatal,
      timestamp: Date.now(),
    };

    setLastExchange(exchange);
    setAllHistory((prev) => [...prev, exchange]);

    setJurorStates((prev) => {
      let finalStatus: "ACTIVE" | "CONVINCED" | "REJECTED" = "ACTIVE";
      if (isConvinced) finalStatus = "CONVINCED";
      if (isRejected) finalStatus = "REJECTED";

      return {
        ...prev,
        [activeJuror.id]: {
          ...prev[activeJuror.id],
          conviction: resultingConviction,
          status: finalStatus,
          history: [...prev[activeJuror.id].history, exchange],
        },
      };
    });

    setIsEvaluating(false);
  };

  const handleNextJuror = () => {
    playTurnTick();
    if (activeJurorIndex < JURORS.length - 1) {
      setActiveJurorIndex((prev) => prev + 1);
    } else {
      onFinishGauntlet(allHistory, jurorStates);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmitCounter();
    }
  };

  const activeName = isTr ? activeJuror.nameTr : activeJuror.name;
  const activeRole = isTr ? activeJuror.roleTitleTr : activeJuror.roleTitle;
  const activeArchetype = isTr ? activeJuror.archetypeTr : activeJuror.archetype;
  const activeFallbackObjection = isTr ? activeJuror.coreObjectionTemplateTr : activeJuror.coreObjectionTemplate;

  const currentStatus = activeState.status;
  const isConvinced = currentStatus === "CONVINCED" || activeState.conviction >= 65;
  const isRejected = currentStatus === "REJECTED" || Boolean(lastExchange && activeState.conviction <= 20);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
      {/* Product Summary Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-800 gap-3">
        <div>
          <span className="text-xs font-bold text-amber-400 block mb-1">
            {isTr ? "Karar Masası Değerlendirmesi" : "Boardroom Evaluation"}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>{pitch.productName}</span>
            <span className="text-xs font-normal text-slate-400 border border-slate-800 bg-slate-900 px-2 py-0.5 rounded">
              {pitch.pricingModel}
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/80 font-mono">
            {isTr
              ? `Jüri Sırası: ${activeJurorIndex + 1} / ${JURORS.length}`
              : `Judge: ${activeJurorIndex + 1} of ${JURORS.length}`}
          </span>
        </div>
      </div>

      {/* 5 Jurors Seating Gallery / Podium */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 mb-8">
        {JURORS.map((juror, idx) => {
          const state = jurorStates[juror.id];
          return (
            <JurorSeat
              key={juror.id}
              config={juror}
              conviction={state.conviction}
              status={state.status}
              isActive={idx === activeJurorIndex}
              lang={lang}
              onSelect={() => {
                playTurnTick();
                setActiveJurorIndex(idx);
              }}
            />
          );
        })}
      </div>

      {/* Main Interrogation Arena Card */}
      <div className="border-2 border-slate-800 rounded-2xl bg-[#111624] p-5 sm:p-8 shadow-2xl relative">
        {/* Active Juror Spotlight Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
          <div className="flex items-center gap-4">
            <SharkAvatar
              index={activeJuror.silhouetteIndex}
              isActive={!lastExchange}
              isConvinced={isConvinced}
              isRejected={isRejected}
              size={68}
            />
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
                <span>{activeArchetype}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {activeName}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeRole}
              </p>
            </div>
          </div>

          {/* Current Conviction Meter */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 sm:p-0 bg-slate-900/60 sm:bg-transparent rounded-xl border sm:border-0 border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 sm:mb-1">
              {t.convictionLevel}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-2xl sm:text-3xl font-black tabular-nums ${
                  activeState.conviction >= 65
                    ? "text-emerald-400"
                    : activeState.conviction <= 20
                    ? "text-rose-400"
                    : "text-amber-400"
                }`}
              >
                %{activeState.conviction}
              </span>
            </div>
          </div>
        </div>

        {/* The Juror's Attack Speech Bubble */}
        <div className="mb-6 speech-bubble p-5 sm:p-6 bg-[#161D2E] border-2 border-slate-700/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
              <MessageSquare size={13} />
              <span>{isTr ? `${activeName} Adına İtiraz:` : `${activeName}'s Objection:`}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {isTr ? "Doğrudan Sorgulama" : "Active Hot Seat"}
            </span>
          </div>

          {isLoadingObjection ? (
            <div className="py-4 text-center text-sm font-medium text-slate-400 animate-pulse flex items-center justify-center gap-2">
              <span>{isTr ? "Jüri dosyanızı inceliyor ve en sert itirazını hazırlıyor..." : "The board is examining your pitch to formulate their objection..."}</span>
            </div>
          ) : (
            <blockquote className="text-base sm:text-lg font-bold text-white leading-relaxed">
              &ldquo;{activeState.currentObjection || activeFallbackObjection}&rdquo;
            </blockquote>
          )}

          {/* Psychological Clue / Pro-Tip */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-start gap-2 text-xs text-amber-300/80 bg-amber-500/5 -mx-2 -mb-2 p-2.5 rounded-b-xl">
            <AlertOctagon size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">{isTr ? "Kritik Tavsiye: " : "Tactical Hint: "}</span>
              <span className="text-slate-300">{activeJuror.psychology}</span>
            </div>
          </div>
        </div>

        {/* Evaluation Reaction Stamp & Verdict (When Answered) */}
        {lastExchange && (
          <div
            className={`mb-6 p-6 rounded-2xl border-2 transition-all relative overflow-hidden ${
              lastExchange.scoreDelta > 0
                ? "bg-emerald-950/20 border-emerald-500/40"
                : "bg-rose-950/20 border-rose-500/40"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                {/* Clean Vector-Based Rubber Stamp */}
                {lastExchange.scoreDelta > 0 ? (
                  <span className="rubber-stamp stamp-deal text-xs sm:text-sm flex items-center gap-1.5">
                    <Check size={14} strokeWidth={3} />
                    <span>{isTr ? "KABUL: MASADA KALDI" : "DEAL: IMPRESSED"}</span>
                  </span>
                ) : (
                  <span className="rubber-stamp stamp-reject text-xs sm:text-sm flex items-center gap-1.5">
                    <X size={14} strokeWidth={3} />
                    <span>{isTr ? "REDDEDİLDİ: MASADAN KALKTI" : "REJECTED: WALKED OUT"}</span>
                  </span>
                )}
                <span
                  className={`text-sm font-black tabular-nums ${
                    lastExchange.scoreDelta > 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {lastExchange.scoreDelta > 0 ? `+${lastExchange.scoreDelta}%` : `${lastExchange.scoreDelta}%`}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-300 font-mono">
                {isTr ? `Yeni İkna Oranı: %${lastExchange.resultingConviction}` : `New Conviction: ${lastExchange.resultingConviction}%`}
              </div>
            </div>

            <div className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed italic">
              &ldquo;{lastExchange.jurorReaction}&rdquo;
            </div>
          </div>
        )}

        {/* Counter Response Station */}
        {!lastExchange ? (
          <form onSubmit={handleSubmitCounter} className="space-y-4">
            {/* Quick Tactical Arsenal Chips */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-400" />
                  <span>{isTr ? "Hızlı Savunma Taktikleri:" : "Tactical Defense Weaponry:"}</span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {counterResponse.length} / 800
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {getTacticSuggestions().map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      playTurnTick();
                      setCounterResponse((prev) => (prev ? `${prev} ${sug.text}` : sug.text));
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-400/50 transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <span>{sug.label}</span>
                  </button>
                ))}
              </div>

              <textarea
                ref={textareaRef}
                rows={4}
                value={counterResponse}
                onChange={(e) => setCounterResponse(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.inputPlaceholder(activeName)}
                maxLength={800}
                disabled={isEvaluating}
                className="w-full bg-[#0B0F19] border-2 border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none leading-relaxed font-medium"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1.5">
                <CornerDownLeft size={12} />
                <span>{isTr ? "Göndermek için Ctrl + Enter tuşlarına basın" : "Press Ctrl + Enter to fire"}</span>
              </div>

              <button
                type="submit"
                disabled={!counterResponse.trim() || isEvaluating}
                className="w-full sm:w-auto btn-tank-primary px-7 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/10 disabled:opacity-40"
              >
                {isEvaluating ? (
                  <span>{isTr ? "Jüri değerlendiriyor..." : "Evaluating..."}</span>
                ) : (
                  <>
                    <span>{isTr ? "Savunmayı Gönder" : "Send Defense"}</span>
                    <Send size={13} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Next Step Action Button */
          <div className="flex items-center justify-end pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleNextJuror}
              className="w-full sm:w-auto btn-tank-primary px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <span>
                {activeJurorIndex < JURORS.length - 1
                  ? (isTr ? `Sonraki Jüriye Geç (${activeJurorIndex + 2}/${JURORS.length})` : `Proceed to Next Judge (${activeJurorIndex + 2}/${JURORS.length})`)
                  : (isTr ? "Nihai Karar Raporunu Gör" : "Reveal Final Verdict")}
              </span>
              <ArrowRight size={17} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
