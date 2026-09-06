"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import EmptyState from "@/components/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";

export interface GrowthChartItem {
  periode: string;
  students: number;
  label: string;
}

interface StudentGrowthChartViewProps {
  data: GrowthChartItem[];
  loading: boolean;
  error: boolean;
  title?: string;
  description?: string;
}

const chartConfig = {
  students: {
    label: "Jumlah Mahasiswa",
    color: "#2463EB",
  },
} satisfies ChartConfig;

export function StudentGrowthChartView({
  data,
  loading,
  error,
  title = "Statistik Mahasiswa",
  description = "Perkembangan jumlah mahasiswa aktif",
}: StudentGrowthChartViewProps) {
  if (error) {
    return (
      <Card className="shadow-none border-none mx-auto !p-0 bg-gradient-to-br from-blue-50/30 to-white">
        <CardHeader className="pt-6">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={AlertCircle}
            title="Data tidak tersedia"
            subtitle="Gagal memuat data statistik mahasiswa"
            variant="small"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none border-none mx-auto !p-0 bg-gradient-to-br from-blue-50/30 to-white">
      <CardHeader className="pt-6">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-[120px] w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
              <AreaChart
                data={data}
                margin={{ right: 20, left: -20, bottom: 5, top: 5 }}
              >
                <defs>
                  <linearGradient
                    id="colorStudents"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                    gradientUnits="objectBoundingBox"
                  >
                    <stop offset="0%" stopColor="#2463EB" stopOpacity={0.4} />
                    <stop offset="40%" stopColor="#2463EB" stopOpacity={0.2} />
                    <stop offset="80%" stopColor="#2463EB" stopOpacity={0.1} />
                    <stop
                      offset="100%"
                      stopColor="#2463EB"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                  <filter
                    id="shadow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="180%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="2"
                      stdDeviation="3"
                      floodColor="#2463EB"
                      floodOpacity="0.1"
                    />
                  </filter>
                </defs>
                <CartesianGrid
                  strokeDasharray="2 4"
                  stroke="#e5e7eb"
                  vertical={false}
                  horizontal={true}
                  opacity={0.3}
                />
                <XAxis
                  dataKey="periode"
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
                  tickMargin={12}
                  tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 500 }}
                  className="text-xs"
                  padding={{ left: 0, right: 0 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
                  tickMargin={12}
                  tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 500 }}
                  padding={{ top: 10, bottom: 10 }}
                />
                <ChartTooltip
                  cursor={{
                    stroke: "#2463EB",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                    opacity: 0.5,
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200/50 rounded-xl shadow-xl">
                          <p className="text-xs font-semibold text-gray-900 mb-2">
                            {d.label}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-[#2463EB] rounded-sm" />
                            <span className="text-xs text-gray-600">
                              Jumlah Mahasiswa:{" "}
                              <span className="font-bold text-[#2463EB] text-xs">
                                {d.students}
                              </span>
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="#2463EB"
                  strokeWidth={2}
                  fill="url(#colorStudents)"
                  fillOpacity={1}
                  filter="url(#shadow)"
                  connectNulls={false}
                  dot={{
                    fill: "#2463EB",
                    strokeWidth: 1,
                    r: 3,
                    stroke: "#ffffff",
                    filter: "url(#shadow)",
                  }}
                  activeDot={{
                    r: 5,
                    fill: "#2463EB",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                    filter: "url(#shadow)",
                    style: { cursor: "pointer" },
                  }}
                />
              </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
