import { cn } from "@virkum/ui";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

import { type Quote, QuoteTabs } from "./QuoteTabs";
import styles from "./Testimonials.module.css";

/** Testimonials: the people are tabs; the quotes advance on their own until one is picked. */
export async function Testimonials() {
  const t = await getTranslations("testimonials");
  const locale = await getLocale();
  const messages = await getMessages();
  const { featured, cards } = messages.testimonials as { featured: Quote; cards: Quote[] };
  const marks = locale === "is" ? { open: "„", close: "“" } : { open: "“", close: "”" };

  return (
    <section className={cn("section bg-frost")}>
      <div className="wrap">
        <header className={styles.head}>
          <p className="t-label reveal">{t("eyebrow")}</p>
          <h2 className="t-h1 reveal">{t("title")}</h2>
        </header>
        <QuoteTabs quotes={[featured, ...cards]} marks={marks} label={t("eyebrow")} />
      </div>
    </section>
  );
}
