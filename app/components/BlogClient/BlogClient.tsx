"use client";

// ✅ STEP 1: useRef ko import mein add kiya
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "./BlogClient.css"; 
import { ctaClick, formSuccess, pageview } from "../../gtm"; 
import { blogData } from "../../Data/blogData"; 

const articleImages: Record<string, string> = {
  "cro": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
  "ab-testing": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
  "shopify": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
  "qa": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
};

const getCategorySlug = (categoryName: string) => {
  if (!categoryName) return "all";
  if (categoryName === "Shopify Development") return "shopify";
  if (categoryName === "A/B Testing") return "ab-testing";
  if (categoryName === "Quality Assurance") return "qa";
  if (categoryName === "CRO") return "cro";
  return categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
};

const articles = blogData.posts.map(post => ({
  ...post,
  categorySlug: getCategorySlug(post.category)
}));

const categories = [
  { id: "all", name: "All Posts", count: articles.length },
  { id: "cro", name: "CRO", count: articles.filter(a => a.categorySlug === "cro").length },
  { id: "ab-testing", name: "A/B Testing", count: articles.filter(a => a.categorySlug === "ab-testing").length },
  { id: "shopify", name: "Shopify Development", count: articles.filter(a => a.categorySlug === "shopify").length },
  { id: "qa", name: "Quality Assurance", count: articles.filter(a => a.categorySlug === "qa").length },
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
  coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop"
};

const categoryColors: Record<string, string> = {
  "CRO": "badge-cro",
  "A/B Testing": "badge-ab",
  "Shopify Development": "badge-shopify",
  "Quality Assurance": "badge-qa",
};

const categoryBorderColors: Record<string, string> = {
  "CRO": "border-hover-cro",
  "A/B Testing": "border-hover-ab",
  "Shopify Development": "border-hover-shopify",
  "Quality Assurance": "border-hover-qa",
};

export default function BlogClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // ✅ STEP 2: Scroll ke liye ref create kiya
  const topRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try { pageview(window.location.pathname, "Blog Index Page"); } catch (e) {}
  }, []);

  // ✅ STEP 3: Naya handler jo category set karega aur upar scroll karega
  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    
    // Smooth scroll to top of the blog section
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
      {/* ✅ STEP 4: Yahan par ref={topRef} lagaya taaki screen yahan scroll ho */}
      <section className="blog-section hero-section" ref={topRef}>
        <div className="container text-center">
          <h1 className="hero-title">
            Insights for <span className="text-highlight">Founders</span> Who Build
          </h1>
          <p className="hero-subtitle">
            Practical advice on conversion optimization, A/B testing, and Shopify development
          </p>

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

      {activeCategory === "all" && (
        <section className="blog-section py-8">
          <div className="container">
            <Link href={`/${featuredArticle.slug}`} className="block-link">
              <div className="featured-card">
                <div className="featured-layout">
                  <div className="featured-image-container">
                    <img src={featuredArticle.coverImage} alt="Checkout conversion" className="featured-image" />
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

      <section className="blog-section py-8">
        <div className="container">
          <div className="grid-header">
            <h2 className="section-title">
              {activeCategory === "all" ? "Latest Articles" : categories.find(c => c.id === activeCategory)?.name}
            </h2>
            <span className="article-count">{filteredArticles.length} articles</span>
          </div>

          <div className="articles-grid">
            {filteredArticles.map((article: any) => (
              <Link key={article.id} href={`/${article.slug}`} className="block-link">
                <article className={`article-card ${categoryBorderColors[article.category]}`}>
                  <div className="article-img-wrapper">
                    <img 
                      src={article.coverImage || articleImages[article.categorySlug]} 
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

      <section className="blog-section py-12">
        <div className="container">
          <h2 className="section-title-center">Browse by Category</h2>
          <div className="categories-grid">
            
            {/* ✅ STEP 5: Yahan sabhi onClick mein naya handleCategoryClick pass kiya */}
            <div 
              className="category-card hover-cro"
              onClick={() => handleCategoryClick("cro")}
            >
              <div className="category-img-wrapper bg-green-light">
                <img src={articleImages["cro"]} alt="CRO analytics" className="category-img" />
              </div>
              <h3 className="category-title">CRO</h3>
              <p className="category-desc">Conversion rate optimization strategies and best practices.</p>
              <span className="category-link text-green">{categories.find(c => c.id === "cro")?.count} articles →</span>
            </div>

            <div 
              className="category-card hover-ab"
              onClick={() => handleCategoryClick("ab-testing")}
            >
              <div className="category-img-wrapper bg-orange-light">
                <img src={articleImages["ab-testing"]} alt="A/B testing" className="category-img" />
              </div>
              <h3 className="category-title">A/B Testing</h3>
              <p className="category-desc">Testing methodologies and statistical significance.</p>
              <span className="category-link text-orange">{categories.find(c => c.id === "ab-testing")?.count} articles →</span>
            </div>

            <div 
              className="category-card hover-shopify"
              onClick={() => handleCategoryClick("shopify")}
            >
              <div className="category-img-wrapper bg-purple-light">
                <img src={articleImages["shopify"]} alt="Shopify development" className="category-img" />
              </div>
              <h3 className="category-title">Shopify Development</h3>
              <p className="category-desc">Theme customization and store optimization.</p>
              <span className="category-link text-purple">{categories.find(c => c.id === "shopify")?.count} articles →</span>
            </div>
            
            <div 
              className="category-card hover-qa"
              onClick={() => handleCategoryClick("qa")}
            >
              <div className="category-img-wrapper bg-blue-light">
                <img src={articleImages["qa"]} alt="Quality Assurance" className="category-img" />
              </div>
              <h3 className="category-title">Quality Assurance</h3>
              <p className="category-desc">Automated testing, checklists, and performance tracking.</p>
              <span className="category-link text-blue">{categories.find(c => c.id === "qa")?.count} articles →</span>
            </div>
            
          </div>
        </div>
      </section>
    </main>
  );
}