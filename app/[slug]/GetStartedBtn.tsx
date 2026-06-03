"use client";

import Link from "next/link";
// Apna sahi path adjust kar lena
import { dl } from "../gtm"; 

export default function GetStartedBtn() {
  const handleGetStartedClick = () => {
    try {
      // "Get Started" ke liye Separate Event (gs tracking)
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
      href="https://ingversionsdigital.com/#hero"
      className="cta-button"
      onClick={handleGetStartedClick}
    >
      Get Started
    </Link>
  );
}