"use client";

import React from "react";
import { JurorConfig, JurorStatus } from "@/types/gauntlet";
import { Language, translations } from "@/locales/i18n";
import { SharkAvatar } from "./SharkAvatar";
import { Check, X, MessageSquare, Clock } from "lucide-react";

interface JurorSeatProps {
  config: JurorConfig;
  conviction: number;
  status: JurorStatus;
  isActive: boolean;
  lang: Language;
  onSelect: () => void;
}

export const JurorSeat: React.FC<JurorSeatProps> = ({
  config,
  conviction,
  status,
  isActive,
  lang,
  onSelect,
}) => {
  const t = translations[lang].jurorStatus;
  const isTr = lang === "tr";

  const isConvinced = status === "CONVINCED" || (status !== "AWAITING" && !isActive && conviction >= 65);
  const isRejected = status === "REJECTED" || (status !== "AWAITING" && !isActive && conviction <= 20);

  // Status Badge Styling with Clean Vector Icons - No Emojis
  let borderClass = "border-slate-800 hover:border-slate-700 bg-[#101522]";
  let statusBadge = (
    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded flex items-center gap-1">
      <Clock size={10} className="text-slate-500" />
      <span>{t.awaiting}</span>
    </span>
  );
  let gaugeColor = "bg-slate-600";
  let gaugeNumberColor = "text-slate-400";

  if (isActive) {
    borderClass = "border-amber-500 bg-[#171D2E] ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/5";
    statusBadge = (
      <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded flex items-center gap-1">
        <MessageSquare size={10} className="text-amber-400" />
        <span>{t.active}</span>
      </span>
    );
    gaugeColor = "bg-amber-400";
    gaugeNumberColor = "text-amber-400";
  } else if (isConvinced) {
    borderClass = "border-emerald-600/60 bg-[#0C1B16]";
    statusBadge = (
      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded flex items-center gap-1">
        <Check size={10} className="text-emerald-400" />
        <span>{t.convinced}</span>
      </span>
    );
    gaugeColor = "bg-emerald-400";
    gaugeNumberColor = "text-emerald-400";
  } else if (isRejected) {
    borderClass = "border-rose-900/60 bg-[#1A0F12] opacity-75";
    statusBadge = (
      <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 rounded flex items-center gap-1">
        <X size={10} className="text-rose-400" />
        <span>{t.rejected}</span>
      </span>
    );
    gaugeColor = "bg-rose-500";
    gaugeNumberColor = "text-rose-400";
  } else if (status === "ACTIVE") {
    gaugeColor = conviction > 50 ? "bg-amber-400" : "bg-rose-500";
  }

  const displayName = isTr ? config.nameTr : config.name;
  const displayRole = isTr ? config.roleTitleTr : config.roleTitle;
  const displayArchetype = isTr ? config.archetypeTr : config.archetype;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`text-left w-full p-3.5 sm:p-4 rounded-xl border-2 transition-all duration-200 relative flex flex-col justify-between group cursor-pointer ${borderClass}`}
    >
      {/* Top Deck: Avatar + Conviction Rate */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <SharkAvatar
          index={config.silhouetteIndex}
          isActive={isActive}
          isConvinced={isConvinced}
          isRejected={isRejected}
          size={52}
        />
        <div className="text-right">
          <div className="text-[10px] font-bold text-slate-400 mb-0.5">
            {t.convictionRate}
          </div>
          <div className={`text-xl font-black tabular-nums ${gaugeNumberColor}`}>
            %{conviction}
          </div>
        </div>
      </div>

      {/* Info & Persona */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-sm font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
            {displayName}
          </span>
        </div>
        <div className="text-xs text-slate-400 leading-snug mb-3 line-clamp-1">
          {displayRole}
        </div>

        {/* Tactile Conviction Bar */}
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/60 mb-2.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${gaugeColor}`}
            style={{ width: `${Math.max(4, conviction)}%` }}
          />
        </div>

        {/* Bottom Status & Archetype */}
        <div className="flex items-center justify-between gap-1 text-[11px]">
          {statusBadge}
          <span className="text-slate-400 font-medium truncate max-w-[110px] text-right">
            {displayArchetype}
          </span>
        </div>
      </div>
    </button>
  );
};
