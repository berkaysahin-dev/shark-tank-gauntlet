"use client";

import React from "react";
import { KeyRound, RotateCcw } from "lucide-react";
import { Language, translations } from "@/locales/i18n";

interface HeaderProps {
  lang: Language;
  onLanguageChange: (newLang: Language) => void;
  onOpenKeys: () => void;
  onReset: () => void;
  isInDuel: boolean;
}

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  onOpenKeys,
  onReset,
  isInDuel,
}) => {
  const t = translations[lang].header;

  return (
    <header className="w-full border-b border-slate-800/80 bg-[#090C12]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Typographic Title - No top logo, no badge */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="flex flex-col text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-sans group-hover:text-amber-400 transition-colors">
                {t.title}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              {t.subtitle}
            </p>
          </button>
        </div>

        {/* Control Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          {/* Reset / Start Over if in duel */}
          {isInDuel && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/60 hover:bg-slate-700/70 text-slate-200 font-semibold transition-all cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>{t.reset}</span>
            </button>
          )}

          {/* BYOK Button */}
          <button
            type="button"
            onClick={onOpenKeys}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold transition-all hover:border-slate-600 shadow-sm cursor-pointer"
          >
            <KeyRound size={13} className="text-amber-400" />
            <span className="hidden sm:inline">{t.byokButton}</span>
            <span className="sm:hidden">API</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center border border-slate-700/80 rounded-lg overflow-hidden bg-slate-900/80 p-0.5">
            <button
              type="button"
              onClick={() => onLanguageChange("en")}
              className={`px-2 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${
                lang === "en"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange("tr")}
              className={`px-2 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${
                lang === "tr"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              TR
            </button>
          </div>

          {/* GitHub Link */}
          <a
            href="https://github.com/berkaysahin-dev/shark-tank-gauntlet"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 bg-slate-900/60 transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon size={16} />
          </a>
        </div>
      </div>
    </header>
  );
};
