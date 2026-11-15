"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import styles from "./DocLayout.module.css";

export type TocItem = { id: string; number: string; title: string };

// useLayoutEffect warns during server rendering; the marker only moves on the client.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Contents for a document page. The entry of the section being read is highlighted
 * and a marker glides beside it. Links are plain anchors, so they work without scripts.
 */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const markerRef = useRef<HTMLSpanElement>(null);

  // The current section is the last one whose top has passed 35% of the screen height
  // (the first one while the page is above it). Works for scrolling and for jumps.
  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);
    const first = sections[0];
    if (!first) return;
    let frame = 0;
    const sync = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      let current = first.id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section.id;
      }
      setActive(current);
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
  }, [items]);

  useIsomorphicLayoutEffect(() => {
    const place = () => {
      const link = linkRefs.current[active];
      const marker = markerRef.current;
      if (!link || !marker) return;
      marker.style.transform = `translateY(${link.offsetTop}px)`;
      marker.style.height = `${link.offsetHeight}px`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  return (
    <nav className={styles.tocNav}>
      {items.map((item) => (
        <a
          key={item.id}
          ref={(node) => {
            linkRefs.current[item.id] = node;
          }}
          href={`#${item.id}`}
          className={styles.tocLink}
          aria-current={item.id === active ? "true" : undefined}
        >
          <span className={`${styles.tocNumber} num`}>{item.number}</span>
          {item.title}
        </a>
      ))}
      <span ref={markerRef} className={styles.marker} aria-hidden="true" />
    </nav>
  );
}
