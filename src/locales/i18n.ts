export type Language = "en" | "tr";

export interface Translations {
  header: {
    title: string;
    subtitle: string;
    reset: string;
    byokButton: string;
    github: string;
    mainSite: string;
    blog: string;
    contact: string;
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
    reviewed: string;
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
    downloadCard: string;
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
    invalidGeminiError: string;
    invalidOpenaiError: string;
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
    about: string;
    blog: string;
    contact: string;
    rights: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      title: "The Gauntlet",
      subtitle: "Startup Pitch Simulator",
      reset: "New Pitch",
      byokButton: "API Keys",
      github: "GitHub Repository",
      mainSite: "berkaysahin.net",
      blog: "Blog",
      contact: "Contact",
    },
    pitchSetup: {
      heroTitle: "Face 5 Tough Pitch Judges",
      heroSubtitle:
        "Skip the polite feedback. Pitch your startup idea to 5 tough buyers who look for every reason to say no.",
      badge: "Your Pitch",
      fillExample: "Load Example Pitch",
      productNameLabel: "Product Name",
      productNamePlaceholder: "e.g. DocuShield, AutoLead, CodePulse",
      oneLinerLabel: "What does it do in plain English?",
      oneLinerPlaceholder: "e.g. Scans supplier contracts and flags hidden risks in 10 seconds for law firms.",
      targetAudienceLabel: "Who is your target customer?",
      targetAudiencePlaceholder: "e.g. Law firms, small business owners, security teams",
      pricingModelLabel: "Pricing",
      pricingModelPlaceholder: "e.g. $49/month per user or $400/year",
      submitButton: "Enter the Boardroom",
      errorRequired: "Please enter at least a product name and a short description.",
      preset: {
        name: "DocuShield AI",
        oneLiner: "Scans supplier contracts and flags hidden legal risks in under 15 seconds.",
        target: "Mid-sized law firms and legal teams",
        price: "$49 per user / month",
      },
    },
    arena: {
      productLabel: "Current Pitch",
      stepCount: (current, total) => `Judge ${current} of ${total}`,
      activeShark: "Speaking Now",
      convictionLevel: "Score",
      objectionLabel: "Their Objection",
      objectionThinking: "The judge is reading your pitch and preparing their toughest question...",
      reactionLabel: (delta) => `Judge's Reaction (${delta > 0 ? "+" : ""}${delta} pts)`,
      newConviction: (conv) => `New Score: ${conv}%`,
      inputLabel: "Your Reply",
      inputPlaceholder: (name) => `Convince ${name} with real numbers, time saved, or clear proof...`,
      inputHint: "Press Ctrl + Enter to send",
      evaluating: "Reviewing your reply...",
      submitCounter: "Send Reply",
      nextShark: "Next Judge",
      viewVerdict: "See Final Verdict",
    },
    jurorStatus: {
      awaiting: "Waiting",
      active: "Speaking",
      reviewed: "Reviewed",
      convinced: "Convinced",
      rejected: "Passed",
      convictionRate: "Score",
    },
    verdict: {
      title: "Final Verdict",
      averageConviction: "Average Score",
      convincedCount: (convinced, total, rejected) =>
        `${convinced} out of ${total} judges were convinced. ${rejected} walked away.`,
      breakdownTitle: "Judge-by-Judge Breakdown",
      accepted: "Convinced",
      rejected: "Passed",
      vulnerabilityTitle: "Biggest Weak Spot",
      remedyTitle: "How to Fix It",
      copyShareText: "Share Result",
      downloadCard: "Download Card (PNG)",
      copied: "Copied!",
      resetButton: "Try Another Pitch",
      shareTemplate: (name, convinced, total, avg, verdict, vuln) =>
        `I pitched ${name} to The Gauntlet.\nResult: ${convinced}/${total} judges convinced (Average Score: ${avg}%)\nVerdict: ${verdict}\nMain Weak Spot: ${vuln}\n\nTest your startup idea here:\nhttps://gauntlet.berkaysahin.net`,
    },
    byokModal: {
      title: "API Keys (Optional)",
      description:
        "Add your own Gemini or OpenAI key for unlimited Live AI replies. Requests go directly from your browser to Google/OpenAI and never touch our server.",
      geminiLabel: "Google Gemini API Key (Recommended)",
      geminiLink: "Get free key",
      openaiLabel: "OpenAI API Key (Optional)",
      openaiLink: "Get key",
      privacyNote:
        "Direct Browser Mode: keys are kept only in this tab's sessionStorage and are never sent to our backend. Works offline without a key too.",
      formatWarning: "Google Gemini API keys start with AIza.",
      invalidGeminiError: "Invalid Gemini key format. Keys start with AIza and are ~39 characters long.",
      invalidOpenaiError: "Invalid OpenAI key format. Keys must start with sk-.",
      saveButton: "Save",
      cancelButton: "Cancel",
      clearButton: "Clear Keys",
      savedMessage: "Saved in this browser tab.",
      clearedMessage: "Keys cleared.",
    },
    footer: {
      heading: "Test your idea before real customers say no.",
      subheading: "Free, open-source pitch practice for founders.",
      license: "MIT License",
      about: "About",
      blog: "Blog",
      contact: "Contact",
      rights: "All rights reserved.",
    },
  },
  tr: {
    header: {
      title: "The Gauntlet",
      subtitle: "Girişim Pitch Simülatörü",
      reset: "Yeni Girişim",
      byokButton: "API Anahtarları",
      github: "GitHub Reposu",
      mainSite: "berkaysahin.net",
      blog: "Blog",
      contact: "İletişim",
    },
    pitchSetup: {
      heroTitle: "5 Zorlu Jüriyle Yüzleşin",
      heroSubtitle:
        "Kibar övgüleri bir kenara bırakın. Fikrinizi satın almamak için bahane arayan 5 zorlu alıcıya karşı savunun.",
      badge: "Girişim Tanıtımı",
      fillExample: "Örnek Doldur",
      productNameLabel: "Ürün veya Girişim Adı",
      productNamePlaceholder: "Örn: DocuShield, AutoLead, CodePulse",
      oneLinerLabel: "Ürününüz Ne Yapar? (Basit ve Net)",
      oneLinerPlaceholder: "Örn: Hukuk büroları için sözleşmelerdeki gizli riskleri 10 saniyede çıkaran araç.",
      targetAudienceLabel: "Hedef Müşteriniz Kim?",
      targetAudiencePlaceholder: "Örn: KOBİ sahipleri, hukuk büroları, şirket yöneticileri",
      pricingModelLabel: "Fiyatlandırma",
      pricingModelPlaceholder: "Örn: Kullanıcı başı aylık 49$ / Yıllık 400$",
      submitButton: "Masaya Çık ve Savun",
      errorRequired: "Lütfen en azından ürün adını ve kısa açıklamasını yazın.",
      preset: {
        name: "DocuShield AI",
        oneLiner: "Tedarikçi sözleşmelerindeki gizli riskleri ve cezai şartları 15 saniyede bulan akıllı araç.",
        target: "Orta ölçekli hukuk büroları ve şirket avukatları",
        price: "Kullanıcı başı aylık 49$",
      },
    },
    arena: {
      productLabel: "Savunulan Ürün",
      stepCount: (current, total) => `Jüri ${current} / ${total}`,
      activeShark: "Söz Alan Jüri",
      convictionLevel: "İkna Puanı",
      objectionLabel: "Jürinin İtirazı",
      objectionThinking: "Jüri fikrinizi inceliyor ve en zor sorusunu hazırlıyor...",
      reactionLabel: (delta) => `Jürinin Tepkisi (${delta > 0 ? "+" : ""}${delta} Puan)`,
      newConviction: (conv) => `Yeni Puan: %${conv}`,
      inputLabel: "Yanıtınız",
      inputPlaceholder: (name) => `${name} karakterini ikna etmek için net rakam, zaman kazancı veya somut kanıt yazın...`,
      inputHint: "Göndermek için Ctrl + Enter tuşlarına basın",
      evaluating: "Yanıtınız inceleniyor...",
      submitCounter: "Yanıtı Gönder",
      nextShark: "Sonraki Jüri",
      viewVerdict: "Karar Özetini Gör",
    },
    jurorStatus: {
      awaiting: "Bekliyor",
      active: "Soruyor",
      reviewed: "Yanıtlandı",
      convinced: "İkna Oldu",
      rejected: "Vazgeçti",
      convictionRate: "İkna",
    },
    verdict: {
      title: "Karar Özeti",
      averageConviction: "Ortalama Puan",
      convincedCount: (convinced, total, rejected) =>
        `${total} jüriden ${convinced} tanesi ikna oldu. ${rejected} tanesi masadan kalktı.`,
      breakdownTitle: "Jüri Değerlendirmeleri",
      accepted: "Kabul",
      rejected: "Red",
      vulnerabilityTitle: "En Zayıf Nokta",
      remedyTitle: "Nasıl Düzeltilir?",
      copyShareText: "Sonucu Paylaş",
      downloadCard: "Kartı İndir (PNG)",
      copied: "Kopyalandı!",
      resetButton: "Yeni Fikir Test Et",
      shareTemplate: (name, convinced, total, avg, verdict, vuln) =>
        `${name} fikrimi The Gauntlet jürisine sundum.\nSonuç: ${convinced}/${total} jüri ikna oldu (Ortalama: %${avg})\nKarar: ${verdict}\nEn Zayıf Nokta: ${vuln}\n\nSen de fikrini ücretsiz test et:\nhttps://gauntlet.berkaysahin.net`,
    },
    byokModal: {
      title: "API Anahtarları (İsteğe Bağlı)",
      description:
        "Sınırsız canlı yapay zeka yanıtları için kendi Gemini veya OpenAI anahtarınızı girebilirsiniz. İstekler doğrudan tarayıcınızdan Google/OpenAI'a gider, sunucumuzdan geçmez.",
      geminiLabel: "Google Gemini API Anahtarı (Önerilen)",
      geminiLink: "Ücretsiz anahtar al",
      openaiLabel: "OpenAI API Anahtarı (İsteğe Bağlı)",
      openaiLink: "Anahtar al",
      privacyNote:
        "Doğrudan Tarayıcı Modu: Anahtarlar sadece bu sekmenin sessionStorage belleğinde tutulur ve asla sunucumuza gönderilmez. Anahtar girmeden de kullanabilirsiniz.",
      formatWarning: "Google Gemini anahtarları AIza ile başlar.",
      invalidGeminiError: "Geçersiz Gemini anahtar biçimi. Anahtar AIza ile başlamalıdır.",
      invalidOpenaiError: "Geçersiz OpenAI anahtar biçimi. Anahtar sk- ile başlamalıdır.",
      saveButton: "Kaydet",
      cancelButton: "Vazgeç",
      clearButton: "Anahtarları Sil",
      savedMessage: "Bu sekme için kaydedildi.",
      clearedMessage: "Anahtarlar silindi.",
    },
    footer: {
      heading: "Fikrinizi gerçek müşterilerden önce test edin.",
      subheading: "Girişimciler için ücretsiz pitch pratiği.",
      license: "MIT Lisansı",
      about: "Hakkımda",
      blog: "Blog",
      contact: "İletişim",
      rights: "Tüm hakları saklıdır.",
    },
  },
};
