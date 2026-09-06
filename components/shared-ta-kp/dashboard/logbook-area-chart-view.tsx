"use client";

import { Area, AreaChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Users } from "lucide-react";
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

export interface LogbookAreaItem {
  bab: string;
  students: number;
}

interface LogbookAreaChartViewProps {
  data: LogbookAreaItem[];
  loading: boolean;
  error: boolean;
  belumBimbingan?: number;
  title?: string;
  description?: string;
}

const chartConfig: ChartConfig = {
  students: { label: "Jml mhs", color: "#2463EB" },
};

export function LogbookAreaChartView({
  data,
  loading,
  error,
  belumBimbingan,
  title = "Statistik Logbook",
  description = "Jumlah mahasiswa yang mengisi Bab 1 - Bab 5",
}: LogbookAreaChartViewProps) {
  if (error) {
    return (
      <Card className="shadow-none border-none mx-auto !p-0">
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
    <Card className="shadow-none border-none mx-auto !p-0">
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
          <ChartContainer config={chartConfig}>
            <AreaChart data={data} margin={{ top: 20, right: 25, left: 25 }}>
              <defs>
                <linearGradient id="fillStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#2463EB" stopOpacity={0.4} />
                  <stop offset="90%" stopColor="#2463EB" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="bab"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Area
                dataKey="students"
                type="monotone"
                stroke="#2463EB"
                strokeWidth={2}
                fill="url(#fillStudents)"
                dot={{ fill: "#2463EB", r: 3 }}
              >
                <LabelList
                  dataKey="students"
                  position="top"
                  className="fill-foreground"
                  fontSize={12}
                />
              </Area>
            </AreaChart>
          </ChartContainer>
        )}

        {!loading && belumBimbingan !== undefined && (
          <div className="mx-4 mb-4 mt-2 flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 shrink-0 text-blue-600" />
            <span>
              <span className="font-semibold text-foreground">
                {belumBimbingan}
              </span>{" "}
              Total Mahasiswa belum bimbingan (ikut TA tapi belum mengisi logbook)
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
