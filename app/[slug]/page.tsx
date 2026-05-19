import { notFound } from "next/navigation";
import Link from "next/link";
import "./ArticleDetail.css";

import ArticleTracker from "./ArticleTracker";
import GetStartedBtn from "./GetStartedBtn"; // Naya Button Import Kiya

const articles: Record<
  string,
  {
    title: string;
    category: string;
    categorySlug: string;
    date: string;
    readTime: string;
    content: string;
  }
> = {
  "checkout-conversion-34-percent": {
    title: "How We Increased Checkout Conversion by 34% for a Shopify Store",
    category: "CRO",
    categorySlug: "cro",
    date: "April 10, 2026",
    readTime: "8 min read",
    content: `
## The Problem

Our client, a mid-size Shopify store selling premium skincare products, was struggling with a 68% checkout abandonment rate.

## Our Approach

We implemented a systematic conversion optimization process.

## The Results

Checkout conversion increased by 34%.

## Want Similar Results?

We specialize in Shopify CRO.
    `,
  },
  // Baaki articles same rahenge
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
    .replace(
      /## |### |`|\*\*|\*|\[|\]/g,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();

  const description =
    plainTextContent.slice(0, 160);

  const heroImages: Record<string, string> = {
    cro: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",

    "ab-testing":
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",

    shopify:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
  };

  const heroImage =
    heroImages[article.categorySlug];

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
    "Shopify Development":
      "badge-shopify",
  };

  const heroImages: Record<string, string> = {
    cro: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",

    "ab-testing":
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",

    shopify:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
  };

  const heroImage =
    heroImages[article.categorySlug];

  return (
    <main className="article-main">

      {/* GTM Pageview */}
      <ArticleTracker
        title={article.title}
      />

      <article className="article-container">

        {/* Back Button */}
        <div className="back-link-wrapper">
          <Link
            href="/"
            className="back-link"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Hero Image */}
        <div className="article-hero-wrapper">
          <img
            src={heroImage}
            alt={article.title}
            className="article-hero-img"
          />
        </div>

        <div className="article-content-wrapper">

          {/* Badge */}
          <div className="badge-container">
            <span
              className={`article-badge ${categoryColors[article.category]}`}
            >
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="article-title">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="article-meta">
            <span>{article.date}</span>
            <span className="meta-dot">•</span>
            <span>{article.readTime}</span>
          </div>

          {/* Content */}
          <div className="article-body">
            {article.content
              .split("\n")
              .map((paragraph, i) => {

                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={i} className="article-h2">
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }

                if (paragraph.startsWith("### ")) {
                  return (
                    <h3 key={i} className="article-h3">
                      {paragraph.replace("### ", "")}
                    </h3>
                  );
                }

                if (paragraph.startsWith("- ")) {
                  return (
                    <li key={i} className="article-li">
                      {paragraph.replace("- ", "")}
                    </li>
                  );
                }

                if (paragraph.trim() === "") {
                  return null;
                }

                return (
                  <p key={i} className="article-p">
                    {paragraph}
                  </p>
                );
              })}
          </div>

          {/* CTA Box */}
          <div className="article-cta-box">
            <h3 className="cta-heading">
              Want results like these?
            </h3>
            <p className="cta-text">
              We help Shopify stores optimize their conversion rates.
            </p>

            {/* YAHAN NAYA COMPONENT USE HUA HAI JISME SEPARATE EVENT HAI */}
            <GetStartedBtn />

          </div>
        </div>
      </article>
    </main>
  );
}