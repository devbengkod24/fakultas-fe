"use client";

import useSWR from "swr";
import { DashboardService } from "@/api/tugas-akhir";
import { StudentGrowthChartView } from "@/components/shared-ta-kp/dashboard/student-growth-chart-view";

const StudentGrowthChart = () => {
  const { data: response, isLoading, error } = useSWR(
    "mahasiswa-statistic",
    () => DashboardService.getMahasiswaStatistic(),
  );

  const chartData =
    response?.success && response.data.chart.length > 0
      ? response.data.chart
      : [{ periode: "Data Kosong", students: 0, label: "Tidak ada data" }];

  return (
    <StudentGrowthChartView
      data={chartData}
      loading={isLoading}
      error={!!error}
      title="Statistik Mahasiswa"
      description="Perkembangan jumlah mahasiswa TA"
    />
  );
};

export default StudentGrowthChart;
