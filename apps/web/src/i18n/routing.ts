import { defineRouting } from "next-intl/routing";

import { locales } from "./locales";

/** URLs: always prefixed (/is/…, /en/…), Icelandic by default, no automatic detection. */
export const routing = defineRouting({
  locales,
  defaultLocale: "is",
  localePrefix: "always",
  /** Rely on URL + defaultLocale only; do not redirect from Accept-Language or NEXT_LOCALE cookie. */
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/sjalfsmat": "/sjalfsmat",
    "/namskeid": "/namskeid",
    "/daemi": "/daemi",
    "/gervigreind": "/gervigreind",
    "/personuvernd": "/personuvernd",
    "/blogg": "/blogg",
    "/blogg/[slug]": "/blogg/[slug]",
  },
});
