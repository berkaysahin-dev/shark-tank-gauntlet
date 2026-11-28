"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useSyncExternalStore } from "react";
import { Language } from "@/locales/i18n";

const emptySubscribe = () => () => {};

interface ThemeToggleProps {
  lang?: Language;
}

export function ThemeToggle({ lang = "en" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full border border-border bg-surface flex items-center justify-center opacity-0" />
    );
  }

  const isDark = theme === "dark";
  const label =
    lang === "tr"
      ? isDark
        ? "Aydınlık Moda Geç"
        : "Karanlık Moda Geç"
      : isDark
      ? "Switch to Light Mode"
      : "Switch to Dark Mode";

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
      title={label}
      aria-label={label}
      className="relative flex items-center justify-center w-8 h-8 rounded-full border border-border bg-surface hover:bg-surface-hover text-foreground backdrop-blur-md cursor-pointer select-none overflow-hidden transition-colors duration-200"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="flex items-center justify-center text-[#f5f5f7]"
          >
            <svg
              className="w-4 h-4 text-[#f5f5f7] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              <path
                d="M19 3v4M21 5h-4"
                strokeWidth="1.75"
                stroke="currentColor"
                className="opacity-75"
              />
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="flex items-center justify-center text-amber-500"
          >
            <svg
              className="w-4 h-4 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.15" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
