"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import styles from "./Consent.module.css";

// IDs come from env so only the Production deployment tracks anything.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;
const PRIVACY_URL = "https://ingversionsdigital.com/privacy-policy";
const KEY = "cookie-consent";
const EVENT = "cookie-consent-change";

const read = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};
const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
};
const choose = (value: "accepted" | "declined") => {
  try {
    localStorage.setItem(KEY, value);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
};

const Consent = () => {
  // server snapshot is "declined" so nothing loads or flashes before hydration
  const choice = useSyncExternalStore(subscribe, read, () => "declined");

  if (!GA_ID && !CLARITY_ID) return null;

  return (
    <>
      {choice === "accepted" && GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
      {choice === "accepted" && CLARITY_ID && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
        </Script>
      )}
      {choice === null && (
        <div className={styles.banner} role="dialog" aria-label="Cookie consent">
          <p className={styles.text}>
            We use analytics cookies (Google Analytics, Microsoft Clarity) to understand how the blog is used.{" "}
            <a href={PRIVACY_URL} target="_blank" rel="noreferrer">Privacy Policy</a>
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.decline} onClick={() => choose("declined")}>Decline</button>
            <button type="button" className={styles.accept} onClick={() => choose("accepted")}>Accept</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Consent;
