"use client";

import React, { useState } from "react";
import { ArrowRight, Table2, ShieldAlert, Zap, Terminal, CheckCircle2, AlertCircle } from "lucide-react";
import { PitchData } from "@/types/gauntlet";
import { Language, translations } from "@/locales/i18n";
import { playGavel, playTurnTick } from "@/lib/audio";
import { JURORS } from "@/config/personas";
import { SharkAvatar } from "./SharkAvatar";
import { AppleDivider } from "@/components/ui/AppleDivider";

interface PitchSetupProps {
  lang: Language;
  onStartGauntlet: (pitch: PitchData) => void;
}

interface QuickPreset {
  id: string;
  icon: React.ReactNode;
  name: string;
  oneLinerEn: string;
  oneLinerTr: string;
  targetEn: string;
  targetTr: string;
  priceEn: string;
  priceTr: string;
  taglineEn: string;
  taglineTr: string;
}

const QUICK_PRESETS: QuickPreset[] = [
  {
    id: "roastsheet",
    icon: <Table2 size={18} className="text-accent" />,
    name: "RoastSheet",
    taglineEn: "Spreadsheet Auditor",
    taglineTr: "Tablo Hata Bulucu",
    oneLinerEn: "An Excel and Google Sheets add-on that spots broken formulas and accounting errors right away.",
    oneLinerTr: "Excel ve Google E-Tablolar'daki formül ve hesap hatalarını anında yakalayan eklenti.",
    targetEn: "Startup founders and finance teams",
    targetTr: "KOBİ finansçıları ve girişimciler",
    priceEn: "$29 / user / month",
    priceTr: "Kullanıcı başı aylık 29$",
  },
  {
    id: "safepulse",
    icon: <ShieldAlert size={18} className="text-accent" />,
    name: "SafePulse",
    taglineEn: "Vendor Security Check",
    taglineTr: "Tedarikçi Güvenlik Kontrolü",
    oneLinerEn: "Checks outside software tools for security and compliance risks in seconds before your team buys them.",
    oneLinerTr: "Şirketin alacağı yeni yazılımları 10 saniyede güvenlik ve KVKK açısından tarayan sistem.",
    targetEn: "Security leads and IT buyers",
    targetTr: "Bilgi güvenliği yöneticileri ve satın alma ekipleri",
    priceEn: "$199 / month team plan",
    priceTr: "Aylık 2.500 TL ekip planı",
  },
  {
    id: "notab",
    icon: <Zap size={18} className="text-accent" />,
    name: "NoTab Flow",
    taglineEn: "No-App Approvals",
    taglineTr: "Sekmesiz Onay Aracı",
    oneLinerEn: "Lets clients and managers approve invoices and contracts straight inside WhatsApp or Slack.",
    oneLinerTr: "Yeni bir site açmadan fatura ve sözleşme onaylarını doğrudan WhatsApp veya Slack'ten bitiren araç.",
    targetEn: "Busy agency and operations managers",
    targetTr: "Yoğun operasyon ve ajans yöneticileri",
    priceEn: "$99 / month flat rate",
    priceTr: "Ekip başı aylık 99$",
  },
  {
    id: "devrelay",
    icon: <Terminal size={18} className="text-accent" />,
    name: "DevRelay",
    taglineEn: "Auto Update Rollback",
    taglineTr: "Otomatik Geri Alma",
    oneLinerEn: "Automatically rolls back broken software updates before users notice slowdowns or crashes.",
    oneLinerTr: "Canlıya çıkan hatalı güncellemeyi kullanıcılar fark etmeden saniyeler içinde eski haline döndüren araç.",
    targetEn: "Engineering leads and DevOps teams",
    targetTr: "Yazılım liderleri ve sistem ekipleri",
    priceEn: "$79 / month team plan",
    priceTr: "Aylık 79$ ekip planı",
  },
];

export const PitchSetup: React.FC<PitchSetupProps> = ({ lang, onStartGauntlet }) => {
  const t = translations[lang].pitchSetup;
  const isTr = lang === "tr";

  const [productName, setProductName] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [pricingModel, setPricingModel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !oneLiner.trim()) {
      setError(t.errorRequired);
      return;
    }
    setError(null);
    playGavel();
    onStartGauntlet({
      productName: productName.trim(),
      oneLiner: oneLiner.trim(),
      targetAudience: targetAudience.trim() || (isTr ? "KOBİ ve kurumsal ekipler" : "Small and mid-sized teams"),
      pricingModel: pricingModel.trim() || (isTr ? "Kullanıcı başı aylık 49$" : "$49 / user / month"),
    });
  };

  const applyPreset = (preset: QuickPreset) => {
    playTurnTick();
    setActivePresetId(preset.id);
    setProductName(preset.name);
    setOneLiner(isTr ? preset.oneLinerTr : preset.oneLinerEn);
    setTargetAudience(isTr ? preset.targetTr : preset.targetEn);
    setPricingModel(isTr ? preset.priceTr : preset.priceEn);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-32 pb-12 sm:pb-16 space-y-10 sm:space-y-12">
      {/* Apple Editorial Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.035em] apple-shimmer-text leading-[1.15] block mx-auto">
          The Gauntlet
        </h1>

        <p className="text-base sm:text-xl font-medium tracking-tight text-foreground max-w-2xl mx-auto">
          {isTr
            ? "Fikriniz 5 zorlu alıcının karşısında ayakta kalabilecek mi?"
            : "Can your startup pitch survive five tough buyers?"}
        </p>

        <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed font-normal">
          {t.heroSubtitle}
        </p>
      </div>

      <AppleDivider />

      {/* Boardroom Panel Preview */}
      <div className="relative rounded-3xl border border-border bg-card-bg/90 p-5 sm:p-6 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/15 to-transparent pointer-events-none"
        />
        <div className="flex items-center justify-between mb-4 text-xs">
          <span className="font-semibold text-foreground tracking-tight">
            {isTr ? "Masadaki Karar Kurulu" : "The Boardroom Panel"}
          </span>
          <span className="text-[11px] font-medium text-accent">
            {isTr ? "5 Jüri Üyesi" : "5 Tough Buyers"}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {JURORS.map((juror) => (
            <div
              key={juror.id}
              className="flex flex-col items-center text-center p-3 rounded-2xl bg-background border border-border transition-colors"
            >
              <SharkAvatar index={juror.silhouetteIndex} size={44} />
              <span className="text-[12px] font-semibold text-foreground mt-2 truncate max-w-full tracking-tight">
                {isTr ? juror.nameTr : juror.name}
              </span>
              <span className="text-[10px] text-muted font-medium truncate max-w-full">
                {isTr ? juror.archetypeTr : juror.archetype}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick-Play Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">
            {isTr ? "Hazır Örnek Seç (Tek Tıkla Doldur)" : "Pick an Example (1-Click)"}
          </span>
          <span className="text-muted text-[11px]">
            {isTr ? "veya aşağıya kendi fikrini yaz" : "or write your own below"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer select-none ${
                  isSelected
                    ? "border-accent bg-accent/[0.06] ring-1 ring-accent/30"
                    : "border-border bg-card-bg/75 hover:bg-card-hover"
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="shrink-0">{preset.icon}</div>
                  {isSelected && (
                    <span className="text-[10px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                      {isTr ? "Seçildi" : "Selected"}
                    </span>
                  )}
                </div>
                <div className="font-semibold text-sm text-foreground tracking-tight mb-0.5">
                  {preset.name}
                </div>
                <div className="text-[11px] text-accent font-medium mb-1.5">
                  {isTr ? preset.taglineTr : preset.taglineEn}
                </div>
                <div className="text-[11px] text-muted line-clamp-2 leading-relaxed">
                  {isTr ? preset.oneLinerTr : preset.oneLinerEn}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Pitch Card */}
      <div className="relative rounded-[28px] sm:rounded-[32px] p-6 sm:p-9 overflow-hidden bg-card-bg/90 border border-border shadow-xs dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/15 to-transparent pointer-events-none"
        />

        <form onSubmit={handleStart} className="relative z-10 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                {isTr ? "Girişiminizi Tanıtın" : "Your Pitch"}
              </h2>
              <p className="text-xs text-muted mt-0.5">
                {isTr ? "Jüriye ne yaptığınızı kısaca anlatın" : "Tell the panel what you are building"}
              </p>
            </div>
            <span className="text-[11px] font-mono font-medium text-muted bg-background px-2.5 py-1 rounded-full border border-border">
              {isTr ? "Adım 1 / 3" : "Step 1 / 3"}
            </span>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[12px] font-medium tracking-tight text-muted mb-2">
              01. {t.productNameLabel} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => {
                setProductName(e.target.value);
                setActivePresetId(null);
              }}
              placeholder={t.productNamePlaceholder}
              maxLength={100}
              className="w-full rounded-2xl px-4 py-3 text-xs sm:text-sm text-foreground bg-background border border-border placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 transition-all duration-200"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[12px] font-medium tracking-tight text-muted">
                02. {t.oneLinerLabel} <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-muted font-mono">
                {oneLiner.length}/300
              </span>
            </div>
            <textarea
              rows={3}
              value={oneLiner}
              onChange={(e) => {
                setOneLiner(e.target.value);
                setActivePresetId(null);
              }}
              placeholder={t.oneLinerPlaceholder}
              maxLength={300}
              className="w-full rounded-2xl px-4 py-3 text-xs sm:text-sm text-foreground bg-background border border-border placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 transition-all duration-200 resize-none leading-relaxed"
            />
            <p className="text-[11px] text-muted mt-1.5">
              {isTr
                ? "İpucu: Kimin hangi derdini çözdüğünüzü sade bir dille yazın."
                : "Tip: Keep it simple. What problem do you solve, and for who?"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-[12px] font-medium tracking-tight text-muted mb-2">
                03. {t.targetAudienceLabel}
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => {
                  setTargetAudience(e.target.value);
                  setActivePresetId(null);
                }}
                placeholder={t.targetAudiencePlaceholder}
                maxLength={100}
                className="w-full rounded-2xl px-4 py-3 text-xs sm:text-sm text-foreground bg-background border border-border placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium tracking-tight text-muted mb-2">
                04. {t.pricingModelLabel}
              </label>
              <input
                type="text"
                value={pricingModel}
                onChange={(e) => {
                  setPricingModel(e.target.value);
                  setActivePresetId(null);
                }}
                placeholder={t.pricingModelPlaceholder}
                maxLength={100}
                className="w-full rounded-2xl px-4 py-3 text-xs sm:text-sm text-foreground bg-background border border-border placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 transition-all duration-200"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-muted text-center sm:text-left flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{isTr ? "Verileriniz saklanmaz" : "Your data is not stored"}</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs sm:text-sm font-medium shadow-[0_4px_16px_rgba(0,113,227,0.3)] hover:shadow-[0_6px_24px_rgba(0,113,227,0.4)] active:scale-95 transition-all cursor-pointer select-none"
            >
              <span>{t.submitButton}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
