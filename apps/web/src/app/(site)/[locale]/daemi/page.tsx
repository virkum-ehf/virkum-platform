import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { SiteFooter } from "@/components/layout/footer/SiteFooter";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CaseStudy } from "@/features/case-study/CaseStudy";
import { locales } from "@/i18n/locales";
import { resolveLocale } from "@/i18n/server";
import { articleJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "daemiPage" });
  return buildPageMetadata(locale, "/daemi", t("metaTitle"), t("metaDescription"));
}

export default async function DaemiPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("daemiPage");
  const tHeader = await getTranslations("header");

  return (
    <>
      <Breadcrumbs
        locale={locale}
        items={[
          { name: tHeader("home"), path: "/" },
          { name: tHeader("cases"), path: "/daemi" },
        ]}
      />
      <JsonLd data={articleJsonLd(locale, "/daemi", `${t("titleBefore")}${t("titleAccent")}`, t("metaDescription"))} />
      <main>
        <CaseStudy />
      </main>
      <SiteFooter />
    </>
  );
}
