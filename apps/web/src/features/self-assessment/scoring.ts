/** Self-assessment data and scoring (unchanged from the original quiz). */

export type QuizOption = { label: string; score: 0 | 1 | 2 };
export type QuizQuestion = { question: string; options: QuizOption[] };
export type ResultBand = "low" | "mid" | "high";

/** Selected option index per question, or null when unanswered. */
export type Answers = Array<number | null>;

/** Score of option `answer` in question `question`, if both exist. */
function optionScore(questions: QuizQuestion[], question: number, answer: number): number | undefined {
  return questions[question]?.options[answer]?.score;
}

export const emptyAnswers = (count: number): Answers => Array.from({ length: count }, () => null);

/** Score of each answered question (0 = runs well, 2 = needs work), null when unanswered. */
export function answerScores(answers: Answers, questions: QuizQuestion[]): Array<number | null> {
  return answers.map((answer, i) => (answer === null ? null : (optionScore(questions, i, answer) ?? null)));
}

/** Sum of the chosen options' scores (0–10 for five questions). */
export function totalScore(answers: Answers, questions: QuizQuestion[]): number {
  return answers.reduce<number>(
    (sum, answer, i) => sum + (answer === null ? 0 : (optionScore(questions, i, answer) ?? 0)),
    0,
  );
}

/** ≤ 3 low, ≤ 6 mid, otherwise high. */
export function resultBand(score: number): ResultBand {
  if (score <= 3) return "low";
  if (score <= 6) return "mid";
  return "high";
}
