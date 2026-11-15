import { Arrow, cn, countWords, RevealWords } from "@virkum/ui";
import { getMessages, getTranslations } from "next-intl/server";

import { BookingLink } from "@/components/BookingLink";
import { Link } from "@/i18n/navigation";

import { HeroStage } from "./HeroStage";
import styles from "./HomeHero.module.css";

type HeroMessages = { h1Line1: string; h1Middle: string; h1Accent: string; checks: string[] };

/** Full-screen hero over the 3D basalt field. The header is transparent over it. */
export async function HomeHero() {
  const t = await getTranslations("hero");
  const messages = await getMessages();
  const hero = messages.hero as HeroMessages;
  const lead = [hero.h1Line1, hero.h1Middle].filter(Boolean).join(" ").trim();
  const accent = hero.h1Accent.trim();

  return (
    <section className={cn(styles.hero, "on-dark")} data-header-overlay>
      <HeroStage>
        <p className={cn("t-label", styles.label, styles.enter)}>{t("badge")}</p>
        <h1 className={cn("t-display", styles.title)}>
          <span className="sr-only">{`${lead} ${accent}`}</span>
          <span aria-hidden="true">
            <RevealWords text={lead} />{" "}
            <span className={styles.accent}>
              <RevealWords text={accent} offset={countWords(lead)} />
            </span>
          </span>
        </h1>
        <p className={cn("t-lead", styles.lead, styles.enter)}>{t("heroDescription")}</p>
        <div className={cn(styles.actions, styles.enter)}>
          <BookingLink className="btn btn-mint">
            {t("ctaBook")}
            <Arrow />
          </BookingLink>
          <Link href="/sjalfsmat" className="btn btn-ghost-dark">
            {t("ctaAssessment")}
          </Link>
        </div>
      </HeroStage>

      <div className={styles.status}>
        <div className={cn("wrap", styles.statusInner)}>
          <ul>
            {hero.checks.map((check) => (
              <li key={check}>
                <span className={styles.dot} aria-hidden="true" />
                {check}
              </li>
            ))}
          </ul>
          <span className={styles.cue} aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
    </section>
  );
}
