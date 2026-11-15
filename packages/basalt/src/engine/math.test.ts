import { clamp01, damp, ease, rng } from "./math";

describe("math", () => {
  it("clamps to 0..1", () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(3)).toBe(1);
  });

  it("eases between 0 and 1", () => {
    for (const fn of [ease.outCubic, ease.inOutCubic, ease.outBack]) {
      expect(fn(0)).toBeCloseTo(0);
      expect(fn(1)).toBeCloseTo(1);
    }
  });

  it("damps towards the target without overshooting", () => {
    const value = damp(0, 10, 5, 0.1);
    expect(value).toBeGreaterThan(0);
    expect(value).toBeLessThan(10);
  });

  it("gives the same random sequence for the same seed", () => {
    const a = rng(7);
    const b = rng(7);
    const first = [a(), a(), a()];
    expect([b(), b(), b()]).toEqual(first);
    first.forEach((n) => expect(n).toBeGreaterThanOrEqual(0));
    first.forEach((n) => expect(n).toBeLessThan(1));
  });
});
