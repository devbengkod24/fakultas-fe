"use client"

// import { useState } from "react"
import { DataTable } from "@/components/data-table"
import { Columns } from "./column"
import { FilterAllRiwayat } from "./filter-all-riwayat"
import { RiwayatService, PeriodeService } from "@/api/bimbingan-karir"
import { useSearchParams } from "next/navigation"
import useSWR from "swr"
import EmptyState from "@/components/empty-state"
import { AlertTriangle, FileX } from "lucide-react"
import { useProfile } from "@/context/profileUseContext"
import { useEffect } from "react"

const fetcherRiwayat = (activeProdiId: number | null, page: number, limit: number, search: string, periode_id?:number) =>
  RiwayatService.getAllRiwayat(activeProdiId, page, limit, search, periode_id || "").then((res) => res);

export function TablesRiwayat() {
  const { activeProdiId } = useProfile();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const periodeId = Number(searchParams.get("periode_id"));

  const { data, error, isLoading, mutate } = useSWR(
    ["riwayat", activeProdiId, page, limit, search, periodeId],
    () => fetcherRiwayat(activeProdiId, page, limit, search, periodeId),
    { revalidateOnFocus: false, dedupingInterval: 0 }
  );

  useEffect(() => {
    if (mutate) {
      mutate();
    }
  }, [activeProdiId, mutate]);

  const { data: periodsData } = useSWR(
    ["periode-riwayat", activeProdiId],
    () => PeriodeService.getAllPeriode(activeProdiId),
    { revalidateOnFocus: false, dedupingInterval: 0 }
  );

  const daftarMhs = data?.data ?? [];
  const totalPages = data?.meta?.pagination.last_page ?? 1;
  const totalData = data?.meta?.pagination.total ?? 0;
  const currentPage = data?.meta?.pagination.current_page ?? 1;
  const perPage = data?.meta?.pagination.per_page ?? limit;

  const periodeList = periodsData?.data ?? [];
  const periodeAktif = periodeList.find((p: { status: number }) => p.status === 1);
  
  if (error) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Gagal Memuat Data"
        subtitle="Terjadi kesalahan saat memuat data riwayat. Silakan coba lagi atau hubungi administrator."
        className="h-[400px]"
      />
    );
  }

  if (!isLoading && daftarMhs.length === 0) {
    return (
      <div>
        <div className="w-full flex flex-col gap-2">
          <FilterAllRiwayat
            periode={periodeId}
            periodeList={periodeList}
            periodeAktif={periodeAktif}
          />
          <EmptyState
            icon={FileX}
            title="Tidak Ada Data Riwayat"
            subtitle="Belum ada data riwayat yang tersedia untuk periode ini. Silahkan pilih periode lainnya."
            className="h-[400px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div >
      <div className="w-full flex flex-col gap-2">
        <FilterAllRiwayat
          periode={periodeId}
          periodeList={periodeList}
          periodeAktif={periodeAktif}
        />
        <DataTable 
          columns={Columns(currentPage, perPage)}
          data={daftarMhs}
          loading={isLoading}
          pagination={{
            currentPage: page,
            lastPage: totalPages,
            limit,
            total: totalData,
          }}
        />
      </div>
    </div>
  )
}
