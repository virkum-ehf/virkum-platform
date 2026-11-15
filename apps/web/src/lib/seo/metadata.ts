import type { Metadata } from "next";

import { BLOG_AUTHOR } from "@/config/site";

import { blogFeedUrl, ICELANDIC_HOME, pageUrl } from "./urls";

/** Page metadata: canonical URL, language alternates, Open Graph and Twitter cards. */

export function pageSeo(locale: string, path: string): Pick<Metadata, "alternates" | "openGraph"> {
  const localized = (code: string) => pageUrl(code, path);

  return {
    alternates: {
      canonical: localized(locale),
      languages: {
        "is-IS": localized("is"),
        en: localized("en"),
        "x-default": localized("is"),
      },
    },
    openGraph: {
      url: localized(locale),
      locale: locale === "is" ? "is_IS" : "en_IS",
      alternateLocale: locale === "is" ? ["en_IS"] : ["is_IS"],
    },
  };
}

export function buildPageMetadata(locale: string, path: string, title: string, description: string): Metadata {
  const seo = pageSeo(locale, path);
  return {
    title: { absolute: title },
    description,
    alternates: seo.alternates,
    openGraph: {
      ...seo.openGraph,
      title,
      description,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}

export function buildArticleMetadata(
  locale: string,
  path: string,
  title: string,
  description: string,
  article: { publishedTime: string; modifiedTime: string; tags: string[] },
): Metadata {
  const base = buildPageMetadata(locale, path, title, description);
  return {
    ...base,
    authors: [{ name: BLOG_AUTHOR.name, url: ICELANDIC_HOME }],
    alternates: {
      ...base.alternates,
      types: { "application/rss+xml": blogFeedUrl(locale) },
    },
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: article.publishedTime,
      modifiedTime: article.modifiedTime,
      authors: [BLOG_AUTHOR.name],
      tags: article.tags,
    },
  };
}
