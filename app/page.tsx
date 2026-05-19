import type { Metadata } from "next";
import BlogClient from "./components/BlogClient/BlogClient";

export const metadata: Metadata = {
  title: "CRO, A/B Testing & Shopify Development Blog | Ingversions",
  description: "Practical insights on conversion rate optimization, A/B testing methodologies, and Shopify development best practices. Learn from real case studies and client experiences. Join 2,000+ founders receiving actionable advice.",
  keywords: ["CRO", "conversion rate optimization", "A/B testing", "Shopify development", "eCommerce blog", "Shopify tips", "blog"],
  authors: [{ name: "Ingversions" }],
  openGraph: {
    type: "website",
    url: "https://blog.ingversionsdigital.com",
    title: "CRO, A/B Testing & Shopify Development Blog | Ingversions",
    description: "Practical insights on conversion rate optimization, A/B testing methodologies, and Shopify development best practices.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Ingversions Blog - CRO, A/B Testing & Shopify Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CRO, A/B Testing & Shopify Development Blog | Ingversions",
    description: "Practical insights on conversion rate optimization, A/B testing methodologies, and Shopify development best practices.",
    images: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop"],
  },
};

export default function BlogPage() {
  return (
    <>
      <BlogClient />
    </>
  );
}