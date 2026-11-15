import en from "../src/content/messages/en.json" with { type: "json" };
import { expect, test } from "./support/test";

const quiz = en.sjalfsmatQuiz;

for (const [answers, band] of [
  [[1, 2, 0, 1, 2], "mid"],
  [[0, 0, 0, 0, 0], "low"],
  [[2, 2, 2, 2, 2], "high"],
] as const) {
  test(`answers ${answers.join("")} give the “${band}” result`, async ({ page, problems }) => {
    await page.goto("/en/sjalfsmat/");
    const panel = page.locator("#quiz");
    for (const answer of answers) {
      await panel.locator("button[aria-pressed]").nth(answer).click();
      await panel.getByRole("button", { name: new RegExp(`${quiz.next}|${quiz.seeResult}`) }).click();
    }
    await expect(panel).toContainText(quiz.results[band].title);
    await expect(panel.getByRole("link", { name: new RegExp(quiz.bookCall) })).toHaveAttribute("href", /calendly\.com/);
    await panel.getByRole("button", { name: new RegExp(quiz.retake) }).click();
    await expect(panel).toContainText(quiz.questions[0]!.question);
    expect(problems).toEqual([]);
  });
}

test("the quiz can be answered with the keyboard (1–3, Enter)", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard shortcuts are for desktops");
  await page.goto("/en/sjalfsmat/");
  await page.locator("#quiz").scrollIntoViewIfNeeded();
  for (const key of ["2", "3", "1", "2", "3"]) {
    await page.keyboard.press(key);
    await page.keyboard.press("Enter");
  }
  await expect(page.locator("#quiz")).toContainText(quiz.results.mid.title);
});
