import { expect, test } from "./support/test";

test.describe("cookie consent", () => {
  test.use({ consent: null });

  test("Google Analytics loads only after Accept", async ({ page, analytics }) => {
    await page.goto("/en/");
    const banner = page.getByRole("dialog", { name: /cookie/i });
    await expect(banner).toBeVisible();
    expect(analytics).toEqual([]);
    await banner.getByRole("button", { name: "Accept" }).click();
    await expect(banner).toBeHidden();
    await expect.poll(() => analytics.length).toBeGreaterThan(0);
    expect(await page.evaluate(() => localStorage.getItem("virkum-cookie-consent"))).toBe("accepted");
  });

  test("Reject loads nothing and is remembered", async ({ page, analytics }) => {
    await page.goto("/is/");
    const banner = page.getByRole("dialog");
    await banner.getByRole("button", { name: "Hafna" }).click();
    await expect(banner).toBeHidden();
    await page.waitForLoadState("networkidle");
    await page.reload();
    await page.waitForTimeout(1000);
    await expect(page.getByRole("dialog")).toBeHidden();
    expect(analytics).toEqual([]);
  });
});
