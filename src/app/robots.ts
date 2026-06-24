import type { MetadataRoute } from "next";
import { business } from "@/data/business";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${business.seo.url}/sitemap.xml`,
  };
}
