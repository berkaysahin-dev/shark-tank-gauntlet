import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://gauntlet.berkaysahin.net",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          en: "https://gauntlet.berkaysahin.net",
          tr: "https://gauntlet.berkaysahin.net",
        },
      },
    },
  ];
}
