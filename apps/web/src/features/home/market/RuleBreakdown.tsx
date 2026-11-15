"use client";

import { cn } from "@virkum/ui";
import { type CSSProperties, useState } from "react";

import styles from "./Market.module.css";

export type RuleGroup = {
  group: 1 | 2 | 3;
  columns: number;
  percent: string;
  title: string;
  body: string;
};

/** The 10/20/70 bar and its cards: pointing at one lifts the matching columns and card. */
export function RuleBreakdown({ groups }: { groups: RuleGroup[] }) {
  const [hot, setHot] = useState<number | null>(null);
  const groupClass = { 1: styles.g1, 2: styles.g2, 3: styles.g3 };

  // Grid column where each label starts (1-based), and one entry per column (20 × 5%).
  const labels = groups.map((g, i) => ({
    ...g,
    start: 1 + groups.slice(0, i).reduce((sum, previous) => sum + previous.columns, 0),
  }));
  const columns = groups.flatMap((g) => Array.from({ length: g.columns }, () => g.group));

  return (
    <>
      <div
        className={cn(styles.bar, "rise", hot !== null && styles.hasHot)}
        style={{ "--step": "38ms" } as CSSProperties}
        aria-hidden="true"
        onPointerLeave={() => setHot(null)}
      >
        {labels.map((g) => (
          <b
            key={`label-${g.group}`}
            className={cn("cf", hot === g.group && styles.isHot)}
            style={
              { gridColumn: `${g.start} / span ${g.columns}`, "--d": `${(g.start - 1) * 40 + 200}ms` } as CSSProperties
            }
            onPointerEnter={() => setHot(g.group)}
          >
            {g.percent}
          </b>
        ))}
        {columns.map((group, i) => (
          <i
            key={`col-${i}`}
            className={cn(styles.col, groupClass[group], "cr", hot === group && styles.isHot)}
            style={{ "--i": i } as CSSProperties}
            onPointerEnter={() => setHot(group)}
          />
        ))}
      </div>

      <div className={cn(styles.cards, hot !== null && styles.hasHot)}>
        {groups.map((g) => (
          <article
            key={g.group}
            className={cn("reveal", styles.card, groupClass[g.group], hot === g.group && styles.isHot)}
            onPointerEnter={() => setHot(g.group)}
            onPointerLeave={() => setHot(null)}
          >
            <p className={styles.pct}>{g.percent}</p>
            <h3>{g.title}</h3>
            <p>{g.body}</p>
          </article>
        ))}
      </div>
    </>
  );
}
