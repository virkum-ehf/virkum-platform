import { cn } from "@virkum/ui";
import type { ReactNode } from "react";

import styles from "./DocLayout.module.css";
import { TableOfContents } from "./TableOfContents";

export type DocSection = { title: string; content: ReactNode };

const sectionId = (index: number) => `s${index + 1}`;
const sectionNumber = (index: number) => String(index + 1).padStart(2, "0");

/** Numbered sections with a sticky table of contents (hidden on small screens). */
export function DocLayout({ sections }: { sections: DocSection[] }) {
  const entries = sections.map((section, i) => ({ section, id: sectionId(i), number: sectionNumber(i) }));
  const items = entries.map(({ section, id, number }) => ({ id, number, title: section.title }));

  return (
    <div className={cn("wrap", styles.doc)}>
      <aside className={styles.toc}>
        <TableOfContents items={items} />
      </aside>
      <div className={styles.body}>
        {entries.map(({ section, id, number }) => (
          <section key={id} id={id} className={cn(styles.section, "reveal")}>
            <p className={cn(styles.number, "num")}>{number}</p>
            <h2>{section.title}</h2>
            {section.content}
          </section>
        ))}
      </div>
    </div>
  );
}
