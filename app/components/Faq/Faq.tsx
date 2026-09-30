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
  const [contentHeight, setContentHeight] = useState(0);
  const maxHeight = isOpen ? `${contentHeight}px` : "0px";

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const observer = new ResizeObserver(() => setContentHeight(body.scrollHeight));
    observer.observe(body.firstElementChild as Element);
    return () => observer.disconnect();
  }, []);

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