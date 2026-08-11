import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import "./ArticleDetail.css";

import ArticleTracker from "./ArticleTracker";
import GetStartedBtn from "./GetStartedBtn";
import PopularArticles from "./PopularArticles";
import { articles } from "../Data/articlesData";
import { articleImages, fallbackImagesByCategory } from "../Data/articleImages";
import Comments from "./Comments";

// ✅ Import your new Mermaid client component
// (Adjust the path if your page.tsx is located elsewhere relative to the components folder)
import Mermaid from "../components/Mermaid";

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

  return (
    <main className="article-main">

      <ArticleTracker title={article.title} />

      <article className="article-container">

        <div className="back-link-wrapper">
          <Link href="/" className="back-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
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
            {/* ✅ NEW: Pass custom components to ReactMarkdown to render the Mermaid chart */}
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
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          {/* <Comments /> */}

          {/* ✅ NEW: Most Popular Articles Slider */}
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