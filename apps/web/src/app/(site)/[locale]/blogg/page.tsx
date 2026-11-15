import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { SiteFooter } from "@/components/layout/footer/SiteFooter";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBlogPosts } from "@/content/blog";
import { BlogIndex } from "@/features/blog/BlogIndex";
import { locales } from "@/i18n/locales";
import { resolveLocale } from "@/i18n/server";
import { blogJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { blogFeedUrl } from "@/lib/seo/urls";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "blog" });
  const metadata = buildPageMetadata(locale, "/blogg", t("metaTitle"), t("metaDescription"));
  return {
    ...metadata,
    title: { absolute: t("tabTitle") },
    alternates: {
      ...metadata.alternates,
      types: { "application/rss+xml": blogFeedUrl(locale) },
    },
  };
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("blog");
  const tHeader = await getTranslations("header");
  const posts = getBlogPosts(locale);
  const dateFormatter = new Intl.DateTimeFormat(locale === "is" ? "is-IS" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const dateLabels = Object.fromEntries(
    posts.map((post) => [post.slug, dateFormatter.format(new Date(post.publishedAt))]),
  );

  return (
    <>
      <JsonLd
        data={blogJsonLd(
          locale,
          t("title"),
          t("metaDescription"),
          posts.map((post) => ({ title: post.title, slug: post.slug, publishedAt: post.publishedAt })),
        )}
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: tHeader("home"), path: "/" },
          { name: tHeader("blog"), path: "/blogg" },
        ]}
      />
      <main>
        <BlogIndex
          posts={posts}
          dateLabels={dateLabels}
          labels={{
            eyebrow: t("eyebrow"),
            title: t("title"),
            intro: t("intro"),
            read: t("read"),
            search: t("search"),
            empty: t("empty"),
            matchTitle: t("matchTitle"),
            matchText: t("matchText"),
          }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
