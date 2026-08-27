"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import styles from "./BlogClient.module.css";
import { pageview } from "../../gtm";
import { blogData } from "../../data/blogData"; 

const articleImages: Record<string, string> = {
  "cro": "/assets/blog/covers/photo-1460925895917-afdab827c52f.jpg",
  "ab-testing": "/assets/blog/covers/photo-1507003211169-0a1dd7228f2d.jpg",
  "shopify": "/assets/blog/covers/photo-1441986300917-64674bd600d8.jpg",
  "qa": "/assets/blog/covers/photo-1516321318423-f06f85e504b3.jpg",
};

const getCategorySlug = (categoryName: string) => {
  if (!categoryName) return "all";
  if (categoryName === "Shopify Development") return "shopify";
  if (categoryName === "A/B Testing") return "ab-testing";
  if (categoryName === "Quality Assurance") return "qa";
  if (categoryName === "CRO") return "cro";
  return categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
};

const articles = blogData.posts
  .map(post => ({
    ...post,
    categorySlug: getCategorySlug(post.category)
  }))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const categories = [
  { id: "all", name: "All Posts", count: articles.length },
  { id: "cro", name: "CRO", count: articles.filter(a => a.categorySlug === "cro").length },
  { id: "ab-testing", name: "A/B Testing", count: articles.filter(a => a.categorySlug === "ab-testing").length },
  { id: "shopify", name: "Shopify Development", count: articles.filter(a => a.categorySlug === "shopify").length },
  { id: "qa", name: "Quality Assurance", count: articles.filter(a => a.categorySlug === "qa").length },
  { id: "ai-automation", name: "AI & Automation", count: articles.filter(a => a.categorySlug === "ai-automation").length },
];

const categoryColors: Record<string, string> = {
  "CRO": "badge-cro",
  "A/B Testing": "badge-ab",
  "Shopify Development": "badge-shopify",
  "Quality Assurance": "badge-qa",
  "AI & Automation": "badge-ai-automation",
};

const categoryBorderColors: Record<string, string> = {
  "CRO": "border-hover-cro",
  "A/B Testing": "border-hover-ab",
  "Shopify Development": "border-hover-shopify",
  "Quality Assurance": "border-hover-qa",
};

export default function BlogClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const topRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try { pageview(window.location.pathname, "Blog Index Page"); } catch (e) {}
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredArticles = activeCategory === "all" 
    ? articles 
    : articles.filter(a => a.categorySlug === activeCategory);

  return (
   <main className={styles["blog-main"]}>
      <section className={`${styles["blog-section"]} ${styles["hero-section"]}`} ref={topRef}>
        <div className={styles["hero-grid"]} aria-hidden="true" />
        <div className={`${styles.container} ${styles["text-center"]}`}>
          <h1 className={styles["hero-title"]}>
            Insights for <span className={styles["text-highlight"]}>Founders</span> Who Build
          </h1>
          <p className={styles["hero-subtitle"]}>
            Practical advice on conversion optimization, A/B testing, and Shopify development
          </p>

          <div className={styles["tabs-container"]}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`${styles["tab-btn"]} ${activeCategory === cat.id ? styles.active : styles.inactive}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles["blog-section"]} py-8`}>
        <div className={styles.container}>
          <div className={styles["grid-header"]}>
            <h2 className={styles["section-title"]}>
              {activeCategory === "all" ? "Latest Articles" : categories.find(c => c.id === activeCategory)?.name}
            </h2>
            <span className={styles["article-count"]}>{filteredArticles.length} articles</span>
          </div>

          <div className={styles["articles-grid"]}>
            {filteredArticles.map((article: any) => (
              <Link key={article.id} href={`/${article.slug}`} className={styles["block-link"]}>
                <article className={`${styles["article-card"]} ${styles[categoryBorderColors[article.category]]}`}>
                  <div className={styles["article-img-wrapper"]}>
                    <Image
                      src={article.coverImage || articleImages[article.categorySlug]}
                      alt={article.category}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={styles["article-img"]}
                    />
                    <span className={`${styles.badge} ${styles[categoryColors[article.category]]}`}>
                      {article.category}
                    </span>
                  </div>

                  <div className={styles["article-content"]}>
                    <h3 className={styles["article-title"]}>
                      {article.title}
                    </h3>
                    <p className={styles["article-excerpt"]}>
                      {article.excerpt}
                    </p>
                    <div className={styles["meta-between"]}>
                      <span>{article.date}</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles["blog-section"]} py-12`}>
        <div className={styles.container}>
          <h2 className={styles["section-title-center"]}>Browse by Category</h2>
          <div className={styles["categories-grid"]}>

            <div
              className={`${styles["category-card"]} ${styles["hover-cro"]}`}
              onClick={() => handleCategoryClick("cro")}
            >
              <div className={`${styles["category-img-wrapper"]} ${styles["bg-green-light"]}`}>
                <Image src={articleImages["cro"]} alt="CRO analytics" fill sizes="(max-width: 768px) 100vw, 33vw" className={styles["category-img"]} />
              </div>
              <h3 className={styles["category-title"]}>CRO</h3>
              <p className={styles["category-desc"]}>Conversion rate optimization strategies and best practices.</p>
              <span className={`${styles["category-link"]} text-green`}>
                {categories.find(c => c.id === "cro")?.count} articles
                <ArrowRight size={16} strokeWidth={3} className={styles["arrow-icon"]} aria-hidden="true" />
              </span>
            </div>

            <div
              className={`${styles["category-card"]} ${styles["hover-ab"]}`}
              onClick={() => handleCategoryClick("ab-testing")}
            >
              <div className={`${styles["category-img-wrapper"]} ${styles["bg-orange-light"]}`}>
                <Image src={articleImages["ab-testing"]} alt="A/B testing" fill sizes="(max-width: 768px) 100vw, 33vw" className={styles["category-img"]} />
              </div>
              <h3 className={styles["category-title"]}>A/B Testing</h3>
              <p className={styles["category-desc"]}>Testing methodologies and statistical significance.</p>
              <span className={`${styles["category-link"]} text-orange`}>
                {categories.find(c => c.id === "ab-testing")?.count} articles
                <ArrowRight size={16} strokeWidth={3} className={styles["arrow-icon"]} aria-hidden="true" />
              </span>
            </div>

            <div
              className={`${styles["category-card"]} ${styles["hover-shopify"]}`}
              onClick={() => handleCategoryClick("shopify")}
            >
              <div className={`${styles["category-img-wrapper"]} ${styles["bg-purple-light"]}`}>
                <Image src={articleImages["shopify"]} alt="Shopify development" fill sizes="(max-width: 768px) 100vw, 33vw" className={styles["category-img"]} />
              </div>
              <h3 className={styles["category-title"]}>Shopify Development</h3>
              <p className={styles["category-desc"]}>Theme customization and store optimization.</p>
              <span className={`${styles["category-link"]} text-purple`}>
                {categories.find(c => c.id === "shopify")?.count} articles
                <ArrowRight size={16} strokeWidth={3} className={styles["arrow-icon"]} aria-hidden="true" />
              </span>
            </div>

            <div
              className={`${styles["category-card"]} ${styles["hover-qa"]}`}
              onClick={() => handleCategoryClick("qa")}
            >
              <div className={`${styles["category-img-wrapper"]} ${styles["bg-blue-light"]}`}>
                <Image src={articleImages["qa"]} alt="Quality Assurance" fill sizes="(max-width: 768px) 100vw, 33vw" className={styles["category-img"]} />
              </div>
              <h3 className={styles["category-title"]}>Quality Assurance</h3>
              <p className={styles["category-desc"]}>Automated testing, checklists, and performance tracking.</p>
              <span className={`${styles["category-link"]} text-blue`}>
                {categories.find(c => c.id === "qa")?.count} articles
                <ArrowRight size={16} strokeWidth={3} className={styles["arrow-icon"]} aria-hidden="true" />
              </span>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}