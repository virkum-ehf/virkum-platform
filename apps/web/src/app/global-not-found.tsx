import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";

import en from "@/content/messages/en.json";
import is from "@/content/messages/is.json";
import { GlobalNotFound, type NotFoundMessages } from "@/features/not-found/GlobalNotFound";

import { fontVariables } from "./fonts";

export const metadata: Metadata = {
  title: is.notFound.title,
  robots: { index: false, follow: true },
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  colorScheme: "light",
};

/** Only the namespaces the header and the 404 view need. */
const pick = (messages: typeof is): NotFoundMessages => ({
  header: messages.header,
  common: messages.common,
  notFound: messages.notFound,
});

/** Branded 404 for every unknown URL (served as out/404.html). */
export default function GlobalNotFoundPage() {
  return (
    <html lang="is" className={fontVariables} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <GlobalNotFound messages={{ is: pick(is), en: pick(en) }} />
      </body>
    </html>
  );
}
