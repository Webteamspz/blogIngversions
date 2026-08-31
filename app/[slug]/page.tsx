import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import styles from "./ArticleDetail.module.css";

import ArticleTracker from "./ArticleTracker";
import GetStartedBtn from "./GetStartedBtn";
import PopularArticles from "./PopularArticles";
import ArticleBlocks from "./ArticleBlocks";
import { articles } from "../data/articlesData";
import { articleImages, fallbackImagesByCategory } from "../data/articleImages";
import { structuredPosts, getStructuredPost } from "../data/structuredPosts";
import Mermaid from "../components/Mermaid";
import CodeBlock from "./CodeBlock";

export async function generateStaticParams() {
  const slugs = new Set([
    ...Object.keys(articles),
    ...structuredPosts.map((p) => p.slug),
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const structured = getStructuredPost(slug);
  if (structured) {
    return {
      title: structured.seo.title,
      description: structured.seo.description,
      keywords: structured.seo.keywords,
      alternates: { canonical: structured.seo.canonical },
      openGraph: {
        type: "article",
        url: structured.seo.canonical,
        title: structured.hero.title,
        description: structured.seo.description,
        images: [{ url: structured.meta.coverImage, width: 1200, height: 630, alt: structured.hero.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: structured.hero.title,
        description: structured.seo.description,
        images: [structured.meta.coverImage],
      },
    };
  }

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

  const structured = getStructuredPost(slug);
  if (structured) {
    const structuredSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: structured.hero.title,
      image: [structured.meta.coverImage],
      author: { "@type": "Organization", name: "Ingversions Digital" },
      publisher: {
        "@type": "Organization",
        name: "Ingversions Digital",
        logo: { "@type": "ImageObject", url: "https://ingversionsdigital.com/logos/logo-192.png" },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": structured.seo.canonical },
    };

    return (
      <main className={styles["article-main"]}>
        <div className={`${styles["article-hero-shape"]} ${styles["article-hero-shape-circle"]}`} aria-hidden="true" />
        <div className={`${styles["article-hero-shape"]} ${styles["article-hero-shape-square"]}`} aria-hidden="true" />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredSchema) }} />

        <ArticleTracker title={structured.hero.title} />

        <article className={styles["article-container"]}>
          <ArticleBlocks post={structured} />

          <div className={styles["article-content-wrapper"]}>
            <PopularArticles currentSlug={slug} />
          </div>
        </article>
      </main>
    );
  }

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
    <main className={styles["article-main"]}>

      <div className={`${styles["article-hero-shape"]} ${styles["article-hero-shape-circle"]}`} aria-hidden="true" />
      <div className={`${styles["article-hero-shape"]} ${styles["article-hero-shape-square"]}`} aria-hidden="true" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <ArticleTracker title={article.title} />

      <article className={styles["article-container"]}>

        <div className={styles["back-link-wrapper"]}>
          <Link href="/" className={styles["back-link"]}>
            <ArrowLeft size={18} strokeWidth={2.5} aria-hidden="true" />
            Back to Blog
          </Link>
        </div>

        <div className={styles["article-hero-wrapper"]}>
          <Image
            src={heroImage}
            alt={article.title}
            fill
            sizes="(max-width: 767px) 100vw, 1440px"
            priority
            className={styles["article-hero-img"]}
          />
        </div>

        <div className={styles["article-content-wrapper"]}>

          <div className={styles["badge-container"]}>
            <span className={`${styles["article-badge"]} ${styles[badgeColor]}`}>
              {article.category}
            </span>
          </div>

          <h1 className={styles["article-title"]}>{article.title}</h1>

          <div className={styles["article-meta"]}>
            <span>{article.date}</span>
            <span className={styles["meta-dot"]}>•</span>
            <span>{article.readTime}</span>
          </div>

          <div className={`${styles["article-body"]} ${styles["markdown-content"]}`}>
            <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const language = match ? match[1] : "";

                  if (language === "mermaid") {
                    return <Mermaid chart={String(children).replace(/\n$/, "")} />;
                  }

                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                pre({ children }) {
                  const child = Array.isArray(children) ? children[0] : children;
                  const cn =
                    (child as { props?: { className?: string } })?.props?.className || "";
                  if (typeof cn === "string" && cn.includes("language-mermaid")) {
                    return <>{children}</>;
                  }
                  return <CodeBlock>{children}</CodeBlock>;
                },
                img({ src, alt }) {
                  const isDiagram = typeof src === "string" && src.startsWith("/diagrams/");
                  return (
                    <img
                      src={src}
                      alt={alt}
                      className={isDiagram ? styles["markdown-diagram-img"] : undefined}
                    />
                  );
                },
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          <PopularArticles currentSlug={slug} />

          <div className={styles["article-cta-box"]}>
            <h3 className={styles["cta-heading"]}>Want results like these?</h3>
            <p className={styles["cta-text"]}>
              We help Shopify stores optimize their conversion rates.
            </p>
            <GetStartedBtn />
          </div>

        </div>
      </article>

    </main>
  );
}