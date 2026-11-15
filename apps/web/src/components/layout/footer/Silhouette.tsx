import { rng } from "@virkum/basalt/math";
import { Columns } from "@virkum/ui";

/** Flat SVG skyline: the footer's fallback when the 3D skyline cannot run. */
export function Silhouette({ className }: { className?: string }) {
  const random = rng(11);
  const count = 46;
  const mintAt = 33;
  const shades = ["#191E27", "#1B212B", "#1D2330"];
  const heights = Array.from({ length: count }, (_, i) =>
    i === mintAt ? 196 : Math.round(58 + random() * 62 + Math.sin(i / 3.1) * 16),
  );
  const colors = heights.map((_, i) =>
    i === mintAt ? "#2EE6A8" : (shades[Math.floor(random() * shades.length)] ?? "#191E27"),
  );
  return (
    <Columns
      heights={heights}
      colors={colors}
      width={26}
      gap={6}
      height={200}
      rise
      step={16}
      late={{ [mintAt]: 520 }}
      className={className}
    />
  );
}
