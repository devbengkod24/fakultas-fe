"use client";

import useSWR from "swr";
import { GelombangService } from "@/api/kerja-praktek";
import { useProfile } from "@/context/profileUseContext";
import { GelombangAktifView } from "@/components/shared-ta-kp/dashboard/gelombang-aktif-view";
import type { GelombangAktifItem } from "@/components/shared-ta-kp/dashboard/gelombang-aktif-view";

const GelombangAktifKoor = () => {
  const { activeProdiId } = useProfile();

  const {
    data: response,
    isLoading,
    error,
  } = useSWR(
    activeProdiId ? ["koor-gelombang-aktif", activeProdiId] : null,
    () => GelombangService.getGelombangAktif(activeProdiId ?? undefined),
  );

  const gelombangAktif: GelombangAktifItem[] = response?.success
    ? response.data.filter((gel: any) => Number(gel.status) === 1)
    : [];

  return (
    <GelombangAktifView
      gelombangAktif={gelombangAktif}
      loading={isLoading}
      error={!!error}
    />
  );
};

export default GelombangAktifKoor;