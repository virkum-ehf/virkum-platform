import type { CSSProperties } from "react";

type ColumnsProps = {
  /** Height of each column, in viewBox units. */
  heights: number[];
  /** Fill of each column. */
  colors: string[];
  /** Column width and gap, in viewBox units. */
  width?: number;
  gap?: number;
  /** Total height of the drawing (defaults to the tallest column). */
  height?: number;
  /** Dashed outline per column (for "missing" columns). */
  strokes?: Array<string | undefined>;
  /** Columns grow from their base in order when a parent `.rise` / `.rise-now` starts. */
  rise?: boolean;
  /** Delay between columns, ms. */
  step?: number;
  /** Extra delay per column index, ms (the mint column arrives last). */
  late?: Record<number, number>;
  className?: string;
  style?: CSSProperties;
};

/**
 * A row of basalt columns with pointed tops, drawn like the logo's columns
 * (peak = 0.29 × width). Purely decorative.
 */
export function Columns({
  heights,
  colors,
  width: w = 12,
  gap = 6,
  height,
  strokes = [],
  rise = false,
  step = 45,
  late = {},
  className,
  style,
}: ColumnsProps) {
  const n = heights.length;
  const totalWidth = n * w + (n - 1) * gap;
  const totalHeight = height ?? Math.max(...heights);
  const peak = w * 0.29;

  return (
    <svg
      className={className}
      style={{ "--step": `${step}ms`, ...style } as CSSProperties}
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      aria-hidden="true"
      focusable="false"
    >
      {heights.map((h, i) => {
        const x = i * (w + gap);
        const top = totalHeight - h;
        const d = `M${x} ${totalHeight}V${(top + peak).toFixed(2)}L${(x + w / 2).toFixed(2)} ${top.toFixed(2)}L${x + w} ${(top + peak).toFixed(2)}V${totalHeight}Z`;
        const stroke = strokes[i];
        const animation = rise
          ? ({ "--i": i, ...(late[i] ? { "--d": `${late[i]}ms` } : {}) } as CSSProperties)
          : undefined;
        return (
          <path
            key={i}
            d={d}
            fill={colors[i]}
            className={rise ? "cr" : undefined}
            style={animation}
            {...(stroke ? { stroke, strokeWidth: 1.5, strokeDasharray: "4 4" } : {})}
          />
        );
      })}
    </svg>
  );
}
