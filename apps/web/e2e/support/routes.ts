import { PAGES as SITE_PAGES } from "../../src/config/pages";
import { getBlogSlugs } from "../../src/content/blog";
import type { Locale } from "../../src/i18n/locales";

export const LOCALES: Locale[] = ["is", "en"];

/** Every page of the site, without the locale prefix, with the trailing slash the site uses. */
export const PAGES = [
  ...SITE_PAGES.map((page) => (page ? `${page}/` : "")),
  ...getBlogSlugs().map((slug) => `blogg/${slug}/`),
];

export const url = (locale: Locale, page = "") => `/${locale}/${page}`;
