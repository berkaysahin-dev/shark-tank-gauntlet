"use client";

import React from "react";
import { Language, translations } from "@/locales/i18n";
import { Heart, Shield } from "lucide-react";

const GithubIcon = ({ size = 15 }: { size?: number }) => (
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

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang].footer;
  const isTr = lang === "tr";

  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#080B11] mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="max-w-xl">
            <h4 className="text-base sm:text-lg font-black text-white mb-1.5">
              {t.heading}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {t.subheading}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <a
              href="https://github.com/berkaysahin-dev/shark-tank-gauntlet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
            >
              <GithubIcon size={15} />
              <span>GitHub</span>
            </a>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Shield size={14} className="text-emerald-400" />
              <span>{isTr ? "Sıfır Veri Saklama" : "Zero Data Retention"}</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="text-slate-400">{t.license}</span>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 font-medium">
          <div>
            © {new Date().getFullYear()} The Gauntlet · {isTr ? "Girişimci Değerlendirme Arenası" : "Adversarial Founder Arena"}
          </div>
          <div>
            {isTr ? "Açık Kaynaklı Girişim Doğrulama Aracı" : "Open Source Founder Validation Tool"}
          </div>
        </div>
      </div>
    </footer>
  );
};
