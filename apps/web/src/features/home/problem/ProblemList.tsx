"use client";

import { cn } from "@virkum/ui";
import { useEffect, useRef, useState } from "react";

import styles from "./Problem.module.css";

export type ProblemItem = { num: string; title: string; desc: string };

/** Highlights the item closest to the middle of the screen (not with reduced motion). */
export function ProblemList({ items }: { items: ProblemItem[] }) {
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [focus, setFocus] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const sync = () => {
      frame = 0;
      const middle = window.innerHeight * 0.5;
      let best = 0;
      let bestDistance = Infinity;
      itemRefs.current.forEach((item, i) => {
        if (!item) return;
        const rect = item.getBoundingClientRect();
        const distance = Math.abs((rect.top + rect.bottom) / 2 - middle);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });
      setFocus(best);
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
    <ol className={cn(focus !== null && styles.tracking)}>
      {items.map((item, i) => (
        <li
          key={item.num}
          ref={(element) => {
            itemRefs.current[i] = element;
          }}
          className={cn("reveal", styles.item, focus === i && styles.focus)}
        >
          <span className={cn("num", styles.num)} aria-hidden="true">
            {item.num}
          </span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
