import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import "./ArticleDetail.css";

import ArticleTracker from "./ArticleTracker";
import GetStartedBtn from "./GetStartedBtn";
import { articles } from "../Data/articlesData"; 
import Comments from "./Comments";

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

  // Fallback hero images agar proper category slug na mile
  const heroImages: Record<string, string> = {
    cro: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    "ab-testing": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    shopify: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
    "quality-assurance": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
    "ux-design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
    analytics: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop"
  };

  const heroImage = heroImages[article.categorySlug] || heroImages["cro"];

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

  const heroImages: Record<string, string> = {
    cro: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    "ab-testing": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    shopify: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
    "quality-assurance": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
    "ux-design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
    analytics: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop"
  };

  const heroImage = heroImages[article.categorySlug] || heroImages["cro"];
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
          <Comments />

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