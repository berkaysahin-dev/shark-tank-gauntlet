"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, KeyRound, ExternalLink, Trash2, Lock, CheckCircle2 } from "lucide-react";
import { validateApiKeyFormat } from "@/lib/security";
import { Language, translations } from "@/locales/i18n";
import { playTurnTick } from "@/lib/audio";

interface KeySettingsModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
}

export const KeySettingsModal: React.FC<KeySettingsModalProps> = ({
  isOpen,
  lang,
  onClose,
}) => {
  const t = translations[lang].byokModal;
  const isTr = lang === "tr";
  const [geminiKey, setGeminiKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGeminiKey(sessionStorage.getItem("gauntlet_gemini_key") || "");
      setOpenaiKey(sessionStorage.getItem("gauntlet_openai_key") || "");
    }
  }, [isOpen]);

  const handleSave = () => {
    playTurnTick();
    if (typeof window !== "undefined") {
      if (geminiKey.trim()) {
        sessionStorage.setItem("gauntlet_gemini_key", geminiKey.trim());
      } else {
        sessionStorage.removeItem("gauntlet_gemini_key");
      }

      if (openaiKey.trim()) {
        sessionStorage.setItem("gauntlet_openai_key", openaiKey.trim());
      } else {
        sessionStorage.removeItem("gauntlet_openai_key");
      }

      setSaveStatus(t.savedMessage);
      setTimeout(() => {
        setSaveStatus(null);
        onClose();
      }, 900);
    }
  };

  const handleClear = () => {
    playTurnTick();
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("gauntlet_gemini_key");
      sessionStorage.removeItem("gauntlet_openai_key");
      setGeminiKey("");
      setOpenaiKey("");
      setSaveStatus(t.clearedMessage);
      setTimeout(() => setSaveStatus(null), 1200);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="w-full max-w-xl border-2 border-slate-700 rounded-2xl bg-[#111624] p-6 sm:p-8 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-2 text-amber-400">
              <Lock size={18} />
              <h3 className="text-lg font-black text-white">
                {t.title}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-medium">
              {t.description}
            </p>

            {/* Offline Simulation Status Pill */}
            <div className="mb-6 p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                {isTr ? "Varsayılan Motor:" : "Default Engine:"}
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                <span>{isTr ? "Sıfır Kurulum Çevrimdışı Simülatör Aktif" : "Offline Heuristics Ready"}</span>
              </span>
            </div>

            {/* Gemini Key Input */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-200">
                    {t.geminiLabel}
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>{t.geminiLink}</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#0B0F19] border-2 border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                />
              </div>

              {/* OpenAI Key Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-200">
                    {t.openaiLabel}
                  </label>
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>{t.openaiLink}</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
                <input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full bg-[#0B0F19] border-2 border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                />
              </div>
            </div>

            {/* Privacy Shield Note */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 mb-6 flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t.privacyNote}
              </p>
            </div>

            {/* Status Message */}
            {saveStatus && (
              <div className="mb-4 text-xs font-bold text-center text-amber-400">
                {saveStatus}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
                <span>{t.clearButton}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {t.cancelButton}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn-tank-primary px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer shadow-sm"
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
