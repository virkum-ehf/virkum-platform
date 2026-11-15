import "server-only";

import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { isLocale, type Locale } from "./locales";

/**
 * Reads and validates the `[locale]` route segment: unknown values render the 404 page.
 * Also enables static rendering for that locale (next-intl `setRequestLocale`).
 */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  return locale;
}
