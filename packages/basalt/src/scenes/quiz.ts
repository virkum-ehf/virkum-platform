/**
 * Self-assessment: one column per question. Each answer sets its column's height
 * (taller = runs more independently); the current question is highlighted.
 */
import * as THREE from "three";

import { BasaltField } from "../engine/field";
import type { Cell } from "../engine/hex";
import type { QuizController } from "../types";

const UNANSWERED = 0.14;
const GAP_X = 1.08;

export function mountQuizScene(host: HTMLElement, questionCount: number): QuizController | null {
  const n = questionCount;
  const cells: Cell[] = Array.from({ length: n }, (_, i) => ({ x: (i - (n - 1) / 2) * GAP_X, z: 0, c: i, r: 0 }));

  const field = new BasaltField(host, {
    cells,
    goals: Array(n).fill(UNANSWERED),
    fov: 30,
    cam: [0, 4.2, 12],
    look: [0, 1.25, 0],
    // Keep every column in view whatever the panel's width.
    fit: (f, aspect) => {
      const half = ((n - 1) / 2) * GAP_X + 0.75;
      const horizontalFov = Math.atan(Math.tan(THREE.MathUtils.degToRad(f.o.fov / 2)) * aspect);
      const distance = Math.max(7.5, half / Math.tan(horizontalFov));
      f.o.cam = [0, 1.25 + distance * 0.28, distance];
    },
    fogNear: 10,
    fogFar: 24,
    hLo: 0.2,
    hHi: 2.6,
    deep: "#22348F",
    bright: "#4F78FF",
    idleAmp: 0.03,
    lift: 0.3,
    liftRadius: 0.6,
    hitY: 1,
    emphColor: "#A9BCFF",
    emphMix: 0.65,
    dimMix: 0.12,
    parallax: [0.6, 0.3],
    introSpread: 0.4,
  });
  if (!field.ok) {
    field.dispose();
    return null;
  }

  let finished = false;
  return {
    setAnswers(scores, currentStep, done) {
      const goals = scores.map((score) => (score === null ? UNANSWERED : 0.55 + 2.0 * ((2 - score) / 2)));
      field.setGoals(goals, { dur: 0.9, stagger: (_c, i) => i * 0.04 });
      field.setEmphasis(done ? null : Uint8Array.from(goals, (_, i) => (i === currentStep ? 1 : 0)));
      if (done && !finished) field.addRipple(0, 0, 0.45);
      finished = done;
    },
    dispose: () => field.dispose(),
  };
}
