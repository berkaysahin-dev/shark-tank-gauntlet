"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KeyRound, RotateCcw } from "lucide-react";
import { Language, translations } from "@/locales/i18n";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { cn } from "@/lib/utils";

interface HeaderProps {
  lang: Language;
  onLanguageChange: (newLang: Language) => void;
  onOpenKeys: () => void;
  onReset: () => void;
  isInDuel: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  onOpenKeys,
  onReset,
  isInDuel,
}) => {
  const t = translations[lang].header;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isSolid = scrolled || menuOpen;

  const externalLinks = [
    { label: t.mainSite, href: "https://berkaysahin.net" },
    { label: t.blog, href: "https://berkaysahin.net/blog" },
    { label: t.contact, href: "https://berkaysahin.net/contact" },
  ];

  const linkClass = (active?: boolean) =>
    cn(
      "text-[12px] tracking-normal font-medium transition-all duration-200 py-1.5 px-2.5 rounded-full whitespace-nowrap",
      active
        ? "text-foreground bg-surface shadow-xs font-semibold"
        : "text-muted hover:text-foreground hover:bg-surface/50"
    );

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 safe-top isolate",
          "border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out",
          isSolid
            ? "bg-background/85 backdrop-blur-2xl backdrop-saturate-180 border-border shadow-xs"
            : "bg-background/60 backdrop-blur-xl border-border/60"
        )}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 h-12 flex items-center justify-between gap-3">
          {/* Apple-style Monogram + Subdomain Indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://berkaysahin.net"
              className="flex items-center gap-0.5 text-[14px] font-semibold tracking-tight text-foreground hover:opacity-85 transition-opacity"
              aria-label="berkaysahin.net"
            >
              <span>berkay</span>
              <span className="text-accent text-[16px] leading-none">.</span>
            </a>
            <span className="text-border text-xs select-none">/</span>
            <button
              type="button"
              onClick={onReset}
              className="text-[12px] font-medium text-muted hover:text-foreground transition-colors cursor-pointer whitespace-nowrap"
            >
              pitch
            </button>
          </div>

          {/* Center Navigation Links (Apple Style) */}
          <nav
            className="hidden sm:flex items-center gap-1 text-[12px]"
            aria-label="Main navigation"
          >
            <button
              type="button"
              onClick={onReset}
              className={cn(linkClass(true), "cursor-pointer")}
            >
              Gauntlet
            </button>
            {externalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={linkClass(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions: Reset, BYOK API, ThemeToggle, LanguageToggle, Mobile Hamburger */}
          <div className="flex items-center gap-2 shrink-0">
            {isInDuel && (
              <button
                type="button"
                onClick={onReset}
                title={t.reset}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface hover:bg-surface-hover border border-border text-foreground text-[11px] font-medium transition-all active:scale-95 cursor-pointer whitespace-nowrap select-none"
              >
                <RotateCcw size={11} />
                <span>{t.reset}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenKeys}
              title={t.byokButton}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface hover:bg-surface-hover border border-border text-foreground text-[11px] font-medium transition-all active:scale-95 cursor-pointer whitespace-nowrap select-none"
            >
              <KeyRound size={11} className="text-accent" />
              <span className="hidden sm:inline">{t.byokButton}</span>
              <span className="sm:hidden">API</span>
            </button>

            <ThemeToggle />

            <LanguageToggle lang={lang} onLanguageChange={onLanguageChange} />

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="sm:hidden w-8 h-8 flex flex-col items-center justify-center gap-1 rounded-full bg-surface border border-border text-foreground cursor-pointer"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span
                className={cn(
                  "block w-4 h-[1.5px] bg-foreground transition-all duration-300 origin-center",
                  menuOpen && "rotate-45 translate-y-[2.5px]"
                )}
              />
              <span
                className={cn(
                  "block w-4 h-[1.5px] bg-foreground transition-all duration-300 origin-center",
                  menuOpen && "-rotate-45 -translate-y-[2.5px]"
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Apple-style Fullscreen Mobile Overlay Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-2xl sm:hidden flex flex-col justify-between safe-top safe-bottom px-6 pt-20 pb-8"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-6 pt-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                {lang === "tr" ? "Menü" : "Menu"}
              </span>
              <div className="flex flex-col space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onReset();
                  }}
                  className="text-left text-2xl font-semibold tracking-tight py-1 text-accent cursor-pointer"
                >
                  The Gauntlet
                </button>
                {externalLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-2xl font-semibold tracking-tight py-1 block text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {isInDuel && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onReset();
                  }}
                  className="inline-flex items-center justify-center gap-2 w-full mt-4 py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-sm transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
                >
                  <RotateCcw size={15} />
                  <span>{t.reset}</span>
                </button>
              )}
            </div>

            <div className="pt-6 border-t border-border flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenKeys();
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-surface border border-border text-foreground text-xs font-medium active:scale-95 transition-all cursor-pointer"
              >
                <KeyRound size={13} className="text-accent" />
                <span>{t.byokButton}</span>
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};
