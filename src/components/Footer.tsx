"use client";

import React from "react";
import { Shield } from "lucide-react";
import { Language, translations } from "@/locales/i18n";
import { AppleDivider } from "@/components/ui/AppleDivider";

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang].footer;
  const isTr = lang === "tr";
  const year = new Date().getFullYear();

  return (
    <footer className="mt-4 sm:mt-8 bg-background">
      <AppleDivider />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 space-y-5">
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-1.5 text-xs text-muted text-center">
            <Shield size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{isTr ? "Verileriniz saklanmaz." : "Your data is not stored."}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-border text-[11px] text-muted">
          <p>
            Copyright © {year} Berkay Şahin. {t.rights}
          </p>
          <span className="text-muted/70">gauntlet.berkaysahin.net</span>
        </div>
      </div>
    </footer>
  );
};
