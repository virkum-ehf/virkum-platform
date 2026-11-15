import { breadcrumbJsonLd } from "@/lib/seo/json-ld";

export function Breadcrumbs({ locale, items }: { locale: string; items: { name: string; path: string }[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(locale, items)) }}
    />
  );
}
