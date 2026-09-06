"use client";

import useSWR from "swr";
import { DashboardService } from "@/api/tugas-akhir";
import { LogbookAreaChartView } from "@/components/shared-ta-kp/dashboard/logbook-area-chart-view";

const EMPTY_DATA = [
  { bab: "Bab 1", students: 0 },
  { bab: "Bab 2", students: 0 },
  { bab: "Bab 3", students: 0 },
  { bab: "Bab 4", students: 0 },
  { bab: "Bab 5", students: 0 },
];

interface LogbookChartItem {
  label: string;
  value: number;
}

const CoordinatorLogbookChart = () => {
  const { data: response, isLoading, error } = useSWR(
    "logbook-statistic",
    () => DashboardService.getLogbookStatistic(),
  );

  // Response baru: data = { chart: [...], belum_bimbingan: n }
  const chart: LogbookChartItem[] = response?.success
    ? (response.data?.chart ?? [])
    : [];

  const chartData =
    chart.length > 0
      ? chart.map((item) => ({
          bab: item.label,
          students: item.value,
        }))
      : EMPTY_DATA;

  const belumBimbingan = response?.success
    ? (response.data?.belum_bimbingan ?? 0)
    : undefined;

  return (
    <LogbookAreaChartView
      data={chartData}
      loading={isLoading}
      error={!!error}
      belumBimbingan={belumBimbingan}
    />
  );
};

export default CoordinatorLogbookChart;
