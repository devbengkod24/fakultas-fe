/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { DataTable } from "@/components/data-table";
import { FilterPengajar } from "@/app/(root)/(subapps)/bimbingan-karir/_components/daftar-mahasiswa/pengajar/filter-pengajar";
import { Columns } from "@/app/(root)/(subapps)/bimbingan-karir/_components/daftar-mahasiswa/pengajar/column";
import { DaftarMhsService, MinatMhsService } from "@/api/bimbingan-karir";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import EmptyState from "@/components/empty-state";
import { AlertTriangle, Users } from "lucide-react";

const fetcherDaftarMhs = (minat: string, page: number, limit: number, search: string) => {
  const minatParam = minat === "semua" ? "" : minat;
  return DaftarMhsService.getAllDaftarMhs(minatParam, page, limit, search).then((res) => res)};

const fetcherMinat = () => {
  return MinatMhsService.getMinat().then((res) => res)
}

export function PengajarDaftarMahasiswa() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const minatMhs = searchParams.get("minat") || "semua";

  const { data, error, isLoading} = useSWR(
    ["daftar-mahasiswa", minatMhs, page, limit, search],
    () => fetcherDaftarMhs(minatMhs, page, limit, search),
    {revalidateOnFocus: false}
  );

  const { data: minatData, isLoading: isLoadingMinat } = useSWR(
    ["minat-mahasiswa-table"],
    () => fetcherMinat(),
    { revalidateOnFocus: false }
  )

  const daftarMhs = data?.data ?? [];
  const totalPages = data?.meta?.pagination.last_page ?? 1;
  const totalData = data?.meta?.pagination.total ?? 0;
  const currentPage = data?.meta?.pagination.current_page ?? 1;
  const perPage = data?.meta?.pagination.per_page ?? limit;
  const minatList = minatData?.data ?? [];

  if (error) return (
    <div>
      <div className="w-full flex flex-col gap-3">
        <FilterPengajar
          minatMhs={minatMhs}
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
          <FilterPengajar
            minatMhs={minatMhs}
          />

          {(!isLoading && daftarMhs.length === 0) ? (
            <EmptyState
              icon={Users}
              title="Tidak Ada Data Mahasiswa"
              subtitle="Belum ada data mahasiswa yang tersedia atau sesuai dengan filter yang dipilih."
            />
          ) : (
            <DataTable
              columns={Columns(currentPage, perPage, minatList)}
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
