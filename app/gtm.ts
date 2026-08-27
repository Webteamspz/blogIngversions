export const GTM_ID = "GTM-P5BGX7H7";

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

export const dl = () => {
  if (typeof window === "undefined") return [];

  window.dataLayer = window.dataLayer || [];

  return window.dataLayer;
};

const now = () => new Date().toISOString();

export function pageview(
  path = window.location.pathname +
    window.location.search +
    window.location.hash,

  title = document.title,
) {
  if (typeof window === "undefined") return;

  dl().push({
    event: "virtual_pageview",

    page_path: path,

    page_title: title,

    page_location: window.location.href,

    page_referrer: document.referrer || null,

    ts: now(),
  });
}

export function ctaClick({
  label,
  location: loc,
  href,
}: {
  label: string;
  location: string;
  href: string;
}) {
  if (typeof window === "undefined") return;

  dl().push({
    event: "cta_click",

    cta_label: (label || "").slice(0, 120),

    cta_location: loc || "unknown",

    cta_href: href || null,

    ts: now(),
  });
}

