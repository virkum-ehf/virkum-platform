import type messages from "@/content/messages/en.json";

import type { Locale } from "./locales";

/** Type-safe translations: unknown keys and wrong namespaces fail the type check. */
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
