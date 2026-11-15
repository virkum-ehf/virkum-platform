import { renderBlogFeed } from "@/content/blog";
import { type Locale, locales } from "@/i18n/locales";

export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function GET(_request: Request, context: { params: Promise<{ locale: string }> }) {
  const { locale } = await context.params;
  if (!locales.includes(locale as Locale)) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(renderBlogFeed(locale), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
