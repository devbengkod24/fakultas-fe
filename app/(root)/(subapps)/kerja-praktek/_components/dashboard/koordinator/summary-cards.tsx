"use client";

import { useState } from "react";
import useSWR from "swr";
import { DashboardService, PengajuanService } from "@/api/kerja-praktek";
import { useProfile } from "@/context/profileUseContext";
import { CustomTabs } from "@/components/custom-tabs";
import {
  PengajuanListView,
  type PengajuanListItem,
} from "@/components/shared-ta-kp/dashboard/pengajuan-list-view";

type RawPengajuanKP = {
  kerja_praktek_id: number;
  judul?: string;
  mahasiswa?: {
    nama?: string;
    nim?: string;
    foto?: string;
  };
  dosen?: {
    nama?: string;
    gelar_depan?: string;
    gelar_belakang?: string;
  };
};

type RawSidangKP = {
  id: number;
  judul?: string;
  mahasiswa?: {
    nama?: string;
    nim?: string;
    foto?: string;
  };
};

const PengajuanList = ({ type }: { type: string }) => {
  const { activeProdiId } = useProfile();

  // Pengajuan KP - menggunakan PengajuanService.getAllPengajuan (dari mahasiswa-bimbingan)
  const { data: pengajuanResponse, isLoading: isPengajuanLoading, error: pengajuanError } = useSWR(
    ["kp-pengajuan-list", activeProdiId],
    () => PengajuanService.getAllPengajuan(1, 10, "", activeProdiId ?? undefined),
    { revalidateOnFocus: false }
  );

  // Pengajuan Sidang - menggunakan DashboardService.getKoorPengajuan("sidang")
  const { data: sidangResponse, isLoading: isSidangLoading, error: sidangError } = useSWR(
    ["kp-sidang-list", activeProdiId],
    () => DashboardService.getKoorPengajuan("sidang", activeProdiId ?? undefined),
    { revalidateOnFocus: false }
  );

  const isLoading = type === "pengajuan" ? isPengajuanLoading : isSidangLoading;
  const error = type === "pengajuan" ? pengajuanError : sidangError;

  const items: PengajuanListItem[] = (() => {
    if (type === "pengajuan") {
      if (!pengajuanResponse?.meta?.success) return [];
      const data = pengajuanResponse.data || [];
      if (!Array.isArray(data)) return [];

      const formatDosen = (dosen?: { nama?: string; gelar_depan?: string; gelar_belakang?: string }) => {
        if (!dosen?.nama) return "-";
        const gelarDepan = dosen.gelar_depan ? `${dosen.gelar_depan} ` : "";
        const gelarBelakang = dosen.gelar_belakang ? `, ${dosen.gelar_belakang}` : "";
        return `${gelarDepan}${dosen.nama}${gelarBelakang}`;
      };

      return (data as RawPengajuanKP[]).map((item) => ({
        id: item.kerja_praktek_id,
        name: item.mahasiswa?.nama || "-",
        studentId: item.mahasiswa?.nim || "-",
        avatar: item.mahasiswa?.foto || null,
        title: formatDosen(item.dosen),
      }));
    }

    if (type === "sidang") {
      if (!sidangResponse?.meta?.success) return [];
      const data = sidangResponse.data?.data || sidangResponse.data || [];
      if (!Array.isArray(data)) return [];
      return (data as RawSidangKP[]).map((item) => ({
        id: item.id,
        name: item.mahasiswa?.nama || "-",
        studentId: item.mahasiswa?.nim || "-",
        avatar: item.mahasiswa?.foto || null,
        title: item.judul || "-",
      }));
    }

    return [];
  })();

  return (
    <PengajuanListView
      items={items}
      loading={isLoading}
      error={!!error}
      emptyTitle="Tidak ada pengajuan"
      emptySubtitle="Belum ada pengajuan yang tersedia"
    />
  );
};

const tabs = [
  { status: "pengajuan-kp", label: "Pengajuan Kerja Praktek" },
  { status: "pengajuan-sidang", label: "Pengajuan Sidang" },
];

const tabToApiType: Record<string, string> = {
  "pengajuan-kp": "pengajuan",
  "pengajuan-sidang": "sidang",
};

const CoordinatorSummaryCards = () => {
  const [activeTab, setActiveTab] = useState("pengajuan-kp");

  return (
    <div className="w-full">
      <CustomTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-4">
        <PengajuanList type={tabToApiType[activeTab] ?? "pengajuan"} />
      </div>
    </div>
  );
};

export default CoordinatorSummaryCards;