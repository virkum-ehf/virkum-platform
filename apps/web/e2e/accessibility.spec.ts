import AxeBuilder from "@axe-core/playwright";

import { LOCALES, PAGES, url } from "./support/routes";
import { expect, test } from "./support/test";

test.describe("accessibility (WCAG 2.1 AA)", () => {
  test.use({ reducedMotion: "reduce" });

  for (const locale of LOCALES) {
    for (const page of PAGES) {
      test(url(locale, page), async ({ page: browser }) => {
        await browser.goto(url(locale, page));
        const results = await new AxeBuilder({ page: browser })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          // Decorative 3D canvases are aria-hidden; axe cannot judge text over WebGL pixels.
          .exclude("canvas")
          .analyze();
        const violations = results.violations.map((v) => `${v.id}: ${v.nodes.length}× ${v.help}`);
        expect(violations).toEqual([]);
      });
    }
  }
});
