"use client";

import { clamp01 } from "@virkum/basalt/math";
import { Fragment, useEffect, useRef, useState } from "react";

import styles from "./Voice.module.css";

/** Words light up one by one as the quote moves up the screen (all lit with reduced motion). */
export function ScrubQuote({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.trim().split(/\s+/);
  const [lit, setLit] = useState(words.length);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const sync = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const progress = clamp01((window.innerHeight * 0.82 - rect.top) / (rect.height + window.innerHeight * 0.3));
      setLit(Math.round(progress * words.length * 1.15));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [words.length]);

  return (
    <p ref={ref} className={styles.quote}>
      {words.map((word, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className={i < lit ? styles.lit : styles.word}>{word}</span>
        </Fragment>
      ))}
    </p>
  );
}
