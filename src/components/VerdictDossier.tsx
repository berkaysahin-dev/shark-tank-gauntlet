"use client";

import React, { useState } from "react";
import { Check, X, RotateCcw, Share2, Award, AlertTriangle, ShieldAlert, Sparkles, CheckCircle2, XCircle, FileCheck } from "lucide-react";
import { PitchData, TurnExchange, JurorRuntimeState, VerdictSummary } from "@/types/gauntlet";
import { JURORS } from "@/config/personas";
import { Language, translations } from "@/locales/i18n";
import { SharkAvatar } from "./SharkAvatar";
import { playTurnTick } from "@/lib/audio";

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
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Official Boardroom Dossier Container */}
      <div className="border-2 border-slate-700/80 rounded-2xl bg-[#111624] shadow-2xl overflow-hidden relative">
        {/* Top Header Strip */}
        <div className="bg-[#171E2E] px-6 py-4 border-b-2 border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <FileCheck size={18} className="text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 block">
                {isTr ? "Resmi Karar Kurulu Tutanağı" : "Official Boardroom Verdict Dossier"}
              </span>
              <h2 className="text-lg font-black text-white">
                {pitch.productName}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">
              {new Date().toLocaleDateString(isTr ? "tr-TR" : "en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
              {pitch.pricingModel}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-9">
          {/* Verdict Banner with Rubber Stamp */}
          <div
            className={`p-6 rounded-2xl mb-8 border-2 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 ${
              isSuccess
                ? "bg-emerald-950/20 border-emerald-500/50"
                : isConditional
                ? "bg-amber-950/20 border-amber-500/50"
                : "bg-rose-950/20 border-rose-500/50"
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                {isSuccess ? (
                  <Award className="text-emerald-400" size={24} />
                ) : isConditional ? (
                  <Sparkles className="text-amber-400" size={24} />
                ) : (
                  <AlertTriangle className="text-rose-400" size={24} />
                )}
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {verdict.valuationVerdict}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {t.convincedCount(verdict.convincedCount, JURORS.length, verdict.rejectedCount)}
              </p>
            </div>

            {/* Clean Vector-Based Rubber Stamp Element (Zero Emojis) */}
            <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2">
              {isSuccess ? (
                <div className="rubber-stamp stamp-deal text-xs sm:text-sm flex items-center gap-1.5">
                  <Check size={14} strokeWidth={3} />
                  <span>{isTr ? "KABUL: YATIRIM TEKLİFİ" : "DEAL ACCEPTED"}</span>
                </div>
              ) : isConditional ? (
                <div className="rubber-stamp stamp-conditional text-xs sm:text-sm flex items-center gap-1.5">
                  <AlertTriangle size={14} strokeWidth={2.5} />
                  <span>{isTr ? "ŞARTLI DEĞERLENDİRME" : "CONDITIONAL OFFER"}</span>
                </div>
              ) : (
                <div className="rubber-stamp stamp-reject text-xs sm:text-sm flex items-center gap-1.5">
                  <X size={14} strokeWidth={3} />
                  <span>{isTr ? "REDDEDİLDİ: TEKLİF YOK" : "REJECTED: WALK OF SHAME"}</span>
                </div>
              )}

              <div className="text-right mt-1">
                <span className="text-[10px] font-bold text-slate-400 block">
                  {t.averageConviction}
                </span>
                <span
                  className={`text-2xl sm:text-3xl font-black tabular-nums ${
                    isSuccess
                      ? "text-emerald-400"
                      : isConditional
                      ? "text-amber-400"
                      : "text-rose-400"
                  }`}
                >
                  %{verdict.averageConviction}
                </span>
              </div>
            </div>
          </div>

          {/* Individual Juror Breakdown Cards */}
          <div className="mb-8">
            <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
              <span>{t.breakdownTitle}</span>
              <span className="text-slate-500 font-normal">({JURORS.length} {isTr ? "Jüri Üyesi" : "Board Members"})</span>
            </h4>

            <div className="space-y-3">
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
                    className={`p-3.5 sm:p-4 rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                      isConvinced
                        ? "bg-[#0F1C18] border-emerald-900/50 hover:border-emerald-700/60"
                        : "bg-[#181116] border-rose-950/50 hover:border-rose-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <SharkAvatar
                        index={juror.silhouetteIndex}
                        isConvinced={isConvinced}
                        isRejected={!isConvinced}
                        size={46}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            {name}
                          </span>
                          <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {archetype}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {role}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pl-14 sm:pl-0">
                      {/* Gauge bar */}
                      <div className="w-24 sm:w-32 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full ${
                            isConvinced ? "bg-emerald-400" : "bg-rose-500"
                          }`}
                          style={{ width: `${conv}%` }}
                        />
                      </div>

                      <div className="text-sm font-black tabular-nums text-white w-12 text-right">
                        %{conv}
                      </div>

                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                          isConvinced
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                            : "bg-rose-500/15 text-rose-300 border-rose-500/40"
                        }`}
                      >
                        {isConvinced ? (
                          <>
                            <CheckCircle2 size={13} />
                            <span>{t.accepted}</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={13} />
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

          {/* Fatal Vulnerability & Strategic Action Plan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-5 rounded-xl bg-rose-950/15 border-2 border-rose-900/40">
              <span className="text-xs font-bold text-rose-400 block mb-2 flex items-center gap-1.5">
                <ShieldAlert size={15} />
                <span>{t.vulnerabilityTitle}</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {verdict.lethalVulnerability}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-emerald-950/15 border-2 border-emerald-900/40">
              <span className="text-xs font-bold text-emerald-400 block mb-2 flex items-center gap-1.5">
                <Sparkles size={15} />
                <span>{t.remedyTitle}</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {verdict.strategicRemedy}
              </p>
            </div>
          </div>

          {/* Action Buttons: 1-Click Share & Pitch Again */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={handleCopyShare}
              className="w-full sm:w-auto btn-tank-primary px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/10"
            >
              {copied ? (
                <>
                  <Check size={15} strokeWidth={2.5} className="text-slate-950" />
                  <span>{t.copied}</span>
                </>
              ) : (
                <>
                  <Share2 size={15} strokeWidth={2.5} />
                  <span>{t.copyShareText}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onReset}
              className="w-full sm:w-auto btn-tank-dark px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
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
