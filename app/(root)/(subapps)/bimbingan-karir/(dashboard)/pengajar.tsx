"use client";

import React from "react";
import MenuDashboardPengajar from "../_components/dashboard/pengajar/info";
import KegiatanAkanDatang from "../_components/dashboard/pengajar/kegiatan-akan-datang";
import IzinMenunggu from "../_components/dashboard/pengajar/izin-menumbuh";
import MahasiswaBimbingan from "../_components/dashboard/pengajar/mahasiswa-bimbingan";
import PengumumanPengajar from "../_components/dashboard/pengajar/pengumuman";
import { DashboardPengajarService } from "@/api/bimbingan-karir";
import useSWR from "swr";
import {
  PengajarDashboardSkeleton,
} from "../_components/dashboard/pengajar/skeleton";
import Tutorial from "../_components/dashboard/pengajar/tutorial";

interface PengajarDashboardProps {
  prodiId?: number | null;
}

const fetcher = (prodiId: number | null | undefined) =>
  DashboardPengajarService.getAllDashboard(prodiId).then((res) => res);

const PengajarDashboard: React.FC<PengajarDashboardProps> = ({ prodiId }) => {
  const { data, isLoading } = useSWR(
    prodiId !== undefined ? ["dashboardPengajarBK", prodiId] : "dashboardPengajarBK",
    () => fetcher(prodiId),
    { revalidateOnFocus: false }
  );

  const cards = data?.data?.cards;
  const kegiatanAkanDatang = data?.data?.kegiatan_akan_datang;
  const izinMenunggu = data?.data?.izin_menunggu;
  const mahasiswaBimbingan = data?.data?.mahasiswa_bimbingan;
  const pengumuman = data?.data?.pengumuman;

  if (isLoading) {
    return <PengajarDashboardSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MenuDashboardPengajar data={cards} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <KegiatanAkanDatang data={kegiatanAkanDatang} />
        <IzinMenunggu data={izinMenunggu} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MahasiswaBimbingan data={mahasiswaBimbingan} />
        <div className="space-y-4">
          <Tutorial />
          <PengumumanPengajar data={pengumuman} />
        </div>
      </div>
    </div>
  );
};

export default PengajarDashboard;
