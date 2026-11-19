/**
 * Home hero: an uneven basalt landscape ("chaos") that settles into ordered terraces around
 * the mint column ("a system") as the visitor scrolls. Columns lift under the cursor and a
 * click sends a ripple through the field.
 */
import { BasaltField } from "../engine/field";
import { cellAt, hexCells, nearest, ziggurat } from "../engine/hex";
import { clamp01, ease, rng } from "../engine/math";
import { isCalm } from "../engine/motion";
import type { HeroSceneParams, SceneController } from "../types";

export function mountHeroScene(
  host: HTMLElement,
  { section, compact, onProgress }: HeroSceneParams,
): SceneController | null {
  const cells = hexCells(compact ? 13 : 26, compact ? 12 : 15);
  const mint = nearest(cells, compact ? { x: 1.6, z: -1.2 } : { x: 3.9, z: -1.0 });
  const centre = cellAt(cells, mint);
  const random = rng(7);

  const chaos = cells.map((c) => {
    const d = Math.hypot(c.x - centre.x, (c.z - centre.z) * 1.1);
    return 0.42 + 2.7 * Math.exp(-(d * d) / 17) + (random() - 0.5) * 0.5 + Math.max(0, -c.z) * 0.06;
  });
  let tallest = 0;
  chaos.forEach((h, i) => {
    if (i !== mint) tallest = Math.max(tallest, h);
  });
  chaos[mint] = tallest + 0.9;
  const order = ziggurat(cells, centre);
  order[mint] = 4.1;

  let shown = -1;
  const field = new BasaltField(host, {
    cells,
    mintIndex: mint,
    goals: chaos,
    fov: compact ? 34 : 30,
    cam: compact ? [-1.2, 8.2, 12.8] : [-3.4, 7.6, 12.8],
    look: compact ? [0.5, 1.75, -1.0] : [1.7, 1.65, -0.9],
    cam2: compact ? [-0.8, 11.6, 9.4] : [-2.4, 11.6, 9.6],
    look2: compact ? [0.7, 0.3, -1.4] : [1.9, 0.35, -1.5],
    fogNear: 16,
    fogFar: 35,
    alpha: false,
    lift: compact ? 0 : 0.95,
    liftRadius: 1.15,
    liftColor: "#6F8DFF",
    ripple: true,
    hitY: 1.4,
    introSpread: 0.9,
    beforeUpdate: (_time, f) => {
      const rect = section.getBoundingClientRect();
      const progress = isCalm() ? 0 : clamp01(-rect.top / (rect.height * 0.7));
      if (Math.abs(progress - shown) < 0.0008) return;
      shown = progress;
      const k = ease.inOutCubic(progress);
      f.setGoalsNow((_cell, i) => {
        const from = chaos[i] ?? 0;
        return from + ((order[i] ?? from) - from) * k;
      });
      f.camK = k;
      onProgress?.(progress);
    },
  });

  if (!field.ok) {
    field.dispose();
    return null;
  }
  return { dispose: () => field.dispose() };
}
