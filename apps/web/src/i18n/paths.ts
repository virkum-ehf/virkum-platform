import type { Locale } from "./locales";

type Address = Pick<Location, "pathname" | "search" | "hash">;

/** The same page in another language, keeping the query string and hash (e.g. /en/daemi/?q=1 → /is/daemi/?q=1). */
export function localizedPath(target: Locale, { pathname, search, hash }: Address): string {
  const rest = pathname.replace(/^\/(is|en)(?=\/|$)/, "") || "/";
  const normalized = rest.endsWith("/") ? rest : `${rest}/`;
  const path = normalized === "/" ? `/${target}/` : `/${target}${normalized}`;
  return `${path}${search}${hash}`;
}
