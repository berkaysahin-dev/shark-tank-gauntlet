import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://pitch.berkaysahin.net/sitemap.xml",
    host: "https://pitch.berkaysahin.net",
  };
}
