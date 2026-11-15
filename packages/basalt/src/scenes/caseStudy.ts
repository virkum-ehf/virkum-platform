/** Case study result panel: a small field rising to the mint column. */
import { BasaltField } from "../engine/field";
import { cellAt, hexCells, nearest } from "../engine/hex";
import { rng } from "../engine/math";
import type { SceneController } from "../types";

export function mountCaseStudyScene(host: HTMLElement): SceneController | null {
  const cells = hexCells(9, 7);
  const mint = nearest(cells, { x: 1.0, z: -0.6 });
  const centre = cellAt(cells, mint);
  const random = rng(5);
  const goals = cells.map((c) => {
    const d = Math.hypot(c.x - centre.x, c.z - centre.z);
    return 0.4 + 2.0 * Math.exp(-(d * d) / 9) + (random() - 0.5) * 0.35;
  });
  let top = 0;
  goals.forEach((h, i) => {
    if (i !== mint) top = Math.max(top, h);
  });
  goals[mint] = top + 0.8;

  const field = new BasaltField(host, {
    cells,
    mintIndex: mint,
    goals,
    cam: [-1.4, 6.6, 9.6],
    look: [0.5, 1.0, -0.4],
    fogNear: 10,
    fogFar: 22,
    lift: 0.55,
    liftRadius: 0.9,
    liftColor: "#6F8DFF",
    ripple: true,
    hitY: 1.0,
    introSpread: 0.6,
  });
  if (!field.ok) {
    field.dispose();
    return null;
  }
  return { dispose: () => field.dispose() };
}
