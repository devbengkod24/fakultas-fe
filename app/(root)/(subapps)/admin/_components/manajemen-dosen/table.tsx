"use client";

import { DataTable } from "@/components/data-table";
import { FilterDosen } from "@/app/(root)/(subapps)/fakultas/_components/manajemen-dosen/filter";
import { Columns } from "@/app/(root)/(subapps)/fakultas/_components/manajemen-dosen/column";
import { useSearchParams } from "next/navigation";
import { Dosen, ProdiInfo } from "@/types/fakultas/penelitian/penelitian";
import { DosenFakultasService } from "@/api";
import { useProfile } from "@/context/profileUseContext";
import useSWR from "swr";
import EmptyState from "@/components/empty-state";
import { Users, AlertTriangle } from "lucide-react";

interface DosenAPI {
  user_id: number;
  dosen_id: number | null;
  name: string;
  npp: string | null;
  gelar_depan: string | null;
  gelar_belakang: string | null;
  bidang_kajian: string | null;
  jabatan_fungsional: string | null;
  prodi_homebase: ProdiInfo;
  prodi_tugas: ProdiInfo[];
}

function adaptDosen(d: DosenAPI): Dosen {
  const gelar = [d.gelar_depan, d.name, d.gelar_belakang]
    .filter(Boolean)
    .join(" ");
  return {
    user_id: d.user_id,
    dosen_id: d.dosen_id ?? d.user_id,
    npp: d.npp ?? "",
    nama: gelar || d.name,
    email: "",
    prodi_homebase: d.prodi_homebase,
    prodi_tugas: d.prodi_tugas,
    jabatan: d.jabatan_fungsional ?? "-",
    peminatan: d.bidang_kajian ?? "-",
  };
}

export function TableDosenAdmin() {
  const searchParams = useSearchParams();
  const { activeProdiId } = useProfile();


  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const searchFromUrl = searchParams.get("search") || "";
  const jabatanFromUrl = searchParams.get("jabatan") || "";

  const swrKey = ["dosen-admin", page, limit, searchFromUrl, jabatanFromUrl];

  const { data: response, error, isLoading } = useSWR(
    swrKey,
    () => DosenFakultasService.getAll(page, limit, searchFromUrl, activeProdiId?.toString(), jabatanFromUrl),
    { revalidateOnFocus: false }
  );
  const rawData = response?.data?.data ?? [];
  const pagination = response?.data?.meta?.pagination;
  const data = rawData.map(adaptDosen);
  const totalPages = pagination?.last_page ?? 1;
  const totalData = pagination?.total ?? 0;

  if (error) {
    return (
      <div className="w-full flex flex-col gap-3">
        <FilterDosen hideProdi />
        <EmptyState
          icon={AlertTriangle}
          title="Terjadi Kesalahan"
          subtitle="Data dosen tidak dapat dimuat. Silakan coba lagi nanti."
          className="h-[400px]"
        />
      </div>
    );
  }

  if (!isLoading && !error && data.length === 0 && !searchFromUrl && !jabatanFromUrl) {
    return (
      <div className="w-full flex flex-col gap-3">
        <FilterDosen hideProdi />
        <EmptyState
          icon={Users}
          title="Belum Ada Data Dosen"
          subtitle="Belum ada data dosen yang tersedia."
          className="h-[400px]"
        />
      </div>
    );
  }

  if (!isLoading && !error && data.length === 0 && (searchFromUrl || jabatanFromUrl)) {
    return (
      <div className="w-full flex flex-col gap-3">
        <FilterDosen hideProdi />
        <EmptyState
          icon={Users}
          title="Tidak Ada Hasil Pencarian"
          subtitle="Tidak ada hasil yang sesuai. Coba gunakan filter yang berbeda."
          className="h-[400px]"
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <FilterDosen hideProdi />
      <DataTable
        columns={Columns(page, limit, "/admin/manajemen-dosen/detail")}
        data={data}
        loading={isLoading}
        pagination={{
          currentPage: page,
          lastPage: totalPages,
          limit,
          total: totalData,
        }}
      />
    </div>
  );
}