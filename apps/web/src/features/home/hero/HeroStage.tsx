"use client";

import { clamp01 } from "@virkum/basalt/math";
import { useBasaltScene } from "@virkum/basalt/react";
import { cn } from "@virkum/ui";
import { COMPACT_QUERY, useMediaQuery } from "@virkum/ui/client";
import { type ReactNode, useRef } from "react";

import { HeroFallback } from "./HeroFallback";
import styles from "./HomeHero.module.css";

/**
 * The interactive part of the hero: the 3D field behind the copy. As the visitor scrolls,
 * the field settles into order and the copy fades and lifts away.
 */
export function HeroStage({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const compact = useMediaQuery(COMPACT_QUERY);

  const { status } = useBasaltScene(
    hostRef,
    async (host, signal) => {
      const section = host.closest("section") ?? host;
      const { mountHeroScene } = await import("@virkum/basalt/scenes/hero");
      if (signal.aborted) return null;
      return mountHeroScene(host, {
        section,
        compact,
        onProgress: (progress) => {
          const copy = copyRef.current;
          if (!copy) return;
          copy.style.opacity = progress > 0 ? String(1 - clamp01(progress * 1.6)) : "";
          copy.style.transform = progress > 0 ? `translate3d(0, ${(-70 * progress).toFixed(1)}px, 0)` : "";
        },
      });
    },
    { key: compact ? "compact" : "wide" },
  );

  return (
    <>
      <div ref={hostRef} className={styles.field} aria-hidden="true">
        {status === "failed" && <HeroFallback className={styles.fallback} />}
      </div>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={cn("wrap", styles.inner)}>
        <div ref={copyRef} className={styles.copy}>
          {children}
        </div>
      </div>
    </>
  );
}
