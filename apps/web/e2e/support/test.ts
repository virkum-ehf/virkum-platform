import { expect, type Page, test as base } from "@playwright/test";

type Options = {
  /** Stored cookie choice before the page loads; null shows the banner. */
  consent: "accepted" | "rejected" | null;
};

type Fixtures = {
  /** Uncaught errors and console errors seen by the page. */
  problems: string[];
  /** Requests to Google Analytics and Meta (blocked, but recorded). */
  analytics: string[];
};

/**
 * Shared test setup, applied to every test: analytics and Meta Pixel requests are blocked (and
 * recorded), the cookie choice is preset so the banner does not cover the page, and errors are
 * collected.
 */
export const test = base.extend<Fixtures & Options>({
  consent: ["rejected", { option: true }],

  analytics: [
    async ({ page }, use) => {
      const requests: string[] = [];
      await page.route(/googletagmanager|google-analytics|facebook/, async (route) => {
        requests.push(route.request().url());
        await route.abort();
      });
      await use(requests);
    },
    { auto: true },
  ],

  problems: [
    async ({ page, consent }, use) => {
      const problems: string[] = [];
      page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
      page.on("console", (message) => {
        if (message.type() === "error" && !/status of 404|net::ERR_FAILED/.test(message.text())) {
          problems.push(`console: ${message.text()}`);
        }
      });
      if (consent) {
        await page.addInitScript((choice) => {
          try {
            localStorage.setItem("virkum-cookie-consent", choice);
          } catch {
            /* storage blocked */
          }
        }, consent);
      }
      await use(problems);
    },
    { auto: true },
  ],
});

export { expect };

/** Scrolls through the whole page like a visitor, so lazy content and scenes start. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 30)));
    }
  });
}

/**
 * Opens a page after the current one has finished loading. Safari reports prefetches that a
 * navigation cancels as errors, so tests that visit several pages wait for quiet first.
 */
export async function visit(page: Page, path: string) {
  if (page.url() !== "about:blank") await page.waitForLoadState("networkidle");
  return page.goto(path);
}
