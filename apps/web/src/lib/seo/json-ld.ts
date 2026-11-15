import { BLOG_AUTHOR, CONTACT_EMAIL, SITE_URL } from "@/config/site";

import { ICELANDIC_HOME, ORGANIZATION_ID, pageUrl } from "./urls";

/** Structured data (schema.org JSON-LD) for search engines. */

/** JSON for an inline script tag: `<` is escaped, so no text in the data can close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

const iceland = { "@type": "Country", name: "Iceland" };

export function organizationJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": ORGANIZATION_ID,
        name: "Virkum",
        legalName: "Virkum ehf.",
        url: ICELANDIC_HOME,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/brand/icon-512.png`,
        },
        image: `${SITE_URL}/og-image.png`,
        description,
        email: CONTACT_EMAIL,
        taxID: "480524-1280",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Bjargargata 1",
          addressLocality: "Reykjavík",
          postalCode: "102",
          addressCountry: "IS",
        },
        areaServed: iceland,
        knowsLanguage: ["is", "en"],
        contactPoint: {
          "@type": "ContactPoint",
          email: CONTACT_EMAIL,
          contactType: "customer support",
          areaServed: "IS",
          availableLanguage: ["Icelandic", "English"],
        },
        sameAs: ["https://www.linkedin.com/company/virkum"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: ICELANDIC_HOME,
        name: "Virkum",
        description,
        inLanguage: "is",
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };
}

export function serviceListJsonLd(locale: string, items: { name: string; description: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: item.name,
        description: item.description,
        url: `${pageUrl(locale, "/")}#thjonusta`,
        provider: { "@id": ORGANIZATION_ID },
        areaServed: iceland,
        availableLanguage: locale === "is" ? "Icelandic" : "English",
      },
    })),
  };
}

export function courseListJsonLd(locale: string, courses: { name: string; description: string }[]) {
  return {
    "@context": "https://schema.org",
    "@graph": courses.map((course) => ({
      "@type": "Course",
      name: course.name,
      description: course.description,
      provider: { "@id": ORGANIZATION_ID },
      inLanguage: locale === "is" ? "is" : "en",
      availableLanguage: locale === "is" ? "Icelandic" : "English",
      url: pageUrl(locale, "/namskeid"),
    })),
  };
}

export function articleJsonLd(locale: string, path: string, headline: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    inLanguage: locale === "is" ? "is" : "en",
    mainEntityOfPage: pageUrl(locale, path),
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    about: iceland,
  };
}

export function blogJsonLd(
  locale: string,
  name: string,
  description: string,
  posts: { title: string; slug: string; publishedAt: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name,
    description,
    url: pageUrl(locale, "/blogg"),
    inLanguage: locale === "is" ? "is" : "en",
    publisher: { "@id": ORGANIZATION_ID },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: pageUrl(locale, `/blogg/${post.slug}`),
      datePublished: post.publishedAt,
      inLanguage: locale === "is" ? "is" : "en",
    })),
  };
}

export function blogPostingJsonLd(
  locale: string,
  post: {
    slug: string;
    title: string;
    description: string;
    publishedAt: string;
    updatedAt: string;
    tags: string[];
  },
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: locale === "is" ? "is" : "en",
    keywords: post.tags.join(", "),
    image: `${SITE_URL}/og-image.png`,
    mainEntityOfPage: pageUrl(locale, `/blogg/${post.slug}`),
    url: pageUrl(locale, `/blogg/${post.slug}`),
    author: {
      "@type": "Person",
      name: BLOG_AUTHOR.name,
      image: `${SITE_URL}${BLOG_AUTHOR.image}`,
      worksFor: { "@id": ORGANIZATION_ID },
    },
    publisher: { "@id": ORGANIZATION_ID },
    about: iceland,
  };
}

export function breadcrumbJsonLd(locale: string, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: pageUrl(locale, item.path),
    })),
  };
}
