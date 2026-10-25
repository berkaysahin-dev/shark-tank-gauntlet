"use client";

import React, { useState } from "react";
import { ArrowRight, Table2, ShieldAlert, Zap, Terminal, CheckCircle2, AlertCircle } from "lucide-react";
import { PitchData } from "@/types/gauntlet";
import { Language, translations } from "@/locales/i18n";
import { playGavel, playTurnTick } from "@/lib/audio";
import { JURORS } from "@/config/personas";
import { SharkAvatar } from "./SharkAvatar";

interface PitchSetupProps {
  lang: Language;
  onStartGauntlet: (pitch: PitchData) => void;
}

interface QuickPreset {
  id: string;
  icon: React.ReactNode;
  titleEn: string;
  titleTr: string;
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
    icon: <Table2 size={20} className="text-amber-400" />,
    titleEn: "RoastSheet",
    titleTr: "RoastSheet",
    name: "RoastSheet",
    taglineEn: "AI Excel Auditor",
    taglineTr: "Finansal Hata Denetçisi",
    oneLinerEn: "An Excel & Google Sheets add-in that catches formula breaks, hidden liabilities, and accounting errors in real time.",
    oneLinerTr: "Muhasebe ve formül hatalarını anında yakalayan, finansal açıkları denetleyen yapay zeka eklentisi.",
    targetEn: "SaaS founders and corporate finance teams",
    targetTr: "KOBİ finansçıları ve startup kurucuları",
    priceEn: "$29 / seat / month",
    priceTr: "Kullanıcı başı aylık 29$",
  },
  {
    id: "patigo",
    icon: <ShieldAlert size={20} className="text-amber-400" />,
    titleEn: "SafePulse",
    titleTr: "SafePulse",
    name: "SafePulse",
    taglineEn: "Vendor Security Auditor",
    taglineTr: "Tedarikçi Güvenlik Denetimi",
    oneLinerEn: "Automated third-party security verification and compliance evidence collection for modern procurement teams.",
    oneLinerTr: "Şirketlerin tedarikçi ve üçüncü parti yazılımlarını 10 saniyede güvenlik ve KVKK uyumluluğuna göre tarayan sistem.",
    targetEn: "CISOs, security officers, and enterprise buyers",
    targetTr: "Bilgi güvenliği yöneticileri ve satın alma ekipleri",
    priceEn: "$199 / month enterprise license",
    priceTr: "Aylık 2.500 TL kurumsal lisans",
  },
  {
    id: "notab",
    icon: <Zap size={20} className="text-amber-400" />,
    titleEn: "NoTab Flow",
    titleTr: "NoTab Flow",
    name: "NoTab Flow",
    taglineEn: "Headless Approvals",
    taglineTr: "Sekmesiz Onay Sistemi",
    oneLinerEn: "Headless client approvals and contract sign-offs executed directly inside WhatsApp and Slack with zero logins.",
    oneLinerTr: "Yeni bir web paneli açmadan, tüm fatura ve sözleşme onaylarını doğrudan WhatsApp ve Slack içinden bitiren araç.",
    targetEn: "Overwhelmed agency and operations directors",
    targetTr: "Yoğun operasyon ve ajans yöneticileri",
    priceEn: "$99 / month flat team rate",
    priceTr: "Ekip başı aylık 99$",
  },
  {
    id: "gitcaffeine",
    icon: <Terminal size={20} className="text-amber-400" />,
    titleEn: "DevRelay",
    titleTr: "DevRelay",
    name: "DevRelay",
    taglineEn: "Automated Deploy Guard",
    taglineTr: "Otomatik Dağıtım Koruması",
    oneLinerEn: "Zero-latency CI/CD pipeline automation that rolls back broken microservice deploys before users notice latency spikes.",
    oneLinerTr: "Mikroservis dağıtımlarında performans düşüşünü anında algılayıp sistemi hatasız sürüme döndüren otonom araç.",
    targetEn: "DevOps leads and engineering managers",
    targetTr: "Yazılım liderleri ve mühendislik yöneticileri",
    priceEn: "$79 / month cluster license",
    priceTr: "Aylık 79$ küme lisansı",
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
      targetAudience: targetAudience.trim() || (isTr ? "KOBİ ve kurumsal ekipler" : "Mid-market businesses"),
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
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Clean Editorial Headline (No badges, no cliché badges) */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
          {isTr ? (
            <>
              Girişimin <span className="text-amber-400 underline decoration-amber-500/40 decoration-4">Karar Masası</span> Karşısında Ayakta Kalabilecek mi?
            </>
          ) : (
            <>
              Can Your Startup Survive <span className="text-amber-400 underline decoration-amber-500/40 decoration-4">The Gauntlet</span>?
            </>
          )}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {isTr
            ? "Kibar ve yüzeysel övgüleri unutun. Ürününüzü satın almamak için her açığı zorlayan 5 farklı psikolojik alıcı arketipinin karşısına çıkın."
            : "Forget polite, superficial praise. Test your value proposition against 5 hyper-critical buyer archetypes who actively probe for fatal flaws before buying."}
        </p>
      </div>

      {/* Roster Preview Bar */}
      <div className="mb-8 p-4 rounded-2xl border-2 border-slate-800 bg-[#101522]/90 shadow-xl">
        <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-400">
          <span>{isTr ? "Masadaki Karar Kurulu" : "The Boardroom Panel"}</span>
          <span className="text-amber-400">{isTr ? "5 Farklı İtiraz Açısı" : "5 Distinct Angles"}</span>
        </div>
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {JURORS.map((juror) => (
            <div
              key={juror.id}
              className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <SharkAvatar index={juror.silhouetteIndex} size={44} />
              <span className="text-[11px] font-bold text-slate-200 mt-1.5 truncate max-w-full">
                {isTr ? juror.nameTr : juror.name}
              </span>
              <span className="text-[10px] text-amber-400/90 font-medium truncate max-w-full">
                {isTr ? juror.archetypeTr : juror.archetype}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick-Play Pitch Cards (Vector Icons - Zero Emojis) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-400">
          <span className="flex items-center gap-1.5">
            <span>{isTr ? "Hızlı Örnek Seç (Tek Tıkla Doldur)" : "Quick-Play Presets (1-Click)"}</span>
          </span>
          <span className="text-slate-500">{isTr ? "veya aşağıya kendiniz yazın" : "or write your own below"}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`p-3.5 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "border-amber-500 bg-amber-500/10 shadow-md shadow-amber-500/10"
                    : "border-slate-800 bg-[#121724] hover:border-slate-700 hover:bg-[#161D2E]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-700/80">
                    {preset.icon}
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
                      {isTr ? "Seçildi" : "Selected"}
                    </span>
                  )}
                </div>
                <div className="font-bold text-sm text-white mb-0.5">
                  {preset.name}
                </div>
                <div className="text-xs text-amber-400/80 font-medium mb-1.5">
                  {isTr ? preset.taglineTr : preset.taglineEn}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {isTr ? preset.oneLinerTr : preset.oneLinerEn}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Pitch Card Form */}
      <form
        onSubmit={handleStart}
        className="border-2 border-slate-800 rounded-2xl p-6 sm:p-8 bg-[#121724] shadow-2xl relative"
      >
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {isTr ? "Girişim Dosyası" : "Startup Pitch Docket"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isTr ? "Kurulun önüne koyacağınız resmi bilgiler" : "The official dossier presented to the board"}
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            {isTr ? "Adım 01/03" : "Stage 01/03"}
          </span>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border-2 border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              01. {t.productNameLabel} <span className="text-rose-400">*</span>
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
              className="w-full bg-[#0B0F19] border-2 border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors font-medium"
            />
          </div>

          {/* One-Liner */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-200">
                02. {t.oneLinerLabel} <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
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
              className="w-full bg-[#0B0F19] border-2 border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors font-medium resize-none leading-relaxed"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              {isTr
                ? "İpucu: Kurulun dikkat süresi kısadır. Ne yaptığınızı ve kimi kurtardığınızı net söyleyin."
                : "Tip: Keep it punchy. What specific pain do you kill and for whom?"}
            </p>
          </div>

          {/* Target Audience & Pricing in 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
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
                className="w-full bg-[#0B0F19] border-2 border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
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
                className="w-full bg-[#0B0F19] border-2 border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors font-medium"
              />
            </div>
          </div>
        </div>

        {/* Action Submit Button */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 text-center sm:text-left flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            <span>{isTr ? "Sıfır veri kaydı, tam yerel gizlilik" : "Zero retention, complete local privacy"}</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto btn-tank-primary px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <span>{isTr ? "Masaya Çık ve Savun" : "Enter the Boardroom"}</span>
            <ArrowRight size={17} strokeWidth={2.5} />
          </button>
        </div>
      </form>
    </div>
  );
};
