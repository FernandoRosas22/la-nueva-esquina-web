import type { MetadataRoute } from "next";
import { business } from "@/data/business";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: business.seo.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
