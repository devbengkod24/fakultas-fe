"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const KP_BLUE_SHADES = ["#2463EB", "#60A8FA", "#90C6FE"];
const TA_BLUE_SHADES = ["#2463EB", "#60A8FA", "#90C6FE"];
const BK_BLUE_SHADES = ["#2463EB", "#5089EB", "#7BA8F0", "#A1C2F5", "#BFD9F9"];

interface DashboardData {
  kp?: {
    status_sidang?: {
      belum?: number;
      proses?: number;
      selesai?: number;
    };
  };
  ta?: {
    krs_distribusi?: {
      ta1?: number;
      ta2?: number;
      ta1_ta2?: number;
    };
  };
  bk?: {
    categories?: string[];
    data?: Record<string, number>;
  };
}

interface MiniChartsProps {
  data?: DashboardData;
  loading?: boolean;
}

const kpConfig: ChartConfig = {
  value: { label: "Jumlah Mahasiswa" },
};

const bkConfig: ChartConfig = {
  value: { label: "Jumlah Lulusan" },
};

const taConfig: ChartConfig = {
  value: { label: "Jumlah Mahasiswa" },
};

export const MiniCharts = ({ data, loading }: MiniChartsProps) => {
  const [bkCategory, setBkCategory] = useState("Seminar");

  const kpMiniBarData = [
    { name: "Belum", value: data?.kp?.status_sidang?.belum ?? 0 },
    { name: "Proses", value: data?.kp?.status_sidang?.proses ?? 0 },
    { name: "Selesai", value: data?.kp?.status_sidang?.selesai ?? 0 },
  ];

  const taMiniBarData = [
    { name: "TA 1", value: data?.ta?.krs_distribusi?.ta1 ?? 0 },
    { name: "TA 2", value: data?.ta?.krs_distribusi?.ta2 ?? 0 },
    { name: "TA 1 & TA 2", value: data?.ta?.krs_distribusi?.ta1_ta2 ?? 0 },
  ];

  const bkCategories = data?.bk?.categories ?? ["Seminar", "TOEFL", "LSP", "Workshop", "Softskill"];
  const bkMiniBarData = bkCategories.map((cat) => ({
    name: cat,
    value: data?.bk?.data?.[cat] ?? 0,
  }));

  const totalKp = kpMiniBarData.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return (
      <>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-gray-100 shadow-sm !p-0 w-full flex-1">
            <CardHeader className="items-start pt-5 pb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[200px] w-full px-4 pb-4 flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  return (
    <>
      {/* KP Mini Bar Chart */}
      <Card className="border border-gray-100 shadow-sm !p-0 w-full flex-1">
        <CardHeader className="items-start pt-5 pb-2">
          <CardTitle className="text-base font-semibold">
            Mata Kuliah KP
          </CardTitle>
          <CardDescription className="text-sm">
            Status Sidang KP ({totalKp} Mahasiswa)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[200px] w-full px-4 pb-4">
            <ChartContainer config={kpConfig} className="h-full w-full">
                <BarChart
                  data={kpMiniBarData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                  barCategoryGap="28%"
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                  />
                  <YAxis hide />
                  <ChartTooltip
                    cursor={{ fill: "#2463EB", fillOpacity: 0.05 }}
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
                    {kpMiniBarData.map((_, idx) => (
                      <Cell
                        key={`kp-cell-${idx}`}
                        fill={KP_BLUE_SHADES[idx] ?? "#2463EB"}
                      />
                    ))}
                  </Bar>
                </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* BK Mini Bar Chart */}
      <Card className="border border-gray-100 shadow-sm !p-0 w-full flex-1">
        <CardHeader className="items-start pt-5 pb-2">
          <div className="w-full flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-base font-semibold">
                Mata Kuliah BK
              </CardTitle>
              <CardDescription className="text-sm">
                Jumlah Kelulusan
              </CardDescription>
            </div>
            <select
              value={bkCategory}
              onChange={(e) => setBkCategory(e.target.value)}
              className="text-xs border border-input rounded-md px-2 py-1 bg-background font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer shrink-0"
            >
              {bkCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[200px] w-full px-4 pb-4">
            <ChartContainer config={bkConfig} className="h-full w-full">
                <BarChart
                  data={bkMiniBarData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  barCategoryGap="22%"
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    interval={0}
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                  />
                  <YAxis hide />
                  <ChartTooltip
                    cursor={{ fill: "#2463EB", fillOpacity: 0.05 }}
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={26}>
                    {bkMiniBarData.map((_, idx) => (
                      <Cell
                        key={`bk-cell-${idx}`}
                        fill={BK_BLUE_SHADES[idx] ?? "#2463EB"}
                      />
                    ))}
                  </Bar>
                </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* TA Mini Bar Chart */}
      <Card className="border border-gray-100 shadow-sm !p-0 w-full flex-1">
        <CardHeader className="items-start pt-5 pb-2">
          <CardTitle className="text-base font-semibold">
            Mata Kuliah TA
          </CardTitle>
          <CardDescription className="text-sm">
            Distribusi KRS TA
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[200px] w-full px-4 pb-4">
            <ChartContainer config={taConfig} className="h-full w-full">
                <BarChart
                  data={taMiniBarData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                  barCategoryGap="28%"
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                  />
                  <YAxis hide />
                  <ChartTooltip
                    cursor={{ fill: "#2463EB", fillOpacity: 0.05 }}
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
                    {taMiniBarData.map((_, idx) => (
                      <Cell
                        key={`ta-cell-${idx}`}
                        fill={TA_BLUE_SHADES[idx] ?? "#2463EB"}
                      />
                    ))}
                  </Bar>
                </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
