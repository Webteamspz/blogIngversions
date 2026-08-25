"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./PopularArticles.css";

import { articles } from "../data/articlesData";
import { blogData } from "../data/blogData";
import { homepageCategoryImages } from "../data/articleImages";

const categoryColors: Record<string, string> = {
  CRO: "badge-cro",
  "A/B Testing": "badge-ab",
  "Shopify Development": "badge-shopify",
  "Quality Assurance": "badge-qa",
  "UX Design": "badge-ux",
  Analytics: "badge-analytics",
};

// ✅ Build a slug -> coverImage lookup from the SAME data source
// the blog homepage (BlogClient.tsx) uses for its thumbnails.
const coverImageBySlug: Record<string, string> = Object.fromEntries(
  blogData.posts.map((post: any) => [post.slug, post.coverImage])
);

// ✅ Same resolution order as the homepage: post.coverImage first,
// then the 4-category fallback map, then a hard default.
function getHomepageThumbnail(slug: string, categorySlug: string) {
  return (
    coverImageBySlug[slug] ||
    homepageCategoryImages[categorySlug] ||
    homepageCategoryImages["cro"]
  );
}

function getMostPopularArticles(currentSlug: string, limit = 5) {
  const entries = Object.entries(articles)
    .filter(([slug]) => slug !== currentSlug)
    .map(([slug, article]: [string, any]) => ({ slug, ...article }));

  const hasViewData = entries.some((a) => typeof a.views === "number");

  const sorted = hasViewData
    ? entries.sort((a, b) => (b.views || 0) - (a.views || 0))
    : entries.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

  return sorted.slice(0, limit);
}

export default function PopularArticles({ currentSlug }: { currentSlug: string }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const popularArticles = getMostPopularArticles(currentSlug, 5);

  if (popularArticles.length === 0) return null;

  return (
    <section className="popular-section">
      <h3 className="popular-title">Most Popular Articles</h3>

      <div className="popular-slider-wrapper">
        <button
          className="popular-nav popular-prev"
          ref={prevRef}
          aria-label="Previous article"
        >
          <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
        </button>

        <button
          className="popular-nav popular-next"
          ref={nextRef}
          aria-label="Next article"
        >
          <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
        </button>

        <Swiper
          modules={[Navigation, Pagination, Autoplay, A11y]}
          speed={600}
          loop={popularArticles.length > 3}
          grabCursor
          spaceBetween={18}
          slidesPerView={1.15}
          onBeforeInit={(swiper) => {
            // @ts-ignore
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-ignore
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            0: { slidesPerView: 1.15, spaceBetween: 14 },
            640: { slidesPerView: 2, spaceBetween: 16 },
            900: { slidesPerView: 3, spaceBetween: 18 },
          }}
          className="popular-swiper"
        >
          {popularArticles.map((article: any) => (
            <SwiperSlide key={article.slug} className="popular-slide">
              <Link href={`/${article.slug}`} className="popular-card-link">
                <article className="popular-card">
                  <div className="popular-img-wrapper">
                    <img
                      src={getHomepageThumbnail(article.slug, article.categorySlug)}
                      alt={article.title}
                      className="popular-img"
                    />
                    <span
                      className={`article-badge popular-badge ${
                        categoryColors[article.category] || "badge-cro"
                      }`}
                    >
                      {article.category}
                    </span>
                  </div>
                  <div className="popular-content">
                    <h4 className="popular-card-title">{article.title}</h4>
                    <div className="popular-meta">
                      <span>{article.date}</span>
                      <span className="popular-meta-dot">•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </article>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}