"use client";

import useSWR from "swr";
import { SidangKoorService } from "@/api/tugas-akhir";
import { useProfile } from "@/context/profileUseContext";
import { GelombangAktifView } from "@/components/shared-ta-kp/dashboard/gelombang-aktif-view";

const GelombangAktifKoor = () => {
  const { profile, activeProdiId } = useProfile();
  const isMultiProdiRole = ["super_fakultas", "dosen", "koordinator"].includes(
    profile?.roles ?? "",
  );

  const swrKey =
    isMultiProdiRole && activeProdiId
      ? `koor-gelombang-aktif-${activeProdiId}`
      : "koor-gelombang-aktif";

  const { data: response, isLoading, error } = useSWR(swrKey, () =>
    SidangKoorService.getGelombangAktif(undefined, activeProdiId ?? undefined),
  );

  return (
    <GelombangAktifView
      gelombangAktif={response?.success ? response.data : []}
      loading={isLoading}
      error={!!error}
      emptyBehavior="show"
    />
  );
};

export default GelombangAktifKoor;
