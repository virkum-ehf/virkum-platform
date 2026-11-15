import { getRequestConfig } from "next-intl/server";

import { isLocale } from "./locales";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested && isLocale(requested) ? requested : "is";
  const messages = (await import(`../content/messages/${locale}.json`)) as { default: Record<string, unknown> };
  return { locale, messages: messages.default, timeZone: "UTC" };
});
