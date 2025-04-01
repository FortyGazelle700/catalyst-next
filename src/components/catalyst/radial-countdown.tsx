"use client";

import {
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Label,
  PolarGrid,
} from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export function RadialCountdown({
  percentage,
  className,
}: {
  percentage: number;
  className?: string;
}) {
  const color = "var(--primary)";

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
      className={cn("h-8 w-8 pointer-events-none", className)}
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
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false} />
      </RadialBarChart>
    </ChartContainer>
  );
}
