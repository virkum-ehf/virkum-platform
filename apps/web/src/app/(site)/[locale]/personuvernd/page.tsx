import { PageHead } from "@virkum/ui";
import { ReadingProgress } from "@virkum/ui/client";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { SiteFooter } from "@/components/layout/footer/SiteFooter";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { CONTACT_EMAIL } from "@/config/site";
import { DocLayout } from "@/features/legal/DocLayout";
import { locales } from "@/i18n/locales";
import { resolveLocale } from "@/i18n/server";
import { buildPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "personuverndPage" });
  return buildPageMetadata(locale, "/personuvernd", t("metaTitle"), t("metaDescription"));
}

export default async function PersonuverndPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("personuverndPage");
  const tHeader = await getTranslations("header");
  const tFooter = await getTranslations("ctaFooter");

  return (
    <>
      <Breadcrumbs
        locale={locale}
        items={[
          { name: tHeader("home"), path: "/" },
          { name: tFooter("privacy"), path: "/personuvernd" },
        ]}
      />
      <ReadingProgress />

      <main>
        <PageHead title={t("title")} lead={t("intro")} />
        <DocLayout
          sections={[
            { title: t("h2collect"), content: <p>{t("pcollect")}</p> },
            { title: t("h2use"), content: <p>{t("puse")}</p> },
            {
              title: t("h2cookies"),
              content: (
                <>
                  <p>{t("pcookies")}</p>
                  <p>{t("pcookiesDetail")}</p>
                </>
              ),
            },
            {
              title: t("h2rights"),
              content: (
                <p>
                  {t("prightsBefore")}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  {t("prightsAfter")}
                </p>
              ),
            },
            { title: t("h2changes"), content: <p>{t("pchanges")}</p> },
          ]}
        />
      </main>

      <SiteFooter />
    </>
  );
}
