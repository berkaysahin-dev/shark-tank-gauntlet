import { JurorConfig } from "@/types/gauntlet";

export const JURORS: JurorConfig[] = [
  {
    id: "cfo-penny-pincher",
    name: "Arthur Vance",
    nameTr: "Halis Bey",
    roleTitle: "SMB Owner & Budget Controller",
    roleTitleTr: "KOBİ Sahibi & Bütçe Yöneticisi",
    archetype: "The Penny-Pincher",
    archetypeTr: "Maliyet Odaklı Patron",
    motto: "Software is an expense. Free labor with Excel is flexible.",
    mottoTr: "Maliyet bir kere yazılır, para zor kazanılır.",
    coreObjectionTemplate:
      "I won't pay a monthly subscription for this when I can have an intern write two Excel formulas. Why should I spend my company's cash on this?",
    coreObjectionTemplateTr:
      "Ben buna aylık para vermem, stajyere iki Excel formülü yazdırır bedavaya çözerim. Neden kasamdaki parayı sana vereyim?",
    psychology:
      "Watches every dollar. Dislikes vague promises. Wants to see clear time or money saved.",
    psychologyTr:
      "Her kuruşun hesabını yapar. Süslü lafları sevmez. Kaç saat veya ne kadar para kurtardığını görmek ister.",
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
    roleTitle: "Chief Information Security Officer",
    roleTitleTr: "Bilgi Güvenliği Yöneticisi",
    archetype: "The Security Gatekeeper",
    archetypeTr: "Titiz Güvenlikçi",
    motto: "Every third-party service is a potential leak.",
    mottoTr: "Her dış servis, içerideki bir risktir.",
    coreObjectionTemplate:
      "Where does my company data live? On a shared cloud server? Our security team will reject this right away. How do you guarantee zero data leaks?",
    coreObjectionTemplateTr:
      "Şirket verilerim nerede duruyor? Paylaşımlı bir bulutta mı? Güvenlik ekibimiz buna hemen hayır der. Veri sızıntısı olmayacağını nasıl garanti ediyorsun?",
    psychology:
      "Worries one data leak could cost him his job. Needs clear proof of where data goes.",
    psychologyTr:
      "Tek bir veri sızıntısının işine mal olmasından korkar. Verilerin nerede işlendiğini net bilmek ister.",
    fatalTrigger:
      "Saying 'don't worry, we host on AWS' or 'our encryption is very safe'.",
    persuasionKey:
      "Zero data storage policy, client-side encryption, and private server or compliance options.",
    initialConviction: 20,
    silhouetteIndex: 2,
  },
  {
    id: "friction-phobic",
    name: "Sarah Jenkins",
    nameTr: "Aslı Karaca",
    roleTitle: "Operations Director",
    roleTitleTr: "Operasyon Yöneticisi",
    archetype: "The Busy Operator",
    archetypeTr: "Vakti Olmayan Yönetici",
    motto: "Any tool that needs a 10-minute tutorial goes in the trash.",
    mottoTr: "10 dakikalık eğitim videosu isteyen araç çöptür.",
    coreObjectionTemplate:
      "I don't even have 5 minutes to learn a new dashboard or watch setup videos. Can this solve my problem without opening new tabs?",
    coreObjectionTemplateTr:
      "Yeni bir panel öğrenmeye veya eğitim videosu izlemeye 5 dakikam bile yok. Yeni sekme açtırmadan, mevcut işimi bozmadan çalışıyor mu?",
    psychology:
      "Already juggling too many tabs and logins. Rejects anything that takes effort to learn.",
    psychologyTr:
      "Gün boyu onlarca açık sekme arasında boğuluyor. Yeni şifre, yeni panel ve uzun kurulum sevmez.",
    fatalTrigger:
      "Offering a 'comprehensive 20-minute academy course'.",
    persuasionKey:
      "Works right inside Slack, email, or existing tools with 1-click setup.",
    initialConviction: 30,
    silhouetteIndex: 3,
  },
  {
    id: "incumbent-loyalist",
    name: "David Sterling",
    nameTr: "Mert Vural",
    roleTitle: "Senior Product Architect",
    roleTitleTr: "Kıdemli Ürün Mimarı",
    archetype: "The Market Leader Fan",
    archetypeTr: "Büyük Marka Savunucusu",
    motto: "Nobody gets fired for choosing the market leader.",
    mottoTr: "Pazar liderini seçtiği için kimse işten atılmadı.",
    coreObjectionTemplate:
      "The market leader has been doing this for 8 years and won't shut down tomorrow. What is the one big reason I should switch to you?",
    coreObjectionTemplateTr:
      "Pazar lideri bu işi 8 yıldır yapıyor ve yarın batmayacak. Tüm düzenimi bozup senin gibi yeni bir ekibe geçmem için en büyük sebep ne?",
    psychology:
      "Already invested in the current tool. Needs a clear speed advantage and easy data transfer.",
    psychologyTr:
      "Mevcut sistemine alışmış durumda. Geçmek için çok net bir hız farkı ve kolay veri aktarımı bekler.",
    fatalTrigger:
      "Saying 'we are cheaper and have 50 extra features'.",
    persuasionKey:
      "10x faster on one painful task, plus 1-click import from the old tool.",
    initialConviction: 20,
    silhouetteIndex: 4,
  },
  {
    id: "hype-tourist",
    name: "Elena Gomez",
    nameTr: "Ece Tezel",
    roleTitle: "Agency Founder",
    roleTitleTr: "Ajans Kurucusu",
    archetype: "The Quick-to-Bore Buyer",
    archetypeTr: "Çabuk Hevesi Kaçan",
    motto: "I try new tools every week, and forget them a week later.",
    mottoTr: "İlk gün hevesle açarım, sekizinci gün adını unuturum.",
    coreObjectionTemplate:
      "I'll try this enthusiastically for three days, then forget it exists. How do you stay useful every day without spamming me?",
    coreObjectionTemplateTr:
      "İlk 3 gün hevesle denerim, sonra adını bile unuturum. Beni bildirimlere boğmadan her gün işime yaradığını nasıl göstereceksin?",
    psychology:
      "Loves shiny new tools but drops them fast unless they deliver value automatically.",
    psychologyTr:
      "Yeni araçları denemeyi sever ama uğraştıran her şeyi hemen bırakır. Otomatik fayda görmek ister.",
    fatalTrigger:
      "Promising 'daily push notifications and newsletter tips'.",
    persuasionKey:
      "Sends useful daily or weekly summaries automatically without requiring you to log in.",
    initialConviction: 30,
    silhouetteIndex: 5,
  },
];
