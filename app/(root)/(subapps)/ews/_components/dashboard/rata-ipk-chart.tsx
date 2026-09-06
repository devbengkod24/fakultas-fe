/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import useSWR from "swr";
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
import { EWSDashboardService } from "@/api/ews";
import { useProfile } from "@/context/profileUseContext";
import {
  isGeneralProdiFilter,
  useProdiFilter,
} from "@/context/prodiFilterContext";

const chartConfig = {
  ipk: {
    label: "IPK",
    color: "#2463EB",
  },
} satisfies ChartConfig;

const RataIpkChart = () => {
  const { profile } = useProfile();
  const role = profile?.roles;
  const { selectedProdiIds } = useProdiFilter();
  const isGeneral = isGeneralProdiFilter(selectedProdiIds);

  const prodiIdParam = isGeneral ? undefined : selectedProdiIds.join(",");

  const {
    data: response,
    isLoading,
    error,
  } = useSWR(
    role ? [`ews-ipk-chart-${role}`, prodiIdParam || "general"] : null,
    () =>
      role === "super_fakultas"
        ? EWSDashboardService.getSuperFakultasDashboard({ prodi_id: prodiIdParam })
        : EWSDashboardService.getAdminDashboard({ prodi_id: prodiIdParam }),
    { revalidateOnFocus: false }
  );

  const blueShades = ["#2463EB", "#60A8FA", "#3B85F6", "#90C6FE", "#BDDCFE"];

  const chartData = useMemo(() => {
    if (!response?.data) return [];

    return (response.data.rata_ipk_per_tahun || []).map((item: any, idx: number) => ({
      year: item.tahun?.toString() || item.tahun_masuk?.toString(),
      ipk: Number(Number(item.rata_ipk || 0).toFixed(2)),
      count: Number(item.jumlah_mahasiswa || 0),
      fill: blueShades[idx % blueShades.length],
    }));
  }, [response]);

  if (error) {
    return (
      <Card className="shadow-none border-none p-0">
        <CardHeader className="pt-6">
          <CardTitle>Rata-rata IPK</CardTitle>
          <CardDescription className="text-sm">
            Rata-rata IPK mahasiswa per angkatan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={AlertCircle}
            title="Data tidak tersedia"
            subtitle="Gagal memuat data rata-rata IPK"
            variant="small"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none border-none p-0">
      <CardHeader className="pt-6 pb-2">
        <CardTitle>Rata-rata IPK</CardTitle>
        <CardDescription className="text-sm">
          Rata-rata IPK mahasiswa per angkatan
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 px-2 pb-2">
        {isLoading ? (
          <div className="space-y-3 p-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-40 w-full" />
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-4 w-12" />
              ))}
            </div>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <BarChart
              barSize={40}
              data={chartData}
              margin={{ top: 20, right: 10, left: 10 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                hide
                domain={[0, 4]}
                ticks={[0, 1, 2, 3, 4]}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value: any) => [`${Number(value).toFixed(2)}`, "IPK"]}
                  />
                }
              />
              <Bar dataKey="ipk" radius={6}>
                <LabelList
                  dataKey="ipk"
                  position="top"
                  className="fill-foreground"
                  fontSize={11}
                  formatter={(value: any) => Number(value).toFixed(2)}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RataIpkChart;
