import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://pitch.berkaysahin.net",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          en: "https://pitch.berkaysahin.net",
          tr: "https://pitch.berkaysahin.net",
        },
      },
    },
  ];
}
