"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Apne paths ke hisaab se in imports ko adjust kar lena
import { blogData as data } from "../../Data/blogData";
import styles from "./Header.module.css";

const HamburgerIcon = (props: any) => (
  <svg width="48" height="49" viewBox="0 0 48 49" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
    <path d="M9 13.1221H27.75M9 24.6221H39M20.25 36.1221H39" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = (props: any) => (
  <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
    <path d="M26.5608 0.439274C25.9751 -0.146425 25.0255 -0.146425 24.4398 0.439274L13.5 11.3791L2.56024 0.439274C1.97456 -0.146425 1.02496 -0.146425 0.439275 0.439274C-0.146425 1.02496 -0.146425 1.97456 0.439275 2.56024L11.379 13.5L0.439305 24.4397C-0.146395 25.0255 -0.146395 25.975 0.439305 26.5608C1.02499 27.1464 1.97459 27.1464 2.56027 26.5608L13.5 15.621L24.4398 26.5608C25.0255 27.1464 25.9751 27.1464 26.5608 26.5608C27.1464 25.975 27.1464 25.0255 26.5608 24.4398L15.6209 13.5L26.5608 2.56024C27.1464 1.97456 27.1464 1.02496 26.5608 0.439274Z" fill="white"/>
  </svg>
);

const isExternalHref = (href = "") =>
  /^https?:\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");

export default function Header() {
  const { links, cta } = data.header;
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [ctaScrollMode, setCtaScrollMode] = useState(false);
  const [hideHeaderCta, setHideHeaderCta] = useState(false);

  const isTeamPage = pathname === "/teampage";
  const ctaHref = isTeamPage ? "/#contact" : cta.href;

  // Restore scroll mode from sessionStorage
  useEffect(() => {
    const flag = sessionStorage.getItem("ctaScrollMode");
    if (flag === "1") {
      setCtaScrollMode(true);
    }
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    document.body.classList.toggle("menu-open", open);

    return () => {
      document.documentElement.style.overflow = "";
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  // Scroll-based hide/show for CTA
  useEffect(() => {
    if (!ctaScrollMode) {
      setHideHeaderCta(false);
      return;
    }

    const handleScroll = () => {
      const contactEl = document.getElementById("contact");
      const headerEl = document.getElementById("header");

      if (!contactEl || !headerEl) return;

      const headerHeight = headerEl.offsetHeight || 0;
      const rect = contactEl.getBoundingClientRect();
      const contactTopRelativeToViewport = rect.top - headerHeight;

      if (contactTopRelativeToViewport <= 0) {
        setHideHeaderCta(true);
        sessionStorage.removeItem("ctaScrollMode");
      } else {
        setHideHeaderCta(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ctaScrollMode]);

  const handleCtaClick = () => {
    if (ctaHref.includes("#contact")) {
      sessionStorage.setItem("ctaScrollMode", "1");
      setCtaScrollMode(true);
    }
  };

  const renderDesktopNavLink = (linkItem: any, index: number) => {
    const { href, label } = linkItem;

    if (href.startsWith("#") || isExternalHref(href)) {
      return (
        <a key={index} href={href}>
          {label}
        </a>
      );
    }

    return (
      <Link key={index} href={href}>
        {label}
      </Link>
    );
  };

  const renderMobileNavLink = (linkItem: any, index: number) => {
    const { href, label } = linkItem;

    if (href.startsWith("#") || isExternalHref(href)) {
      return (
        <a key={index} href={href} onClick={() => setOpen(false)}>
          {label}
        </a>
      );
    }

    return (
      <Link key={index} href={href} onClick={() => setOpen(false)}>
        {label}
      </Link>
    );
  };

  return (
    <header className={styles.siteHeader} id="header">
      <div className={`container ${styles.headerRow}`}>
        {/* Brand Logo */}
        <Link href="https://ingversionsdigital.com/" className={styles.brand}>
          <img 
            src="/logos/main-logo.png" 
            alt="Ingversions Logo" 
            className={`${styles.brandLogo} ${styles.desktopLogo}`} 
          />
          <img 
            src="/logos/mobile-logo.png" 
            alt="Ingversions Logo" 
            className={`${styles.brandLogo} ${styles.mobileLogoOnly}`} 
          />
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.nav}>
          {links.map((linkItem: any, index: number) => renderDesktopNavLink(linkItem, index))}
        </nav>

        {/* Header CTA Button */}
        {!hideHeaderCta &&
          (isExternalHref(ctaHref) || ctaHref.startsWith("#") ? (
            <a className={`btn ${styles.desktopCta}`} href={ctaHref} onClick={handleCtaClick}>
              {cta.label}
            </a>
          ) : (
            <Link className={`btn ${styles.desktopCta}`} href={ctaHref} onClick={handleCtaClick}>
              {cta.label}
            </Link>
          ))}

        {/* Simple & Clean Hamburger Button */}
        <button 
          className={styles.hamburger} 
          aria-label="Toggle menu" 
          aria-expanded={open} 
          onClick={() => setOpen(!open)} 
          type="button"
        >
          <HamburgerIcon className={styles.menuIcon} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`${styles.overlay} ${open ? styles.show : ""}`} 
        onClick={() => setOpen(false)} 
        aria-hidden="true" 
      />
      
      {/* Mobile Menu Drawer */}
      <aside 
        id="mobile-menu" 
        className={`${styles.mobileMenu} ${open ? styles.open : ""}`} 
        role="dialog" 
        aria-modal="true" 
        aria-label="Mobile menu"
      >
        <div className={styles.mobileHeader}>
          <button className={styles.closeBtn} aria-label="Close menu" onClick={() => setOpen(false)} type="button">
            <CloseIcon className={styles.closeIcon} />
          </button>
        </div>
        <div className={styles.menuBody}>
          <nav className={styles.mobileNav}>
            {links.map((linkItem: any, index: number) => renderMobileNavLink(linkItem, index))}
          </nav>
        </div>
      </aside>
    </header>
  );
}