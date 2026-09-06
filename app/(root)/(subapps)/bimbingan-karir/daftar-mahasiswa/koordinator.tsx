/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { DataTable } from "@/components/data-table";
import { FilterAllDaftarMhs } from "@/app/(root)/(subapps)/bimbingan-karir/_components/daftar-mahasiswa/filter-all-daftar-mhs";
import { Columns } from "@/app/(root)/(subapps)/bimbingan-karir/_components/daftar-mahasiswa/column";
import { DaftarMhsService, MinatMhsService } from "@/api/bimbingan-karir";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import EmptyState from "@/components/empty-state";
import { AlertTriangle, Users } from "lucide-react";
import { handleToastResponse } from "@/lib/toast-response";
import { useState } from "react";
import { useProfile } from "@/context/profileUseContext";

const fetcherDaftarMhs = (activeProdiId: number | null, minat: string, page: number, limit: number, search: string) => {
  const minatParam = minat === "semua" ? "" : minat;
  return DaftarMhsService.getAllDaftarMhs(minatParam, page, limit, search, activeProdiId).then((res) => res);
};

const fetcherMinat = (activeProdiId: number | null) => {
  return MinatMhsService.getMinat(activeProdiId).then((res) => res);
};

export function KoordinatorDaftarMahasiswa() {
  const searchParams = useSearchParams();
  const { activeProdiId } = useProfile();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const minatMhs = searchParams.get("minat") || "semua";
  const [isSyncing, setIsSyncing] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    ["daftar-mahasiswa", activeProdiId, minatMhs, page, limit, search],
    () => fetcherDaftarMhs(activeProdiId, minatMhs, page, limit, search),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      dedupingInterval: 500,
    }
  );

  const { data: minatData, isLoading: isLoadingMinat } = useSWR(
    ["minat-mahasiswa-table", activeProdiId],
    () => fetcherMinat(activeProdiId),
    { revalidateOnFocus: false, dedupingInterval: 500 }
  );

  const daftarMhs = data?.data ?? [];
  const totalPages = data?.meta?.pagination.last_page ?? 1;
  const totalData = data?.meta?.pagination.total ?? 0;
  const currentPage = data?.meta?.pagination.current_page ?? 1;
  const perPage = data?.meta?.pagination.per_page ?? limit;
  const minatList = minatData?.data ?? [];

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await DaftarMhsService.Sync();
      mutate();
      handleToastResponse(response);
    } catch (error: any) {
      handleToastResponse(error.response);
    } finally {
      setIsSyncing(false);
    }
  };

  if (error) return (
    <div>
      <div className="w-full flex flex-col gap-3">
        <FilterAllDaftarMhs
          minatMhs={minatMhs}
          mutate={mutate}
          isSyncing={isSyncing}
          handleSync={handleSync}
        />
        <EmptyState
          icon={AlertTriangle}
          title="Terjadi Kesalahan"
          subtitle="Data mahasiswa tidak dapat dimuat. Silakan coba lagi nanti."
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className="w-full flex flex-col gap-3">
        <FilterAllDaftarMhs
          minatMhs={minatMhs}
          mutate={mutate}
          isSyncing={isSyncing}
          handleSync={handleSync}
        />

        {(!isLoading && daftarMhs.length === 0) ? (
          <EmptyState
            icon={Users}
            title="Tidak Ada Data Mahasiswa"
            subtitle="Belum ada data mahasiswa yang tersedia atau sesuai dengan filter yang dipilih."
          />
        ) : (
          <DataTable
            columns={Columns(currentPage, perPage, minatList, mutate)}
            data={daftarMhs}
            loading={isLoading || isLoadingMinat}
            pagination={{
              currentPage: page,
              lastPage: totalPages,
              limit,
              total: totalData,
            }}
          />
        )}
      </div>
    </div>
  );
}