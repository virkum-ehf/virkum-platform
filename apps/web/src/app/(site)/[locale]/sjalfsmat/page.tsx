import { PageHead } from "@virkum/ui";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";

import { SiteFooter } from "@/components/layout/footer/SiteFooter";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SelfAssessment } from "@/features/self-assessment/SelfAssessment";
import { locales } from "@/i18n/locales";
import { resolveLocale } from "@/i18n/server";
import { buildPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "sjalfsmatPage" });
  return buildPageMetadata(locale, "/sjalfsmat", t("metaTitle"), t("metaDescription"));
}

export default async function SjalfsmatPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("sjalfsmatPage");
  const messages = await getMessages();
  const tHeader = await getTranslations("header");

  return (
    <>
      <Breadcrumbs
        locale={locale}
        items={[
          { name: tHeader("home"), path: "/" },
          { name: tHeader("selfAssessment"), path: "/sjalfsmat" },
        ]}
      />

      <main className="bg-frost">
        <PageHead
          eyebrow={t("eyebrow")}
          title={
            <>
              {t("titleBefore")}
              <span className="accent">{t("titleAccent")}</span>
            </>
          }
          lead={t("intro")}
        />
        <NextIntlClientProvider messages={{ sjalfsmatQuiz: messages.sjalfsmatQuiz }}>
          <SelfAssessment />
        </NextIntlClientProvider>
      </main>

      <SiteFooter />
    </>
  );
}
