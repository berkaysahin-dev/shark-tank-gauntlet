export type Language = "en" | "tr";

export interface Translations {
  header: {
    title: string;
    subtitle: string;
    reset: string;
    byokButton: string;
    github: string;
  };
  pitchSetup: {
    heroTitle: string;
    heroSubtitle: string;
    badge: string;
    fillExample: string;
    productNameLabel: string;
    productNamePlaceholder: string;
    oneLinerLabel: string;
    oneLinerPlaceholder: string;
    targetAudienceLabel: string;
    targetAudiencePlaceholder: string;
    pricingModelLabel: string;
    pricingModelPlaceholder: string;
    submitButton: string;
    errorRequired: string;
    preset: {
      name: string;
      oneLiner: string;
      target: string;
      price: string;
    };
  };
  arena: {
    productLabel: string;
    stepCount: (current: number, total: number) => string;
    activeShark: string;
    convictionLevel: string;
    objectionLabel: string;
    objectionThinking: string;
    reactionLabel: (delta: number) => string;
    newConviction: (conv: number) => string;
    inputLabel: string;
    inputPlaceholder: (name: string) => string;
    inputHint: string;
    evaluating: string;
    submitCounter: string;
    nextShark: string;
    viewVerdict: string;
  };
  jurorStatus: {
    awaiting: string;
    active: string;
    convinced: string;
    rejected: string;
    convictionRate: string;
  };
  verdict: {
    title: string;
    averageConviction: string;
    convincedCount: (convinced: number, total: number, rejected: number) => string;
    breakdownTitle: string;
    accepted: string;
    rejected: string;
    vulnerabilityTitle: string;
    remedyTitle: string;
    copyShareText: string;
    copied: string;
    resetButton: string;
    shareTemplate: (name: string, convinced: number, total: number, avg: number, verdict: string, vuln: string) => string;
  };
  byokModal: {
    title: string;
    description: string;
    geminiLabel: string;
    geminiLink: string;
    openaiLabel: string;
    openaiLink: string;
    privacyNote: string;
    formatWarning: string;
    saveButton: string;
    cancelButton: string;
    clearButton: string;
    savedMessage: string;
    clearedMessage: string;
  };
  footer: {
    heading: string;
    subheading: string;
    license: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      title: "The Gauntlet",
      subtitle: "Adversarial Founder Arena",
      reset: "New Pitch",
      byokButton: "API Keys",
      github: "GitHub Repository",
    },
    pitchSetup: {
      heroTitle: "Face 5 Ruthless Pitch Judges",
      heroSubtitle:
        "Forget gentle advice. Test your startup idea against 5 hyper-critical psychological buyer archetypes who actively try to say no.",
      badge: "Pitch Setup",
      fillExample: "Load Example Pitch",
      productNameLabel: "Product Name",
      productNamePlaceholder: "e.g. DocuShield, AutoLead, CodePulse",
      oneLinerLabel: "What does it do in plain English?",
      oneLinerPlaceholder: "e.g. AI assistant that scans contracts for hidden legal risks in 10 seconds for law firms.",
      targetAudienceLabel: "Who is your target customer?",
      targetAudiencePlaceholder: "e.g. Law firms, SME business owners, security managers",
      pricingModelLabel: "Pricing Model",
      pricingModelPlaceholder: "e.g. $49/month per user or $400/year",
      submitButton: "Enter the Boardroom",
      errorRequired: "Please enter at least the product name and a clear description.",
      preset: {
        name: "DocuShield AI",
        oneLiner: "An automated assistant that scans supplier contracts and flags hidden liability clauses in under 15 seconds.",
        target: "Mid-sized law firms and corporate legal counsels",
        price: "$49 per seat / month",
      },
    },
    arena: {
      productLabel: "Current Startup",
      stepCount: (current, total) => `Judge ${current} of ${total}`,
      activeShark: "Active Interrogator",
      convictionLevel: "Conviction Level",
      objectionLabel: "Their Objection",
      objectionThinking: "The judge is examining your pitch and formulating their objection...",
      reactionLabel: (delta) => `Judge's Reaction (${delta > 0 ? "+" : ""}${delta} pts)`,
      newConviction: (conv) => `New Conviction: ${conv}%`,
      inputLabel: "Your Counter-Argument",
      inputPlaceholder: (name) => `Convince ${name} with concrete numbers, clear ROI, or specific risk reduction...`,
      inputHint: "Press Cmd + Enter to submit",
      evaluating: "Judging your response...",
      submitCounter: "Send Defense",
      nextShark: "Next Judge",
      viewVerdict: "See Final Verdict",
    },
    jurorStatus: {
      awaiting: "Waiting",
      active: "Speaking",
      convinced: "Bought In",
      rejected: "Walked Away",
      convictionRate: "Conviction",
    },
    verdict: {
      title: "Boardroom Verdict Dossier",
      averageConviction: "Avg Conviction",
      convincedCount: (convinced, total, rejected) =>
        `${convinced} of ${total} judges were convinced. ${rejected} walked away.`,
      breakdownTitle: "Individual Judge Scorecard",
      accepted: "Convinced",
      rejected: "Passed",
      vulnerabilityTitle: "Biggest Vulnerability Exposed",
      remedyTitle: "Actionable Strategy to Fix It",
      copyShareText: "Share Results (X / LinkedIn)",
      copied: "Copied to Clipboard!",
      resetButton: "Pitch a New Startup",
      shareTemplate: (name, convinced, total, avg, verdict, vuln) =>
        `I just took my startup (${name}) through The Gauntlet.\nResult: ${convinced}/${total} judges bought in (Average Conviction: ${avg}%)\nVerdict: ${verdict}\nKey Weakness: ${vuln}\n\nTest your pitch against 5 ruthless archetypes for free:`,
    },
    byokModal: {
      title: "Private API Key Management (BYOK)",
      description:
        "Every user brings their own API key. Your key is stored strictly inside this browser tab's temporary memory (sessionStorage). It is never saved to any database and nobody else can ever see or access it.",
      geminiLabel: "Google Gemini API Key (Recommended)",
      geminiLink: "Get free key",
      openaiLabel: "OpenAI API Key (Alternative)",
      openaiLink: "Get key",
      privacyNote:
        "Zero-storage guarantee: If you do not enter a key, the app runs on a built-in offline simulation engine so you can still play freely.",
      formatWarning: "Google Gemini API keys usually start with AIzaSy.",
      saveButton: "Save to Browser",
      cancelButton: "Cancel",
      clearButton: "Clear Keys",
      savedMessage: "Key saved to local session memory.",
      clearedMessage: "Keys cleared. Switched to offline mode.",
    },
    footer: {
      heading: "Test your startup before real buyers tear it apart.",
      subheading:
        "The Gauntlet is a free, open-source, zero-retention boardroom simulator designed for founders.",
      license: "MIT Open Source License",
    },
  },
  tr: {
    header: {
      title: "The Gauntlet",
      subtitle: "Girişimci Düello Arenası",
      reset: "Yeni Girişim",
      byokButton: "API Anahtarları",
      github: "GitHub Reposu",
    },
    pitchSetup: {
      heroTitle: "5 Acımasız Jüriyle Canlı Yüzleşin",
      heroSubtitle:
        "Nezaketen yapılan övgüleri unutun. Girişiminizi, ürünü almamak için bahane arayan 5 zorlu alıcı arketipine karşı test edin.",
      badge: "Girişim Tanıtımı",
      fillExample: "Örnek Bilgi Yükle",
      productNameLabel: "Ürün veya Girişim Adı",
      productNamePlaceholder: "Örn: DocuShield, AutoLead, CodePulse",
      oneLinerLabel: "Ürününüz Ne Yapar? (Herkesin Anlayacağı Dilde)",
      oneLinerPlaceholder: "Örn: Hukuk büroları için sözleşmelerdeki gizli riskleri 10 saniyede çıkaran yapay zeka asistanı.",
      targetAudienceLabel: "Hedef Müşteriniz Kim?",
      targetAudiencePlaceholder: "Örn: KOBİ patronları, hukuk büroları, şirket yöneticileri",
      pricingModelLabel: "Fiyatlandırma",
      pricingModelPlaceholder: "Örn: Kullanıcı başı aylık 49$ / Yıllık 400$",
      submitButton: "Jüri Masasına Otur",
      errorRequired: "Lütfen en az ürün adını ve anlaşılır bir açıklama girin.",
      preset: {
        name: "DocuShield AI",
        oneLiner: "Tedarikçi sözleşmelerindeki gizli riskleri ve cezai şartları 15 saniyede denetleyen otomatik asistan.",
        target: "Orta ölçekli hukuk büroları ve şirket avukatları",
        price: "Kullanıcı başı aylık 49$",
      },
    },
    arena: {
      productLabel: "Savunulan Ürün",
      stepCount: (current, total) => `Jüri ${current} / ${total}`,
      activeShark: "Söz Alan İtirazcı",
      convictionLevel: "İkna Seviyesi",
      objectionLabel: "Jürinin İtirazı",
      objectionThinking: "Jüri girişiminizi inceliyor ve en sert itirazını hazırlıyor...",
      reactionLabel: (delta) => `Jürinin Tepkisi (${delta > 0 ? "+" : ""}${delta} Puan)`,
      newConviction: (conv) => `Yeni İkna: %${conv}`,
      inputLabel: "Savunmanız",
      inputPlaceholder: (name) => `${name} karakterini ikna etmek için net veri, tasarruf veya risk çözümü sunun...`,
      inputHint: "Cmd + Enter ile hızlı gönderin",
      evaluating: "Jüri yanıtınızı değerlendiriyor...",
      submitCounter: "Cevabı Gönder",
      nextShark: "Sonraki Jüri",
      viewVerdict: "Karar Raporunu Gör",
    },
    jurorStatus: {
      awaiting: "Beklemede",
      active: "Söz Aldı",
      convinced: "İkna Oldu",
      rejected: "Masadan Kalktı",
      convictionRate: "İkna Oranı",
    },
    verdict: {
      title: "Jüri Karar Raporu",
      averageConviction: "Ortalama İkna",
      convincedCount: (convinced, total, rejected) =>
        `5 jüriden ${convinced} tanesi ikna oldu. ${rejected} tanesi masadan kalktı.`,
      breakdownTitle: "Bireysel Jüri Değerlendirmeleri",
      accepted: "Kabul",
      rejected: "Red",
      vulnerabilityTitle: "En Zayıf Görülen Nokta",
      remedyTitle: "Nasıl Düzeltirsiniz?",
      copyShareText: "Sonucu Paylaş (X / LinkedIn)",
      copied: "Panoya Kopyalandı!",
      resetButton: "Yeni Bir Girişim Test Et",
      shareTemplate: (name, convinced, total, avg, verdict, vuln) =>
        `Girişimimi (${name}) The Gauntlet jürisine sundum.\nSonuç: ${convinced}/${total} jüri ikna oldu (Ortalama: %${avg})\nKarar: ${verdict}\nEn Zayıf Halka: ${vuln}\n\nSen de 5 acımasız jüriye karşı fikrini ücretsiz test et:`,
    },
    byokModal: {
      title: "Kişisel API Anahtarı (BYOK)",
      description:
        "Her kullanıcı kendi API anahtarını kullanır. Anahtarınız sadece bu tarayıcı sekmesinin geçici belleğinde (sessionStorage) saklanır. Hiçbir sunucuya kaydedilmez ve sizden başka kimse asla göremez.",
      geminiLabel: "Google Gemini API Anahtarı (Önerilen)",
      geminiLink: "Ücretsiz anahtar al",
      openaiLabel: "OpenAI API Anahtarı (Alternatif)",
      openaiLink: "Anahtar al",
      privacyNote:
        "Sıfır veri tutma garantisi: Anahtar girmeseniz dahi sistem yerleşik çevrimdışı simülasyonla tam olarak çalışır.",
      formatWarning: "Google Gemini anahtarları genellikle AIzaSy ile başlar.",
      saveButton: "Tarayıcıya Kaydet",
      cancelButton: "Vazgeç",
      clearButton: "Anahtarları Sil",
      savedMessage: "Anahtar oturum belleğine güvenle kaydedildi.",
      clearedMessage: "Anahtarlar temizlendi. Çevrimdışı moda geçildi.",
    },
    footer: {
      heading: "Ürününüzü gerçek müşterilerle karşılaşmadan önce test edin.",
      subheading:
        "The Gauntlet, girişimciler için açık kaynaklı ve gizlilik öncelikli bir itiraz simülatörüdür.",
      license: "MIT Açık Kaynak Lisansı",
    },
  },
};
