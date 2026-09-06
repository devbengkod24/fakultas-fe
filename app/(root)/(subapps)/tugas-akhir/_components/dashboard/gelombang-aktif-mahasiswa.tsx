"use client";

import useSWR from "swr";
import { MonitoringSidang1Service } from "@/api/tugas-akhir";
import { GelombangAktifView } from "@/components/shared-ta-kp/dashboard/gelombang-aktif-view";

const GelombangAktifMahasiswa = () => {
  const { data: response, isLoading, error } = useSWR(
    "mahasiswa-gelombang-aktif",
    () => MonitoringSidang1Service.getGelombangAktif(),
  );

  return (
    <GelombangAktifView
      gelombangAktif={response?.success ? response.data : []}
      loading={isLoading}
      error={!!error}
      emptyBehavior="hide"
    />
  );
};

export default GelombangAktifMahasiswa;
