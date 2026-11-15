"use client";

import { useBasaltScene } from "@virkum/basalt/react";
import { cn } from "@virkum/ui";
import { COMPACT_QUERY, useMediaQuery } from "@virkum/ui/client";
import { useRef } from "react";

import { Silhouette } from "./Silhouette";
import styles from "./SiteFooter.module.css";

/** 3D row of columns under the call to action; they rise where the cursor is. */
export function FooterSkyline() {
  const hostRef = useRef<HTMLDivElement>(null);
  const compact = useMediaQuery(COMPACT_QUERY);
  const { status } = useBasaltScene(
    hostRef,
    async (host, signal) => {
      const region = host.closest<HTMLElement>("[data-skyline-region]") ?? host;
      const { mountSkylineScene } = await import("@virkum/basalt/scenes/skyline");
      if (signal.aborted) return null;
      return mountSkylineScene(host, { region, compact });
    },
    // The footer is on every page; load its scene only when a visitor scrolls near it.
    { key: compact ? "compact" : "wide", lazyMargin: "600px" },
  );

  if (status === "failed") {
    return (
      <div className={cn(styles.silhouette, "rise")}>
        <Silhouette />
      </div>
    );
  }
  return <div ref={hostRef} className={styles.skyline} aria-hidden="true" />;
}
