import { SITE_URL } from "@/config/site";
import type { Locale } from "@/i18n/locales";
import { locales } from "@/i18n/locales";

import { blogPosts } from "./posts";
import type { BlogPost } from "./types";

export type { BlogHref, BlogPost, BlogSection } from "./types";

export function getBlogPosts(locale: string): BlogPost[] {
  if (!locales.includes(locale as Locale)) return [];
  return blogPosts[locale as Locale];
}

export function getBlogPost(locale: string, slug: string): BlogPost | undefined {
  return getBlogPosts(locale).find((post) => post.slug === slug);
}

export function getBlogSlugs(): string[] {
  return blogPosts.is.map((post) => post.slug);
}

function escapeXml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function renderBlogFeed(locale: string) {
  const posts = getBlogPosts(locale);
  const origin = SITE_URL;
  const home = `${origin}/${locale}/blogg/`;
  const language = locale === "is" ? "is" : "en";
  const title = locale === "is" ? "Blogg Virkum" : "Virkum blog";
  const description =
    locale === "is"
      ? "Greinar um rekstrarkerfi, takt og gervigreind fyrir íslensk fyrirtæki."
      : "Articles on operating systems, rhythm and AI for Icelandic companies.";

  const items = posts
    .map((post) => {
      const url = `${origin}/${locale}/blogg/${post.slug}/`;
      return `<item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${home}</link>
    <description>${escapeXml(description)}</description>
    <language>${language}</language>
    ${items}
  </channel>
</rss>`;
}
