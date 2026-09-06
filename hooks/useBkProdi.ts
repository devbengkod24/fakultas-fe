"use client";

import { useProfile } from "@/context/profileUseContext";

interface Prodi {
  id: number;
  nama: string;
  kode_prodi: string;
}

interface BkProdiReturn {
  /** Active prodi ID for filtering */
  activeProdiId: number | null;
  /** Active prodi object */
  activeProdi: Prodi | undefined;
  /** Active prodi name */
  prodiName: string;
  /** All prodis user has access to */
  daftarProdi: Prodi[];
  /** Check if user has multiple prodis */
  hasMultipleProdis: boolean;
  /** Check if user has BK permission */
  hasBkPermission: boolean;
}

export const useBkProdi = (): BkProdiReturn => {
  const { profile, activeProdiId } = useProfile();

  const daftarProdi = profile?.daftar_prodi || [];
  const hasMultipleProdis = daftarProdi.length > 1;
  const hasBkPermission = profile?.permissions?.includes("bimbingan-karir") ?? false;

  const activeProdi = daftarProdi.find((p) => p.id === activeProdiId) || profile?.prodi;

  const prodiName = activeProdi?.nama || "Semua Prodi";

  return {
    activeProdiId,
    activeProdi,
    prodiName,
    daftarProdi,
    hasMultipleProdis,
    hasBkPermission,
  };
};