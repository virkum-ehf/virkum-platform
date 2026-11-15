"use client";

import { useLocale, useTranslations } from "next-intl";

import { NotFoundView } from "@/features/not-found/NotFoundView";

export default function NotFound() {
  const t = useTranslations("notFound");
  const locale = useLocale();
  return (
    <NotFoundView
      copy={{ code: t("code"), title: t("title"), description: t("description"), homeLink: t("homeLink") }}
      homeHref={`/${locale}/`}
    />
  );
}
