"use client";

import { cn, initials } from "@virkum/ui";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";

import styles from "./Testimonials.module.css";

/** Arrow keys move between tabs (WAI-ARIA tabs pattern). */
const KEY_STEPS: Partial<Record<string, number>> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

export type Quote = { name: string; company: string; quote: string };

type QuoteTabsProps = {
  quotes: Quote[];
  marks: { open: string; close: string };
  /** Accessible name of the tab list. */
  label: string;
};

/**
 * Accessible tabs. Until the visitor picks one, the quotes advance every 7 seconds
 * (a CSS animation on the active tab's bar; it pauses on hover and off screen).
 */
export function QuoteTabs({ quotes, marks, label }: QuoteTabsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(false);
  const [inView, setInView] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry?.isIntersecting ?? false;
      setInView(visible);
      // Restart the timer when the quotes come back into view.
      if (visible) setCycle((value) => value + 1);
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const select = (next: number, byUser: boolean) => {
    setIndex(next);
    if (byUser) setPicked(true);
    setCycle((value) => value + 1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = KEY_STEPS[event.key];
    let next: number | null = step === undefined ? null : (index + step + quotes.length) % quotes.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = quotes.length - 1;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
    tabRefs.current[next]?.focus();
  };

  return (
    <div ref={rootRef} className={cn(styles.quotes, "reveal", !inView && styles.paused)}>
      <div className={styles.stage}>
        {quotes.map((quote, i) => (
          <figure
            key={quote.name}
            role="tabpanel"
            id={`quote-panel-${i}`}
            aria-labelledby={`quote-tab-${i}`}
            aria-hidden={i !== index}
            className={cn(styles.panel, i === index && styles.panelActive)}
          >
            <blockquote>
              <p>
                {marks.open}
                {quote.quote}
                {marks.close}
              </p>
            </blockquote>
          </figure>
        ))}
      </div>

      <div className={styles.tabs} role="tablist" aria-label={label}>
        {quotes.map((quote, i) => {
          const selected = i === index;
          return (
            <button
              key={quote.name}
              ref={(element) => {
                tabRefs.current[i] = element;
              }}
              type="button"
              role="tab"
              id={`quote-tab-${i}`}
              aria-controls={`quote-panel-${i}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              className={styles.tab}
              onClick={() => select(i, true)}
              onKeyDown={onKeyDown}
            >
              <span className={styles.avatar} aria-hidden="true">
                {initials(quote.name)}
              </span>
              <span className={styles.who}>
                <strong>{quote.name}</strong>
                <span>{quote.company}</span>
              </span>
              {selected && (
                <i
                  key={cycle}
                  className={cn(styles.bar, picked ? styles.barFull : styles.barTimer)}
                  aria-hidden="true"
                  onAnimationEnd={() => select((index + 1) % quotes.length, false)}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
