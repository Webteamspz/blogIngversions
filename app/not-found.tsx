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
      <span className={`${styles.nfBlob} ${styles.nfBlobOne}`} aria-hidden="true" />
      <span className={`${styles.nfBlob} ${styles.nfBlobTwo}`} aria-hidden="true" />
      <span className={`${styles.nfBlob} ${styles.nfBlobThree}`} aria-hidden="true" />
      <div className={styles.nfCard}>
        <h1 className={styles.nfTitle}>404</h1>
        <p className={styles.nfSubtitle}>The page you are looking for does not exist.</p>
        <Link href="/" className={styles.nfBtn}>Go Back Home</Link>
      </div>
    </section>
  );
}
