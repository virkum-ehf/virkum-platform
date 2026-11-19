"use client";

import { useBasaltScene } from "@virkum/basalt/react";
import type { AiGridController, AiGroup } from "@virkum/basalt/types";
import { cn } from "@virkum/ui";
import { useRef, useState } from "react";

import styles from "./Market.module.css";

type AiStatProps = {
  eyebrow: string;
  lineStrong: string;
  lineMuted: string;
  lineAccent: string;
  sourceNote: string;
};

/** The first percentage in a sentence ("50%"), for the grid's key. */
const percentOf = (text: string) => text.match(/\d+\s?%/)?.[0] ?? "";

/**
 * "50% use AI, 14% have a policy": 100 columns, one per 1% of Icelandic companies.
 * Pointing at a part of the sentence lights exactly its columns.
 */
export function AiStat({ eyebrow, lineStrong, lineMuted, lineAccent, sourceNote }: AiStatProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [hot, setHot] = useState<AiGroup | null>(null);
  const { status, controllerRef } = useBasaltScene<AiGridController>(
    hostRef,
    async (host, signal) => {
      const { mountAiGridScene } = await import("@virkum/basalt/scenes/aiGrid");
      if (signal.aborted) return null;
      return mountAiGridScene(host);
    },
    { lazyMargin: "600px" },
  );

  const point = (group: AiGroup | null) => {
    setHot(group);
    controllerRef.current?.highlight(group);
  };

  const part = (group: AiGroup, text: string, className?: string) => (
    <span
      className={cn(styles.hot, className, hot && hot !== group && styles.faded)}
      onPointerEnter={() => point(group)}
      onPointerLeave={() => point(null)}
    >
      {text}
    </span>
  );

  return (
    <div className={styles.stat}>
      <div className={styles.copy}>
        <p className="t-label reveal">{eyebrow}</p>
        <p className={cn(styles.line, "reveal")}>
          {part("use", lineStrong)}
          {part("policy", lineMuted, styles.muted)}
          {part("gap", lineAccent, "accent")}
        </p>
        <p className={styles.source}>{sourceNote}</p>
      </div>
      <div className={cn(styles.grid, "reveal", status === "failed" && styles.gridFailed)}>
        <div ref={hostRef} className={styles.gridField} aria-hidden="true" />
        <div className={styles.key} aria-hidden="true">
          <span className={styles.keyUse}>
            <i />
            {percentOf(lineStrong)}
          </span>
          <span className={styles.keyPolicy}>
            <i />
            {percentOf(lineMuted)}
          </span>
        </div>
      </div>
    </div>
  );
}
