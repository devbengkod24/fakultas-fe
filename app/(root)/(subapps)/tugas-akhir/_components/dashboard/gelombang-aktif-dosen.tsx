"use client";

import useSWR from "swr";
import { MonitoringSidang1Service } from "@/api/tugas-akhir";
import { useProfile } from "@/context/profileUseContext";
import { GelombangAktifView } from "@/components/shared-ta-kp/dashboard/gelombang-aktif-view";

const GelombangAktifDosen = () => {
  const { activeProdiId } = useProfile();

  const { data: response, isLoading, error } = useSWR(
    `dosen-gelombang-aktif-${activeProdiId ?? "default"}`,
    () =>
      MonitoringSidang1Service.getGelombangAktifByDosen(
        undefined,
        activeProdiId ?? undefined,
      ),
  );

  return (
    <GelombangAktifView
      gelombangAktif={response?.success ? response.data : []}
      loading={isLoading}
      error={!!error}
      showProdi
      emptyBehavior="show"
    />
  );
};

export default GelombangAktifDosen;
