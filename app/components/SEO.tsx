import { Metadata } from 'next';

/**
 * SEO Utility function to generate metadata for articles
 * Returns Metadata object with Open Graph and Twitter Card support
 */
export function generateArticleMetadata({
  title,
  description,
  slug,
  category,
  date,
}: {
  title: string;
  description: string;
  slug: string;
  category: string;
  date: string;
}): Metadata {
  const heroImages: Record<string, string> = {
    cro: 'https://images.unsplash.com/photo-1551288049-bebda4e38328?q=80&w=800&h=400&fit=crop',
    'ab-testing': 'https://images.unsplash.com/photo-1590228943550-110271813329?q=80&w=800&h=400&fit=crop',
    shopify: 'https://images.unsplash.com/photo-1455344259771-3c54587137df?q=80&w=800&h=400&fit=crop',
  };
  
  const heroImage = heroImages[category.toLowerCase() as keyof typeof heroImages] 
    || 'https://images.unsplash.com/photo-1600607686527-16b8220b1454?q=80&w=800&h=400&fit=crop';

  return {
    title: `${title} | Ingversions Blog`,
    description: description,
    keywords: [category.toLowerCase(), 'Shopify', 'CRO', 'A/B testing', title.toLowerCase()],
    authors: [{ name: 'Ingversions' }],
    openGraph: {
      type: 'article',
      url: `https://blog.ingversionsdigital.com/blog/${slug}`,
      title: title,
      description: description,
      images: [
        {
          url: heroImage,
          width: 800,
          height: 400,
          alt: title,
        },
      ],
      publishedTime: date,
      section: category,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [heroImage],
      site: '@ingversions',
      creator: '@ingversions',
    },
  };
}
