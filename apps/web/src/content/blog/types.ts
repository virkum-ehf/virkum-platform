import type { Locale } from "@/i18n/locales";

export type BlogSection = { type: "p"; text: string } | { type: "h2"; text: string } | { type: "ul"; items: string[] };

export type BlogHref = "/" | "/sjalfsmat" | "/daemi" | "/gervigreind" | "/namskeid" | "/personuvernd" | "/blogg";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  sections: BlogSection[];
  links: { href: BlogHref; label: string }[];
};

export type BlogCopy = Record<Locale, BlogPost[]>;
