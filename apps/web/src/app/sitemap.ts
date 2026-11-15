import type { MetadataRoute } from "next";

import { PAGES } from "@/config/pages";
import { SITE_URL } from "@/config/site";
import { getBlogSlugs } from "@/content/blog";
import { type Locale, locales } from "@/i18n/locales";

export const dynamic = "force-static";

/** Icelandic pages rank above their English twins; the home page highest. */
function priority(locale: Locale, path: string): number {
  const icelandic = locale === "is";
  if (path === "") return icelandic ? 1 : 0.6;
  if (path === "blogg") return icelandic ? 0.9 : 0.5;
  if (path.startsWith("blogg/")) return icelandic ? 0.7 : 0.4;
  return icelandic ? 0.8 : 0.4;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...PAGES, ...getBlogSlugs().map((slug) => `blogg/${slug}`)];
  return paths.flatMap((path) => {
    const url = (code: Locale) => `${SITE_URL}/${code}${path ? `/${path}` : ""}/`;
    return locales.map((locale) => ({
      url: url(locale),
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: priority(locale, path),
      alternates: { languages: { "is-IS": url("is"), en: url("en"), "x-default": url("is") } },
    }));
  });
}
