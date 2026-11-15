import { expect, test } from "./support/test";

test("search narrows the list, ignores accents and can be cleared", async ({ page, problems }) => {
  await page.goto("/is/blogg/");
  const results = page.locator("main li[data-slug]");
  const all = await results.count();
  expect(all).toBeGreaterThan(1);

  const input = page.getByRole("searchbox");
  await input.fill("gervigreind");
  await expect(results).not.toHaveCount(all);
  await expect(results.first()).toContainText(/gervigreind/i);

  await input.fill("radgjof");
  await expect(results.first()).toBeVisible();

  await input.fill("zzqx");
  await expect(results).toHaveCount(0);

  await input.fill("");
  await expect(results).toHaveCount(all);
  expect(problems).toEqual([]);
});

test("an article links to related posts in the same language", async ({ page }) => {
  await page.goto("/en/blogg/");
  await page.locator("main li[data-slug] h2 a").first().click();
  await expect(page).toHaveURL(/\/en\/blogg\/[a-z-]+\/$/);
  await expect(page.locator("article h1, main h1").first()).toBeVisible();
  const related = page.locator('main a[href^="/en/blogg/"]');
  expect(await related.count()).toBeGreaterThan(0);
});
