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

    return () => {
      isMounted = false;
    };
  }, [activeJurorIndex, activeJuror, activeState.currentObjection, pitch, lang]);

  const getTacticSuggestions = () => {
    switch (activeJuror.id) {
      case "cfo-penny-pincher":
        return isTr
          ? [
              { label: "30 Günde Kendini Öder", text: "Bu sistem haftada 8 saat personel zamanı kurtararak saatlik maliyet üzerinden 30 günde kendini öder." },
              { label: "Excel Hatasını Bitirir", text: "Kırılgan tablo formülleri ve insan hatası yerine tüm hesaplamaları otomatik yapar." },
            ]
          : [
              { label: "30-Day Payback", text: "This saves 8 hours of staff time every week per user, paying for itself within 30 days." },
              { label: "No Formula Errors", text: "Replaces fragile spreadsheets and catches costly manual mistakes automatically." },
            ];
      case "paranoid-ciso":
        return isTr
          ? [
              { label: "Veri Saklamıyoruz", text: "Veriler tarayıcı tarafında şifrelenir ve sunucularımızda hiçbir müşteri verisi saklanmaz." },
              { label: "Özel Sunucu & KVKK", text: "Şirketinizin kendi sunucusunda (VPC) çalışabilir, KVKK ve GDPR kurallarına tam uyumludur." },
            ]
          : [
              { label: "No Data Stored", text: "Data is encrypted on your side and zero client information is stored on our servers." },
              { label: "Private Cloud & Audit", text: "Runs in your own private cloud (VPC) with full audit logs and strict compliance." },
            ];
      case "friction-phobic":
        return isTr
          ? [
              { label: "Yeni Sekme Yok", text: "Ekibiniz yeni bir panel açmaz. Tüm işlemler doğrudan mevcut Slack ve e-posta içinden tek tıkla biter." },
              { label: "Kurulum 10 Saniye", text: "10 saniyede çalışmaya başlar, eğitim videosu veya uzun kurulum gerektirmez." },
            ]
          : [
              { label: "No New Tabs", text: "Zero new tabs needed. Everything runs straight inside Slack and email with one click." },
              { label: "10-Second Setup", text: "Works in seconds with zero training videos or complicated setup." },
            ];
      case "incumbent-loyalist":
        return isTr
          ? [
              { label: "10 Kat Hızlı", text: "Büyük rakiplerin kimsenin kullanmadığı 50 menüsü var; biz bu tek işi onlardan 10 kat hızlı çözüyoruz." },
              { label: "1 Tıkla Veri Aktarımı", text: "Eski sistemdeki tüm verilerinizi 1 tıkla içeri alıyoruz, geçişte hiçbir kayıp yaşanmıyor." },
            ]
          : [
              { label: "10x Faster", text: "The big incumbent has 100 bloated menus. We do this one critical job 10x faster." },
              { label: "1-Click Import", text: "Bring all your data from the old tool in one click with zero lock-in." },
            ];
      case "hype-tourist":
        return isTr
          ? [
              { label: "Otomatik Sabah Özeti", text: "Her sabah panele girmenize gerek kalmadan işinize yarayan kısa özeti e-postanıza hazır gönderir." },
              { label: "Bildirim Kirliliği Yok", text: "Gereksiz bildirim yağmuru yok; sadece gerçekten aksiyon almanız gereken anda haber verir." },
            ]
          : [
              { label: "Morning Summary", text: "Sends a ready-to-read summary every morning so you get value without opening an app." },
              { label: "No Spam Alerts", text: "Zero annoying notifications; it only speaks up when something actually needs your attention." },
            ];
      default:
        return [];
    }
  };

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

  const selectJuror = (idx: number) => {
    playTurnTick();
    setLastExchange(null);
    setCounterResponse("");
    setActiveJurorIndex(idx);
  };

  const handleNextJuror = () => {
    playTurnTick();
    if (activeJurorIndex < JURORS.length - 1) {
      setLastExchange(null);
      setCounterResponse("");
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-20 sm:pt-28 pb-12 sm:pb-16 space-y-6 sm:space-y-8">
      {/* Product Summary Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-border gap-3">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent block mb-1">
            {isTr ? "Jüri Değerlendirmesi" : "Pitch Review"}
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex flex-wrap items-center gap-2">
            <span>{pitch.productName}</span>
            <span className="text-xs font-medium text-muted border border-border bg-surface px-2.5 py-0.5 rounded-full">
              {pitch.pricingModel}
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-foreground bg-surface px-3 py-1 rounded-full border border-border font-mono">
            {isTr
              ? `Jüri ${activeJurorIndex + 1} / ${JURORS.length}`
              : `Judge ${activeJurorIndex + 1} of ${JURORS.length}`}
          </span>
        </div>
      </div>

      {/* 5 Jurors Seating Gallery */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
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
              onSelect={() => selectJuror(idx)}
            />
          );
        })}
      </div>

      {/* Main Interrogation Arena Card */}
      <div className="relative rounded-[28px] sm:rounded-[32px] p-5 sm:p-8 overflow-hidden bg-card-bg/90 border border-border shadow-xs dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/15 to-transparent pointer-events-none"
        />

        {/* Active Juror Spotlight Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-border gap-4">
          <div className="flex items-center gap-4">
            <SharkAvatar
              index={activeJuror.silhouetteIndex}
              isActive={!lastExchange}
              isConvinced={isConvinced}
              isRejected={isRejected}
              size={64}
            />
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent mb-0.5">
                <span>{activeArchetype}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                {activeName}
              </h3>
              <p className="text-xs text-muted mt-0.5">
                {activeRole}
              </p>
            </div>
          </div>

          {/* Current Conviction Meter */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 sm:p-0 bg-background sm:bg-transparent rounded-2xl border sm:border-0 border-border">
            <span className="text-[11px] font-medium text-muted sm:mb-0.5">
              {t.convictionLevel}
            </span>
            <span
              className={`text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight ${
                activeState.conviction >= 65
                  ? "text-emerald-600 dark:text-emerald-400"
                  : activeState.conviction <= 20
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-accent"
              }`}
            >
              %{activeState.conviction}
            </span>
          </div>
        </div>

        {/* Juror Objection Box */}
        <div className="mb-6 rounded-2xl p-5 sm:p-6 bg-background border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <MessageSquare size={14} />
              <span>{isTr ? `${activeName} Soruyor:` : `${activeName} Asks:`}</span>
            </div>
            <span className="text-[10px] text-muted font-mono">
              {isTr ? "Canlı Soru" : "Live Question"}
            </span>
          </div>

          {isLoadingObjection ? (
            <div className="py-4 text-center text-sm font-medium text-muted animate-pulse">
              {t.objectionThinking}
            </div>
          ) : (
            <blockquote className="text-base sm:text-lg font-semibold text-foreground leading-relaxed tracking-tight">
              &ldquo;{activeState.currentObjection || activeFallbackObjection}&rdquo;
            </blockquote>
          )}

          {/* Hint */}
          <div className="mt-4 pt-3 border-t border-border flex items-start gap-2.5 text-xs text-muted">
            <AlertOctagon size={15} className="text-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground">
                {isTr ? "İpucu: " : "Hint: "}
              </span>
              <span>{isTr ? activeJuror.psychologyTr : activeJuror.psychology}</span>
            </div>
          </div>
        </div>

        {/* Evaluation Reaction */}
        {lastExchange && (
          <div
            className={`mb-6 p-5 sm:p-6 rounded-2xl border transition-all ${
              lastExchange.scoreDelta > 0
                ? "bg-emerald-500/[0.06] border-emerald-500/35"
                : "bg-rose-500/[0.06] border-rose-500/35"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                {lastExchange.scoreDelta > 0 ? (
                  <span className="rubber-stamp stamp-deal text-xs">
                    <Check size={13} strokeWidth={2.5} />
                    <span>{isTr ? "KABUL: MASADA KALDI" : "DEAL: IMPRESSED"}</span>
                  </span>
                ) : (
                  <span className="rubber-stamp stamp-reject text-xs">
                    <X size={13} strokeWidth={2.5} />
                    <span>{isTr ? "REDDEDİLDİ: MASADAN KALKTI" : "REJECTED: WALKED OUT"}</span>
                  </span>
                )}
                <span
                  className={`text-sm font-semibold tabular-nums ${
                    lastExchange.scoreDelta > 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {lastExchange.scoreDelta > 0 ? `+${lastExchange.scoreDelta}%` : `${lastExchange.scoreDelta}%`}
                </span>
              </div>

              <div className="text-xs font-medium text-muted font-mono">
                {isTr
                  ? `Yeni İkna Oranı: %${lastExchange.resultingConviction}`
                  : `New Conviction: ${lastExchange.resultingConviction}%`}
              </div>
            </div>

            <div className="text-sm sm:text-base font-normal text-foreground leading-relaxed">
              &ldquo;{lastExchange.jurorReaction}&rdquo;
            </div>
          </div>
        )}

        {/* Counter Response Station */}
        {!lastExchange ? (
          <form onSubmit={handleSubmitCounter} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Sparkles size={13} className="text-accent" />
                  <span>{isTr ? "Hazır Yanıt Örnekleri:" : "Quick Reply Ideas:"}</span>
                </span>
                <span className="text-[11px] text-muted font-mono">
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
                    className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-background hover:bg-surface-hover text-accent border border-border transition-colors cursor-pointer select-none"
                  >
                    {sug.label}
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
                className="w-full rounded-2xl p-4 text-xs sm:text-sm text-foreground bg-background border border-border placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 transition-all duration-200 resize-none leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-muted hidden sm:flex items-center gap-1.5">
                <CornerDownLeft size={12} />
                <span>{isTr ? "Göndermek için Ctrl + Enter tuşlarına basın" : "Press Ctrl + Enter to send"}</span>
              </div>

              <button
                type="submit"
                disabled={!counterResponse.trim() || isEvaluating}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs sm:text-sm font-medium shadow-[0_4px_16px_rgba(0,113,227,0.3)] hover:shadow-[0_6px_24px_rgba(0,113,227,0.4)] active:scale-95 transition-all cursor-pointer disabled:opacity-40 select-none"
              >
                {isEvaluating ? (
                  <span>{t.evaluating}</span>
                ) : (
                  <>
                    <span>{t.submitCounter}</span>
                    <Send size={13} />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-end pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleNextJuror}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs sm:text-sm font-medium shadow-[0_4px_16px_rgba(0,113,227,0.3)] hover:shadow-[0_6px_24px_rgba(0,113,227,0.4)] active:scale-95 transition-all cursor-pointer select-none"
            >
              <span>
                {activeJurorIndex < JURORS.length - 1
                  ? isTr
                    ? `Sonraki Jüriye Geç (${activeJurorIndex + 2}/${JURORS.length})`
                    : `Proceed to Next Judge (${activeJurorIndex + 2}/${JURORS.length})`
                  : isTr
                  ? "Nihai Karar Raporunu Gör"
                  : "Reveal Final Verdict"}
              </span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
