import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";

import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Virkum",
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/is/` },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  colorScheme: "light",
};

export default function EntryLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="is">
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
