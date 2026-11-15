import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";

import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { Header } from "@/components/layout/header/Header";
import { PageTransition } from "@/components/layout/page-transition/PageTransition";
import { RevealOnRoute } from "@/components/layout/RevealOnRoute";
import { PreserveSearchParams } from "@/components/navigation/PreserveSearchParams";
import { JsonLd } from "@/components/seo/JsonLd";
import { env } from "@/config/env";
import { SITE_URL } from "@/config/site";
import { resolveLocale } from "@/i18n/server";
import { MARK_SCRIPTED } from "@/lib/documentScripts";
import { organizationJsonLd } from "@/lib/seo/json-ld";

import { fontVariables } from "../../fonts";

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  colorScheme: "light",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "seo" });
  const messages = await getMessages({ locale });
  const keywords = messages.seo.keywords;
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    keywords,
    icons: {
      icon: [
        { url: "/brand/favicon.svg", type: "image/svg+xml" },
        { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      siteName: "Virkum",
      locale: locale === "is" ? "is_IS" : "en_IS",
      alternateLocale: locale === "is" ? ["en_IS"] : ["is_IS"],
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("twitterDescription"),
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);

  const messages = await getMessages();
  const structuredData = organizationJsonLd(messages.seo.jsonLdDescription);

  return (
    <html lang={locale} className={fontVariables} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MARK_SCRIPTED }} />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <NextIntlClientProvider
          locale={locale}
          messages={{
            header: messages.header,
            common: messages.common,
            cookieBanner: messages.cookieBanner,
            notFound: messages.notFound,
          }}
        >
          <JsonLd data={structuredData} />
          <ConsentProvider
            gaMeasurementId={env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
            metaPixelId={env.NEXT_PUBLIC_META_PIXEL_ID}
          >
            <PreserveSearchParams />
            <RevealOnRoute />
            <Header />
            {children}
            <PageTransition />
            <CookieBanner />
          </ConsentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
