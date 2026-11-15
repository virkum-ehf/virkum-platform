"use client";

import { useEffect, useRef } from "react";

import styles from "./ReadingProgress.module.css";

/** Reading progress for long pages, shown under the header. */
export function ReadingProgress() {
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    const sync = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
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
    <div className={styles.progress} aria-hidden="true">
      <i ref={barRef} className={styles.bar} />
    </div>
  );
}
