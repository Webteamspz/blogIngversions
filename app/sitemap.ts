import type { MetadataRoute } from "next";
import { articles } from "./data/articlesData";
import { structuredPosts } from "./data/structuredPosts";

const SITE_URL = "https://blog.ingversionsdigital.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const dates = new Map<string, string>([
    ...Object.entries(articles).map(([slug, a]) => [slug, a.date] as const),
    ...structuredPosts.map((p) => [p.slug, p.meta.date] as const),
  ]);

  const articleEntries: MetadataRoute.Sitemap = [...dates].map(
    ([slug, date]) => {
      const parsedDate = new Date(date);
      return {
        url: `${SITE_URL}/${slug}`,
        lastModified: isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
        changeFrequency: "monthly",
        priority: 0.8,
      };
    }
  );

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...articleEntries,
  ];
}
