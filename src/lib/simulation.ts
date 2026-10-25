import { JurorConfig, PitchData, TurnExchange, VerdictSummary } from "@/types/gauntlet";
import { Language } from "@/locales/i18n";

/**
 * High-Acuity Offline Heuristic Engine
 * Supports seamless bilingual (EN / TR) evaluation.
 */

export function simulateInitialObjection(
  juror: JurorConfig,
  pitch: PitchData,
  lang: Language = "en"
): string {
  const { productName, oneLiner, targetAudience, pricingModel } = pitch;

  if (lang === "tr") {
    switch (juror.id) {
      case "cfo-penny-pincher":
        return `Bak dostum, "${productName}" için benden ${pricingModel || "aylık abonelik"} istiyorsun. ${targetAudience || "Müşteriler"} zaten krizde her kuruşu sayıyor. Ben ofis stajyerine iki Excel formülü yazdırıp ${oneLiner || "bu işi"} bedavaya çözemez miyim? Beni neden kasamdaki nakdi sana dökmeye ikna edeceksin?`;

      case "paranoid-ciso":
        return `"${productName}" güzel anlatılmış ama kurumsal güvenlik masasında hikaye dinlenmez. Bu ${oneLiner || "sistem"} çalışırken bizim gizli müşteri ve ticari verilerimiz nerede duruyor? Bulutta mı? O zaman şirketimin güvenlik komitesi buna asla izin vermez. Sıfır sızıntıyı ve KVKK/GDPR uyumunu nasıl garanti ediyorsun?`;

      case "friction-phobic":
        return `Ben günde 10 saat operasyon yönetiyorum. Ekibimin "${productName}" için yeni bir dashboard öğrenmeye, 15 dakikalık eğitim videosu izlemeye bir saniyesi bile yok. Tıklamadan, ekran değiştirmeden mevcut iş akışımızı bozmadan çalışıyor mu? Yoksa bizi yeni bir panele mi mahkum edeceksin?`;

      case "incumbent-loyalist":
        return `Piyasada 8-10 yıldır tahtını kurmuş dev rakipler varken, "${productName}" gibi dün kurulmuş bir ekibe operasyonumu bağlamam delilik olur. Onlar batmaz, sertifikaları tam. Senin tek bir ölümcül farkın ne ki yılların kurulu düzenini bozup sana geçeyim?`;

      case "hype-tourist":
        return `Harika bir fikir gibi duruyor, ilk hafta heyecanla oturup "${productName}" denerim. Ama sekizinci gün hevesim kaçacak ve yeni bir iş yoğunluğunda adını bile unutacağım. Beni ve ekibimi her gün zorla girmeden sana bağlı kılacak mekanizman ne? Yoksa terk edilen araçlar mezarlığına mı gideceksin?`;

      default:
        return juror.coreObjectionTemplateTr;
    }
  }

  // English fallback & default
  switch (juror.id) {
    case "cfo-penny-pincher":
      return `Look, you're asking me for ${pricingModel || "a monthly fee"} for "${productName}". My budget is already stretched thin. Why shouldn't I just have an intern build two Excel templates to handle ${oneLiner || "this work"} for free? Give me one cold, hard financial reason to open my wallet.`;

    case "paranoid-ciso":
      return `"${productName}" sounds convenient, but convenience is a security nightmare. Where is our proprietary client data stored? In a multi-tenant public cloud? Our risk committee will veto this in seconds. How do you guarantee zero data leaks and strict regulatory compliance?`;

    case "friction-phobic":
      return `I manage operations 10 hours a day across 20 browser tabs. My team does not have 5 minutes to learn a new dashboard or watch onboarding webinars. Does "${productName}" run silently in our existing workflow without adding more clicks to my day?`;

    case "incumbent-loyalist":
      return `The market leader has been running this space for nearly a decade and won't go out of business tomorrow. Why would I risk my career and undergo painful migration headaches to switch to an unproven newcomer like "${productName}"? What is your single 10x advantage?`;

    case "hype-tourist":
      return `This looks slick. I'll probably sign up and play with "${productName}" for three days. But by day eight, novelty fades and I'll forget it exists. How do you create ongoing, passive value so my team actually keeps using it without annoying spam notifications?`;

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
      const hasRoiOrCost = /roi|tasarruf|maliyet|amortisman|saat|personel|asgari|excel|tl|dolar|\$|\%|oran|hesap|save|hour|wage|intern|cost|payback|revenue|margin/i.test(text);
      const isFluffy = /yapay zeka devrimi|gelecek|vizyon|modern|kolaylık|trend|kahve parası|future|revolutionary|synergy|coffee/i.test(text);

      if (hasRoiOrCost && !isFluffy) {
        scoreDelta = 35;
        reaction = isTr
          ? "Lafı gevelemedin, doğrudan saatlik iş gücü maliyetinden vurdun. Stajyerin haftalık zamanını kurtarıyorsa bu para masada kalabilir."
          : "Straight to the point. Tying the cost directly to recovered payroll hours makes sense. If it saves 8 hours a week, I'm willing to consider the math.";
      } else if (isFluffy) {
        scoreDelta = -20;
        reaction = isTr
          ? "Boş edebiyat yapma bana! Gelecekmiş, trendmiş... Ay sonu elektrik faturasını trendle ödemiyorum. Bana net amortisman tablosu vermediğin sürece tek kuruş çıkmaz."
          : "Empty buzzwords won't pay my payroll. 'The future of AI' doesn't show up on my profit statement. Until you show me a concrete payback timeline, I'm out.";
        isFatal = true;
      } else {
        scoreDelta = 10;
        reaction = isTr
          ? "Fena bir savunma değil ama hala Excel stajyerinden daha ucuza geldiğini matematiksel olarak kanıtlayamadın."
          : "Decent argument, but you still haven't mathematically proven that you're cheaper than existing spreadsheet labor.";
      }
      break;
    }

    case "paranoid-ciso": {
      const hasSecTerms = /soc2|iso|şifreleme|encryption|zero-retention|on-prem|vpc|istemci|kvkk|gdpr|kayıt tutmuyoruz|log|audit|retention|client-side|token/i.test(text);
      const isWeakSec = /merak etmeyin|aws çok güvenli|google güvencesi|hiçbir şey olmaz|şifreliyoruz|dont worry|aws is safe|never breached/i.test(text);

      if (hasSecTerms) {
        scoreDelta = 40;
        reaction = isTr
          ? "Beklediğimden daha teknik konuştun. Sıfır veri saklama taahhüdü ve istemci taraflı şifreleme audit raporumu kurtarır. Bunu sözleşmeye yazarsan onay veririm."
          : "Now we're talking engineering rigor. A zero-retention policy and client-side encryption satisfy my security committee. Put that in the SLA and we're good.";
      } else if (isWeakSec) {
        scoreDelta = -25;
        reaction = isTr
          ? "'AWS çok güvenli' mi dedin sen bana? AWS'in güvenliği senin kodundaki açığı kapatmaz! Kurumsal veriyi oyuncak edemem. Reddedildi."
          : "Saying 'AWS is secure' proves you don't understand infrastructure security. AWS security doesn't protect against your application flaws. Vetoed.";
        isFatal = true;
      } else {
        scoreDelta = 5;
        reaction = isTr
          ? "Genel geçer laflar bunlar. Bir CISO'yu ikna etmek için ISO 27001 yol haritanı veya lokal veri işleme protokolünü görmek isterim."
          : "Too vague. Before I approve any vendor, I need to see your exact data retention lifecycle and encryption certificates.";
      }
      break;
    }

    case "friction-phobic": {
      const hasFrictionless = /slack|whatsapp|email|e-posta|kısayol|tek tık|api|eklenti|arka planda|otomatik|panel yok|headless|extension|shortcut|background|zero-click/i.test(text);
      const hasHeavy = /onboarding|eğitim|akademi|video|kılavuz|öğrenmek çok kolay|dashboard|webinar|tutorial/i.test(text);

      if (hasFrictionless) {
        scoreDelta = 35;
        reaction = isTr
          ? "İşte duymak istediğim cevap bu! Yeni bir sekmeyle uğraşmayacaksam, mevcut mesajlaşma veya e-postamdan tek tıkla hallolacaksa hemen kullanırım."
          : "Exactly what I wanted to hear. If it triggers right from our existing email/Slack without a 15th browser tab, my team will actually use it.";
      } else if (hasHeavy) {
        scoreDelta = -20;
        reaction = isTr
          ? "Eğitim videosu mu izleyeceğim bir de? Benim kahve içmeye vaktim yok. Bana iş yükü getiren araç ne kadar süslü olursa olsun çöptür."
          : "A training webinar? I barely have time to drink coffee. Any tool that demands more homework from my team is dead on arrival.";
        isFatal = true;
      } else {
        scoreDelta = 10;
        reaction = isTr
          ? "Arayüzün basit olduğunu söylüyorsun ama yine de ekibimi oraya taşımam gerekecek gibi görünüyor. Şimdilik nötrüm."
          : "You claim it's simple, but it still sounds like another login my team will resist adopting.";
      }
      break;
    }

    case "incumbent-loyalist": {
      const hasWedge = /wedge|odak|10x|10 kat|spesifik|hız|göç|migration|veri taşıma|niş|tek bir iş|fast|specific|niche|faster|1-click import/i.test(text);
      const isGeneric = /daha ucuzuz|yerliyiz|daha çok özellik|bizde her şey var|en iyisiyiz|cheaper|more features|better than them/i.test(text);

      if (hasWedge) {
        scoreDelta = 35;
        reaction = isTr
          ? "Mantıklı bir strateji. Dev rakiplerin 6 ayda yapamadığı bu tek odaklı işi 10 kat hızlı çözüyorsan ve eski verimi 2 dakikada aktarabiliyorsam denerim."
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
      const hasHabit = /pasif|otomatik özet|sabah|günlük|tetikleyici|arkaplanda|bildirim değil|çıktı|haftalık rapor|rutin|passive|morning|summary|digest|background|standup|automated/i.test(text);
      const isSpam = /push bildirim|newsletter|bülten|hatırlatırız|mail atarız|kampanya|notifications|daily alerts/i.test(text);

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
        scoreDelta = 10;
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
    ? "Teklif Yok — Masadan Elendiniz"
    : "No Deal — Dismissed from the Boardroom";
  let lethalVulnerability = isTr
    ? "Argümanlarınız somut iş çıktısı ve risk yönetiminden ziyade soyut özellikler üzerinde kaldı."
    : "Your responses relied on abstract feature promises rather than hard financial ROI and strict risk protocols.";
  let strategicRemedy = isTr
    ? "Fiyatlandırmayı net ROI'ye bağlayın, sıfır veri tutma protokolü tanımlayın ve mevcut araçlara entegre olun."
    : "Anchor pricing directly to employee hours saved, commit to a strict zero-retention data SLA, and embed directly into existing communication channels.";

  if (convinced >= 4) {
    termSheetStatus = "ACCEPTED";
    valuationVerdict = isTr
      ? "Tebrikler: 5 Jüriden 4'ü İkna Edildi — Anlaşma Masada!"
      : "Acquired: 4 of 5 Judges Bought In — Term Sheet Issued!";
    lethalVulnerability = isTr
      ? "Küçük operasyonel detaylarda birkaç soru işareti masada kaldı."
      : "Minor operational integration nuances remained slightly unanswered.";
    strategicRemedy = isTr
      ? "Pazar liderinin en hantal kaldığı spesifik noktayı hedefleyerek lansman yapın."
      : "Double down on your 10x wedge against the bloated market leader.";
  } else if (convinced >= 2) {
    termSheetStatus = "CONDITIONAL";
    valuationVerdict = isTr
      ? "Şartlı İlerleme — 5 Jüriden 2'si Masada Kaldı"
      : "Conditional Interest — 2 of 5 Judges Still at the Table";
    lethalVulnerability = isTr
      ? "Maliyet veya kurumsal veri güvenliği tarafındaki şüpheler tam temizlenemedi."
      : "Cost justification or cloud compliance doubts weren't fully cleared up.";
    strategicRemedy = isTr
      ? "Kullanıcıya yeni ekran açtırmayın ve ilk 14 günde maliyetini çıkardığını gösteren sayaç ekleyin."
      : "Eliminate dashboard friction and provide a transparent real-time ROI dashboard.";
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
