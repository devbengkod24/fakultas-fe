"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, PieChart } from "lucide-react";
import EmptyState from "@/components/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface RadialSegment {
  key: string;
  label: string;
  color: string;
  value: number;
}

interface RadialChartViewProps {
  segments: RadialSegment[];
  loading: boolean;
  error: boolean;
  title?: string;
  description?: string;
  centerLabel?: string;
}

export function RadialChartView({
  segments,
  loading,
  error,
  title = "Distribusi Mahasiswa",
  description = "Jumlah mahasiswa aktif periode saat ini",
  centerLabel = "Mahasiswa",
}: RadialChartViewProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  const chartConfig = segments.reduce<ChartConfig>((cfg, s) => {
    cfg[s.key] = { label: s.label, color: s.color };
    return cfg;
  }, {});

  const chartData = [
    segments.reduce<Record<string, number | string>>(
      (row, s) => {
        row[s.key] = s.value;
        return row;
      },
      { name: "chart" }
    ),
  ];

  // Semua segment nol tetap merender chart kosong (frame + legend tanpa bar) — kebaca "rusak"
  if (error || (!loading && total === 0)) {
    return (
      <Card className="mx-auto border border-gray-100 !p-0 shadow-sm">
        <CardHeader className="items-start pt-6">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={error ? AlertCircle : PieChart}
            title={error ? "Data tidak tersedia" : "Belum ada data"}
            subtitle={
              error
                ? "Gagal memuat data distribusi mahasiswa"
                : "Belum ada data untuk periode ini."
            }
            variant="small"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto border border-gray-100 !p-0 shadow-sm">
      <CardHeader className="items-start pt-6">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center p-0">
        {loading ? (
          <div className="w-full space-y-4 p-4">
            <Skeleton className="mx-auto h-4 w-32" />
            <Skeleton className="mx-auto h-[160px] w-[160px] rounded-full" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto mt-4 h-[200px] w-full"
          >
            <RadialBarChart
              data={chartData}
              endAngle={180}
              innerRadius={90}
              outerRadius={160}
              cy="60%"
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 16}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {total.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className="fill-muted-foreground"
                          >
                            {centerLabel}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
              {segments.map((s) => (
                <RadialBar
                  key={s.key}
                  dataKey={s.key}
                  stackId="a"
                  cornerRadius={5}
                  fill={s.color}
                  className="stroke-transparent stroke-2"
                />
              ))}
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col !p-0 !pb-4 !pl-4">
        <div className="flex w-full flex-wrap justify-center gap-2">
          {segments.map((s) => (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className="size-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-xs">
                {s.label}: {s.value} (
                {total > 0 ? ((s.value / total) * 100).toFixed(1) : "0"}%)
              </span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
