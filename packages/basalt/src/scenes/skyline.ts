/** Footer: a row of dark columns under the call to action; they rise where the cursor is. */
import * as THREE from "three";

import { BasaltField } from "../engine/field";
import { cellAt, hexCells, ROOT3 } from "../engine/hex";
import { rng } from "../engine/math";
import type { SceneController, SkylineSceneParams } from "../types";

export function mountSkylineScene(host: HTMLElement, { region, compact }: SkylineSceneParams): SceneController | null {
  const count = compact ? 22 : 46;
  const depth = 3;
  const cells = hexCells(count, depth);
  const random = rng(11);
  const front = cells.filter((c) => c.r === depth - 1);
  const mint = cells.indexOf(cellAt(front, Math.round(front.length * 0.7)));
  const goals = cells.map((c, i) =>
    i === mint ? 3.0 : 0.5 + random() * 0.7 + Math.sin(c.c / 3.1) * 0.2 + (depth - 1 - c.r) * 0.35,
  );

  const field = new BasaltField(host, {
    cells,
    mintIndex: mint,
    goals,
    region,
    trackX: true,
    trackY: -0.2,
    hitPlaneZ: true,
    liftX: true,
    fov: 20,
    cam: [0, 5.4, 18],
    look: [0, 0.7, 0],
    parallax: [0.6, 0],
    fog: "#14181F",
    fogNear: 14,
    fogFar: 46,
    deep: "#1C2333",
    bright: "#34426C",
    hLo: 0.4,
    hHi: 2.0,
    hemi: 0.55,
    key: 0.85,
    rim: 1.7,
    lift: 1.2,
    liftRadius: 1.25,
    liftColor: "#4F78FF",
    idleAmp: 0.03,
    introSpread: 0.9,
    introMintDelay: 1.25,
    glow: 2.2,
    // Fit the whole row to the width of the footer.
    fit: (f, aspect) => {
      const half = (count * ROOT3 * 0.5) / 2;
      const horizontalFov = Math.atan(Math.tan(THREE.MathUtils.degToRad(f.o.fov / 2)) * aspect);
      f.o.cam = [0, 5.4, (half / Math.tan(horizontalFov)) * 0.94];
    },
  });
  if (!field.ok) {
    field.dispose();
    return null;
  }
  return { dispose: () => field.dispose() };
}
