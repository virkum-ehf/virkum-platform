"use client";

import { type Messages, NextIntlClientProvider } from "next-intl";
import { useEffect, useSyncExternalStore } from "react";

import { Header } from "@/components/layout/header/Header";
import type { Locale } from "@/i18n/locales";

import { NotFoundView } from "./NotFoundView";

export type NotFoundMessages = Pick<Messages, "header" | "common" | "notFound">;

const subscribe = () => () => {};
const localeFromAddress = (): Locale => (/^\/en(\/|$)/.test(window.location.pathname) ? "en" : "is");

/**
 * 404 for any unknown URL. The static 404.html is shared by both languages, so the
 * language is read from the address after load (Icelandic by default).
 */
export function GlobalNotFound({ messages }: { messages: Record<Locale, NotFoundMessages> }) {
  const locale = useSyncExternalStore(subscribe, localeFromAddress, () => "is" as const);
  const copy = messages[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = copy.notFound.title;
  }, [locale, copy]);

  return (
    <NextIntlClientProvider locale={locale} messages={copy} timeZone="UTC">
      <Header />
      <NotFoundView copy={copy.notFound} homeHref={`/${locale}/`} />
    </NextIntlClientProvider>
  );
}
