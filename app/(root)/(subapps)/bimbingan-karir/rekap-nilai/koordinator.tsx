"use client"

import { DataTable } from "@/components/data-table"
import { Columns } from "../_components/rekap-nilai/koordinator/column"
import { FilterAllRekap } from "../_components/rekap-nilai/koordinator/filter-all-rekap"
import { KategoriService, RekapNilaiService } from "@/api/bimbingan-karir"
import useSWR from "swr"
import { useSearchParams } from "next/navigation"
import EmptyState from "@/components/empty-state"
import { AlertTriangle, FileX2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProfile } from "@/context/profileUseContext"
import { useEffect } from "react"

const fetcherRekapNilai = (activeProdiId: number | null, page: number, limit: number, search: string) =>
  RekapNilaiService.getAllRekapNilai(activeProdiId, page, limit, search).then((res) => res);

export function KoordinatorRekapNilai() {
  const { activeProdiId } = useProfile();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const { data, error, isLoading, mutate } = useSWR(
    ["rekap-nilai", activeProdiId, page, limit, search],
    () => fetcherRekapNilai(activeProdiId, page, limit, search),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      dedupingInterval: 0,
    }
  );

  useEffect(() => {
    if (mutate) {
      mutate();
    }
  }, [activeProdiId, mutate]);

  const { data: kategoriData } = useSWR(
    ["kategori-active", activeProdiId],
    () => KategoriService.getActive(activeProdiId),
    { revalidateOnFocus: false, dedupingInterval: 0 }
  );

  const activeCategories = kategoriData?.data || [];

  const daftarMhs = data?.data ?? [];
  const totalPages = data?.meta?.pagination.last_page ?? 1;
  const totalData = data?.meta?.pagination.total ?? 0;
  const currentPage = data?.meta?.pagination.current_page ?? 1;
  const perPage = data?.meta?.pagination.per_page ?? limit;

  if (error) {
    return (
      <div className="w-full">
        <FilterAllRekap />
        <EmptyState
          icon={AlertTriangle}
          title="Gagal memuat data"
          subtitle="Terjadi kesalahan saat memuat data rekap nilai. Silakan coba lagi."
          button={
            <Button
              variant="outline"
              onClick={() => mutate()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </Button>
          }
        />
      </div>
    );
  }

  if (!isLoading && daftarMhs.length === 0) {
    return (
      <div className="w-full">
        <FilterAllRekap />
        <EmptyState
          icon={FileX2}
          title="Tidak ada data"
          subtitle="Data rekap nilai tidak ditemukan."
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-2">
        <FilterAllRekap />
        <DataTable
          columns={Columns(currentPage, perPage, activeCategories)}
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
