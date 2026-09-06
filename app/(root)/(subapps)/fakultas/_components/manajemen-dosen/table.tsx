"use client";

import { DataTable } from "@/components/data-table";
import { FilterDosen } from "./filter";
import { Columns } from "./column";
import { useSearchParams } from "next/navigation";
import { Dosen, ProdiInfo } from "@/types/fakultas/penelitian/penelitian";
import { handleToastResponse } from "@/lib/toast-response";
import { DosenFakultasService } from "@/api";
import useSWR, { mutate } from "swr";
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

export function TableDosen() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const searchFromUrl = searchParams.get("search") || "";
  const prodiFromUrl = searchParams.get("prodi") || "";
  const jabatanFromUrl = searchParams.get("jabatan") || "";

  const swrKey = ["dosen-fakultas", page, limit, searchFromUrl, prodiFromUrl, jabatanFromUrl];

  const { data: response, error, isLoading } = useSWR(
    swrKey,
    () => DosenFakultasService.getAll(page, limit, searchFromUrl, prodiFromUrl, jabatanFromUrl),
    { revalidateOnFocus: false }
  );

  const rawData = response?.data?.data ?? [];
  const pagination = response?.data?.meta?.pagination;
  const data = rawData.map(adaptDosen);
  const totalPages = pagination?.last_page ?? 1;
  const totalData = pagination?.total ?? 0;

  const handleEdit = async (dosen: Dosen) => {
    if (!dosen.dosen_id) {
      handleToastResponse({ success: false, message: "ID Dosen tidak ditemukan" });
      return;
    }
    try {
      console.log("Editing dosen:", dosen);
      mutate(swrKey);
      handleToastResponse({ success: true, message: "Berhasil memperbarui data dosen" });
    } catch (error) {
      handleToastResponse({ success: false, message: "Gagal memperbarui data dosen" });
      console.error(error);
      throw error;
    }
  };

  if (error) {
    return (
      <div className="w-full flex flex-col gap-3">
        <FilterDosen />
        <EmptyState
          icon={AlertTriangle}
          title="Terjadi Kesalahan"
          subtitle="Data dosen tidak dapat dimuat. Silakan coba lagi nanti."
          className="h-[400px]"
        />
      </div>
    );
  }

  if (!isLoading && !error && data.length === 0 && !searchFromUrl && !prodiFromUrl && !jabatanFromUrl) {
    return (
      <div className="w-full flex flex-col gap-3">
        <FilterDosen />
        <EmptyState
          icon={Users}
          title="Belum Ada Data Dosen"
          subtitle="Belum ada data dosen yang tersedia."
          className="h-[400px]"
        />
      </div>
    );
  }

  if (!isLoading && !error && data.length === 0 && (searchFromUrl || prodiFromUrl || jabatanFromUrl)) {
    return (
      <div className="w-full flex flex-col gap-3">
        <FilterDosen />
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
      <FilterDosen />
      <DataTable
        columns={Columns(page, limit)}
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