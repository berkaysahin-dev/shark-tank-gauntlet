import { JurorConfig, PitchData, TurnExchange, VerdictSummary } from "@/types/gauntlet";
import { Language } from "@/locales/i18n";

/**
 * High-Acuity Offline Heuristic Engine
 * Supports bilingual (EN / TR) evaluation with negation awareness and clean inline phrasing.
 */

function formatInlinePremise(raw: string | undefined, fallback: string): string {
  const cleaned = (raw || "").trim().replace(/[.!?]+$/, "");
  if (!cleaned) return fallback;
  // Quote multi-clause or capitalized descriptions so they always read grammatically inline
  if (cleaned.length > 75 || /[.!?]/.test(cleaned)) {
    return `"${cleaned}"`;
  }
  // Keep acronyms uppercase (AI, SaaS, B2B, CRM, etc.), lowercase normal leading words
  if (/^[A-Z]{2,}/.test(cleaned)) {
    return cleaned;
  }
  return cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
}

/**
 * Checks whether a keyword appears WITHOUT an immediately preceding negation
 * (e.g., "zero onboarding", "no training", "eğitim gerektirmez").
 */
function hasUnnegatedKeyword(text: string, pattern: RegExp, isTr: boolean): boolean {
  const globalFlags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const regex = new RegExp(pattern.source, globalFlags);
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const start = Math.max(0, match.index - 28);
    const before = text.slice(start, match.index);
    const after = text.slice(match.index, Math.min(text.length, match.index + match[0].length + 24));

    const prefixNegation = isTr
      ? /(?:sıfır|hiç|yok|gerek(?:mez|tirmez)|olmadan|istemez|değil)\s*$/i
      : /\b(?:zero|no|without|skip|never|don't\s+need|doesn't\s+need|not\s+require)\s+$/i;

    const suffixNegation = isTr
      ? /\b(?:yok|gerektirmez|gerekmez|istemez|olmadan)\b/i
      : /\b(?:not\s+needed|not\s+required|free)\b/i;

    if (!prefixNegation.test(before) && !suffixNegation.test(after)) {
      return true;
    }
  }
  return false;
}

export function simulateInitialObjection(
  juror: JurorConfig,
  pitch: PitchData,
  lang: Language = "en"
): string {
  const { productName, oneLiner, targetAudience, pricingModel } = pitch;

  if (lang === "tr") {
    const inlineWork = formatInlinePremise(oneLiner, "bu işi");
    switch (juror.id) {
      case "cfo-penny-pincher":
        return `Bak dostum, "${productName}" için benden ${pricingModel || "aylık abonelik"} istiyorsun. ${targetAudience || "Müşteriler"} zaten her kuruşu sayıyor. Ben stajyere iki Excel formülü yazdırıp ${inlineWork} işini bedavaya çözemez miyim? Kasamdaki nakdi sana neden vereyim?`;

      case "paranoid-ciso":
        return `"${productName}" güzel anlatılmış ama kurumsal güvenlik masasında hikaye dinlenmez. Sistem çalışırken bizim gizli müşteri ve ticari verilerimiz nerede duruyor? Paylaşımlı bulutta mı? Güvenlik ekibim buna asla izin vermez. Sıfır sızıntıyı ve KVKK/GDPR uyumunu nasıl garanti ediyorsun?`;

      case "friction-phobic":
        return `Ben günde 10 saat operasyon yönetiyorum. Ekibimin "${productName}" için yeni bir panel öğrenmeye, 15 dakikalık eğitim videosu izlemeye bir saniyesi bile yok. Tıklamadan, ekran değiştirmeden mevcut iş akışımızı bozmadan çalışıyor mu? Yoksa bizi yeni bir sekmeye mi mahkum edeceksin?`;

      case "incumbent-loyalist":
        return `Piyasada 8-10 yıldır tahtını kurmuş dev rakipler varken, "${productName}" gibi yeni bir ekibe operasyonumu bağlamam büyük risk. Onlar yarın batmaz, sertifikaları tam. Senin tek bir ölümcül farkın ne ki yılların kurulu düzenini bozup sana geçeyim?`;

      case "hype-tourist":
        return `Harika bir fikir gibi duruyor, ilk hafta heyecanla oturup "${productName}" denerim. Ama sekizinci gün hevesim kaçacak ve iş yoğunluğunda adını bile unutacağım. Beni ve ekibimi zorla panele sokmadan sana bağlı kılacak mekanizman ne?`;

      default:
        return juror.coreObjectionTemplateTr;
    }
  }

  const inlineWorkEn = formatInlinePremise(oneLiner, "this workflow");
  switch (juror.id) {
    case "cfo-penny-pincher":
      return `Look, you're asking me for ${pricingModel || "a monthly fee"} for "${productName}". My budget is already stretched thin. Why shouldn't I just have an intern build two Excel templates to handle ${inlineWorkEn} for free? Give me one cold, hard financial reason to open my wallet.`;

    case "paranoid-ciso":
      return `"${productName}" sounds convenient, but convenience is a security nightmare. Where does our proprietary client data live? In a multi-tenant public cloud? Our risk committee will veto that in seconds. How do you guarantee zero data leaks and strict compliance?`;

    case "friction-phobic":
      return `I manage operations 10 hours a day across 20 browser tabs. My team does not have 5 minutes to learn a new dashboard or watch onboarding webinars. Does "${productName}" run silently in our existing workflow without adding more clicks to my day?`;

    case "incumbent-loyalist":
      return `The market leader has been running this space for nearly a decade and won't go out of business tomorrow. Why would I risk my career and endure painful migration headaches to switch to "${productName}"? What is your single 10x advantage?`;

    case "hype-tourist":
      return `This looks slick. I'll probably sign up and play with "${productName}" for three days. But by day eight, novelty fades and I'll forget it exists. How do you deliver ongoing, passive value so my team keeps using it without annoying spam notifications?`;

    default:
      return juror.coreObjectionTemplate;
  }
}

export function simulateEvaluation(
  juror: JurorConfig,
  pitch: PitchData,
  objection: string,
  userResponse: string,
  currentConviction: number,
  lang: Language = "en"
): {
  jurorReaction: string;
  scoreDelta: number;
  resultingConviction: number;
  isFatal: boolean;
} {
  const text = userResponse.toLowerCase();
  let scoreDelta = 0;
  let reaction = "";
  let isFatal = false;

  const isTr = lang === "tr";

  switch (juror.id) {
    case "cfo-penny-pincher": {
      const hasRoiOrCost =
        /\b(?:roi|tasarruf|maliyet|amortisman|saat|personel|asgari|excel|tl|dolar|oran|hesap|save|saves|saved|hour|hours|wage|payroll|cost|payback|revenue|margin|month|days)\b|\$|%/i.test(
          text
        );
      const isFluffy = hasUnnegatedKeyword(
        text,
        /(?:yapay zeka devrimi|gelecek|vizyon|modern|kolaylık|trend|kahve parası|future|revolutionary|synergy|cup of coffee)/i,
        isTr
      );

      if (hasRoiOrCost && !isFluffy) {
        scoreDelta = 35;
        const hoursMatch = userResponse.match(/\b(\d+)\s*(hours?|hrs?|saat)\b/i);
        const mentionedTime = hoursMatch ? hoursMatch[0] : isTr ? "ekip saatini" : "staff hours";
        reaction = isTr
          ? `Lafı gevelemedin, doğrudan ${mentionedTime} ve iş gücü maliyeti üzerinden konuştun. Gerçekten kendini 30 günde amorti ediyorsa bu bütçe masada kalabilir.`
          : `Straight to the point. Tying the price directly to recovered labor (${mentionedTime}) makes financial sense. If the payback math holds, I'm willing to consider it.`;
      } else if (isFluffy) {
        scoreDelta = -20;
        reaction = isTr
          ? "Boş edebiyat yapma bana! Gelecekmiş, trendmiş... Ay sonu elektrik faturasını trendle ödemiyorum. Net amortisman tablosu vermediğin sürece tek kuruş çıkmaz."
          : "Empty buzzwords won't pay my payroll. 'The future of AI' doesn't show up on my profit statement. Until you show a concrete payback timeline, I'm out.";
        isFatal = true;
      } else {
        scoreDelta = 5;
        reaction = isTr
          ? "Fena bir savunma değil ama hala Excel stajyerinden daha ucuza geldiğini matematiksel olarak kanıtlayamadın."
          : "Decent argument, but you still haven't mathematically proven it's cheaper than existing spreadsheet labor.";
      }
      break;
    }

    case "paranoid-ciso": {
      const hasSecTerms =
        /\b(?:soc2|soc\s*2|iso|şifreleme|encryption|encrypted|zero-retention|zero\s+retention|on-prem|vpc|istemci|kvkk|gdpr|kayıt tutmuyoruz|log|audit|retention|client-side|token|self-hosted)\b/i.test(
          text
        );
      const isWeakSec = hasUnnegatedKeyword(
        text,
        /(?:merak etmeyin|aws çok güvenli|google güvencesi|hiçbir şey olmaz|dont worry|don't worry|aws is safe|never breached)/i,
        isTr
      );

      if (hasSecTerms) {
        scoreDelta = 40;
        reaction = isTr
          ? "Net ve teknik bir yanıt verdin. Veri saklamamanız ve istemci taraflı koruma güvenlik ekibimizi rahatlatır. Bunu sözleşmeye yazarsan onay veririm."
          : "That is a clear, solid answer. Zero retention and strict client-side isolation satisfy our security committee. Put that in the SLA and I'm in.";
      } else if (isWeakSec) {
        scoreDelta = -25;
        reaction = isTr
          ? "'Merak etmeyin, bulutta güvende' demek yetmez. Bulut sağlayıcının güvenliği uygulamadaki açığı kapatmaz. Kurumsal veriyi riske atamam."
          : "Saying 'don't worry, AWS is secure' doesn't cover bugs in your own app. I can't risk company data on vague promises.";
        isFatal = true;
      } else {
        scoreDelta = 5;
        reaction = isTr
          ? "Çok genel kaldın. Beni ikna etmek için verilerin nerede durduğunu, nasıl şifrelendiğini ve ne zaman silindiğini net söylemelisin."
          : "Too vague. Before I approve a new tool, I need to know exactly where data lives and when it gets deleted.";
      }
      break;
    }

    case "friction-phobic": {
      const hasFrictionless =
        /\b(?:slack|whatsapp|email|e-posta|kısayol|tek tık|one-click|1-click|api|eklenti|arka planda|otomatik|panel yok|headless|extension|shortcut|background|zero-click|no new tabs|yeni sekme yok|zero onboarding|no training|eğitim gerektirmez)\b/i.test(
          text
        );
      const hasHeavy = hasUnnegatedKeyword(
        text,
        /\b(?:onboarding|eğitim|akademi|video|kılavuz|dashboard|webinar|tutorial|course)\b/i,
        isTr
      );

      if (hasFrictionless) {
        scoreDelta = 35;
        reaction = isTr
          ? "İşte duymak istediğim cevap bu! Yeni bir sekmeyle uğraşmayacaksam, mevcut mesajlaşma veya e-postamdan tek tıkla hallolacaksa ekibim hemen kullanır."
          : "Exactly what I wanted to hear. If it runs straight inside our existing workflow without a 15th browser tab or training, my team will actually adopt it.";
      } else if (hasHeavy) {
        scoreDelta = -20;
        reaction = isTr
          ? "Eğitim videosu mu izleyeceğim bir de? Benim kahve içmeye vaktim yok. Bana ekstra iş yükü getiren araç ne kadar süslü olursa olsun çöptür."
          : "A training webinar? I barely have time to drink coffee. Any tool that demands more homework from my team is dead on arrival.";
        isFatal = true;
      } else {
        scoreDelta = 5;
        reaction = isTr
          ? "Arayüzün basit olduğunu söylüyorsun ama yine de ekibimi yeni bir yere taşımam gerekecek gibi görünüyor. Hâlâ ikna olmadım."
          : "You claim it's simple, but it still sounds like another login my team will resist adopting.";
      }
      break;
    }

    case "incumbent-loyalist": {
      const hasWedge =
        /\b(?:wedge|odak|10x|10 kat|spesifik|hız|göç|migration|import|veri taşıma|niş|tek bir iş|fast|faster|specific|niche|1-click import)\b/i.test(
          text
        );
      const isGeneric = hasUnnegatedKeyword(
        text,
        /(?:daha ucuzuz|yerliyiz|daha çok özellik|bizde her şey var|en iyisiyiz|cheaper|more features|better than them)/i,
        isTr
      );

      if (hasWedge) {
        scoreDelta = 35;
        reaction = isTr
          ? "Mantıklı bir strateji. Dev rakiplerin 6 ayda yapamadığı bu tek odaklı işi 10 kat hızlı çözüyorsan ve eski verimi 1 tıkla aktarabiliyorsam denerim."
          : "Fair point. The market leader is bloated and moves like a glacier. If you solve this one acute bottleneck 10x faster with 1-click migration, I'll test it.";
      } else if (isGeneric) {
        scoreDelta = -25;
        reaction = isTr
          ? "Klasik 'biz onlardan daha ucuzuz' masalı. 6 ay sonra batmayacağının garantisi yok. Küresel devin güvenini bırakıp sana geçmem."
          : "The classic 'we're cheaper and have more buttons' pitch. You could vanish in 6 months. I'm not risking my infrastructure on that.";
        isFatal = true;
      } else {
        scoreDelta = 5;
        reaction = isTr
          ? "Farkını söyledin ama hala geçiş maliyetimin getireceği riske değip değmeyeceğinden emin değilim."
          : "You highlighted a few perks, but not enough to justify ripping out our current system.";
      }
      break;
    }

    case "hype-tourist": {
      const hasHabit =
        /\b(?:pasif|otomatik özet|sabah|günlük|tetikleyici|arkaplanda|arka planda|bildirim değil|çıktı|haftalık rapor|rutin|passive|morning|summary|digest|background|standup|automated)\b/i.test(
          text
        );
      const isSpam = hasUnnegatedKeyword(
        text,
        /(?:push bildirim|newsletter|bülten|hatırlatırız|mail atarız|kampanya|push notifications|daily alerts|spam)/i,
        isTr
      );

      if (hasHabit) {
        scoreDelta = 35;
        reaction = isTr
          ? "Ben uygulamayı açmayı unutsam bile sabah ilk kahvemde önüme hazır çıktıyı getireceksen retention problemim çözülür. Bunu satın alırım."
          : "If I get the core value delivered passively into my morning digest without needing to remember to log in, you solved the churn problem. I'm in.";
      } else if (isSpam) {
        scoreDelta = -20;
        reaction = isTr
          ? "Bana günde 3 tane push bildirimi atarsan ilk yapacağım şey uygulamayı silmek olur. Kalıcı değer üretemiyorsun."
          : "Daily reminder emails and push notifications? I'll mute and uninstall you by day two. That's not sustainable retention.";
        isFatal = true;
      } else {
        scoreDelta = 5;
        reaction = isTr
          ? "Fikir fena değil ama ikinci hafta beni hala burada tutabileceğinin garantisini tam hissedemedim."
          : "Sounds interesting, but I'm still unconvinced I won't lose interest once the novelty wears off.";
      }
      break;
    }
  }

  const resultingConviction = Math.max(0, Math.min(100, currentConviction + scoreDelta));

  return {
    jurorReaction: reaction,
    scoreDelta,
    resultingConviction,
    isFatal,
  };
}

export function simulateVerdict(
  pitch: PitchData,
  history: TurnExchange[],
  jurorStates: Record<string, { conviction: number }>,
  lang: Language = "en"
): VerdictSummary {
  const scores = Object.values(jurorStates).map((s) => s.conviction);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / (scores.length || 1));
  const convinced = scores.filter((s) => s >= 60).length;
  const rejected = scores.filter((s) => s < 45).length;

  const isTr = lang === "tr";

  let termSheetStatus: "ACCEPTED" | "CONDITIONAL" | "REJECTED" = "REJECTED";
  let valuationVerdict = isTr
    ? "Teklif Yok — Jüri İkna Olmadı"
    : "No Deal — Panel Not Convinced";
  let lethalVulnerability = isTr
    ? "Yanıtlarınız somut zaman/maliyet kazancı ve veri güvenliği yerine genel özelliklerde kaldı."
    : "Your answers stayed on general features instead of clear time saved, cost savings, and data safety.";
  let strategicRemedy = isTr
    ? "Fiyatınızı kurtarılan saate bağlayın, verilerin saklanmadığını netleştirin ve mevcut araçlara entegre olun."
    : "Tie your pricing to hours saved, make data privacy crystal clear, and fit inside tools teams already use.";

  if (convinced >= 4) {
    termSheetStatus = "ACCEPTED";
    valuationVerdict = isTr
      ? `Tebrikler: 5 Jüriden ${convinced}'ü İkna Oldu — Teklif Masada!`
      : `Deal: ${convinced} of 5 Judges Convinced!`;
    lethalVulnerability = isTr
      ? "Küçük kurulum ve geçiş detaylarında birkaç soru işareti kaldı."
      : "A few small questions remained around setup and switching from old tools.";
    strategicRemedy = isTr
      ? "Büyük rakiplerin en yavaş kaldığı tek noktaya odaklanarak büyümeye devam edin."
      : "Stay focused on the one job you do much faster than big incumbents.";
  } else if (convinced >= 2) {
    termSheetStatus = "CONDITIONAL";
    valuationVerdict = isTr
      ? `Şartlı Onay — 5 Jüriden ${convinced}'si Masada Kaldı`
      : `Maybe — ${convinced} of 5 Judges Still Interested`;
    lethalVulnerability = isTr
      ? "Maliyet hesabı veya veri güvenliği tarafındaki şüpheler tam giderilemedi."
      : "Cost justification or data privacy doubts weren't fully cleared up.";
    strategicRemedy = isTr
      ? "Yeni bir panel açtırmadan çalışın ve ürünün ilk 2 haftada maliyetini çıkardığını net gösterin."
      : "Remove extra setup steps and show clearly how the tool pays for itself in the first 14 days.";
  }

  return {
    convincedCount: convinced,
    rejectedCount: rejected,
    averageConviction: avg,
    termSheetStatus,
    valuationVerdict,
    lethalVulnerability,
    strategicRemedy,
  };
}
