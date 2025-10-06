type BoxStats = {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
};

export type BoxWhiskerChartProps = {
  stats: BoxStats;
  width?: number;
  height?: number;
  padding?: number;
  title?: string;
  showValues?: boolean;
  className?: string;
};

export default function BoxWhiskerChart({
  stats,
  width = 700,
  height = 120,
  padding = 48,
  showValues = true,
}: BoxWhiskerChartProps) {
  const { min, q1, median, q3, max } = stats;
  const range = max - min || 1;
  const innerWidth = width - padding * 2;
  const centerY = height / 2;
  const boxHeight = 28;

  const x = (v: number) => padding + ((v - min) / range) * innerWidth;
  const xMin = x(min);
  const xQ1 = x(q1);
  const xMed = x(median);
  const xQ3 = x(q3);
  const xMax = x(max);

  return (
    <svg width={width} height={height} className="block">
      <line
        x1={padding}
        y1={centerY}
        x2={width - padding}
        y2={centerY}
        strokeWidth={2}
        className="stroke-primary/30 stroke"
      />
      <line
        x1={xMin}
        y1={centerY}
        x2={xQ1}
        y2={centerY}
        className="stroke-primary/30 stroke"
        strokeWidth={2}
      />
      <line
        x1={xQ3}
        y1={centerY}
        x2={xMax}
        y2={centerY}
        className="stroke-primary/30 stroke"
        strokeWidth={2}
      />
      <line
        x1={xMin}
        y1={centerY - boxHeight / 4}
        x2={xMin}
        y2={centerY + boxHeight / 4}
        className="stroke-primary/30 stroke"
        strokeWidth={2}
      />
      <line
        x1={xMax}
        y1={centerY - boxHeight / 4}
        x2={xMax}
        y2={centerY + boxHeight / 4}
        className="stroke-primary/30 stroke"
        strokeWidth={2}
      />

      <rect
        x={xQ1}
        y={centerY - boxHeight / 2}
        width={Math.max(1, xQ3 - xQ1)}
        height={boxHeight}
        className="stroke fill-sidebar stroke-primary/30"
        rx={6}
      />

      <line
        x1={xMed}
        y1={centerY - boxHeight / 2}
        x2={xMed}
        y2={centerY + boxHeight / 2}
        className="stroke-primary/30 stroke"
        strokeWidth={2.5}
      />

      {showValues && (
        <g className="fill-muted-foreground text-xs">
          <text x={xMin} y={centerY - boxHeight / 2 - 8} textAnchor="middle">
            {min}
          </text>
          <text x={xQ1} y={centerY - boxHeight / 2 - 8} textAnchor="middle">
            {q1}
          </text>
          <text x={xMed} y={centerY - boxHeight / 2 - 8} textAnchor="middle">
            {median}
          </text>
          <text x={xQ3} y={centerY - boxHeight / 2 - 8} textAnchor="middle">
            {q3}
          </text>
          <text x={xMax} y={centerY - boxHeight / 2 - 8} textAnchor="middle">
            {max}
          </text>
        </g>
      )}
    </svg>
  );
}

// Example usage:
// <BoxWhiskerChart stats={{ min: 10, q1: 15, median: 20, q3: 25, max: 30 }} title="Summary" />
