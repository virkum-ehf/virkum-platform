/** Hexagonal column layouts. */

export type Cell = {
  x: number;
  z: number;
  /** Column index in the grid. */
  c: number;
  /** Row index in the grid (0 = back row). */
  r: number;
};

export const ROOT3 = Math.sqrt(3);

/**
 * A hex grid centred on the origin. A vertex of each column faces the camera (+z),
 * which gives the tops the pointed silhouette the columns have in the logo.
 */
export function hexCells(cols: number, rows: number, radius = 0.5): Cell[] {
  const dx = ROOT3 * radius;
  const dz = 1.5 * radius;
  const cells: Cell[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({
        x: (c - (cols - 1) / 2) * dx + (r % 2 ? dx / 2 : 0) - dx / 4,
        z: (r - (rows - 1) / 2) * dz,
        c,
        r,
      });
    }
  }
  return cells;
}

/** The cell at `index`; throws if the layout has no such cell (a programming error). */
export function cellAt(cells: Cell[], index: number): Cell {
  const cell = cells[index];
  if (!cell) throw new RangeError(`No cell at index ${index} (layout has ${cells.length})`);
  return cell;
}

/** Index of the cell closest to a point on the ground plane. */
export function nearest(cells: Cell[], point: { x: number; z: number }): number {
  let best = 0;
  let bestDistance = Infinity;
  cells.forEach((cell, i) => {
    const d = (cell.x - point.x) ** 2 + (cell.z - point.z) ** 2;
    if (d < bestDistance) {
      bestDistance = d;
      best = i;
    }
  });
  return best;
}

/** Ordered terraces that step down evenly from a centre column ("the system"). */
export function ziggurat(cells: Cell[], centre: Cell, top = 3.0, step = 0.36, floor = 0.32): number[] {
  return cells.map((c) =>
    Math.max(floor, top - Math.round(Math.hypot(c.x - centre.x, c.z - centre.z) / (ROOT3 * 0.5)) * step),
  );
}
