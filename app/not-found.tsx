import type { Metadata } from "next";
import Link from "next/link";
import ScrollToTopOnMount from "./ScrollToTopOnMount";
import "./not-found.css";

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
    <section className="nfWrapper">
      <ScrollToTopOnMount />
      <span className="nfBlob nfBlobOne" aria-hidden="true" />
      <span className="nfBlob nfBlobTwo" aria-hidden="true" />
      <span className="nfBlob nfBlobThree" aria-hidden="true" />
      <div className="nfCard">
        <h1 className="nfTitle">404</h1>
        <p className="nfSubtitle">The page you are looking for does not exist.</p>
        <Link href="/" className="nfBtn">Go Back Home</Link>
      </div>
    </section>
  );
}
