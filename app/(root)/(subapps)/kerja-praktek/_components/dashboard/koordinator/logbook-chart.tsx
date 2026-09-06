"use client";

import useSWR from "swr";
import { DashboardService } from "@/api/kerja-praktek";
import { useProfile } from "@/context/profileUseContext";
import { LogbookBarChartView } from "@/components/shared-ta-kp/dashboard/logbook-bar-chart-view";
import type { LogbookBarItem } from "@/components/shared-ta-kp/dashboard/logbook-bar-chart-view";

const CoordinatorLogbookChart = () => {
  const { activeProdiId } = useProfile();

  const { data: response, isLoading, error } = useSWR(
    ["logbook-statistic-kp", activeProdiId ?? undefined],
    () => DashboardService.getLogbookMahasiswaStats(activeProdiId ?? undefined).then((res) => res)
  );

  const chartData = (() => {
    const isSuccess = response?.meta?.success || response?.success;
    if (!isSuccess) {
      return [
        { bab: "Tahap 1", students: 0, fill: "#2463EB" },
        { bab: "Tahap 2", students: 0, fill: "#60A8FA" },
        { bab: "Tahap 3", students: 0, fill: "#3B85F6" },
        { bab: "Tahap 4", students: 0, fill: "#90C6FE" },
        { bab: "Tahap 5", students: 0, fill: "#BDDCFE" },
      ] as LogbookBarItem[];
    }

    const rawData = response.data;
    const dataList = Array.isArray(rawData) ? rawData : rawData?.data || [];

    if (!Array.isArray(dataList) || dataList.length === 0) {
      return [
        { bab: "Tahap 1", students: 0, fill: "#2463EB" },
        { bab: "Tahap 2", students: 0, fill: "#60A8FA" },
        { bab: "Tahap 3", students: 0, fill: "#3B85F6" },
        { bab: "Tahap 4", students: 0, fill: "#90C6FE" },
        { bab: "Tahap 5", students: 0, fill: "#BDDCFE" },
      ] as LogbookBarItem[];
    }

    const tahapCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    dataList.forEach((item: { ping?: Record<string, unknown[]> }) => {
      const ping = item.ping || {};
      Object.keys(ping).forEach((bab) => {
        const babNum = parseInt(bab);
        if (babNum >= 1 && babNum <= 5 && Array.isArray(ping[bab]) && ping[bab].length > 0) {
          tahapCounts[babNum]++;
        }
      });
    });

    const colors = ["#2463EB", "#60A8FA", "#3B85F6", "#90C6FE", "#BDDCFE"];
    return Object.entries(tahapCounts).map(([tahap, count], index) => ({
      bab: `Tahap ${tahap}`,
      students: count,
      fill: colors[index] || "#2463EB",
    })) as LogbookBarItem[];
  })();

  return (
    <LogbookBarChartView
      title="Statistik Logbook"
      description="Jumlah mahasiswa yang mengisi logbook per tahap"
      data={chartData}
      loading={isLoading}
      error={!!error}
      barSize={40}
    />
  );
};

export default CoordinatorLogbookChart;