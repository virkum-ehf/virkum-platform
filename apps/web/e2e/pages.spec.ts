import en from "../src/content/messages/en.json" with { type: "json" };
import is from "../src/content/messages/is.json" with { type: "json" };
import { LOCALES, PAGES, url } from "./support/routes";
import { expect, scrollThrough, test, visit } from "./support/test";

for (const locale of LOCALES) {
  for (const page of PAGES) {
    test(`${url(locale, page)} renders`, async ({ page: browser, problems, analytics }) => {
      const response = await browser.goto(url(locale, page));
      expect(response?.status()).toBe(200);
      await expect(browser.locator("html")).toHaveAttribute("lang", locale);
      await expect(browser.locator("h1")).toHaveCount(1);
      await expect(browser.locator("main")).toHaveCount(1);
      await expect(browser.locator("header").first()).toBeVisible();

      await scrollThrough(browser);

      const overflow = await browser.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, "no sideways scrolling").toBeLessThanOrEqual(0);
      const brokenImages = await browser.evaluate(() =>
        [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
      );
      expect(brokenImages).toEqual([]);
      expect(problems).toEqual([]);
      expect(analytics, "no analytics after rejecting cookies").toEqual([]);
    });
  }
}

test("unknown addresses show the branded 404 in the visitor's language", async ({ page, problems }) => {
  for (const [locale, messages] of [
    ["is", is],
    ["en", en],
  ] as const) {
    const response = await visit(page, `/${locale}/does/not/exist/`);
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toHaveText(messages.notFound.title);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.getByRole("link", { name: messages.notFound.homeLink })).toHaveAttribute("href", `/${locale}/`);
  }
  expect(problems).toEqual([]);
});

test("the root address opens the remembered language", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/is\/?$/);
  await page.evaluate(() => localStorage.setItem("preferred-locale", "en"));
  await visit(page, "/");
  await expect(page).toHaveURL(/\/en\/?$/);
});
