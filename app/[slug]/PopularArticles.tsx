"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import styles from "./PopularArticles.module.css";
import articleStyles from "./ArticleDetail.module.css";

import { blogData } from "../data/blogData";

// Sourced from blogData.posts — the single list every blog (markdown + structured)
// is registered in, so new posts appear here automatically once added there.
function getMostPopularArticles(currentSlug: string, limit = 5) {
  return blogData.posts
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export default function PopularArticles({ currentSlug }: { currentSlug: string }) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const popularArticles = getMostPopularArticles(currentSlug, 5);

  if (popularArticles.length === 0) return null;

  return (
    <section className={styles["popular-section"]}>
      <h3 className={styles["popular-title"]}>Most Popular Articles</h3>

      <div className={styles["popular-slider-wrapper"]}>
        <button
          className={`${styles["popular-nav"]} ${styles["popular-prev"]}`}
          ref={prevRef}
          aria-label="Previous article"
        >
          <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
        </button>

        <button
          className={`${styles["popular-nav"]} ${styles["popular-next"]}`}
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
          navigation
          onBeforeInit={(swiper) => {
            const nav = swiper.params.navigation;
            if (nav && typeof nav !== "boolean") {
              nav.prevEl = prevRef.current;
              nav.nextEl = nextRef.current;
            }
          }}
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
          className={styles["popular-swiper"]}
        >
          {popularArticles.map((article) => (
            <SwiperSlide key={article.slug} className={styles["popular-slide"]}>
              <Link href={`/${article.slug}`} className={styles["popular-card-link"]}>
                <article className={styles["popular-card"]}>
                  <div className={styles["popular-img-wrapper"]}>
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
                      className={styles["popular-img"]}
                    />
                    <span className={`${articleStyles["article-badge"]} ${styles["popular-badge"]}`}>
                      {article.category}
                    </span>
                  </div>
                  <div className={styles["popular-content"]}>
                    <h4 className={styles["popular-card-title"]}>{article.title}</h4>
                    <div className={styles["popular-meta"]}>
                      <span>{article.date}</span>
                      <span className={styles["popular-meta-dot"]}>•</span>
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