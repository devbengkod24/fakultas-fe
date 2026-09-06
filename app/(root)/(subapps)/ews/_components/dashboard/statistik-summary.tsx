"use client";

import { useMemo } from "react";
import useSWR from "swr";
import {
  GraduationCap,
  CheckCircle,
  AlertTriangle,
  PauseCircle,
  OctagonX,
  UserX,
} from "lucide-react";
import SummaryCard from "./summary-card";
import { EWSDashboardService } from "@/api/ews";
import { useProfile } from "@/context/profileUseContext";
import {
  isGeneralProdiFilter,
  useProdiFilter,
} from "@/context/prodiFilterContext";

const StatistikSummary = () => {
  const { profile } = useProfile();
  const role = profile?.roles;
  const { selectedProdiIds } = useProdiFilter();
  const isGeneral = isGeneralProdiFilter(selectedProdiIds);

  const prodiIdParam = isGeneral ? undefined : selectedProdiIds.join(",");

  const {
    data: response,
    isLoading,
  } = useSWR(
    role ? [`ews-dashboard-summary-${role}`, prodiIdParam || "general"] : null,
    () =>
      role === "super_fakultas"
        ? EWSDashboardService.getSuperFakultasDashboard({ prodi_id: prodiIdParam })
        : EWSDashboardService.getAdminDashboard({ prodi_id: prodiIdParam }),
    { revalidateOnFocus: false }
  );

  const statistik = useMemo(() => {
    const rawStatistik = response?.data?.statistik_global;
    const tableData = response?.data?.tabel_ringkasan_prodi || [];

    if (isGeneral || tableData.length === 0) {
      return rawStatistik;
    }

    // Filter and aggregate data for selected prodis
    const selectedData = tableData.filter((item: any) => 
      selectedProdiIds.includes(String(item.prodi?.id))
    );

    if (selectedData.length === 0) {
      return {
        total_mahasiswa: 0,
        total_mahasiswa_aktif: 0,
        total_mahasiswa_mangkir: 0,
        total_mahasiswa_cuti: 0,
        total_mahasiswa_do: 0,
        total_mahasiswa_tidak_aktif: 0,
      };
    }

    return {
      total_mahasiswa: selectedData.reduce((acc: number, curr: any) => acc + Number(curr.jumlah_mahasiswa || 0), 0),
      total_mahasiswa_aktif: selectedData.reduce((acc: number, curr: any) => acc + Number(curr.jumlah_mahasiswa_aktif || 0), 0),
      total_mahasiswa_mangkir: selectedData.reduce((acc: number, curr: any) => acc + Number(curr.jumlah_mahasiswa_mangkir || 0), 0),
      total_mahasiswa_cuti: selectedData.reduce((acc: number, curr: any) => acc + Number(curr.jumlah_mahasiswa_cuti || 0), 0),
      total_mahasiswa_do: selectedData.reduce((acc: number, curr: any) => acc + Number(curr.jumlah_do || 0), 0),
      total_mahasiswa_tidak_aktif: selectedData.reduce((acc: number, curr: any) => acc + Number(curr.jumlah_mahasiswa_tidak_aktif || 0), 0),
    };
  }, [response, selectedProdiIds, isGeneral]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      <SummaryCard
        title="Total Mahasiswa"
        value={
          isLoading
            ? "..."
            : statistik?.total_mahasiswa ||
              0
        }
        icon={GraduationCap}
        borderColor="border-l-blue-500"
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
      />

      <SummaryCard
        title="Aktif"
        value={
          isLoading
            ? "..."
            : statistik?.total_mahasiswa_aktif ||
              0
        }
        icon={CheckCircle}
        borderColor="border-l-emerald-500"
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
      />

      <SummaryCard
        title="Mangkir"
        value={
          isLoading
            ? "..."
            : statistik?.total_mahasiswa_mangkir ||
              0
        }
        icon={AlertTriangle}
        borderColor="border-l-yellow-500"
        iconBg="bg-yellow-100"
        iconColor="text-yellow-600"
      />

      <SummaryCard
        title="Cuti"
        value={
          isLoading
            ? "..."
            : statistik?.total_mahasiswa_cuti ||
              0
        }
        icon={PauseCircle}
        borderColor="border-l-orange-500"
        iconBg="bg-orange-100"
        iconColor="text-orange-600"
      />

      <SummaryCard
        title="DO"
        value={
          isLoading
            ? "..."
            : statistik?.total_mahasiswa_do ||
              0
        }
        icon={OctagonX}
        borderColor="border-l-red-500"
        iconBg="bg-red-100"
        iconColor="text-red-600"
      />

      <SummaryCard
        title="Meninggal"
        value={
          isLoading
            ? "..."
            : statistik?.total_mahasiswa_tidak_aktif ||
              0
        }
        icon={UserX}
        borderColor="border-l-slate-500"
        iconBg="bg-slate-100"
        iconColor="text-slate-600"
      />
    </div>
  );
};

export default StatistikSummary;
