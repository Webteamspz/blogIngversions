import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";

import "./globals.css";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "../app/components/ScrollToTop/ScrollToTop";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-outfit",
});
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
});

export const viewport: Viewport = {
  themeColor: "#fffdf5",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://blog.ingversionsdigital.com"),
  title: "Ingversions Blog",
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
    <html lang="en" className={`${outfit.variable} ${plusJakarta.variable}`}>
      <head>
        <Script src={`https://www.googletagmanager.com/gtm.js?id=GTM-P5BGX7H7`} strategy="afterInteractive" />
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              'gtm.start': new Date().getTime(),
              event: 'gtm.js'
            });
          `}
        </Script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      </head>

      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
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

        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P5BGX7H7"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <ScrollToTop />

        <Header />
        <main className="grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}