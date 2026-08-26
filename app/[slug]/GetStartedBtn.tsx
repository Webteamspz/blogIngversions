"use client";

import Link from "next/link";
import { dl } from "../gtm";
import styles from "./ArticleDetail.module.css";

export default function GetStartedBtn() {
  const handleGetStartedClick = () => {
    try {
      dl().push({
        event: "get_started",
        button_location: "Article Bottom CTA",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn("GTM Get Started Event Error:", error);
    }
  };

  return (
    <Link
      href="https://calendly.com/ingversionsdigital/30min?month=2025-10"
      className={styles["cta-button"]}
      onClick={handleGetStartedClick}
    >
      Get Started
    </Link>
  );
}