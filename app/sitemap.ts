import type { MetadataRoute } from "next";
import { articles } from "./data/articlesData";

const SITE_URL = "https://blog.ingversionsdigital.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const articleEntries: MetadataRoute.Sitemap = Object.entries(articles).map(
    ([slug, article]) => {
      const parsedDate = new Date(article.date);
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
