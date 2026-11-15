import nextVitals from "eslint-config-next/core-web-vitals";

import { base } from "./base.js";

/** Next.js apps: Next's Core Web Vitals rules (React, hooks, a11y, images, links) + the shared base. */
export function next({ tsconfigRootDir }) {
  return [
    ...nextVitals,
    ...base({ tsconfigRootDir }),
    {
      // Playwright tests are not React code: fixtures receive a `use` callback, which the
      // hooks rules would mistake for React's `use`.
      files: ["e2e/**", "**/*.spec.ts"],
      rules: { "react-hooks/rules-of-hooks": "off" },
    },
  ];
}

export default next;
