/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CartesianGrid,
  Bar,
  BarChart,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorStateChart from "./error-state-chart";
import EmptyStateChart from "./empty-state-chart";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { ResearchFundSuperAdminService } from "@/api/superadmin";
import { ResearchFundData } from "@/types/admin/publikasi-page/chart-statistics";

// Chart config untuk budget riset
const budgetChartConfig = {
  internal: {
    label: "Internal",
    color: "#1e7fd9", // Biru
  },
  bima: {
    label: "Bima",
    color: "#22c55d", // Hijau
  },
  simlitabmas: {
    label: "Simlitabmas",
    color: "#eb8b15", // Orange
  },
} satisfies ChartConfig;

// Format rupiah
const formatRupiah = (value: number) => {
  if (value >= 1000) {
    return `Rp ${(value / 1000).toFixed(1)} Miliar`;
  }
  return `Rp ${value} Juta`;
};

// Custom tooltip content dengan dot berwarna
const CustomTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-md shadow-lg p-3 text-xs">
        <p className="font-semibold mb-2 text-gray-800">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">
              {entry.name ? `${entry.name} ` : ""}
              {formatRupiah(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ChartBudgetRiset = () => {
  const [selectedTahun, setSelectedTahun] = useState("6");

  // State for research fund data
  const [fundData, setFundData] = useState<ResearchFundData | null>(null);
  const [fundLoading, setFundLoading] = useState(true);
  const [fundError, setFundError] = useState<string | null>(null);

  // Fetch research fund data
  const fetchResearchFund = useCallback(async () => {
    try {
      setFundLoading(true);
      setFundError(null);
      const response = await ResearchFundSuperAdminService.getAllResearchFund(
        10
      ); // Get last 10 years
      console.log("Research fund response:", response);
      if (response.success && response.data) {
        setFundData(response.data);
      } else {
        console.error("Research fund data error:", response.data);
        setFundError(response.message || "Failed to fetch research fund data");
      }
    } catch (err) {
      console.error("Research fund fetch error:", err);
      setFundError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setFundLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResearchFund();
  }, [fetchResearchFund]);

  // Transform data for chart
  const displayedData = useMemo(() => {
    if (!fundData || !fundData.per_source) return [];

    const internalSource = fundData.per_source["INTERNAL_SOURCE"];
    const bimaSource = fundData.per_source["BIMA_SOURCE"];
    const simlitabmasSource = fundData.per_source["SIMLITABMAS_SOURCE"];

    // Get all years from all sources
    const allYears = new Set([
      ...Object.keys(internalSource || {}),
      ...Object.keys(bimaSource || {}),
      ...Object.keys(simlitabmasSource || {}),
    ]);

    const transformedData = Array.from(allYears)
      .sort()
      .map((year) => ({
        tahun: year,
        internal: Math.round(
          (Number(internalSource?.[year]?.total_fund) || 0) / 1000000
        ), // Convert to millions
        bima: Math.round(
          (Number(bimaSource?.[year]?.total_fund) || 0) / 1000000
        ), // Convert to millions
        simlitabmas: Math.round(
          (Number(simlitabmasSource?.[year]?.total_fund) || 0) / 1000000
        ), // Convert to millions
      }));

    return transformedData.slice(-Number.parseInt(selectedTahun));
  }, [fundData, selectedTahun]);

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row justify-between items-center pb-4">
        <div>
          <h3 className="font-semibold text-base">Budget Riset</h3>
        </div>
        <Select defaultValue={selectedTahun} onValueChange={setSelectedTahun}>
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue placeholder={`${selectedTahun} Tahun`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3 Tahun</SelectItem>
            <SelectItem value="6">6 Tahun</SelectItem>
            <SelectItem value="10">10 Tahun</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-0">
        {fundLoading ? (
          <div className="h-[150px] flex items-center justify-center">
            <div className="space-y-3 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ) : fundError ? (
          <ErrorStateChart onRetry={fetchResearchFund} />
        ) : displayedData.length === 0 ? (
          <EmptyStateChart
            title="Tidak Ada Data Budget"
            description="Belum ada data budget riset untuk periode yang dipilih."
            onRefresh={fetchResearchFund}
          />
        ) : (
          <div className="w-full h-[150px]">
            <ChartContainer
              config={budgetChartConfig}
              className="h-full w-full"
            >
                <BarChart
                  data={displayedData}
                  margin={{
                    right: 15,
                    left: 15,
                  }}
                  barCategoryGap="15%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="tahun"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={11}
                    fontWeight={500}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={10}
                    tickMargin={6}
                    tickFormatter={formatRupiah}
                    fontWeight={500}
                    width={75}
                  />
                  <ChartTooltip content={<CustomTooltipContent />} />
                  <Bar
                    dataKey="internal"
                    name=" Internal"
                    fill="var(--color-internal)"
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="bima"
                    name=" Bima"
                    fill="var(--color-bima)"
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="simlitabmas"
                    name=" Simlitabmas"
                    fill="var(--color-simlitabmas)"
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartBudgetRiset;
