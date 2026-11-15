"use client";

import { useBasaltScene } from "@virkum/basalt/react";
import type { QuizController } from "@virkum/basalt/types";
import { Columns, CutCorner } from "@virkum/ui";
import { useEffect, useRef } from "react";

import styles from "./SelfAssessment.module.css";

type QuizFieldProps = {
  /** Score per question (0 best … 2 worst), null while unanswered. */
  scores: Array<number | null>;
  step: number;
  done: boolean;
};

/**
 * Live 3D structure beside the quiz: one column per question that grows with each answer
 * (taller = runs more independently). The current question's column is highlighted.
 */
export function QuizField({ scores, step, done }: QuizFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const count = scores.length;
  const { status, controllerRef } = useBasaltScene<QuizController>(
    hostRef,
    async (host, signal) => {
      const { mountQuizScene } = await import("@virkum/basalt/scenes/quiz");
      if (signal.aborted) return null;
      return mountQuizScene(host, count);
    },
    { key: count },
  );

  useEffect(() => {
    if (status === "ready") controllerRef.current?.setAnswers(scores, step, done);
  }, [status, scores, step, done, controllerRef]);

  return (
    <CutCorner size={56} className={styles.panel} bodyClassName={styles.panelBody}>
      <div ref={hostRef} className={styles.field} aria-hidden="true">
        {status === "failed" && <QuizFallback scores={scores} step={step} done={done} />}
      </div>
    </CutCorner>
  );
}

/** Flat version for browsers without WebGL. */
function QuizFallback({ scores, step, done }: QuizFieldProps) {
  return (
    <Columns
      heights={scores.map((score) => (score === null ? 14 : 55 + 200 * ((2 - score) / 2)))}
      colors={scores.map((score, i) => (!done && i === step ? "#A9BCFF" : score === null ? "#2A3C93" : "#4F78FF"))}
      width={40}
      gap={14}
      height={260}
      className={styles.fallback}
    />
  );
}
