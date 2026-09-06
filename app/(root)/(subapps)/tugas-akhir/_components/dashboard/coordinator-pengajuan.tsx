"use client";

import { useState } from "react";
import useSWR from "swr";
import { DashboardService } from "@/api/tugas-akhir";
import { CustomTabs } from "@/components/custom-tabs";
import {
  PengajuanListView,
  type PengajuanListItem,
} from "@/components/shared-ta-kp/dashboard/pengajuan-list-view";

type RawPengajuan = { tugas_akhir_id: number; nama_mhs: string; nim: string; ipk_mhs?: number; foto?: string; judul_ta: string };
type RawSidang = { sidang_ta1_id?: number; sidang_ta2_id?: number; name: string; nim: string; foto?: string; judul: string };

const PengajuanList = ({ type }: { type: string }) => {
  const { data: response, isLoading, error } = useSWR(
    ["koor-pengajuan", type],
    () => DashboardService.getKoorPengajuan(type),
  );

  const items: PengajuanListItem[] = (() => {
    if (!response?.success || !response.data?.length) return [];
    switch (type) {
      case "pengajuan":
        return (response.data as RawPengajuan[]).map((item) => ({
          id: item.tugas_akhir_id,
          name: item.nama_mhs,
          studentId: item.nim,
          gpa: item.ipk_mhs,
          avatar: item.foto,
          title: item.judul_ta,
        }));
      case "sidang":
        return (response.data as RawSidang[]).map((item) => ({
          id: item.sidang_ta1_id!,
          name: item.name,
          studentId: item.nim,
          avatar: item.foto,
          title: item.judul,
        }));
      case "sidang2":
        return (response.data as RawSidang[]).map((item) => ({
          id: item.sidang_ta2_id!,
          name: item.name,
          studentId: item.nim,
          avatar: item.foto,
          title: item.judul,
        }));
      default:
        return [];
    }
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
  { status: "tugas-akhir", label: "Pengajuan Tugas Akhir" },
  { status: "sidang-ta1", label: "Pengajuan Sidang TA 1" },
  { status: "sidang-ta2", label: "Pengajuan Sidang TA 2" },
];

const tabToApiType: Record<string, string> = {
  "tugas-akhir": "pengajuan",
  "sidang-ta1": "sidang",
  "sidang-ta2": "sidang2",
};

const CoordinatorPengajuanDashboard = () => {
  const [activeTab, setActiveTab] = useState("tugas-akhir");

  return (
    <div className="w-full max-w-6xl mx-auto">
      <CustomTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-6">
        <PengajuanList type={tabToApiType[activeTab] ?? "pengajuan"} />
      </div>
    </div>
  );
};

export default CoordinatorPengajuanDashboard;
