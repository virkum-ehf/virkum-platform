import { Arrow, cn, initials } from "@virkum/ui";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { ScrubQuote } from "./ScrubQuote";
import styles from "./Voice.module.css";

/** A quote on navy whose words light up as it scrolls through the screen. */
export async function Voice() {
  const t = await getTranslations("marketContext");
  const stat = await getTranslations("aiStat");

  return (
    <section className={cn(styles.voice, "on-dark")}>
      <div className={cn("wrap", styles.grid)}>
        <p className={cn("t-label reveal", styles.label)}>{t("quoteEyebrow")}</p>
        <figure>
          <blockquote>
            <ScrubQuote text={t("quoteBody")} />
          </blockquote>
          <figcaption className={cn(styles.who, "reveal")}>
            <span className={styles.avatar} aria-hidden="true">
              {initials(t("quoteName"))}
            </span>
            <span>
              <strong>{t("quoteName")}</strong>
              <span>{t("quoteRole")}</span>
            </span>
          </figcaption>
        </figure>
        <div className={cn(styles.tie, "reveal")}>
          <p>{t("stepTie")}</p>
          <Link href="/gervigreind" className="link">
            {stat("policyLink")}
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
