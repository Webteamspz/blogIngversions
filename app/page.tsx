import type { Metadata } from "next";
import BlogClient from "./components/BlogClient/BlogClient";

export const metadata: Metadata = {
  title: "Blog Page",
  description:
    "Practical insights on conversion rate optimization, A/B testing methodologies, and Shopify development best practices. Learn from real case studies and client experiences. Join 2,000+ founders receiving actionable advice.",
  keywords: [
    "CRO",
    "conversion rate optimization",
    "A/B testing",
    "Shopify development",
    "eCommerce blog",
    "Shopify tips",
    "blog",
  ],
  authors: [{ name: "Ingversions" }],
  alternates: {
    canonical: "https://blog.ingversionsdigital.com/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://blog.ingversionsdigital.com",
    title: "CRO, A/B Testing & Shopify Development Blog | Ingversions",
    description:
      "Practical insights on conversion rate optimization, A/B testing methodologies, and Shopify development best practices.",
    images: [
      {
        url: "/assets/blog/covers/photo-1460925895917-afdab827c52f.jpg",
        width: 1200,
        height: 630,
        alt: "Ingversions Blog - CRO, A/B Testing & Shopify Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CRO, A/B Testing & Shopify Development Blog | Ingversions",
    description:
      "Practical insights on conversion rate optimization, A/B testing methodologies, and Shopify development best practices.",
    images: ["/assets/blog/covers/photo-1460925895917-afdab827c52f.jpg"],
    site: "@ingversions",
  },
};

export default function BlogPage() {
  return (
    <>
      <BlogClient />
    </>
  );
}