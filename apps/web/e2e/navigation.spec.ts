import { expect, test } from "./support/test";

test.describe("header and language", () => {
  test("the language switch opens the same page in the other language and remembers it", async ({ page, isMobile }) => {
    await page.goto("/en/daemi/");
    if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator('button[lang="is"]:visible').first().click();
    await expect(page).toHaveURL(/\/is\/daemi\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "is");
    expect(await page.evaluate(() => localStorage.getItem("preferred-locale"))).toBe("is");

    // Switching re-renders the root layout; reveals further down must still wait for the visitor.
    const waitingReveals = await page.evaluate(
      () =>
        [...document.querySelectorAll(".reveal")].filter(
          (element) =>
            element.getBoundingClientRect().top > window.innerHeight * 1.2 && getComputedStyle(element).opacity === "0",
        ).length,
    );
    expect(waitingReveals, "scroll reveals still active after switching language").toBeGreaterThan(0);
  });

  test("the logo and navigation links move between pages", async ({ page, isMobile }) => {
    test.skip(isMobile, "the desktop navigation is hidden on phones; the menu has its own test");
    await page.goto("/en/");
    await page.locator("header nav").getByRole("link", { name: "Blog" }).click();
    await expect(page).toHaveURL(/\/en\/blogg\/$/);
    await expect(page.locator("h1")).toBeVisible();
    await page.locator("header").getByRole("link", { name: "Virkum" }).first().click();
    await expect(page).toHaveURL(/\/en\/$/);
  });

  test("“Services” scrolls to the three steps on the home page", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop navigation only");
    await page.goto("/en/");
    await page.locator("header nav").getByRole("link", { name: "Services" }).click();
    await expect(page).toHaveURL(/#thjonusta$/);
    await expect(page.locator("#thjonusta h2")).toBeInViewport();
  });

  test("the mobile menu opens, locks scrolling and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "phones only");
    await page.goto("/is/");
    await page.getByRole("button", { name: "Opna valmynd" }).click();
    const menu = page.locator("#site-menu");
    await expect(menu).toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await page.getByRole("button", { name: "Opna valmynd" }).click();
    await menu.getByRole("link", { name: /Sjálfsmat/ }).click();
    await expect(page).toHaveURL(/\/is\/sjalfsmat\/$/);
    await expect(menu).toBeHidden();
  });
});
