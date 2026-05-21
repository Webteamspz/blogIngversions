import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Ingversions Digital",
  description: "Your trusted digital partner.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">

      <head>

        {/* Google Tag Manager Script */}
        <Script
          src={`https://www.googletagmanager.com/gtm.js?id=GTM-P5BGX7H7`}
          strategy="afterInteractive"
        />

        {/* GTM Init */}
        <Script
          id="gtm-init"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];

            window.dataLayer.push({
              'gtm.start': new Date().getTime(),
              event: 'gtm.js'
            });
          `}
        </Script>

      </head>

      <body
        className={`${barlow.className} flex flex-col min-h-screen`}
      >

        {/* GTM Provider */}
        <GTMProvider />

        {/* GTM NoScript */}
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

          <main className="grow">
            {children}
          </main>

          <Footer />

        </Preloader>

      </body>
    </html>
  );
}