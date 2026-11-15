/** Small numeric helpers shared by the basalt scenes. */

export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const ease = {
  outCubic: (k: number) => 1 - Math.pow(1 - k, 3),
  inOutCubic: (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
  /** Slight overshoot, used for the mint column so it "arrives". */
  outBack: (k: number) => {
    const c1 = 1.25;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2);
  },
};

/** Frame-rate independent smoothing towards a target. */
export const damp = (from: number, to: number, lambda: number, dt: number): number =>
  from + (to - from) * (1 - Math.exp(-lambda * dt));

/** Seeded random numbers (mulberry32), so every visitor sees the same landscape. */
export function rng(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
