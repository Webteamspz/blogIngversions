"use client";

import { useEffect } from "react";
import { pageview } from "../gtm";

export default function ArticleTracker({
  title,
}: {
  title: string;
}) {
  useEffect(() => {
    try {
      pageview(
        window.location.pathname,
        `Article: ${title}`
      );
    } catch (e) {
      console.error("GTM Pageview Error:", e);
    }
  }, [title]);

  return null;
}