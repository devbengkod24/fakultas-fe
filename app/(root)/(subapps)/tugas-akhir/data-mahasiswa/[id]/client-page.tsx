"use client";

import useSWR from "swr";
import DashboardHeader from "@/components/dashboard-header";
import { LogbookService } from "@/api/tugas-akhir";
import {
  MahasiswaProfileView,
  type LogbookEntry,
  type MahasiswaProfileDetail,
} from "@/components/shared-ta-kp/mahasiswa-profile/mahasiswa-profile-view";

export default function MahasiswaDetailClientPage({
  mahasiswaId,
}: {
  mahasiswaId: number;
}) {
  const {
    data: detailRes,
    isLoading: loadingDetail,
    error: errorDetail,
  } = useSWR(["mhs-profile-detail", mahasiswaId], () =>
    LogbookService.getDetailMahasiswaKoor(mahasiswaId),
  );

  const { data: logbookRes, isLoading: loadingLogbook } = useSWR(
    ["mhs-profile-logbook", mahasiswaId],
    () => LogbookService.getLogbookMahasiswaByIdKoor(mahasiswaId),
  );

  const detail: MahasiswaProfileDetail | null = detailRes?.data ?? null;
  const logbooks: LogbookEntry[] = Array.isArray(logbookRes?.data)
    ? logbookRes.data
    : (logbookRes?.data?.data ?? []);

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "tugas-akhir" },
          { name: "Data Mahasiswa", url: "tugas-akhir/data-mahasiswa" },
          { name: "Profil Mahasiswa", url: "#" },
        ]}
      />
      <MahasiswaProfileView
        detail={detail}
        logbooks={logbooks}
        loading={loadingDetail || loadingLogbook}
        error={!!errorDetail}
        context="ta"
      />
    </div>
  );
}
