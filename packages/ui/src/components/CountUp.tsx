"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

import { clamp01, easeOutCubic } from "../lib/easing";
import { parseDisplayNumber } from "../lib/numbers";

const DURATION_MS = 1100;

// useLayoutEffect warns during server rendering; the count only runs in the browser.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type CountUpProps = {
  /** The figure as written in the copy, e.g. "1,592" or "50 m.kr./ár". */
  text: string;
  className?: string;
};

/**
 * Counts the first number in `text` up from zero once, when it scrolls into view,
 * keeping the original format. The server renders the final text; with reduced
 * motion (or without scripts) the final text is all anyone sees.
 */
export function CountUp({ text, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    const node = element?.firstChild;
    if (!element || !node || node.nodeType !== Node.TEXT_NODE) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const parsed = parseDisplayNumber(text);
    if (!parsed) return;

    // Start from zero before the figure is first painted (its block is still hidden by .reveal).
    node.nodeValue = parsed.format(0);
    let frame = 0;
    let start: number | null = null;
    const step = (time: number) => {
      start ??= time;
      const k = easeOutCubic(clamp01((time - start) / DURATION_MS));
      node.nodeValue = k >= 1 ? text : parsed.format(parsed.value * k);
      if (k < 1) frame = requestAnimationFrame(step);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        frame = requestAnimationFrame(step);
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      node.nodeValue = text;
    };
  }, [text]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
