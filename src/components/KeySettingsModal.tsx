"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, ExternalLink, Trash2, Lock, AlertCircle } from "lucide-react";
import { Language, translations } from "@/locales/i18n";
import { playTurnTick } from "@/lib/audio";
import { validateApiKeyFormat } from "@/lib/security";

interface KeySettingsModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
  onKeysUpdated?: () => void;
}

export const KeySettingsModal: React.FC<KeySettingsModalProps> = ({
  isOpen,
  lang,
  onClose,
  onKeysUpdated,
}) => {
  const t = translations[lang].byokModal;
  const [geminiKey, setGeminiKey] = useState(() =>
    typeof window !== "undefined" ? sessionStorage.getItem("gauntlet_gemini_key") || "" : ""
  );
  const [openaiKey, setOpenaiKey] = useState(() =>
    typeof window !== "undefined" ? sessionStorage.getItem("gauntlet_openai_key") || "" : ""
  );
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const handleSave = () => {
    playTurnTick();
    setValidationError(null);

    const trimmedGemini = geminiKey.trim();
    const trimmedOpenai = openaiKey.trim();

    if (trimmedGemini && !validateApiKeyFormat(trimmedGemini, "gemini")) {
      setValidationError(t.invalidGeminiError);
      return;
    }

    if (trimmedOpenai && !validateApiKeyFormat(trimmedOpenai, "openai")) {
      setValidationError(t.invalidOpenaiError);
      return;
    }

    if (typeof window !== "undefined") {
      if (trimmedGemini) {
        sessionStorage.setItem("gauntlet_gemini_key", trimmedGemini);
      } else {
        sessionStorage.removeItem("gauntlet_gemini_key");
      }

      if (trimmedOpenai) {
        sessionStorage.setItem("gauntlet_openai_key", trimmedOpenai);
      } else {
        sessionStorage.removeItem("gauntlet_openai_key");
      }

      onKeysUpdated?.();
      setSaveStatus(t.savedMessage);
      setTimeout(() => {
        setSaveStatus(null);
        onClose();
      }, 800);
    }
  };

  const handleClear = () => {
    playTurnTick();
    setValidationError(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("gauntlet_gemini_key");
      sessionStorage.removeItem("gauntlet_openai_key");
      setGeminiKey("");
      setOpenaiKey("");
      onKeysUpdated?.();
      setSaveStatus(t.clearedMessage);
      setTimeout(() => setSaveStatus(null), 1200);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="byok-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="w-full max-w-xl border border-border rounded-[28px] bg-card-bg/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 text-muted hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-surface cursor-pointer"
              aria-label={lang === "tr" ? "Kapat" : "Close"}
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-2 text-accent">
              <Lock size={17} />
              <h3 id="byok-modal-title" className="text-lg font-semibold tracking-tight text-foreground">
                {t.title}
              </h3>
            </div>

            <p className="text-xs text-muted leading-relaxed mb-5">
              {t.description}
            </p>

            {validationError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="space-y-4 mb-5">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-foreground">
                    {t.geminiLabel}
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-accent hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>{t.geminiLink}</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => {
                    setGeminiKey(e.target.value);
                    setValidationError(null);
                  }}
                  placeholder="AIzaSy..."
                  className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 transition-all font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-foreground">
                    {t.openaiLabel}
                  </label>
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-accent hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>{t.openaiLink}</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
                <input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => {
                    setOpenaiKey(e.target.value);
                    setValidationError(null);
                  }}
                  placeholder="sk-proj-..."
                  className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 transition-all font-mono"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-background border border-border mb-5 flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted leading-relaxed">
                {t.privacyNote}
              </p>
            </div>

            {saveStatus && (
              <div className="mb-4 text-xs font-medium text-center text-accent">
                {saveStatus}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-full transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
                <span>{t.clearButton}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full text-xs font-medium text-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  {t.cancelButton}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium cursor-pointer shadow-sm active:scale-95 transition-all"
                >
                  {t.saveButton}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
