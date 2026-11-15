import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";

import { SiteFooter } from "@/components/layout/footer/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { Clients } from "@/features/home/clients/Clients";
import { HomeHero } from "@/features/home/hero/HomeHero";
import { Market } from "@/features/home/market/Market";
import { Problem } from "@/features/home/problem/Problem";
import { Services } from "@/features/home/services/Services";
import { Team } from "@/features/home/team/Team";
import { Testimonials } from "@/features/home/testimonials/Testimonials";
import { Voice } from "@/features/home/voice/Voice";
import { locales } from "@/i18n/locales";
import { resolveLocale } from "@/i18n/server";
import { serviceListJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "seo" });
  return {
    ...buildPageMetadata(locale, "/", t("ogTitle"), t("description")),
    title: { absolute: "Virkum" },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const messages = await getMessages();
  const services = (messages.serviceCards as { items: { name: string; body: string }[] }).items;

  return (
    <>
      <JsonLd
        data={serviceListJsonLd(
          locale,
          services.map((item) => ({ name: item.name, description: item.body })),
        )}
      />
      <main>
        <HomeHero />
        <Services />
        <Problem />
        <Clients />
        <Testimonials />
        <Market />
        <Voice />
        <Team />
      </main>
      <SiteFooter />
    </>
  );
}
