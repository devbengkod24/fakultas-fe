"use client";

import useSWR from "swr";
import { DashboardServiceV2 } from "@/api/tugas-akhir";
import { useProfile } from "@/context/profileUseContext";
import {
  KrsAngkatanItem,
  KrsBarChartView,
} from "@/components/shared-ta-kp/dashboard/krs-bar-chart-view";

export function TaChart() {
  const { activeProdiId } = useProfile();
  const { data: response, isLoading, error } = useSWR(
    `ta-chart-${activeProdiId ?? "default"}`,
    () => DashboardServiceV2.getTaChart(),
  );

  // Response baru: data = { ta1: [{angkatan, ambil_krs, lulus}], ta2: [...] }
  const ta1: KrsAngkatanItem[] = response?.success
    ? (response.data?.ta1 ?? [])
    : [];
  const ta2: KrsAngkatanItem[] = response?.success
    ? (response.data?.ta2 ?? [])
    : [];

  return (
    <KrsBarChartView
      ta1={ta1}
      ta2={ta2}
      loading={isLoading}
      error={!!error}
    />
  );
}
