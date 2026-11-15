import { Arrow, PageHead } from "@virkum/ui";
import { ReadingProgress } from "@virkum/ui/client";
import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";

import { BookingLink } from "@/components/BookingLink";
import { SiteFooter } from "@/components/layout/footer/SiteFooter";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { CtaPanel } from "@/features/legal/CtaPanel";
import { DocLayout } from "@/features/legal/DocLayout";
import { locales } from "@/i18n/locales";
import { resolveLocale } from "@/i18n/server";
import { buildPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "gervigreindPage" });
  return buildPageMetadata(locale, "/gervigreind", t("metaTitle"), t("metaDescription"));
}

type Section = { title: string; body: string };

export default async function GervigreindPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("gervigreindPage");
  const tCommon = await getTranslations("common");
  const messages = await getMessages();
  const sections = (messages.gervigreindPage as { sections: Section[] }).sections;
  const tHeader = await getTranslations("header");

  return (
    <>
      <Breadcrumbs
        locale={locale}
        items={[
          { name: tHeader("home"), path: "/" },
          { name: tHeader("ai"), path: "/gervigreind" },
        ]}
      />
      <ReadingProgress />

      <main>
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

        <DocLayout
          sections={sections.map((section) => ({
            title: section.title,
            content: section.body.split("\n\n").map((paragraph, i) => <p key={i}>{paragraph}</p>),
          }))}
        />

        <section className="wrap pb-[var(--section)]">
          <CtaPanel
            title={t("ctaTitle")}
            body={t("ctaBody")}
            action={
              <BookingLink className="btn btn-primary">
                {tCommon("bookCall")}
                <Arrow />
              </BookingLink>
            }
          />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
