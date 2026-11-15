import { cn, noBreak, splitTick } from "@virkum/ui";
import { getTranslations } from "next-intl/server";

import { BookingLink } from "@/components/BookingLink";
import { Logo } from "@/components/brand/Logo";
import { CONTACT_EMAIL } from "@/config/site";
import { Link } from "@/i18n/navigation";

import { FooterSkyline } from "./FooterSkyline";
import styles from "./SiteFooter.module.css";

const SOURCES_URL = "https://stadagervigreindar.is/kafli-2";

/** Call to action with the 3D skyline, then contact details and legal notes. */
export async function SiteFooter() {
  const t = await getTranslations("ctaFooter");
  const bullets = [t("bullet1"), t("bullet2"), t("bullet3")].map(splitTick);

  return (
    <footer className={cn(styles.footer, "on-dark")}>
      <div className={styles.main} data-skyline-region>
        <div className={cn("wrap", styles.grid)}>
          <div className={styles.copy}>
            <h2 className={cn(styles.title, "reveal")}>
              {t("titleLine1")}
              <span className="accent">{t("titleLine2")}</span>
            </h2>
            <p className={cn(styles.body, "reveal")}>{noBreak(t("body"))}</p>
            <ul className={cn(styles.ticks, "reveal")}>
              {bullets.map((bullet) => (
                <li key={bullet.text}>
                  {bullet.tick && (
                    <span className={styles.tick} aria-hidden="true">
                      ✓
                    </span>
                  )}{" "}
                  {bullet.text}
                </li>
              ))}
            </ul>
          </div>
          <div className={cn(styles.action, "reveal")}>
            <BookingLink className="btn btn-mint">{t("bookCall")}</BookingLink>
          </div>
        </div>
        <FooterSkyline />
      </div>

      <div className="wrap">
        <div className={styles.columns}>
          <div>
            <Logo variant="onDark" height={38} className={styles.logo} decorative />
            <p>
              <strong className={styles.company}>{t("companyName")}</strong>
            </p>
            <p className={styles.blurb}>{t("companyBlurb")}</p>
          </div>
          <div>
            <h3 className={styles.heading}>{t("contactHeading")}</h3>
            <ul>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
              <li>{t("location")}</li>
            </ul>
          </div>
          <div>
            <h3 className={styles.heading}>{t("companyHeading")}</h3>
            <ul>
              <li>{t("kennitala")}</li>
              <li>
                <Link href="/personuvernd">{t("privacy")}</Link>
              </li>
              <li>
                <Link href="/namskeid">{t("courses")}</Link>
              </li>
              <li>
                <Link href="/blogg">{t("blog")}</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.legal}>
          <p>
            {t("sourcesBefore")}
            <a href={SOURCES_URL} target="_blank" rel="noopener noreferrer">
              {t("sourcesChapter")}
            </a>
            {t("sourcesAfter")}
          </p>
          <p>
            © {new Date().getFullYear()} Virkum ehf. · {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
