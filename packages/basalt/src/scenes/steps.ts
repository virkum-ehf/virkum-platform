/**
 * Services story, three states:
 * 0 — a scan sweeps the field and flags four sunken columns (the bottlenecks);
 * 1 — everything moves into order and the mint column rises;
 * 2 — the system runs on a steady pulse.
 */
import { BasaltField } from "../engine/field";
import { cellAt, hexCells, nearest, ziggurat } from "../engine/hex";
import { rng } from "../engine/math";
import type { StepsController } from "../types";

const BOTTLENECKS = [14, 31, 47, 66];

export function mountStepsScene(host: HTMLElement): StepsController | null {
  const cells = hexCells(11, 8);
  const mint = nearest(cells, { x: 1.2, z: -0.6 });
  const centre = cellAt(cells, mint);
  const random = rng(21);
  const flags = new Uint8Array(cells.length);
  const chaos = cells.map((_, i) => (i === mint ? 0.02 : 0.5 + random() * 1.55));
  BOTTLENECKS.forEach((i) => {
    if (i !== mint) {
      flags[i] = 1;
      chaos[i] = 0.24;
    }
  });
  const order = ziggurat(cells, centre, 2.7, 0.34, 0.3);
  order[mint] = 3.7;

  const field = new BasaltField(host, {
    cells,
    mintIndex: mint,
    goals: chaos,
    cam: [-1.7, 7.4, 11.0],
    look: [0.6, 0.95, -0.4],
    fogNear: 12,
    fogFar: 26,
    lift: 0.55,
    liftRadius: 1.0,
    liftColor: "#6F8DFF",
    hitY: 1.0,
    introSpread: 0.7,
  });
  if (!field.ok) {
    field.dispose();
    return null;
  }
  field.flags = flags;
  field.scan = true;

  let current = 0;
  const sweep = (c: { x: number }) => ((c.x - field.minX) / field.spanX) * 0.35;

  return {
    setStep(step) {
      if (step === current) return;
      current = step;
      if (step === 0) {
        field.setGoals(chaos, { dur: 1.0, stagger: sweep });
        field.scan = true;
        field.pulse = 0;
      } else {
        field.setGoals(order, { dur: 1.25, stagger: (c, i) => (i === mint ? 0.5 : sweep(c)) });
        field.scan = false;
        field.pulse = step === 2 ? 2.4 : 0;
      }
    },
    dispose: () => field.dispose(),
  };
}
