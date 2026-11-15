import type { Locale } from "@/i18n/locales";
import { locales } from "@/i18n/locales";

/** Stored when the user picks a language via the header; read on `/` by `LocaleRedirect`. */
export const PREFERRED_LOCALE_STORAGE_KEY = "preferred-locale";

export function setPreferredLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFERRED_LOCALE_STORAGE_KEY, locale);
  } catch {
    /* quota / private mode */
  }
}

export function getPreferredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(PREFERRED_LOCALE_STORAGE_KEY);
    return locales.includes(value as Locale) ? (value as Locale) : null;
  } catch {
    return null;
  }
}
