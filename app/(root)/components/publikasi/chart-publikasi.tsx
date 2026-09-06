"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import ErrorStateChart from "./error-state-chart";
import EmptyStateChart from "./empty-state-chart";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  ArticleStatisticSuperAdminService,
  ResearchStatisticSuperAdminService,
} from "@/api/superadmin";

import {
  ArticleStatisticData,
  ResearchStatisticData,
} from "@/types/admin/publikasi-page/chart-statistics";

interface StatsCardProps {
  activeTab: string;
}

const publikasiChartConfig = {
  scopus: {
    label: "Scopus",
    color: "#1e7fd9",
  },

  garuda: {
    label: "Garuda",
    color: "#eb8b15",
  },

  scholar: {
    label: "Scholar",
    color: "#00a651",
  },
} satisfies ChartConfig;


const risetChartConfig = {
  internal: {
    label: "Internal",
    color: "#1e7fd9",
  },

  bima: {
    label: "Bima",
    color: "#00a651",
  },

  simlitabmas: {
    label: "Simlitabmas",
    color: "#eb8b15",
  },
} satisfies ChartConfig;

const ChartPublikasi = ({ activeTab }: StatsCardProps) => {
  const [selectedTahunPublikasi, setSelectedTahunPublikasi] =
    useState("6");

  const [selectedTahunRiset, setSelectedTahunRiset] =
    useState("6");


  const [articleData, setArticleData] =
    useState<ArticleStatisticData | null>(null);

  const [articleLoading, setArticleLoading] =
    useState(true);

  const [articleError, setArticleError] =
    useState<string | null>(null);


  const [researchData, setResearchData] =
    useState<ResearchStatisticData | null>(null);

  const [researchLoading, setResearchLoading] =
    useState(true);

  const [researchError, setResearchError] =
    useState<string | null>(null);


  const fetchArticleStatistics = useCallback(async () => {
    try {
      setArticleLoading(true);
      setArticleError(null);

      const response =
        await ArticleStatisticSuperAdminService.getAllArticleStatistic(
          10
        );

      if (response.success && response.data) {
        setArticleData(response.data);
      } else {
        setArticleError(
          response.message ||
            "Failed to fetch article statistics"
        );
      }
    } catch (err) {
      console.error("Article statistics fetch error:", err);

      setArticleError(
        err instanceof Error
          ? err.message
          : "An error occurred"
      );
    } finally {
      setArticleLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticleStatistics();
  }, [fetchArticleStatistics]);


  const fetchResearchStatistics = useCallback(async () => {
    try {
      setResearchLoading(true);
      setResearchError(null);

      const response =
        await ResearchStatisticSuperAdminService.getAllResearchStatistic(
          10
        );

      if (response.success && response.data) {
        setResearchData(response.data);
      } else {
        setResearchError(
          response.message ||
            "Failed to fetch research statistics"
        );
      }
    } catch (err) {
      console.error("Research statistics fetch error:", err);

      setResearchError(
        err instanceof Error
          ? err.message
          : "An error occurred"
      );
    } finally {
      setResearchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResearchStatistics();
  }, [fetchResearchStatistics]);


  const publikasiData = useMemo(() => {
    if (
      !articleData ||
      !articleData.years ||
      articleData.years.length === 0
    ) {
      return [];
    }

    const transformedData = articleData.years.map(
      (year, index) => {
        return {
          tahun: year,
          scopus: articleData.scopus_count[index] || 0,
          garuda: articleData.garuda_count[index] || 0,
          scholar: articleData.scholar_count[index] || 0,
        };
      }
    );

    return transformedData.slice(
      -Number.parseInt(selectedTahunPublikasi)
    );
  }, [articleData, selectedTahunPublikasi]);

  const risetData = useMemo(() => {
    if (!researchData) return [];

    const data = researchData as unknown as Record<
      string,
      Record<string, number>
    >;

    const internalYears = data["INTERNAL_SOURCE"]
      ? Object.keys(data["INTERNAL_SOURCE"])
      : [];

    const bimaYears = data["BIMA_SOURCE"]
      ? Object.keys(data["BIMA_SOURCE"])
      : [];

    const simlitabmasYears = data["SIMLITABMAS_SOURCE"]
      ? Object.keys(data["SIMLITABMAS_SOURCE"])
      : [];

    const allYears = [
      ...new Set([
        ...internalYears,
        ...bimaYears,
        ...simlitabmasYears,
      ]),
    ].sort();

    if (allYears.length === 0) return [];

    const transformedData = allYears.map((year) => {
      const internalValue =
        (data["INTERNAL_SOURCE"] &&
          data["INTERNAL_SOURCE"][year]) ||
        0;

      const bimaValue =
        (data["BIMA_SOURCE"] &&
          data["BIMA_SOURCE"][year]) ||
        0;

      const simlitabmasValue =
        (data["SIMLITABMAS_SOURCE"] &&
          data["SIMLITABMAS_SOURCE"][year]) ||
        0;

      return {
        tahun: year,
        internal: internalValue,
        bima: bimaValue,
        simlitabmas: simlitabmasValue,
      };
    });

    return transformedData.slice(
      -Number.parseInt(selectedTahunRiset)
    );
  }, [researchData, selectedTahunRiset]);

  return (
    <div className="space-y-6">
      {activeTab === "artikel" ? (
        <Card className="shadow-none">
          <CardHeader className="flex flex-row justify-between items-center">
            <h3 className="font-semibold text-sm">
              Artikel Publikasi
            </h3>

            <Select
              defaultValue={selectedTahunPublikasi}
              onValueChange={setSelectedTahunPublikasi}
            >
              <SelectTrigger className="w-32 h-7 text-xs">
                <SelectValue
                  placeholder={`${selectedTahunPublikasi} Tahun`}
                />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="3">3 Tahun</SelectItem>
                <SelectItem value="6">6 Tahun</SelectItem>
                <SelectItem value="10">10 Tahun</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>

          <CardContent>
            {articleLoading ? (
              <div className="h-[200px] flex items-center justify-center">
                <div className="space-y-3 w-full">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ) : articleError ? (
              <ErrorStateChart
                onRetry={fetchArticleStatistics}
              />
            ) : publikasiData.length === 0 ? (
              <EmptyStateChart
                title="Tidak Ada Data Artikel"
                description="Belum ada data artikel publikasi untuk periode yang dipilih."
                onRefresh={fetchArticleStatistics}
              />
            ) : (
              <ChartContainer config={publikasiChartConfig}>
                <LineChart
                  accessibilityLayer
                  data={publikasiData}
                  margin={{
                    left: 16,
                    right: 16,
                  }}
                >
                  <CartesianGrid vertical={false} />

                  <XAxis
                    dataKey="tahun"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    height={48}
                  />

                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />

                  <Line
                    dataKey="scopus"
                    type="linear"
                    stroke="var(--color-scopus)"
                    strokeWidth={2}
                    dot={false}
                  />

                  <Line
                    dataKey="garuda"
                    type="linear"
                    stroke="var(--color-garuda)"
                    strokeWidth={2}
                    dot={false}
                  />

                  <Line
                    dataKey="scholar"
                    type="linear"
                    stroke="var(--color-scholar)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-none">
          <CardHeader className="flex flex-row justify-between items-center">
            <h3 className="font-semibold text-sm">
              Riset
            </h3>

            <Select
              defaultValue={selectedTahunRiset}
              onValueChange={setSelectedTahunRiset}
            >
              <SelectTrigger className="w-32 h-7 text-xs">
                <SelectValue
                  placeholder={`${selectedTahunRiset} Tahun`}
                />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="3">3 Tahun</SelectItem>
                <SelectItem value="6">6 Tahun</SelectItem>
                <SelectItem value="10">10 Tahun</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>

          <CardContent>
            {researchLoading ? (
              <div className="h-[200px] flex items-center justify-center">
                <div className="space-y-3 w-full">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ) : researchError ? (
              <ErrorStateChart
                onRetry={fetchResearchStatistics}
              />
            ) : risetData.length === 0 ? (
              <EmptyStateChart
                title="Tidak Ada Data Riset"
                description="Belum ada data riset untuk periode yang dipilih."
                onRefresh={fetchResearchStatistics}
              />
            ) : (
              <ChartContainer config={risetChartConfig}>
                <LineChart
                  accessibilityLayer
                  data={risetData}
                  margin={{
                    left: 16,
                    right: 16,
                  }}
                >
                  <CartesianGrid vertical={false} />

                  <XAxis
                    dataKey="tahun"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    height={48}
                  />

                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />

                  <Line
                    dataKey="internal"
                    type="linear"
                    stroke="var(--color-internal)"
                    strokeWidth={2}
                    dot={false}
                  />

                  <Line
                    dataKey="bima"
                    type="linear"
                    stroke="var(--color-bima)"
                    strokeWidth={2}
                    dot={false}
                  />

                  <Line
                    dataKey="simlitabmas"
                    type="linear"
                    stroke="var(--color-simlitabmas)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChartPublikasi;

