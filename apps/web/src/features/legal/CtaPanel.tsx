import { cn, CutCorner } from "@virkum/ui";
import type { ReactNode } from "react";

import styles from "./CtaPanel.module.css";

type CtaPanelProps = {
  title: string;
  body: string;
  /** The panel's one filled button. */
  action: ReactNode;
  className?: string;
};

/** Frost panel with the cut corner: a closing call to action for a page. */
export function CtaPanel({ title, body, action, className }: CtaPanelProps) {
  return (
    <CutCorner className={cn("reveal", className)} bodyClassName={styles.body}>
      <div className={styles.copy}>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <div className={styles.action}>{action}</div>
    </CutCorner>
  );
}
