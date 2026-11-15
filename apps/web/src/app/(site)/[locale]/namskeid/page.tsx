import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Courses } from "@/features/courses/Courses";
import { SlimFooter } from "@/features/courses/SlimFooter";
import { locales } from "@/i18n/locales";
import { resolveLocale } from "@/i18n/server";
import { courseListJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "namskeidPage" });
  return buildPageMetadata(locale, "/namskeid", t("metaTitle"), t("metaDescription"));
}

type CourseListMessages = { courses: { title: string; description: string }[] };

export default async function NamskeidPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const messages = await getMessages();
  const { courses } = messages.namskeidPage as CourseListMessages;
  const tHeader = await getTranslations("header");

  return (
    <>
      <Breadcrumbs
        locale={locale}
        items={[
          { name: tHeader("home"), path: "/" },
          { name: tHeader("courses"), path: "/namskeid" },
        ]}
      />
      <JsonLd
        data={courseListJsonLd(
          locale,
          courses.map((course) => ({ name: course.title, description: course.description })),
        )}
      />
      <main>
        <Courses />
      </main>
      <SlimFooter />
    </>
  );
}
