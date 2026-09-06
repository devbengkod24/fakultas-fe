/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import useSWR from "swr";
import {
  Label,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
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
  eligible: {
    label: "Eligible",
    color: "#2463EB",
  },
  non_eligible: {
    label: "Belum Eligible",
    color: "#60A8FA",
  },
} satisfies ChartConfig;

const StatistikKelulusanChart = () => {
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
    role ? [`ews-kelulusan-chart-${role}`, prodiIdParam || "general"] : null,
    () =>
      role === "super_fakultas"
        ? EWSDashboardService.getSuperFakultasDashboard({ prodi_id: prodiIdParam })
        : EWSDashboardService.getAdminDashboard({ prodi_id: prodiIdParam }),
    { revalidateOnFocus: false }
  );

  const stats = useMemo(() => {
    const rawStats = response?.data?.statistik_kelulusan;
    const tableData = response?.data?.tabel_ringkasan_prodi || [];

    if (isGeneral || tableData.length === 0) {
      return {
        eligible: Number(rawStats?.eligible || 0),
        non_eligible: Number(rawStats?.non_eligible || 0),
      };
    }

    const selectedData = tableData.filter((item: any) => 
      selectedProdiIds.includes(String(item.prodi?.id))
    );

    return {
      eligible: selectedData.reduce((acc: number, curr: any) => acc + Number(curr.eligible || 0), 0),
      non_eligible: selectedData.reduce((acc: number, curr: any) => acc + Number(curr.tidak_eligible || 0), 0),
    };
  }, [response, selectedProdiIds, isGeneral]);

  const eligible = stats.eligible;
  const nonEligible = stats.non_eligible;
  const total = eligible + nonEligible;
  const eligiblePercent =
    total > 0
      ? parseFloat(((eligible / total) * 100).toFixed(1))
      : 0;

  const chartData = [
    {
      name: "Kelulusan",
      eligible: eligible,
      non_eligible: nonEligible,
    },
  ];

  if (error) {
    return (
      <Card className="shadow-none border-none p-0">
        <CardHeader className="pt-6">
          <CardTitle>Statistik Kelulusan</CardTitle>
          <CardDescription className="text-sm">
            Persentase mahasiswa eligible wisuda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={AlertCircle}
            title="Data tidak tersedia"
            subtitle="Gagal memuat data statistik kelulusan"
            variant="small"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none border-none p-0">
      <CardHeader className="pt-6 pb-2">
        <CardTitle>Statistik Kelulusan</CardTitle>
        <CardDescription className="text-sm">
          Persentase mahasiswa eligible wisuda
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center p-0 px-2 pb-2">
        {isLoading ? (
          <div className="w-full space-y-4 p-4">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-[160px] w-[160px] rounded-full mx-auto" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto w-full h-[240px] mt-2"
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
                            {eligiblePercent}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className="fill-muted-foreground"
                          >
                            Eligible
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="eligible"
                stackId="a"
                cornerRadius={5}
                fill="var(--color-eligible)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="non_eligible"
                fill="var(--color-non_eligible)"
                stackId="a"
                cornerRadius={5}
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="!p-0 !pb-3 flex-col !pl-4">
        <div className="flex w-full justify-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div
              className="size-2 rounded-full"
              style={{ backgroundColor: "#2463EB" }}
            ></div>
            <span className="text-xs">
              Eligible: {eligible} ({eligiblePercent}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="size-2 rounded-full"
              style={{ backgroundColor: "#60A8FA" }}
            ></div>
            <span className="text-xs">
              Belum Eligible: {nonEligible} ({(100 - eligiblePercent).toFixed(1)}%)
            </span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 px-4 text-center">
          Mahasiswa eligible adalah mahasiswa yang memenuhi seluruh persyaratan akademik dan administratif untuk mengikuti wisuda.
        </p>
      </CardFooter>
    </Card>
  );
};

export default StatistikKelulusanChart;
