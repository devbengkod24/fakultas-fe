"use client";

import useSWR from "swr";
import { PublicDosenService } from "@/api";
import type { PublicDosen, StandardResponse } from "@/types/dosen/public-dosen";

interface UsePublicDosenReturn {
  dosen: PublicDosen | null;
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
}

export const usePublicDosen = (
  dosenId: number | null | undefined,
): UsePublicDosenReturn => {
  const { data, error, isLoading, mutate } = useSWR<StandardResponse<PublicDosen>>(
    dosenId ? ["public-dosen", dosenId] : null,
    () => PublicDosenService.getById(dosenId!) as Promise<StandardResponse<PublicDosen>>,
    { revalidateOnFocus: false },
  );

  return {
    dosen: data?.data ?? null,
    isLoading: isLoading,
    error: error ?? null,
    mutate: () => {
      void mutate();
    },
  };
};