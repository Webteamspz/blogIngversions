import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import "./ArticleDetail.css";

import ArticleTracker from "./ArticleTracker";
import GetStartedBtn from "./GetStartedBtn";
import PopularArticles from "./PopularArticles";
import { articles } from "../data/articlesData";
import { articleImages, fallbackImagesByCategory } from "../data/articleImages";
import Mermaid from "../components/Mermaid";
import CodeBlock from "./CodeBlock";

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
    alternates: {
      canonical: `https://blog.ingversionsdigital.com/${slug}`,
    },
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

  const heroImage = articleImages[slug] || fallbackImagesByCategory[article.categorySlug] || fallbackImagesByCategory["cro"];
  const badgeColor = categoryColors[article.category] || "badge-default";

  const publishedDate = new Date(article.date);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    image: [heroImage],
    datePublished: isNaN(publishedDate.getTime()) ? undefined : publishedDate.toISOString(),
    author: {
      "@type": "Organization",
      name: "Ingversions Digital",
    },
    publisher: {
      "@type": "Organization",
      name: "Ingversions Digital",
      logo: {
        "@type": "ImageObject",
        url: "https://ingversionsdigital.com/logos/logo-192.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://blog.ingversionsdigital.com/${slug}`,
    },
  };

  return (
    <main className="article-main">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <ArticleTracker title={article.title} />

      <article className="article-container">

        <div className="back-link-wrapper">
          <Link href="/" className="back-link">
            <ArrowLeft size={18} strokeWidth={2.5} aria-hidden="true" />
            Back to Blog
          </Link>
        </div>

        <div className="article-hero-wrapper">
          <img src={heroImage} alt={article.title} className="article-hero-img" />
        </div>

        <div className="article-content-wrapper">

          <div className="badge-container">
            <span className={`article-badge ${badgeColor}`}>
              {article.category}
            </span>
          </div>

          <h1 className="article-title">{article.title}</h1>

          <div className="article-meta">
            <span>{article.date}</span>
            <span className="meta-dot">•</span>
            <span>{article.readTime}</span>
          </div>

          <div className="article-body markdown-content">
            <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const language = match ? match[1] : "";

                  // If it's a mermaid block, render our client component
                  if (language === "mermaid") {
                    return <Mermaid chart={String(children).replace(/\n$/, "")} />;
                  }

                  // Otherwise, return standard code blocks
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                pre({ children }) {
                  return <CodeBlock>{children}</CodeBlock>;
                },
                img({ src, alt }) {
                  const isDiagram = typeof src === "string" && src.startsWith("/diagrams/");
                  return (
                    <img
                      src={src}
                      alt={alt}
                      className={isDiagram ? "markdown-diagram-img" : undefined}
                    />
                  );
                },
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          {/* <Comments /> */}

          <PopularArticles currentSlug={slug} />

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