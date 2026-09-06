"use client";

import React, { useState } from "react";
import useSWR from "swr";
import {
  Area,
  AreaChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";
import { AdminFakultasDashboardService } from "@/api/admin-fakultas";

interface MonthlyVisitorData {
  month: string;
  visitors: number;
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Ags", "Sep", "Okt", "Nov", "Des",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

const chartConfig: ChartConfig = {
  visitors: { label: "Pengunjung", color: "#2463EB" },
};

export const VisitorStatsChart = () => {
  const [selectedYear, setSelectedYear] = useState<string>(String(CURRENT_YEAR));

  const { data: response, isLoading } = useSWR(
    ["admin-fakultas-visitor-stats", selectedYear],
    () => AdminFakultasDashboardService.getVisitorStats(Number(selectedYear)),
    { revalidateOnFocus: false },
  );

  const rawData: { month: number; visitors: number }[] = response?.data || [];
  const data: MonthlyVisitorData[] =
    rawData.length > 0
      ? rawData.map((item) => ({
          month: MONTH_LABELS[item.month - 1],
          visitors: item.visitors,
        }))
      : MONTH_LABELS.map((month) => ({ month, visitors: 0 }));

  const totalVisitors = data.reduce((acc, curr) => acc + curr.visitors, 0);

  return (
    <Card className="shadow-none border border-gray-200 p-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
        <div>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <Activity className="size-4 text-blue-500" />
            Statistik Pengunjung Website
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            Jumlah trafik kunjungan halaman Landing Fakultas per bulan
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-8 w-[90px] text-xs">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              {YEAR_OPTIONS.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 pb-6 pt-2">
        <div className="mb-4 px-2 flex items-center gap-2">
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <>
              <span className="text-2xl font-bold text-gray-900">
                {totalVisitors.toLocaleString("id-ID")}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Total kunjungan tahun {selectedYear}
              </span>
            </>
          )}
        </div>

        {isLoading ? (
          <Skeleton className="h-[220px] w-full" />
        ) : (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[220px] w-full"
        >
          <AreaChart
            data={data}
            margin={{ top: 20, right: 15, left: 15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="#2463EB" stopOpacity={0.4} />
                <stop offset="90%" stopColor="#2463EB" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            <YAxis hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey="visitors"
              type="monotone"
              stroke="#2463EB"
              strokeWidth={2}
              fill="url(#fillVisitors)"
              dot={{ fill: "#2463EB", r: 3 }}
            >
              <LabelList
                dataKey="visitors"
                position="top"
                className="fill-foreground"
                fontSize={11}
              />
            </Area>
          </AreaChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
