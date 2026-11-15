import type { ReactNode } from "react";

import { cn } from "../../lib/cn";
import styles from "./PageHead.module.css";

type PageHeadProps = {
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  narrow?: boolean;
  className?: string;
};

/** Eyebrow, page title and lead paragraph, revealed on load. */
export function PageHead({ eyebrow, title, lead, narrow = false, className }: PageHeadProps) {
  return (
    <section className={cn("wrap", styles.head, narrow && styles.narrow, className)}>
      {eyebrow && <p className="t-label reveal">{eyebrow}</p>}
      <h1 className="t-h1 reveal">{title}</h1>
      {lead && <p className="t-lead reveal">{lead}</p>}
    </section>
  );
}
