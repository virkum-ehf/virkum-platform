import { answerScores, emptyAnswers, type QuizQuestion, resultBand, totalScore } from "./scoring";

const question = (scores: Array<0 | 1 | 2>): QuizQuestion => ({
  question: "?",
  options: scores.map((score, i) => ({ label: `Option ${i + 1}`, score })),
});
const questions = Array.from({ length: 5 }, () => question([0, 1, 2]));

describe("self-assessment scoring", () => {
  it("starts with every question unanswered", () => {
    expect(emptyAnswers(5)).toEqual([null, null, null, null, null]);
  });

  it("adds up the chosen options' scores", () => {
    expect(totalScore([1, 2, 0, 1, 2], questions)).toBe(6);
    expect(totalScore([null, 2, null, null, null], questions)).toBe(2);
    expect(totalScore(emptyAnswers(5), questions)).toBe(0);
  });

  it("reports each answer's score for the 3D columns", () => {
    expect(answerScores([0, null, 2, 1, null], questions)).toEqual([0, null, 2, 1, null]);
  });

  it.each([
    [0, "low"],
    [3, "low"],
    [4, "mid"],
    [6, "mid"],
    [7, "high"],
    [10, "high"],
  ] as const)("score %i is %s", (score, band) => {
    expect(resultBand(score)).toBe(band);
  });
});
