"use client";

import { PolarRadiusAxis, RadialBar, RadialBarChart, Label } from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

export function RadialChart({ percentage }: { percentage: number }) {
  // Function to determine color based on percentage
  const getColor = (percent: number) => {
    if (percent >= 100) return "var(--color-blue-500)";
    if (percent >= 90) return "var(--color-green-500)";
    if (percent >= 80) return "var(--color-lime-500)";
    if (percent >= 70) return "var(--color-yellow-500)";
    if (percent >= 60) return "var(--color-amber-500)";
    if (percent == -1)
      return "color-mix(in oklab, var(--color-gray-500) 20%, transparent)";
    return "var(--color-red-500)";
  };

  const color = getColor(percentage);

  const chartData = [{ name: "progress", value: 1, fill: color }];

  // Required config for ChartContainer
  const chartConfig = {
    value: {
      label: "Percentage",
      color: color,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="pointer-events-none h-8 w-8"
    >
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={90 - ((percentage == -1 ? 100 : percentage) * 360) / 100}
        innerRadius={12}
        outerRadius={24}
        barSize={4}
      >
        <RadialBar
          dataKey="value"
          cornerRadius={2}
          fill={color}
          max={360}
          isAnimationActive={false}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (!viewBox) return null;

              const cx: number = (viewBox as { cx: number }).cx ?? 0;
              const cy: number = (viewBox as { cy: number }).cy ?? 0;

              return (
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan
                    x={cx}
                    y={cy}
                    style={{
                      fill: color,
                      fontSize: "0.5rem",
                      fontWeight: "bold",
                    }}
                  >
                    {percentage == -1 ? "—" : percentage.toFixed(0)}
                  </tspan>
                </text>
              );
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
