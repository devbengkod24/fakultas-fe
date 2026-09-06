"use client";

import useSWR from "swr";
import { DashboardService, MahasiswaService } from "@/api/kerja-praktek";
import { useProfile } from "@/context/profileUseContext";
import { RadialChartView } from "@/components/shared-ta-kp/dashboard/radial-chart-view";
import type { RadialSegment } from "@/components/shared-ta-kp/dashboard/radial-chart-view";

type SidangItem = {
  status?: string;
  jadwal_sidang?: {
    tanggal?: string | null;
    jam?: string | null;
  };
};

const CoordinatorDistributionChart = () => {
  const { activeProdiId } = useProfile();

  const { data: mahasiswaResponse, isLoading: isMahasiswaLoading } = useSWR(
    ["kp-distribution-mahasiswa", activeProdiId ?? undefined],
    () => MahasiswaService.getAllMahasiswa(1, 1000, "", undefined, undefined, activeProdiId ?? undefined)
  );

  const { data: sidangResponse, isLoading: isSidangLoading, error } = useSWR(
    ["kp-distribution-sidang", activeProdiId ?? undefined],
    () => DashboardService.getKoorPengajuan("sidang", activeProdiId ?? undefined)
  );

  const sidangItems = sidangResponse?.data?.data || sidangResponse?.data || [];
  const totalMahasiswa = mahasiswaResponse?.meta?.pagination?.total || 0;

  const proses = Array.isArray(sidangItems)
    ? sidangItems.filter((item: SidangItem) => {
        const status = item?.status?.toLowerCase() || "";
        return status !== "selesai";
      }).length
    : 0;

  const selesai = Array.isArray(sidangItems)
    ? sidangItems.filter((item: SidangItem) => item?.status?.toLowerCase() === "selesai").length
    : 0;

  const belum = Math.max(totalMahasiswa - proses - selesai, 0);

  const segments: RadialSegment[] = [
    { key: "selesai", label: "Selesai", color: "#2463EB", value: selesai },
    { key: "proses", label: "Proses", color: "#60A8FA", value: proses },
    { key: "belum", label: "Belum", color: "#90C6FE", value: belum },
  ];

  const isLoading = isMahasiswaLoading || isSidangLoading;

  return (
    <RadialChartView
      title="Distribusi Status Sidang KP"
      description="Jumlah mahasiswa berdasarkan status sidang KP"
      segments={segments}
      loading={isLoading}
      error={!!error}
      centerLabel="Mahasiswa KP"
    />
  );
};

export default CoordinatorDistributionChart;