"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface LogbookBarItem {
  bab: string;
  students: number;
  fill: string;
}

interface LogbookBarChartViewProps {
  data: LogbookBarItem[];
  loading: boolean;
  error: boolean;
  title?: string;
  description?: string;
  barSize?: number;
}

const chartConfig: ChartConfig = {
  students: { label: "Jml mhs" },
};

export function LogbookBarChartView({
  data,
  loading,
  error,
  title = "Statistik Logbook",
  description = "Jumlah mahasiswa yang mengisi Bab 1 - Bab 5",
  barSize = 40,
}: LogbookBarChartViewProps) {
  if (error) {
    return (
      <Card className="border border-gray-100 shadow-sm mx-auto !p-0">
        <CardHeader className="pt-6">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={AlertCircle}
            title="Data tidak tersedia"
            subtitle="Gagal memuat data statistik logbook"
            variant="small"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-100 shadow-sm mx-auto !p-0">
      <CardHeader className="pt-6">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="space-y-3 p-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full" />
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-4 w-12" />
              ))}
            </div>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart
              barSize={barSize}
              data={data}
              margin={{ top: 20, right: 10, left: 10 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="bab"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="students" radius={6}>
                <LabelList
                  dataKey="students"
                  position="top"
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
