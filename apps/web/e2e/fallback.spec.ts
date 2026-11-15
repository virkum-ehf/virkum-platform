import { expect, scrollThrough, test } from "./support/test";

// Runs in a browser with WebGL disabled (project "no-webgl").
test("without WebGL every 3D scene falls back to flat columns", async ({ page, problems }) => {
  await page.goto("/en/");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator("section").first().locator("svg path").first()).toBeVisible();
  await scrollThrough(page);
  await expect(page.locator("footer svg path").first()).toBeAttached();
  expect(problems).toEqual([]);
});
