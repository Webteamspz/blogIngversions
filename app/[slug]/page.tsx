import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import "./ArticleDetail.css";

import ArticleTracker from "./ArticleTracker";
import GetStartedBtn from "./GetStartedBtn";
import { articles } from "../Data/articlesData"; 
import Comments from "./Comments";

// 1. Map all 30 specific blog images by their unique slug
const articleImages: Record<string, string> = {
  "shopify-theme-customizations-boost-sales": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
  "ab-testing-mistakes-cost-money": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
  "cro-fundamentals-where-to-start": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
  "mobile-cro-designing-small-screens": "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=1200&auto=format&fit=crop",
  "psychology-high-converting-landing-pages": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
  "qa-checklist-before-launching-store": "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80",
  "headless-shopify-is-it-right-for-your-brand": "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=600&q=80",
  "multivariate-vs-ab-testing": "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80",
  "micro-commitments-better-funnels": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
  "automated-ui-testing-ecommerce": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
  "optimizing-shopify-core-web-vitals": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
  "reducing-cart-abandonment-strategic-nudges": "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80",
  "calculate-statistical-significance": "https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=600&q=80",
  "cross-browser-testing-nightmares": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
  "advanced-liquid-snippets-dynamic-pricing": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
  "role-of-social-proof-in-cro": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80",
  "testing-cta-buttons": "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=600&q=80",
  "performance-testing-black-friday": "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80",
  "migrating-to-shopify-plus": "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=600&q=80",
  "data-driven-redesigns": "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=600&q=80",
  
  // Newly Mapped Blogs (21-30)
  "shopify-apps-safe-to-uninstall": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  "shopify-bundles-boost-aov": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
  "shopify-technical-seo-checklist": "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80",
  "exit-popups-that-convert": "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80",
  "personalization-tactics-lift-conversions": "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=600&q=80",
  "one-page-vs-multi-page-checkout": "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80",
  "sample-ratio-mismatch-ab-testing": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
  "how-long-to-run-ab-test": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
  "regression-testing-shopify-releases": "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&q=80",
  "accessibility-testing-wcag-ecommerce": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80"
};

// 2. Keep the fallbacks just in case a new post gets added without a mapped image
const fallbackImagesByCategory: Record<string, string> = {
  cro: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
  "ab-testing": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
  shopify: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
  "quality-assurance": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
  "ux-design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
  analytics: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop"
};

export async function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const plainTextContent = article.content
    .replace(/## |### |`|\*\*|\*|\[|\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const description = plainTextContent.slice(0, 160);

  // Look for exact slug image first, then category, then generic fallback
  const heroImage = articleImages[slug] || fallbackImagesByCategory[article.categorySlug] || fallbackImagesByCategory["cro"];

  return {
    title: `${article.title} | Ingversions Blog`,
    description,
    keywords: [
      article.category.toLowerCase(),
      "Shopify",
      "CRO",
      "A/B testing",
    ],
    openGraph: {
      type: "article",
      url: `https://blog.ingversionsdigital.com/${slug}`,
      title: article.title,
      description,
      images: [
        {
          url: heroImage,
          width: 800,
          height: 400,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [heroImage],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) notFound();

  const categoryColors: Record<string, string> = {
    CRO: "badge-cro",
    "A/B Testing": "badge-ab",
    "Shopify Development": "badge-shopify",
    "Quality Assurance": "badge-qa",
    "UX Design": "badge-ux",
    "Analytics": "badge-analytics"
  };

  // Look for exact slug image first, then category, then generic fallback
  const heroImage = articleImages[slug] || fallbackImagesByCategory[article.categorySlug] || fallbackImagesByCategory["cro"];
  const badgeColor = categoryColors[article.category] || "badge-default";

  return (
    <main className="article-main">

      {/* GTM Pageview */}
      <ArticleTracker title={article.title} />

      <article className="article-container">

        {/* Back Button */}
        <div className="back-link-wrapper">
          <Link href="/" className="back-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Hero Image */}
        <div className="article-hero-wrapper">
          <img src={heroImage} alt={article.title} className="article-hero-img" />
        </div>

        <div className="article-content-wrapper">

          {/* Badge */}
          <div className="badge-container">
            <span className={`article-badge ${badgeColor}`}>
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="article-title">{article.title}</h1>

          {/* Meta */}
          <div className="article-meta">
            <span>{article.date}</span>
            <span className="meta-dot">•</span>
            <span>{article.readTime}</span>
          </div>

          {/* Content Rendered via ReactMarkdown */}
          <div className="article-body markdown-content">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>

          {/* 🎯 Real-Time Comments Component */}
          {/* <Comments /> */}

          {/* CTA Box */}
          <div className="article-cta-box">
            <h3 className="cta-heading">Want results like these?</h3>
            <p className="cta-text">
              We help Shopify stores optimize their conversion rates.
            </p>
            <GetStartedBtn />
          </div>

        </div>
      </article>

    </main>
  );
}