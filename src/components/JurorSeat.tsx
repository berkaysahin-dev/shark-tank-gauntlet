"use client";

import React from "react";
import { JurorConfig, JurorStatus } from "@/types/gauntlet";
import { Language, translations } from "@/locales/i18n";
import { SharkAvatar } from "./SharkAvatar";
import { Check, X, MessageSquare, Clock, CheckCheck } from "lucide-react";
import { formatPercent } from "@/lib/utils";

interface JurorSeatProps {
  config: JurorConfig;
  conviction: number;
  status: JurorStatus;
  hasAnswered?: boolean;
  isActive: boolean;
  lang: Language;
  onSelect: () => void;
}

export const JurorSeat: React.FC<JurorSeatProps> = ({
  config,
  conviction,
  status,
  hasAnswered = false,
  isActive,
  lang,
  onSelect,
}) => {
  const t = translations[lang].jurorStatus;
  const isTr = lang === "tr";

  const isConvinced = status === "CONVINCED" || (status !== "AWAITING" && !isActive && conviction >= 65);
  const isRejected = status === "REJECTED" || (status !== "AWAITING" && !isActive && conviction <= 20);

  let cardClass = "border-border bg-card-bg/75 hover:bg-card-hover";
  let statusBadge = (
    <span className="text-[10px] font-medium text-muted bg-surface px-2 py-0.5 rounded-full border border-border flex items-center gap-1">
      <Clock size={10} className="text-muted" />
      <span>{t.awaiting}</span>
    </span>
  );
  let gaugeColor = "bg-muted-subtle";
  let gaugeNumberColor = "text-muted";

  if (isActive) {
    cardClass = "border-accent bg-background ring-2 ring-accent/20 shadow-xs";
    statusBadge = (
      <span className="text-[10px] font-semibold text-accent bg-accent/10 border border-accent/25 px-2 py-0.5 rounded-full flex items-center gap-1">
        <MessageSquare size={10} className="text-accent" />
        <span>{t.active}</span>
      </span>
    );
    gaugeColor = "bg-accent";
    gaugeNumberColor = "text-accent";
  } else if (isConvinced) {
    cardClass = "border-emerald-500/45 bg-emerald-500/[0.06] hover:bg-emerald-500/[0.1]";
    statusBadge = (
      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
        <Check size={10} />
        <span>{t.convinced}</span>
      </span>
    );
    gaugeColor = "bg-emerald-500";
    gaugeNumberColor = "text-emerald-600 dark:text-emerald-400";
  } else if (isRejected) {
    cardClass = "border-rose-500/35 bg-rose-500/[0.05] opacity-80";
    statusBadge = (
      <span className="text-[10px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
        <X size={10} />
        <span>{t.rejected}</span>
      </span>
    );
    gaugeColor = "bg-rose-500";
    gaugeNumberColor = "text-rose-600 dark:text-rose-400";
  } else if (hasAnswered) {
    cardClass = "border-amber-500/35 bg-amber-500/[0.04] hover:bg-amber-500/[0.08]";
    statusBadge = (
      <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
        <CheckCheck size={10} />
        <span>{t.reviewed}</span>
      </span>
    );
    gaugeColor = "bg-amber-500";
    gaugeNumberColor = "text-amber-600 dark:text-amber-400";
  } else if (status === "ACTIVE") {
    gaugeColor = conviction > 50 ? "bg-accent" : "bg-rose-500";
    gaugeNumberColor = "text-foreground";
  }

  const displayName = isTr ? config.nameTr : config.name;
  const displayRole = isTr ? config.roleTitleTr : config.roleTitle;
  const displayArchetype = isTr ? config.archetypeTr : config.archetype;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`text-left w-full p-3.5 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between group cursor-pointer select-none ${cardClass}`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <SharkAvatar
          index={config.silhouetteIndex}
          isActive={isActive}
          isConvinced={isConvinced}
          isRejected={isRejected}
          size={46}
        />
        <div className="text-right">
          <div className="text-[10px] font-medium text-muted mb-0.5">
            {t.convictionRate}
          </div>
          <div className={`text-lg font-semibold tabular-nums tracking-tight ${gaugeNumberColor}`}>
            {formatPercent(conviction, lang)}
          </div>
        </div>
      </div>

      <div>
        <div className="text-[13px] font-semibold text-foreground tracking-tight group-hover:text-accent transition-colors truncate">
          {displayName}
        </div>
        <div className="text-[11px] text-muted leading-snug mb-2.5 truncate">
          {displayRole}
        </div>

        <div className="w-full h-1.5 bg-surface-raised rounded-full overflow-hidden mb-2.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${gaugeColor}`}
            style={{ width: `${Math.max(4, conviction)}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-1 text-[10px]">
          {statusBadge}
          <span className="text-muted font-medium truncate max-w-[96px] text-right">
            {displayArchetype}
          </span>
        </div>
      </div>
    </button>
  );
};
