import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Gauntlet — gauntlet.berkaysahin.net",
    short_name: "Gauntlet",
    description:
      "Test your startup pitch against 5 ruthless psychological buyer archetypes. Zero retention, BYOK and offline simulator.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: "en",
    orientation: "portrait-primary",
    categories: ["business", "productivity", "technology"],
  };
}
