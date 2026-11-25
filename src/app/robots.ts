import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://gauntlet.berkaysahin.net/sitemap.xml",
    host: "https://gauntlet.berkaysahin.net",
  };
}
