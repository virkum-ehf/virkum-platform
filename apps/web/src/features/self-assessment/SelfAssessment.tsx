"use client";

import { Arrow, cn, Columns } from "@virkum/ui";
import { useMessages, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BookingLink } from "@/components/BookingLink";
import { at } from "@/lib/at";

import { ProgressColumns } from "./ProgressColumns";
import { QuizField } from "./QuizField";
import { type Answers, answerScores, emptyAnswers, type QuizQuestion, resultBand, totalScore } from "./scoring";
import styles from "./SelfAssessment.module.css";

type QuizMessages = { questions: QuizQuestion[] };

/**
 * The two-minute self-assessment: five questions, a score out of ten and a result,
 * with a live 3D structure beside it. Keys 1–3 pick an answer and Enter continues.
 */
export function SelfAssessment() {
  const t = useTranslations("sjalfsmatQuiz");
  const messages = useMessages();
  const questions = (messages.sjalfsmatQuiz as QuizMessages).questions;
  const total = questions.length;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => emptyAnswers(total));
  const [done, setDone] = useState(false);

  const quizRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const current = at(questions, step);
  const selected = answers[step];
  const progress = done ? 100 : (step / total) * 100;
  const scores = useMemo(() => answerScores(answers, questions), [answers, questions]);

  const choose = useCallback(
    (option: number) =>
      setAnswers((previous) => {
        const next = [...previous];
        next[step] = option;
        return next;
      }),
    [step],
  );

  const handleNext = useCallback(() => {
    if (selected === null) return;
    if (step < total - 1) setStep(step + 1);
    else setDone(true);
  }, [selected, step, total]);

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleReset = () => {
    setAnswers(emptyAnswers(total));
    setStep(0);
    setDone(false);
  };

  // Keyboard: 1–3 picks an answer, Enter continues (only while the quiz is on screen).
  useEffect(() => {
    if (done) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as Element | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      const rect = quizRef.current?.getBoundingClientRect();
      if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
      if (/^[1-9]$/.test(event.key)) {
        const option = Number(event.key) - 1;
        if (option >= current.options.length) return;
        event.preventDefault();
        choose(option);
        optionRefs.current[option]?.focus();
      } else if (event.key === "Enter") {
        // Enter on the chosen answer continues; on another answer it selects that answer,
        // and on other buttons and links it keeps its normal meaning.
        const optionIndex = optionRefs.current.findIndex((node) => node === target);
        if (optionIndex >= 0 ? optionIndex !== selected : target?.closest("button, a")) return;
        if (selected === null) return;
        event.preventDefault();
        handleNext();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [done, current, selected, choose, handleNext]);

  const score = totalScore(answers, questions);
  const band = resultBand(score);

  return (
    <section className={cn("wrap", styles.layout)}>
      <div className={styles.main}>
        <div ref={quizRef} id="quiz" aria-live="polite">
          {!done ? (
            <>
              <div className={styles.progress}>
                <div>
                  <p className="t-label">{t("progress", { current: step + 1, total })}</p>
                  <ProgressColumns
                    key={step}
                    step={step}
                    total={total}
                    finished={false}
                    className={styles.progressColumns}
                  />
                </div>
                <span className={cn(styles.percent, "num")}>{Math.round(progress)}%</span>
              </div>

              <div key={step} className={styles.card} role="group" aria-labelledby="quiz-question">
                <h2 id="quiz-question">{current.question}</h2>
                <div className={styles.options}>
                  {current.options.map((option, i) => (
                    <button
                      key={i}
                      ref={(node) => {
                        optionRefs.current[i] = node;
                      }}
                      type="button"
                      className={styles.option}
                      aria-pressed={selected === i}
                      onClick={() => choose(i)}
                    >
                      <span className={styles.radio} aria-hidden="true" />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.nav}>
                {step > 0 ? (
                  <button type="button" className={styles.textButton} onClick={handleBack}>
                    {t("back")}
                  </button>
                ) : (
                  <span />
                )}
                <button type="button" className="btn btn-primary" onClick={handleNext} disabled={selected === null}>
                  {step === total - 1 ? t("seeResult") : t("next")}
                  <Arrow />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={cn(styles.card, styles.result)}>
                <div className={styles.scale} aria-hidden="true">
                  <Columns
                    heights={Array(10).fill(40)}
                    colors={Array.from({ length: 10 }, (_, i) => (i < score ? "#2B59FF" : "#DDE3EC"))}
                    width={16}
                    gap={6}
                    rise
                    step={55}
                    className="rise-now"
                  />
                </div>
                <p className="t-label">{t(`results.${band}.eyebrow`, { score })}</p>
                <h2>{t(`results.${band}.title`)}</h2>
                <p className={styles.resultBody}>{t(`results.${band}.body`)}</p>
                <BookingLink className="btn btn-primary">
                  {t("bookCall")}
                  <Arrow />
                </BookingLink>
              </div>
              <div className={styles.retake}>
                <button type="button" onClick={handleReset}>
                  {t("retake")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={styles.side}>
        <QuizField scores={scores} step={step} done={done} />
      </div>
    </section>
  );
}
