import { cn } from "@virkum/ui";
import { getMessages, getTranslations } from "next-intl/server";

import styles from "./Services.module.css";
import { type Step, StepsStory } from "./StepsStory";

/** "How we work": the three steps as a pinned scroll story beside a 3D panel. */
export async function Services() {
  const t = await getTranslations("serviceCards");
  const messages = await getMessages();
  const items = (messages.serviceCards as { items: Step[] }).items;

  return (
    <section id="thjonusta" className={cn(styles.services, "bg-frost")}>
      <StepsStory
        items={items}
        labels={{ featured: t("featuredPill"), duration: t("durationLabel"), book: t("bookCall") }}
        head={
          <header className={styles.head}>
            <p className="t-label reveal">{t("eyebrow")}</p>
            <h2 className="t-h1 reveal">{t("title")}</h2>
            <p className="t-lead reveal">{t("tagline")}</p>
          </header>
        }
      />
    </section>
  );
}
