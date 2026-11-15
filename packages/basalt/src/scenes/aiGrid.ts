/**
 * AI statistic: 100 columns, one per 1% of Icelandic companies.
 * 50 use AI (light blue), 14 of those have a policy (cobalt); the rest are grey.
 */
import * as THREE from "three";

import { BasaltField } from "../engine/field";
import { hexCells } from "../engine/hex";
import type { AiGridController, AiGroup } from "../types";

/** 2 = uses AI and has a policy, 1 = uses AI without a policy, 0 = does not use AI. */
type Group = 0 | 1 | 2;
const HEIGHTS = [0.16, 1.0, 1.7] as const;

export function mountAiGridScene(host: HTMLElement): AiGridController | null {
  const cells = hexCells(10, 10);
  const group = cells.map((_, i): Group => (i < 14 ? 2 : i < 50 ? 1 : 0));
  const groupOf = (i: number): Group => group[i] ?? 0;
  const colors = [new THREE.Color("#D3DAE6"), new THREE.Color("#9DB2FF"), new THREE.Color("#2B59FF")] as const;
  const members: Record<AiGroup, (i: number) => boolean> = {
    use: (i) => groupOf(i) >= 1,
    policy: (i) => groupOf(i) === 2,
    gap: (i) => groupOf(i) === 1,
  };

  const field = new BasaltField(host, {
    cells,
    goals: group.map((g) => HEIGHTS[g]),
    lighting: "light",
    fog: "#FFFFFF",
    fogNear: 20,
    fogFar: 42,
    colorOf: (i) => colors[groupOf(i)],
    dimColor: "#EEF2F8",
    dimMix: 0.8,
    emphMix: 0,
    emphLift: 0.25,
    fov: 25,
    cam: [0, 13.4, 13.2],
    look: [0, 0.1, -0.1],
    parallax: [0.8, 0.4],
    lift: 0.35,
    liftRadius: 0.75,
    hitY: 0.9,
    idleAmp: 0.02,
    introDur: 0.9,
    introDelay: (_c, i, random) =>
      groupOf(i) === 0 ? 0.05 + random() * 0.25 : groupOf(i) === 1 ? 0.45 + (i - 14) * 0.014 : 1.3 + i * 0.03,
  });
  if (!field.ok) {
    field.dispose();
    return null;
  }

  return {
    highlight(key) {
      field.setEmphasis(key ? Uint8Array.from(cells, (_, i) => (members[key](i) ? 1 : 0)) : null);
    },
    dispose: () => field.dispose(),
  };
}
