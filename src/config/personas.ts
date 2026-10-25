import { JurorConfig } from "@/types/gauntlet";

export const JURORS: JurorConfig[] = [
  {
    id: "cfo-penny-pincher",
    name: "Arthur Vance",
    nameTr: "Halis Bey",
    roleTitle: "SMB Owner & Budget Controller",
    roleTitleTr: "KOBİ Fabrika Sahibi & Finans Denetçisi",
    archetype: "The Penny-Pincher",
    archetypeTr: "Cimri KOBİ Patronu",
    motto: "Software is an expense. Free labor with Excel is flexible.",
    mottoTr: "Maliyet bir kere yazılır, para zor kazanılır.",
    coreObjectionTemplate:
      "I won't pay a monthly subscription for this when I can have an intern write two Excel formulas. Why should I hand you my company's hard-earned cash?",
    coreObjectionTemplateTr:
      "Ben buna aylık para vermem, stajyere iki Excel formülü yazdırır bedavaya çözerim. Beni neden kasamdaki nakdi sana dökmeye ikna edeceksin?",
    psychology:
      "Cash-flow traumatized. Hates buzzwords. Demands direct labor/dollar ROI calculations.",
    fatalTrigger:
      "Claiming it's 'an investment in the future' or 'just the cost of a cup of coffee'.",
    persuasionKey:
      "Direct calculation of hours saved multiplied by hourly wage, proving it pays for itself in 30 days.",
    initialConviction: 25,
    silhouetteIndex: 1,
  },
  {
    id: "paranoid-ciso",
    name: "Marcus Vance",
    nameTr: "Bülent Demir",
    roleTitle: "Chief Information Security Officer (CISO)",
    roleTitleTr: "Kurumsal Güvenlik Direktörü (CISO)",
    archetype: "The Paranoid CISO",
    archetypeTr: "Paranoyak Güvenlikçi",
    motto: "Every third-party software is an active insider breach.",
    mottoTr: "Her üçüncü parti servis, içerideki bir köstebektir.",
    coreObjectionTemplate:
      "Where does my company data live? In the public cloud? My security audit committee will reject this immediately. How do you guarantee zero data leakage?",
    coreObjectionTemplateTr:
      "Verilerim nerede duruyor? Bulutta mı? O zaman güvenlik komitemiz buna asla onay vermez. Sıfır sızıntıyı ve uyumluluğu nasıl garanti ediyorsun?",
    psychology:
      "Fears career ruin from a single breach. Skeptical of standard cloud claims.",
    fatalTrigger:
      "Saying 'don't worry, we host on AWS' or 'our encryption is very safe'.",
    persuasionKey:
      "Zero-data retention policy, client-side encryption, SOC2/ISO roadmap, and on-prem/VPC options.",
    initialConviction: 20,
    silhouetteIndex: 2,
  },
  {
    id: "friction-phobic",
    name: "Sarah Jenkins",
    nameTr: "Aslı Karaca",
    roleTitle: "Operations Director",
    roleTitleTr: "Operasyon Yöneticisi",
    archetype: "The Friction-Phobic Operator",
    archetypeTr: "Tembel Kullanıcı",
    motto: "Any tool requiring a 10-minute training video goes to the trash.",
    mottoTr: "On dakikadan uzun süren eğitim videosu olan araç çöptür.",
    coreObjectionTemplate:
      "I don't even have 5 minutes to learn a new dashboard or watch onboarding videos. Does this solve my job without opening new tabs?",
    coreObjectionTemplateTr:
      "Yeni bir panel öğrenmeye veya eğitim videosu izlemeye 5 dakikam bile yok. Yeni sekme açtırmadan, mevcut işimi bozmadan çözüyor mu?",
    psychology:
      "Cognitively exhausted. Works across dozens of open tabs. Hates new logins and complicated dashboards.",
    fatalTrigger:
      "Offering a 'comprehensive 20-minute academy course'.",
    persuasionKey:
      "Headless operation, Slack/Email native triggers, 1-click execution without leaving current tools.",
    initialConviction: 30,
    silhouetteIndex: 3,
  },
  {
    id: "incumbent-loyalist",
    name: "David Sterling",
    nameTr: "Mert Vural",
    roleTitle: "Senior Architect & Enterprise Specialist",
    roleTitleTr: "Kıdemli Ürün Mimarı",
    archetype: "The Incumbent Loyalist",
    archetypeTr: "Rakip Fanatiği",
    motto: "Nobody gets fired for choosing the established market leader.",
    mottoTr: "Pazar liderini seçtiği için kimse kovulmadı.",
    coreObjectionTemplate:
      "The market leader has been doing this for 8 years and won't go bankrupt tomorrow. What is your single fatal advantage that justifies switching to you?",
    coreObjectionTemplateTr:
      "Pazar lideri bunu 8 yıldır yapıyor ve yarın batmayacak. Tüm düzenimi bozup senin gibi yeni bir ekibe geçmem için tek ölümcül farkın ne?",
    psychology:
      "Trapped in sunk-cost fallacy. Deeply invested in existing certifications and workflows.",
    fatalTrigger:
      "Saying 'we are cheaper and have 50 extra features'.",
    persuasionKey:
      "10x speed on a single sharp wedge, 1-click automated data migration, and zero lock-in.",
    initialConviction: 20,
    silhouetteIndex: 4,
  },
  {
    id: "hype-tourist",
    name: "Elena Gomez",
    nameTr: "Ece Tezel",
    roleTitle: "Agency Founder & Growth Lead",
    roleTitleTr: "Ajans Kurucusu",
    archetype: "The Hype Tourist",
    archetypeTr: "Hevesli Ama Çabuk Bıkan",
    motto: "I try new tools every week; 7 days later I forget they exist.",
    mottoTr: "İlk gün aşkla açarım, sekizinci gün adını unuturum.",
    coreObjectionTemplate:
      "I will try this enthusiastically for three days, then completely forget about it. How will you keep bringing me daily value without spamming me?",
    coreObjectionTemplateTr:
      "İlk 3 gün hevesle denerim, sonra adını bile unuturum. Beni spam bildirimlere boğmadan nasıl her gün geri getireceksin?",
    psychology:
      "Novelty seeker with zero attention span. Abandons tools unless they produce passive ambient value.",
    fatalTrigger:
      "Promising 'daily push notifications and newsletter tips'.",
    persuasionKey:
      "Passive background output delivered to existing morning routines (e.g. daily ready-made summary).",
    initialConviction: 30,
    silhouetteIndex: 5,
  },
];
