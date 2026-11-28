"use client";

import React, { useState } from "react";
import { Check, X, RotateCcw, Share2, Download, Award, AlertTriangle, ShieldAlert, Sparkles, CheckCircle2, XCircle, FileCheck } from "lucide-react";
import { PitchData, TurnExchange, JurorRuntimeState, VerdictSummary } from "@/types/gauntlet";
import { JURORS } from "@/config/personas";
import { Language, translations } from "@/locales/i18n";
import { SharkAvatar } from "./SharkAvatar";
import { playTurnTick } from "@/lib/audio";
import { formatPercent } from "@/lib/utils";
import { downloadRoastCardPng } from "@/lib/roastCard";

interface VerdictDossierProps {
  pitch: PitchData;
  history: TurnExchange[];
  jurorStates: Record<string, JurorRuntimeState>;
  verdict: VerdictSummary;
  lang: Language;
  onReset: () => void;
}

export const VerdictDossier: React.FC<VerdictDossierProps> = ({
  pitch,
  history,
  verdict,
  jurorStates,
  lang,
  onReset,
}) => {
  const t = translations[lang].verdict;
  const isTr = lang === "tr";
  const [copied, setCopied] = useState(false);

  const shareText = t.shareTemplate(
    pitch.productName,
    verdict.convincedCount,
    JURORS.length,
    verdict.averageConviction,
    verdict.valuationVerdict,
    verdict.lethalVulnerability
  );

  const handleCopyShare = () => {
    playTurnTick();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isSuccess = verdict.termSheetStatus === "ACCEPTED";
  const isConditional = verdict.termSheetStatus === "CONDITIONAL";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-12 sm:pb-16">
      <div className="relative rounded-[28px] sm:rounded-[32px] overflow-hidden bg-card-bg/90 border border-border shadow-xs dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/15 to-transparent pointer-events-none"
        />

        {/* Top Header Strip */}
        <div className="px-6 py-4 border-b border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <FileCheck size={18} className="text-accent shrink-0" />
            <div>
              <span className="text-[10px] font-mono font-medium text-accent block">
                {t.title}
              </span>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {pitch.productName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs text-muted font-mono">
              {new Date().toLocaleDateString(isTr ? "tr-TR" : "en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-background border border-border text-foreground">
              {pitch.pricingModel}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-9 space-y-8">
          {/* Verdict Banner */}
          <div
            className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-6 ${
              isSuccess
                ? "bg-emerald-500/[0.08] border-emerald-500/35"
                : isConditional
                ? "bg-amber-500/[0.08] border-amber-500/35"
                : "bg-rose-500/[0.08] border-rose-500/35"
            }`}
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                {isSuccess ? (
                  <Award className="text-emerald-600 dark:text-emerald-400" size={22} />
                ) : isConditional ? (
                  <Sparkles className="text-amber-600 dark:text-amber-400" size={22} />
                ) : (
                  <AlertTriangle className="text-rose-600 dark:text-rose-400" size={22} />
                )}
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                  {verdict.valuationVerdict}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted font-normal">
                {t.convincedCount(verdict.convincedCount, JURORS.length, verdict.rejectedCount)}
              </p>
            </div>

            <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2">
              {isSuccess ? (
                <div className="rubber-stamp stamp-deal text-xs">
                  <Check size={13} strokeWidth={2.5} />
                  <span>{isTr ? "KABUL: TEKLİF VAR" : "DEAL ACCEPTED"}</span>
                </div>
              ) : isConditional ? (
                <div className="rubber-stamp stamp-conditional text-xs">
                  <AlertTriangle size={13} strokeWidth={2.5} />
                  <span>{isTr ? "ŞARTLI ONAY" : "CONDITIONAL OFFER"}</span>
                </div>
              ) : (
                <div className="rubber-stamp stamp-reject text-xs">
                  <X size={13} strokeWidth={2.5} />
                  <span>{isTr ? "TEKLİF YOK" : "NO DEAL"}</span>
                </div>
              )}

              <div className="text-right mt-1">
                <span className="text-[10px] font-medium text-muted block">
                  {t.averageConviction}
                </span>
                <span
                  className={`text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight ${
                    isSuccess
                      ? "text-emerald-600 dark:text-emerald-400"
                      : isConditional
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {formatPercent(verdict.averageConviction, lang)}
                </span>
              </div>
            </div>
          </div>

          {/* Individual Juror Breakdown */}
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
              <span>{t.breakdownTitle}</span>
              <span className="text-muted font-normal">
                ({JURORS.length} {isTr ? "Jüri Üyesi" : "Board Members"})
              </span>
            </h4>

            <div className="space-y-2.5">
              {JURORS.map((juror) => {
                const state = jurorStates[juror.id];
                const conv = state?.conviction ?? juror.initialConviction;
                const isConvinced = conv >= 60;
                const name = isTr ? juror.nameTr : juror.name;
                const archetype = isTr ? juror.archetypeTr : juror.archetype;
                const role = isTr ? juror.roleTitleTr : juror.roleTitle;

                return (
                  <div
                    key={juror.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors bg-background ${
                      isConvinced ? "border-emerald-500/35" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <SharkAvatar
                        index={juror.silhouetteIndex}
                        isConvinced={isConvinced}
                        isRejected={!isConvinced}
                        size={44}
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-foreground tracking-tight">
                            {name}
                          </span>
                          <span className="text-[10px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                            {archetype}
                          </span>
                        </div>
                        <div className="text-xs text-muted line-clamp-1 mt-0.5">
                          {role}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pl-14 sm:pl-0">
                      <div className="w-24 sm:w-32 h-1.5 bg-surface-raised rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isConvinced ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                          style={{ width: `${conv}%` }}
                        />
                      </div>

                      <div className="text-sm font-semibold tabular-nums text-foreground w-10 text-right">
                        {formatPercent(conv, lang)}
                      </div>

                      <span
                        className={`text-[11px] font-medium px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                          isConvinced
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30"
                        }`}
                      >
                        {isConvinced ? (
                          <>
                            <CheckCircle2 size={12} />
                            <span>{t.accepted}</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={12} />
                            <span>{t.rejected}</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fatal Vulnerability & Strategic Remedy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-background border border-rose-500/30">
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                <ShieldAlert size={15} />
                <span>{t.vulnerabilityTitle}</span>
              </span>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed font-normal">
                {verdict.lethalVulnerability}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-background border border-emerald-500/30">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                <Sparkles size={15} />
                <span>{t.remedyTitle}</span>
              </span>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed font-normal">
                {verdict.strategicRemedy}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyShare}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs sm:text-sm font-medium shadow-[0_4px_16px_rgba(0,113,227,0.3)] hover:shadow-[0_6px_24px_rgba(0,113,227,0.4)] active:scale-95 transition-all cursor-pointer select-none"
              >
                {copied ? (
                  <>
                    <Check size={15} />
                    <span>{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Share2 size={15} />
                    <span>{t.copyShareText}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  playTurnTick();
                  downloadRoastCardPng({ pitch, verdict, jurorStates, history, lang });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border bg-background hover:bg-surface-hover text-foreground text-xs sm:text-sm font-medium active:scale-95 transition-all cursor-pointer select-none"
              >
                <Download size={15} className="text-accent" />
                <span>{t.downloadCard}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border bg-surface hover:bg-surface-hover text-foreground text-xs sm:text-sm font-medium active:scale-95 transition-all cursor-pointer select-none"
            >
              <RotateCcw size={15} />
              <span>{t.resetButton}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
