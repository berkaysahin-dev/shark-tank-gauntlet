"use client";

import { type Language } from "@/locales/i18n";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  lang: Language;
  onLanguageChange: (newLang: Language) => void;
}

export function LanguageToggle({ lang, onLanguageChange }: LanguageToggleProps) {
  const options: { value: Language; label: string }[] = [
    { value: "en", label: "EN" },
    { value: "tr", label: "TR" },
  ];

  return (
    <div
      className="flex items-center rounded-full border border-border bg-surface backdrop-blur-md p-0.5"
      role="group"
      aria-label="Language"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onLanguageChange(option.value)}
          className={cn(
            "relative min-w-[30px] min-h-[24px] px-2 py-0.5 text-[11px] font-medium tracking-tight transition-all duration-200 rounded-full cursor-pointer select-none",
            lang === option.value
              ? "text-foreground bg-foreground/15 shadow-xs font-semibold"
              : "text-muted hover:text-foreground"
          )}
          aria-label={option.value === "en" ? "English" : "Türkçe"}
          aria-pressed={lang === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
