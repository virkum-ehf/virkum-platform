import { hexCells, nearest, ROOT3, ziggurat } from "./hex";

describe("hex layout", () => {
  it("creates cols × rows cells centred on the origin", () => {
    const cells = hexCells(10, 10);
    expect(cells).toHaveLength(100);
    const meanX = cells.reduce((sum, c) => sum + c.x, 0) / cells.length;
    const meanZ = cells.reduce((sum, c) => sum + c.z, 0) / cells.length;
    expect(Math.abs(meanX)).toBeLessThan(0.01);
    expect(Math.abs(meanZ)).toBeLessThan(0.01);
  });

  it("spaces neighbouring columns one hex width apart", () => {
    const [a, b] = hexCells(2, 1);
    expect(b!.x - a!.x).toBeCloseTo(ROOT3 * 0.5);
  });

  it("finds the nearest cell", () => {
    const cells = hexCells(5, 5);
    const target = cells[12]!;
    expect(nearest(cells, { x: target.x + 0.05, z: target.z - 0.05 })).toBe(12);
  });

  it("steps terraces down from the centre and never below the floor", () => {
    const cells = hexCells(9, 9);
    const centre = cells[40]!;
    const heights = ziggurat(cells, centre, 3, 0.36, 0.32);
    expect(heights[40]).toBe(3);
    expect(Math.min(...heights)).toBeGreaterThanOrEqual(0.32);
  });
});
