export const GTM_ID = "GTM-P5BGX7H7";

/* -----------------------------
   Window Types
------------------------------ */

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    __gtmInit?: boolean;
    __gtmFormSuccess?: (form: HTMLFormElement) => void;
  }
}

/* -----------------------------
   DataLayer Helper
------------------------------ */

export const dl = () => {
  if (typeof window === "undefined") return [];

  window.dataLayer = window.dataLayer || [];

  return window.dataLayer;
};

/* -----------------------------
   Helpers
------------------------------ */

const now = () => new Date().toISOString();

/* -----------------------------
   Page View Tracking
------------------------------ */

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

/* -----------------------------
   CTA Click Tracking
------------------------------ */

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

/* -----------------------------
   Form Submit Tracking
------------------------------ */

export function formSubmit({
  form_id,
  form_name,
}: {
  form_id: string;
  form_name: string;
}) {
  if (typeof window === "undefined") return;

  dl().push({
    event: "form_submit",

    form_id,

    form_name,

    ts: now(),
  });
}

/* -----------------------------
   Form Success Tracking
------------------------------ */

export function formSuccess({
  form_id,
  form_name,
}: {
  form_id: string;
  form_name: string;
}) {
  if (typeof window === "undefined") return;

  dl().push({
    event: "form_success",

    form_id,

    form_name,

    ts: now(),
  });
}

/* -----------------------------
   Observe Section Once
------------------------------ */

export function observeSectionOnce(
  el: HTMLElement | null,

  eventName: string,

  extra: Record<string, unknown> = {},

  threshold = 0.5,
) {
  if (typeof window === "undefined") return;

  if (!el || !eventName || (el as any).__gtmObserved) return;

  (el as any).__gtmObserved = true;

  const io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];

      if (entry?.isIntersecting && entry.intersectionRatio >= threshold) {
        dl().push({
          event: eventName,

          ...extra,

          ts: now(),
        });

        io.disconnect();
      }
    },

    {
      threshold: [threshold],
    },
  );

  io.observe(el);

  return () => io.disconnect();
}

/* -----------------------------
   Main GTM Init
------------------------------ */

export function initGTMTracking() {
  if (typeof window === "undefined") return;

  // Prevent double initialization
  if (window.__gtmInit) return;

  window.__gtmInit = true;

  /* -----------------------------
     SPA Pageview Tracking
  ------------------------------ */

  const firePV = () => {
    pageview();
  };

  ["pushState", "replaceState"].forEach((method) => {
    const original = (history as any)[method];

    (history as any)[method] = function (...args: any[]) {
      const result = original.apply(this, args);

      queueMicrotask(firePV);

      return result;
    };
  });

  window.addEventListener("popstate", firePV);

  window.addEventListener("hashchange", firePV);

  /* -----------------------------
     CTA Auto Tracking
  ------------------------------ */

  document.addEventListener("click", (e) => {
    const el = (e.target as Element).closest?.("[data-cta]");

    if (!el) return;

    const link = el.closest("a");

    ctaClick({
      label: el.getAttribute("data-cta") || (el.textContent || "").trim(),

      location: el.getAttribute("data-cta-loc") || "unknown",

      href:
        (link && link.getAttribute("href")) || el.getAttribute("href") || "",
    });
  });

  /* -----------------------------
     Form Submit Tracking
  ------------------------------ */

  document.addEventListener("submit", (e) => {
    const form = (e.target as Element).closest?.("form[data-gtm-form]");

    if (!form) return;

    const form_name = form.getAttribute("data-gtm-form") || "";

    const form_id = (form as HTMLFormElement).id || form_name || "form";

    formSubmit({
      form_id,
      form_name,
    });
  });

  /* -----------------------------
     Global Form Success Helper
  ------------------------------ */

  window.__gtmFormSuccess = (form: HTMLFormElement) => {
    if (!form) return;

    const form_name = form.getAttribute("data-gtm-form") || form.name || "form";

    const form_id = form.id || form_name;

    formSuccess({
      form_id,
      form_name,
    });
  };

  /* -----------------------------
     Scroll Depth Tracking
  ------------------------------ */

  const marks = new Set<number>();

  const thresholds = [25, 50, 75, 100];

  let ticking = false;

  const onScroll = () => {
    if (ticking) return;

    ticking = true;

    requestAnimationFrame(() => {
      const doc = document.documentElement;

      const total = doc.scrollHeight - doc.clientHeight;

      if (total > 0) {
        const percent = Math.min(
          100,

          Math.round(((window.scrollY || doc.scrollTop) / total) * 100),
        );

        thresholds.forEach((t) => {
          if (!marks.has(t) && percent >= t) {
            marks.add(t);

            dl().push({
              event: "scroll_depth",

              percent: t,

              ts: now(),
            });
          }
        });
      }

      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  onScroll();
}
