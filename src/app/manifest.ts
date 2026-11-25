import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Gauntlet — pitch.berkaysahin.net",
    short_name: "Gauntlet",
    description:
      "Girişiminizi 5 acımasız psikolojik alıcı arketipine karşı test edin. Sıfır veri saklama, BYOK ve çevrimdışı simülatör.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: "tr",
    orientation: "portrait-primary",
    categories: ["business", "productivity", "technology"],
  };
}
