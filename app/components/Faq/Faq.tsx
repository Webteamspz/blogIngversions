"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Faq.module.css";

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionItemProps {
  index: number;
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: (index: number) => void;
}

const FaqAccordionItem = ({ index, q, a, isOpen, onToggle }: FaqAccordionItemProps) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (bodyRef.current) {
      setMaxHeight(isOpen ? `${bodyRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (bodyRef.current && isOpen) {
        setMaxHeight(`${bodyRef.current.scrollHeight}px`);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  return (
    <div className={`${styles.accordionItem} ${isOpen ? styles.open : ""}`}>
      <button
        className={styles.accordionItemHeader}
        onClick={() => onToggle(index)}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        id={`faq-button-${index}`}
      >
        <span>{q}</span>
        <span className={styles.accordionItemIcon} aria-hidden="true" />
      </button>
      <div
        id={`faq-panel-${index}`}
        role="region"
        aria-labelledby={`faq-button-${index}`}
        className={styles.accordionItemBody}
        ref={bodyRef}
        style={{ maxHeight }}
      >
        <div className={styles.accordionItemBodyContent}>{a}</div>
      </div>
    </div>
  );
};

interface FaqProps {
  items: FaqItem[];
}

const Faq = ({ items }: FaqProps) => {
  const [openIndex, setOpenIndex] = useState(-1);
  const handleToggle = (i: number) => setOpenIndex((cur) => (cur === i ? -1 : i));

  return (
    <div className={styles.accordion}>
      {items.map((it, i) => (
        <FaqAccordionItem
          key={i}
          index={i}
          q={it.q}
          a={it.a}
          isOpen={openIndex === i}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
};

export default Faq;