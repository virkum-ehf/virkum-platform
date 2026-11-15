import { expect, test, visit } from "./support/test";

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("everything is visible without waiting for animations", async ({ page, problems }) => {
    for (const path of ["/en/", "/en/daemi/", "/en/sjalfsmat/"]) {
      await visit(page, path);
      const hidden = await page.evaluate(
        () =>
          [...document.querySelectorAll(".reveal")].filter((element) => getComputedStyle(element).opacity !== "1")
            .length,
      );
      expect(hidden, path).toBe(0);
    }
    expect(problems).toEqual([]);
  });
});

test("scroll reveals stay visible after interaction", async ({ page, isMobile }) => {
  test.skip(isMobile, "hover interactions");
  await page.goto("/en/");
  const card = page.locator("article").filter({ hasText: "70%" }).first();
  await card.scrollIntoViewIfNeeded();
  await card.hover();
  await page.mouse.move(0, 0);
  await expect(card).toHaveCSS("opacity", "1");
});
