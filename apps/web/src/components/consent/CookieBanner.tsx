"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useCookieConsent } from "@/components/consent/ConsentProvider";
import { Link } from "@/i18n/navigation";

import styles from "./CookieBanner.module.css";

/** Appears shortly after the first visit; Accept and Reject carry the same weight. */
export function CookieBanner() {
  const t = useTranslations("cookieBanner");
  const { consent, saveConsent } = useCookieConsent();
  const needsChoice = consent.status === "needs-choice";
  const [delayPassed, setDelayPassed] = useState(false);

  useEffect(() => {
    if (!needsChoice) return;
    const timer = setTimeout(() => setDelayPassed(true), 600);
    return () => clearTimeout(timer);
  }, [needsChoice]);

  if (!needsChoice || !delayPassed) return null;

  return (
    <div role="dialog" aria-live="polite" aria-label={t("ariaLabel")} className={styles.banner}>
      <p className={styles.text}>
        {t("bodyBefore")}
        <Link href="/personuvernd">{t("privacyLink")}</Link>
        {t("bodyAfter")}
      </p>
      <div className={styles.choices}>
        <button type="button" onClick={() => saveConsent("rejected")} className="btn btn-sm btn-secondary">
          {t("reject")}
        </button>
        <button type="button" onClick={() => saveConsent("accepted")} className="btn btn-sm btn-secondary">
          {t("accept")}
        </button>
      </div>
    </div>
  );
}
