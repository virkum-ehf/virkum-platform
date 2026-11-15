import { Columns } from "@virkum/ui";

/** Highest earnings ratio on the chart's scale, in percent. */
const SCALE_MAX = 18;
const CHART_HEIGHT = 108;

type ScenarioChartProps = {
  /** Today's earnings ratio, in percent. */
  baseline: number;
  /** The scenario's earnings ratio, in percent. */
  target: number;
  highlight: boolean;
};

/** Two columns: today's ratio (grey) beside the scenario's ratio. Decorative. */
export function ScenarioChart({ baseline, target, highlight }: ScenarioChartProps) {
  const height = (value: number) => Math.max(2, Math.round((value / SCALE_MAX) * CHART_HEIGHT));
  return (
    <Columns
      heights={[height(baseline), height(target)]}
      colors={["#DDE3EC", highlight ? "#2B59FF" : "#1B2A6B"]}
      width={34}
      gap={10}
      height={110}
      rise
      step={160}
    />
  );
}
