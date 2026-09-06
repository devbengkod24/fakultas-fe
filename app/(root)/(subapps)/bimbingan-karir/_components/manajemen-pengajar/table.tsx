"use client"

import { DataTable } from "@/components/data-table"
import { Columns } from "./column"
import { FilterManajemenDosen } from "./filter"
import { useSearchParams } from "next/navigation"
import EmptyState from "@/components/empty-state"
import { AlertTriangle, FileX } from "lucide-react"
import { ManajemenPengajarService } from "@/api/bimbingan-karir"
import useSWR, { KeyedMutator } from "swr"
import { useProfile } from "@/context/profileUseContext"
import { useEffect, useCallback } from "react"

const fetcherDataPengajar = (activeProdiId: number | null, page: number, limit: number, search: string) => {
  return ManajemenPengajarService.getAllPengajar(activeProdiId, page, limit, search).then((res) => res)};


export function TablesManajemenPengajar() {
  const { activeProdiId } = useProfile();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const fetcherWithProdi = useCallback(() => fetcherDataPengajar(activeProdiId, page, limit, search), [activeProdiId, page, limit, search]);

  const { data, error, isLoading, mutate } = useSWR(
    ["table-manajemen-pengajar", activeProdiId, page, limit, search],
    fetcherWithProdi,
    { revalidateOnFocus: false, dedupingInterval: 500 }
  );

  const daftarPengajar = data?.data?.data || [];
  const totalPages = data?.meta?.pagination.last_page ?? 1;
  const totalData = data?.meta?.pagination.total ?? 0;
  const currentPage = data?.meta?.pagination.current_page ?? 1;
  const perPage = data?.meta?.pagination.per_page ?? limit;
  
  if (error) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Gagal Memuat Data"
        subtitle="Terjadi kesalahan saat memuat data pengajar. Silakan coba lagi."
        className="h-[400px]"
      />
    );
  }

  if (!isLoading && daftarPengajar.length === 0) {
    return (
      <div>
        <div className="w-full flex flex-col gap-2">
          <FilterManajemenDosen mutate={mutate} />
          <EmptyState
            icon={FileX}
            title="Tidak Ada Data Manajemen Pengajar"
            subtitle="Belum ada data manajemen dosen yang tersedia. Silahkan tambahkan data pengajar terlebih dahulu."
            className="h-[400px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div >
      <div className="w-full flex flex-col gap-2">
        <FilterManajemenDosen mutate={mutate} />
        <DataTable 
          columns={Columns(currentPage, perPage, mutate)}
          data={daftarPengajar}
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
