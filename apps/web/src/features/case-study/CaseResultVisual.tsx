"use client";

import { useBasaltScene } from "@virkum/basalt/react";
import { cn, Columns } from "@virkum/ui";
import { useRef } from "react";

import styles from "./CaseStudy.module.css";

/** Flat rising columns, shown when WebGL is not available. */
function RisingColumns() {
  return (
    <Columns
      heights={[40, 48, 46, 58, 66, 62, 78, 92, 132]}
      colors={["#2A3C93", "#2D44A3", "#2D44A3", "#3150B8", "#3150B8", "#3150B8", "#3559D0", "#3A62E6", "#2EE6A8"]}
      width={26}
      gap={9}
      rise
      step={60}
      late={{ 8: 260 }}
    />
  );
}

/** The result panel's 3D field: columns rising to the mint one (cursor lifts, click ripples). */
export function CaseResultVisual() {
  const hostRef = useRef<HTMLDivElement>(null);
  const { status } = useBasaltScene(
    hostRef,
    async (host, signal) => {
      const { mountCaseStudyScene } = await import("@virkum/basalt/scenes/caseStudy");
      if (signal.aborted) return null;
      return mountCaseStudyScene(host);
    },
    { lazyMargin: "600px" },
  );

  if (status === "failed") {
    return (
      <div className={cn(styles.viz, "rise")} aria-hidden="true">
        <RisingColumns />
      </div>
    );
  }
  return (
    <div className={styles.viz} aria-hidden="true">
      <div ref={hostRef} className={styles.field} />
    </div>
  );
}
