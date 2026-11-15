"use client";

import { cn } from "@virkum/ui";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { type Locale, locales } from "@/i18n/locales";
import { localizedPath } from "@/i18n/paths";
import { setPreferredLocale } from "@/i18n/preference";

import styles from "./Header.module.css";

type LanguageSwitchProps = {
  /** Called after switching (closes the mobile menu). */
  onSwitch?: () => void;
  className?: string;
};

/** IS | EN control. Remembers the choice for the root page and opens the same page in the other language. */
export function LanguageSwitch({ onSwitch, className }: LanguageSwitchProps) {
  const t = useTranslations("header");
  const current = useLocale();
  const router = useRouter();

  const choose = (target: Locale) => {
    if (target === current) return;
    setPreferredLocale(target);
    router.push(localizedPath(target, window.location));
    onSwitch?.();
  };

  return (
    <div className={cn(styles.lang, className)} role="group" aria-label={t("switchLanguage")}>
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={code === current}
          className={styles.langOption}
          onClick={() => choose(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
