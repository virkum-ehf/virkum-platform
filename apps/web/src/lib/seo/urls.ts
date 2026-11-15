import { SITE_URL } from "@/config/site";

export const ICELANDIC_HOME = `${SITE_URL}/is/`;
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** Absolute URL of a page in a language, always with the trailing slash the site uses. */
export function pageUrl(locale: string, path: string): string {
  const suffix = path === "/" ? "/" : `${path}/`;
  return `${SITE_URL}/${locale}${suffix}`;
}

export function blogFeedUrl(locale: string): string {
  return `${SITE_URL}/${locale}/blogg/feed.xml`;
}
