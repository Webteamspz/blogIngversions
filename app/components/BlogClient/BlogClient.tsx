 "use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./BlogClient.css"; 
// Agar gtm.ts tumhari root folder mein hai, toh path "/gtm" ya "../gtm" hoga
import { ctaClick, formSuccess, pageview } from "../../gtm"; 

const featuredImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop";

const articleImages: Record<string, string> = {
  "cro": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
  "ab-testing": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
  "shopify": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
};

const categories = [
  { id: "all", name: "All Posts", count: 9 },
  { id: "cro", name: "CRO", count: 3 },
  { id: "ab-testing", name: "A/B Testing", count: 3 },
  { id: "shopify", name: "Shopify Development", count: 3 },
];

const featuredArticle = {
  id: "featured-1",
  slug: "checkout-conversion-34-percent",
  title: "How We Increased Checkout Conversion by 34% for a Shopify Store",
  excerpt: "A deep dive into the A/B tests, UX changes, and technical optimizations that transformed a struggling checkout flow into a conversion machine. Learn the exact steps we took to boost revenue.",
  category: "CRO",
  categorySlug: "cro",
  date: "April 10, 2026",
  readTime: "8 min read",
};

const articles = [
  { id: "1", slug: "shopify-theme-customizations-boost-sales", title: "5 Shopify Theme Customizations That Boost Sales", excerpt: "From product page layouts to checkout optimizations, these theme changes can significantly improve your conversion rate.", category: "Shopify Development", categorySlug: "shopify", date: "April 8, 2026", readTime: "6 min read" },
  { id: "2", slug: "ab-testing-mistakes-cost-money", title: "A/B Testing Mistakes That Cost You Money", excerpt: "Common pitfalls in conversion testing and how to avoid them. Learn from real client experiences.", category: "A/B Testing", categorySlug: "ab-testing", date: "April 5, 2026", readTime: "5 min read" },
  { id: "3", slug: "cro-fundamentals-where-to-start", title: "CRO Fundamentals: Where to Start", excerpt: "New to conversion rate optimization? This guide covers the essential frameworks and tools you need.", category: "CRO", categorySlug: "cro", date: "April 3, 2026", readTime: "7 min read" },
  { id: "4", slug: "headless-shopify-storefront", title: "Building a Headless Shopify Storefront", excerpt: "When and why to go headless, plus a technical overview of our preferred stack for performance.", category: "Shopify Development", categorySlug: "shopify", date: "March 28, 2026", readTime: "10 min read" },
  { id: "5", slug: "statistical-significance-ab-testing", title: "Statistical Significance in A/B Testing", excerpt: "Stop guessing and start testing with confidence. A no-nonsense guide to test validity.", category: "A/B Testing", categorySlug: "ab-testing", date: "March 25, 2026", readTime: "6 min read" },
  { id: "6", slug: "mobile-checkout-optimization", title: "Mobile Checkout Optimization: 7 Quick Wins", excerpt: "Mobile commerce is growing. Here's how to capture those sales with better UX.", category: "CRO", categorySlug: "cro", date: "March 22, 2026", readTime: "4 min read" },
];

const categoryColors: Record<string, string> = {
  "CRO": "badge-cro",
  "A/B Testing": "badge-ab",
  "Shopify Development": "badge-shopify",
};

const categoryBorderColors: Record<string, string> = {
  "CRO": "border-hover-cro",
  "A/B Testing": "border-hover-ab",
  "Shopify Development": "border-hover-shopify",
};

export default function BlogClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Track Page View
  useEffect(() => {
    try { pageview(window.location.pathname, "Blog Index Page"); } catch (e) {}
  }, []);

  const filteredArticles = activeCategory === "all" 
    ? articles 
    : articles.filter(a => a.categorySlug === activeCategory);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    try { ctaClick({ label: "Subscribe Attempt", location: "Blog Newsletter", href: "" }); } catch (err) {}

    if (email) {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        
        const data = await response.json();
        if (response.ok && data.success) {
          setSubscribed(true);
          setEmail("");
          try { formSuccess({ form_id: "blog_newsletter", form_name: "Blog Newsletter Form" }); } catch (err) {}
        } else {
          setError(data.error || "Something went wrong.");
        }
      } catch (err) { setError("Network error."); }
      setLoading(false);
    }
  };

  return (
   <main className="blog-main">
      {/* Hero Section */}
      <section className="blog-section hero-section">
        <div className="container text-center">
          <h1 className="hero-title">
            Insights for <span className="text-highlight">Founders</span> Who Build
          </h1>
          <p className="hero-subtitle">
            Practical advice on conversion optimization, A/B testing, and Shopify development
          </p>

          {/* Category Tabs */}
          <div className="tabs-container">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`tab-btn ${activeCategory === cat.id ? "active" : "inactive"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {activeCategory === "all" && (
        <section className="blog-section py-8">
          <div className="container">
            <Link href={`/${featuredArticle.slug}`} className="block-link">
              <div className="featured-card">
                <div className="featured-layout">
                  <div className="featured-image-container">
                    <img src={featuredImage} alt="Checkout conversion" className="featured-image" />
                  </div>
                  <div className="featured-content">
                    <span className={`badge ${categoryColors[featuredArticle.category]}`}>
                      Featured • {featuredArticle.category}
                    </span>
                    <h2 className="featured-title">
                      {featuredArticle.title}
                    </h2>
                    <p className="featured-excerpt">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="meta-info">
                      <span>{featuredArticle.date}</span>
                      <span className="meta-divider">•</span>
                      <span>{featuredArticle.readTime}</span>
                    </div>
                    <span className="read-more">
                      Read Article →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="blog-section py-8">
        <div className="container">
          <div className="grid-header">
            <h2 className="section-title">
              {activeCategory === "all" ? "Latest Articles" : categories.find(c => c.id === activeCategory)?.name}
            </h2>
            <span className="article-count">{filteredArticles.length} articles</span>
          </div>

          <div className="articles-grid">
            {filteredArticles.map((article) => (
              <Link key={article.id} href={`/${article.slug}`} className="block-link">
                <article className={`article-card ${categoryBorderColors[article.category]}`}>
                  <div className="article-img-wrapper">
                    <img 
                      src={articleImages[article.categorySlug]} 
                      alt={article.category} 
                      className="article-img"
                    />
                  </div>

                  <div className="article-content">
                    <span className={`badge ${categoryColors[article.category]}`}>
                      {article.category}
                    </span>
                    <h3 className="article-title">
                      {article.title}
                    </h3>
                    <p className="article-excerpt">
                      {article.excerpt}
                    </p>
                    <div className="meta-between">
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

      {/* Newsletter CTA */}
      <section className="blog-section py-12">
        <div className="newsletter-container text-center">
          <h2 className="newsletter-title">
            Get Weekly CRO & Shopify Tips
          </h2>
          <p className="newsletter-subtitle">
            Join 2,000+ founders receiving actionable advice. No spam.
          </p>
          {subscribed ? (
            <div className="success-msg">
              <p className="success-text">Thank you for subscribing</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="newsletter-input"
              />
              <button
                type="submit"
                disabled={loading}
                className="newsletter-btn"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}
          {error && (
            <p className="error-msg">{error}</p>
          )}
        </div>
      </section>

      {/* Category Cards */}
      <section className="blog-section py-12">
        <div className="container">
          <h2 className="section-title-center">Browse by Category</h2>
          <div className="categories-grid">
            {/* CRO */}
            <div 
              className="category-card hover-cro"
              onClick={() => setActiveCategory("cro")}
            >
              <div className="category-img-wrapper bg-green-light">
                <img src={articleImages["cro"]} alt="CRO analytics" className="category-img" />
              </div>
              <h3 className="category-title">CRO</h3>
              <p className="category-desc">Conversion rate optimization strategies and best practices.</p>
              <span className="category-link text-green">3 articles →</span>
            </div>

            {/* A/B Testing */}
            <div 
              className="category-card hover-ab"
              onClick={() => setActiveCategory("ab-testing")}
            >
              <div className="category-img-wrapper bg-orange-light">
                <img src={articleImages["ab-testing"]} alt="A/B testing" className="category-img" />
              </div>
              <h3 className="category-title">A/B Testing</h3>
              <p className="category-desc">Testing methodologies and statistical significance.</p>
              <span className="category-link text-orange">3 articles →</span>
            </div>

            {/* Shopify */}
            <div 
              className="category-card hover-shopify"
              onClick={() => setActiveCategory("shopify")}
            >
              <div className="category-img-wrapper bg-purple-light">
                <img src={articleImages["shopify"]} alt="Shopify development" className="category-img" />
              </div>
              <h3 className="category-title">Shopify Development</h3>
              <p className="category-desc">Theme customization and store optimization.</p>
              <span className="category-link text-purple">3 articles →</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
