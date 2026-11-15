import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Static export to Firebase Hosting. Remove `output` when server features (forms, accounts,
  // a database) are added and the app moves to a Node host such as Firebase App Hosting.
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: { unoptimized: true },
  // Workspace packages ship TypeScript source; Next compiles them.
  transpilePackages: ["@virkum/ui", "@virkum/basalt"],
  experimental: {
    // One branded 404 for every unknown URL (the site has two root layouts).
    globalNotFound: true,
  },
};

export default withNextIntl(nextConfig);
