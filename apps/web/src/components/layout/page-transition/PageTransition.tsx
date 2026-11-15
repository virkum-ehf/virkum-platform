"use client";

import { cn } from "@virkum/ui";
import { usePathname } from "next/navigation";
import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";

import styles from "./PageTransition.module.css";

const COLUMNS = 14;
const MINT_COLUMN = 9;
const DURATION_MS = 1000;

// useLayoutEffect warns during server rendering; this component only animates on the client.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Page transition: after a client-side navigation the new page starts covered by navy
 * columns (one mint), which then fall away. Nothing shows on the first load or with
 * reduced motion, and links are never delayed.
 */
export function PageTransition() {
  const pathname = usePathname();
  const previous = useRef(pathname);
  const [phase, setPhase] = useState<"idle" | "covered" | "revealing">("idle");

  // Cover before the new page paints, so it is never seen uncovered.
  useIsomorphicLayoutEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPhase("covered");
  }, [pathname]);

  useEffect(() => {
    if (phase === "covered") {
      const frame = requestAnimationFrame(() => requestAnimationFrame(() => setPhase("revealing")));
      return () => cancelAnimationFrame(frame);
    }
    if (phase === "revealing") {
      const timer = window.setTimeout(() => setPhase("idle"), DURATION_MS);
      return () => window.clearTimeout(timer);
    }
  }, [phase]);

  if (phase === "idle") return null;

  return (
    <div className={cn(styles.curtain, phase === "revealing" && styles.revealing)} aria-hidden="true">
      {Array.from({ length: COLUMNS }, (_, i) => (
        <i
          key={i}
          className={cn(styles.column, i === MINT_COLUMN && styles.mint)}
          style={{ "--i": i } as CSSProperties}
        />
      ))}
    </div>
  );
}
