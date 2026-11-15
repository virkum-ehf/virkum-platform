import { cn } from "@virkum/ui";
import type { CSSProperties } from "react";

type ProgressColumnsProps = {
  /** Index of the current question. */
  step: number;
  total: number;
  finished: boolean;
  className?: string;
};

const WIDTH = 18;
const GAP = 8;
const PEAK = WIDTH * 0.29;

/**
 * Quiz progress as a row of rising columns: answered ones are cobalt, the current one is
 * outlined, the rest are grey. The column just answered rises into place (render with
 * `key={step}` so it replays on every step).
 */
export function ProgressColumns({ step, total, finished, className }: ProgressColumnsProps) {
  const heights = Array.from({ length: total }, (_, i) => 22 + i * 7);
  const H = Math.max(...heights) + 2;

  return (
    <svg
      className={cn("rise-now", className)}
      viewBox={`0 0 ${total * (WIDTH + GAP) - GAP + 2} ${H}`}
      aria-hidden="true"
      focusable="false"
    >
      {heights.map((h, i) => {
        const x = i * (WIDTH + GAP) + 1;
        const top = H - h;
        const d = `M${x} ${H - 1}V${(top + PEAK).toFixed(2)}L${x + WIDTH / 2} ${top}L${x + WIDTH} ${(top + PEAK).toFixed(2)}V${H - 1}Z`;
        if (finished && i === total - 1) return <path key={i} d={d} fill="#2EE6A8" />;
        if (finished || i < step) {
          const justAnswered = i === step - 1;
          return (
            <path
              key={i}
              d={d}
              fill="#2B59FF"
              className={justAnswered ? "cr" : undefined}
              style={justAnswered ? ({ "--i": 0 } as CSSProperties) : undefined}
            />
          );
        }
        if (i === step) return <path key={i} d={d} fill="#EEF2FF" stroke="#2B59FF" strokeWidth={1.5} />;
        return <path key={i} d={d} fill="#DDE3EC" />;
      })}
    </svg>
  );
}
