"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import "./ScrollToTop.css";

export default function ScrollToTop() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`tsNav scrollTopBtn ${showScrollTop ? "scrollTopVisible" : "scrollTopHidden"}`}
      aria-label="Scroll to top"
    >
      <ArrowUp className="scrollTopArrow" size={20} strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
}