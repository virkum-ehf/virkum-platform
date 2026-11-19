"use client";

import { cn } from "@virkum/ui";
import { useEffect, useRef, useState } from "react";

import styles from "./Problem.module.css";

export type ProblemItem = { num: string; title: string; desc: string };

/** Highlights the item in the middle of the screen (not with reduced motion). */
export function ProblemList({ items }: { items: ProblemItem[] }) {
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [focus, setFocus] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = itemRefs.current.filter((item): item is HTMLLIElement => item !== null);
    if (nodes.length === 0) return;

    // A band around the middle of the screen. The row filling it most is the one in focus.
    // IntersectionObserver reports that without reading layout on every scroll frame.
    const ratios = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target, entry.intersectionRatio);
        let best = 0;
        let bestRatio = 0;
        nodes.forEach((node, index) => {
          const ratio = ratios.get(node) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = index;
          }
        });
        if (bestRatio === 0) return;
        setFocus((current) => (current === best ? current : best));
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [items.length]);

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
