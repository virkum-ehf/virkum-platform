/** Primary / default site language is Icelandic (`is`); English is secondary. */
export const locales = ["is", "en"] as const;

export type Locale = (typeof locales)[number];

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);
