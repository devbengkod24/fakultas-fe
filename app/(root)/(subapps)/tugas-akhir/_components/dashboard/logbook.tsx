"use client";

import useSWR from "swr";
import { DashboardService } from "@/api/tugas-akhir";
import { useProfile } from "@/context/profileUseContext";
import { LogbookAreaChartView } from "@/components/shared-ta-kp/dashboard/logbook-area-chart-view";

const EMPTY_DATA = [
  { bab: "Bab 1", students: 0 },
  { bab: "Bab 2", students: 0 },
  { bab: "Bab 3", students: 0 },
  { bab: "Bab 4", students: 0 },
  { bab: "Bab 5", students: 0 },
];

const LogbookChart = () => {
  const { activeProdiId } = useProfile();
  const { data: response, isLoading, error } = useSWR(
    `dosen-logbook-statistic-${activeProdiId ?? "default"}`,
    () => DashboardService.getDosenLogbookStatistic(),
  );

  const chartData =
    response?.success && response.data?.length
      ? response.data.map((item: { bab: string; students: number }) => ({
          bab: item.bab,
          students: item.students,
        }))
      : EMPTY_DATA;

  return (
    <LogbookAreaChartView
      data={chartData}
      loading={isLoading}
      error={!!error}
    />
  );
};

export default LogbookChart;
