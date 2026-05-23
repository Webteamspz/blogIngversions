import type { Metadata, Viewport } from "next";
import { Barlow } from "next/font/google";
import Script from "next/script";

import "./globals.css";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Preloader from "./components/Preloader/Preloader";

import GTMProvider from "./GTMProvider";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

// 1. Theme Color (Pehle meta tag mein tha, ab Next.js Viewport mein aayega)
export const viewport: Viewport = {
  themeColor: "#030303",
  width: "device-width",
  initialScale: 1,
};

// 2. Global Metadata: Favicons aur Manifest yahan add ho gaye hain
export const metadata: Metadata = {
  title: "Ingversions Digital",
  description: "Your trusted digital partner.",
  icons: {
    icon: [
      { url: "/logos/logo-48.png", sizes: "48x48", type: "image/png" },
      { url: "/logos/logo-96.png", sizes: "96x96", type: "image/png" },
      { url: "/logos/logo-192.png", sizes: "192x192", type: "image/png" },
      { url: "/logos/logo-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 3. Organization Schema (JSON-LD)
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ingversions Digital",
    alternateName: "Ingversions",
    url: "https://ingversionsdigital.com",
    logo: "https://ingversionsdigital.com/logos/logo-192.png",
    sameAs: [
      "https://in.linkedin.com/company/ingversions",
      "https://x.com/ingversions",
      "https://www.instagram.com/ingversions",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-8866167750",
      contactType: "customer service",
      email: "ingversionsdigital@gmail.com",
      areaServed: "Worldwide",
      availableLanguage: ["English", "Hindi"],
    },
  };

  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager Script (Aapka original) */}
        <Script
          src={`https://www.googletagmanager.com/gtm.js?id=GTM-P5BGX7H7`}
          strategy="afterInteractive"
        />

        {/* GTM Init (Aapka original) */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              'gtm.start': new Date().getTime(),
              event: 'gtm.js'
            });
          `}
        </Script>

        {/* Schema Markup Injector */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>

      <body className={`${barlow.className} flex flex-col min-h-screen`}>
        {/* Microsoft Clarity - Next.js Script format mein */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){
                  (c[a].q=c[a].q||[]).push(arguments)
                };
                t=l.createElement(r);
                t.async=1;
                t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];
                y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "wqx46kxwy8");
            `,
          }}
        />

        {/* GTM Provider */}
        <GTMProvider />

        {/* GTM NoScript (Aapka original) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P5BGX7H7"
            height="0"
            width="0"
            style={{
              display: "none",
              visibility: "hidden",
            }}
          />
        </noscript>

        <Preloader>
          <Header />
          <main className="grow">{children}</main>
          <Footer />
        </Preloader>
      </body>
    </html>
  );
}