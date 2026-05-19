"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./Preloader.module.css";

interface PreloaderProps {
  minDuration?: number;
  logoSrc?: string;
  children: React.ReactNode; // Ab yeh component website ke content ko bhi accept karega
}

export default function Preloader({ minDuration = 1200, logoSrc, children }: PreloaderProps) {
  const [showPreloader, setShowPreloader] = useState(false);
  const [visible, setVisible] = useState(true);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    // Check if preloader was already shown
    const hasSeenPreloader = localStorage.getItem("hasSeenPreloader");

    if (!hasSeenPreloader) {
      setShowPreloader(true);
      
      const onLoad = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const wait = Math.max(minDuration - elapsed, 0);
        
        const t = setTimeout(() => {
          setVisible(false);
          localStorage.setItem("hasSeenPreloader", "true");
        }, wait);
        
        return () => clearTimeout(t);
      };

      if (document.readyState === "complete") {
        onLoad();
      } else {
        window.addEventListener("load", onLoad);
        return () => window.removeEventListener("load", onLoad);
      }
    }
  }, [minDuration]);

  return (
    <>
      {/* Agar preloader dikhana hai, toh yeh UI render hoga */}
      {showPreloader && visible && (
        <div className={styles.overlay} role="status" aria-live="polite" aria-label="Loading">
          <div className={styles.wrapper}>
            {logoSrc && <img className={styles.logo} src={logoSrc} alt="Loading" />}
          </div>
        </div>
      )}
      
      {/* Preloader ke piche/baad aapki website render hogi */}
      {children}
    </>
  );
}