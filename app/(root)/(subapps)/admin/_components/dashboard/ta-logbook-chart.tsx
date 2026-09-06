"use client";

import React from "react";
import { LogbookAreaChartView } from "@/components/shared-ta-kp/dashboard/logbook-area-chart-view";

interface LogbookItem {
  bab: string;
  students: number;
}

interface TaLogbookChartProps {
  data?: LogbookItem[];
  loading?: boolean;
}

export const TaLogbookChart = ({ data, loading }: TaLogbookChartProps) => {
  const logbookData = data ?? [
    { bab: "Bab 1", students: 0 },
    { bab: "Bab 2", students: 0 },
    { bab: "Bab 3", students: 0 },
    { bab: "Bab 4", students: 0 },
    { bab: "Bab 5", students: 0 },
  ];

  return (
    <div className="border rounded-xl p-4 w-full [&_[data-chart]]:!aspect-auto [&_[data-chart]]:!h-[180px]">
      <LogbookAreaChartView
        data={logbookData}
        loading={loading ?? false}
        error={false}
        title="Statistik Logbook Tugas Akhir"
        description="Jumlah mahasiswa yang mengisi Bab 1 - Bab 5"
      />
    </div>
  );
};
