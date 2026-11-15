/**
 * Every page of the site, as paths without the language prefix ("" is the home page). Blog posts
 * are added from the content. Feeds the sitemap and the end-to-end tests, so a new page is covered
 * by both once it is listed here.
 */
export const PAGES = ["", "sjalfsmat", "daemi", "namskeid", "gervigreind", "personuvernd", "blogg"] as const;

export type PagePath = (typeof PAGES)[number];
