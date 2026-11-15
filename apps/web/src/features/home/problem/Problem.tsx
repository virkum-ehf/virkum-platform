import { Arrow, cn, noBreak } from "@virkum/ui";
import { getMessages, getTranslations } from "next-intl/server";

import { BookingLink } from "@/components/BookingLink";

import styles from "./Problem.module.css";
import { type ProblemItem, ProblemList } from "./ProblemList";

/** The problem: a sticky heading beside a list; the item in the middle of the screen is in focus. */
export async function Problem() {
  const t = await getTranslations("problemSection");
  const tCommon = await getTranslations("common");
  const messages = await getMessages();
  const items = (messages.problemSection as { items: ProblemItem[] }).items;

  return (
    <section className="section">
      <div className={cn("wrap", styles.grid)}>
        <header className={styles.head}>
          <div className={styles.sticky}>
            <p className="t-label reveal">{t("eyebrow")}</p>
            <h2 className="t-h1 reveal">{t("title")}</h2>
          </div>
        </header>
        <div className={styles.list}>
          <ProblemList items={items} />
          <div className={cn(styles.close, "reveal")}>
            <p>{noBreak(t("closingPrompt"))}</p>
            <BookingLink className="btn btn-primary">
              {tCommon("bookCall")}
              <Arrow />
            </BookingLink>
          </div>
        </div>
      </div>
    </section>
  );
}
