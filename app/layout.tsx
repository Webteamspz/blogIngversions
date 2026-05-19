import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";

// 1. Sahi Imports (Check karo ki PreloaderWrapper sahi jagah se import ho)
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Preloader from "./components/Preloader/Preloader"; 

const barlow = Barlow({ 
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"] 
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
      <body className={`${barlow.className} flex flex-col min-h-screen`}>
        
        {/* 2. Yahan PreloaderWrapper use karna hai, Preloader nahi! */}
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