import type { Metadata } from "next";
import Link from "next/link";
import ScrollToTopOnMount from "./ScrollToTopOnMount";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page Not Found | Ingversions Digital",
  description: "The page you're looking for doesn't exist or may have moved.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <section className={styles.nfWrapper}>
      <ScrollToTopOnMount />
      <div className={styles.decor} aria-hidden="true">
        <span className={styles.shapeCircleTl} />
        <span className={styles.shapeSquareTr} />
        <span className={styles.shapeCircleBr} />
        <span className={styles.shapeSquareBl} />
      </div>
      <div className={styles.nfCard}>
        <h1 className={styles.nfTitle}>404</h1>
        <p className={styles.nfSubtitle}>The page you are looking for does not exist.</p>
        <Link href="/" className={styles.nfBtn}>Go Back Home</Link>
      </div>
    </section>
  );
}
