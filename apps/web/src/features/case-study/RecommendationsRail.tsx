"use client";

import { clamp01 } from "@virkum/basalt/math";
import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";

/** An ordered list with a rail beside it that fills as the visitor reads down the list. */
export function RecommendationsRail({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      list.style.setProperty("--k", "1");
      return;
    }
    let frame = 0;
    const sync = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      list.style.setProperty("--k", clamp01((window.innerHeight * 0.62 - rect.top) / rect.height).toFixed(3));
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
  }, []);

  return (
    <ol ref={ref} className={className} style={{ "--k": 0 } as CSSProperties}>
      {children}
    </ol>
  );
}
