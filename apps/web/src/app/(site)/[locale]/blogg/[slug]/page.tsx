import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages, getTranslations } from "next-intl/server";

import { SiteFooter } from "@/components/layout/footer/SiteFooter";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { BLOG_AUTHOR } from "@/config/site";
import { getBlogPost, getBlogSlugs } from "@/content/blog";
import { BlogPost } from "@/features/blog/BlogPost";
import { locales } from "@/i18n/locales";
import { resolveLocale } from "@/i18n/server";
import { buildArticleMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return locales.flatMap((locale) => getBlogSlugs().map((slug) => ({ locale, slug })));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const post = getBlogPost(locale, slug);
  if (!post) return {};
  return buildArticleMetadata(locale, `/blogg/${post.slug}`, post.title, post.description, {
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    tags: post.tags,
  });
}

export default async function BlogArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const post = getBlogPost(locale, slug);
  if (!post) notFound();

  const t = await getTranslations("blog");
  const tHeader = await getTranslations("header");
  const tCta = await getTranslations("ctaFooter");
  const messages = await getMessages();
  const members = (messages.teamSection as { members: { name: string; image: string; role: string }[] }).members;
  const member = members.find((item) => item.image === BLOG_AUTHOR.image) ?? members[0];
  const author = { name: BLOG_AUTHOR.name, image: member?.image ?? BLOG_AUTHOR.image, role: member?.role ?? "" };

  return (
    <>
      <Breadcrumbs
        locale={locale}
        items={[
          { name: tHeader("home"), path: "/" },
          { name: tHeader("blog"), path: "/blogg" },
          { name: post.title, path: `/blogg/${post.slug}` },
        ]}
      />
      <main>
        <BlogPost
          locale={locale}
          post={post}
          labels={{
            back: t("back"),
            published: t("published"),
            updated: t("updated"),
            related: t("related"),
            read: t("read"),
          }}
          author={author}
          cta={{
            titleLine1: tCta("titleLine1"),
            titleLine2: tCta("titleLine2"),
            body: tCta("body"),
            button: tCta("bookCall"),
          }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
