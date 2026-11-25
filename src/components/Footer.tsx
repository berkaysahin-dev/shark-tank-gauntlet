"use client";

import React from "react";
import { Shield } from "lucide-react";
import { Language, translations } from "@/locales/i18n";
import { AppleDivider } from "@/components/ui/AppleDivider";

interface FooterProps {
  lang: Language;
}

const links = [
  { label: "berkaysahin.net", href: "https://berkaysahin.net", external: false },
  { label: "Telegram", href: "https://t.me/paydaemon", external: true },
  { label: "GitHub", href: "https://github.com/berkaysahin-dev/shark-tank-gauntlet", external: true },
];

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang].footer;
  const isTr = lang === "tr";
  const year = new Date().getFullYear();

  return (
    <footer className="mt-4 sm:mt-8 bg-background">
      <AppleDivider />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-muted">
              <li>
                <a
                  href="https://berkaysahin.net/about"
                  className="hover:text-foreground transition-colors duration-200"
                >
                  {t.about}
                </a>
              </li>
              <li>
                <a
                  href="https://berkaysahin.net/blog"
                  className="hover:text-accent transition-colors duration-200"
                >
                  {t.blog}
                </a>
              </li>
              <li>
                <a
                  href="https://berkaysahin.net/contact"
                  className="hover:text-accent transition-colors duration-200"
                >
                  {t.contact}
                </a>
              </li>
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="inline-flex items-center gap-1.5 text-[11px] text-muted">
            <Shield size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{isTr ? "Sıfır Veri Saklama · MIT" : "Zero Data Retention · MIT"}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-border text-[11px] text-muted">
          <p>
            Copyright © {year} Berkay Şahin. {t.rights}
          </p>
          <span className="text-muted/70">pitch.berkaysahin.net</span>
        </div>
      </div>
    </footer>
  );
};
