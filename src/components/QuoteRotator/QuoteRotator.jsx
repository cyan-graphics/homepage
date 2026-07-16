"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const DISPLAY_TIME = 7000;
const FADE_TIME = 700;

function randomNextIndex(length, currentIndex) {
  if (length < 2) return 0;
  return (currentIndex + 1 + Math.floor(Math.random() * (length - 1))) % length;
}

export default function QuoteRotator({ quotes, styles }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (quotes.length < 2) return undefined;
    let swapTimer;
    const interval = window.setInterval(() => {
      setVisible(false);
      swapTimer = window.setTimeout(() => {
        setActiveIndex((current) => randomNextIndex(quotes.length, current));
        setVisible(true);
      }, FADE_TIME);
    }, DISPLAY_TIME);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(swapTimer);
    };
  }, [quotes.length]);

  if (quotes.length === 0) {
    return (
      <div className={styles.quoteFallback}>
        <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
        <blockquote>Words are where I keep the light.</blockquote>
      </div>
    );
  }

  const quote = quotes[activeIndex];
  return (
    <Link href={`/blog/${quote._id}`} className={`${styles.quoteLink} ${visible ? styles.quoteVisible : styles.quoteHidden}`} aria-label={`Read ${quote.title}`}>
      <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
      <blockquote>{quote.desc}</blockquote>
      <span className={styles.readMore}>Read the full piece <span aria-hidden="true">&rarr;</span></span>
    </Link>
  );
}
