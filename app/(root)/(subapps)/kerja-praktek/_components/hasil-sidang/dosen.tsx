"use client"

import { DataTable } from "@/components/data-table"
import { MonitoringSidangService } from "@/api/kerja-praktek"
import useSWR from "swr"
import { useSearchParams } from "next/navigation"
import { Columns } from "./columns"
import { toast } from "sonner"
import MonitoringSidangToolbar from "./toolbar"
import { handleToastResponse } from "@/lib/toast-response"
import type { MonitoringSidang, PeranDosen } from "@/types/kerja-praktek/monitoring-sidang"
import EmptyState from "@/components/empty-state"
import { CalendarCheck } from "lucide-react"
import { useProfile } from "@/context/profileUseContext"

const fetchAllMonitoringSidangDosen = async (gelombang_id?: number, search?: string) => {
  const pageSize = 100;
  const firstResponse = await MonitoringSidangService.getAllMonitoringSidangDosen(gelombang_id, search, 1, pageSize);
  const firstPageData: MonitoringSidang[] = firstResponse?.data ?? [];
  const lastPage: number = firstResponse?.meta?.pagination?.last_page ?? 1;

  let merged = [...firstPageData];

  if (lastPage > 1) {
    const pagePromises: Promise<any>[] = [];
    for (let page = 2; page <= lastPage; page += 1) {
      pagePromises.push(MonitoringSidangService.getAllMonitoringSidangDosen(gelombang_id, search, page, pageSize));
    }

    const otherPages = await Promise.all(pagePromises);
    const otherData = otherPages.flatMap((res) => res?.data ?? []);
    merged = [...merged, ...otherData];
  }

  // Backend now handles filtering for jadwal, no need for client-side filter
  return merged;
};

export default function MonitoringSidangDosen({ hideSearchBar = false }: { hideSearchBar?: boolean } = {}) {
  const searchParams = useSearchParams();

  // Panggil useProfile di top-level component lifecycle (BUKAN di dalam Columns
  // factory). Sebelumnya useProfile() dipanggil di Columns() yang dipanggil inline
  // di JSX column prop, sehingga order hook berubah tiap render → React error.
  const { profile } = useProfile();
  const role = profile?.roles;
  const isDosen = role === "dosen";

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const searchTerm = searchParams.get("search") || "";
  const gelombangId = Number(searchParams.get("gelombang_id")) || undefined;

  const { data: hasilSidang, isLoading, mutate } = useSWR(
    ["hasil-sidang", gelombangId, searchTerm],
    () => fetchAllMonitoringSidangDosen(gelombangId, searchTerm),
    { revalidateOnFocus: false }
  );

  const totalData = hasilSidang?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalData / limit));
  const currentPage = Math.min(page, totalPages);
  const perPage = limit;
  const startIndex = (currentPage - 1) * limit;
  const paginatedSidang = (hasilSidang ?? []).slice(startIndex, startIndex + limit);

  // Update nilai via endpoint dosen. Setiap peran (pembimbing/penguji_1/2/3)
  // di-route ke handler terpisah, lalu backend yang menentukan kolom DB mana
  // yang di-update berdasarkan `peran` di body request (lihat fieldMap di
  // SidangService::updateNilaiSidang). BE akan reject 403 jika dosen tidak
  // memegang peran tsb di sidang ini.
  const handleUpdateNilaiByPeran = async (
    id: number,
    peran: PeranDosen,
    nilai: number,
  ) => {
    try {
      const res = await MonitoringSidangService.updateNilaiDosen(id, peran, nilai);
      handleToastResponse(res);
      mutate();
    } catch (error) {
      console.error(`Error update nilai ${peran}:`, error);
      toast.error(`Gagal mengupdate nilai ${peran}`);
    }
  };

  const handleUpdateNilaiPenyelia = async (_id: number, _nilai: number) => {
    // Dosen tidak boleh mengubah nilai penyelia (wewenang koor/mitra).
    toast.error("Nilai penyelia hanya dapat diubah oleh koordinator");
  };

  const handleUpdateNilaiPembimbing = async (id: number, nilai: number) => {
    await handleUpdateNilaiByPeran(id, "pembimbing", nilai);
  };

  const handleUpdateNilaiPenguji1 = async (id: number, nilai: number) => {
    await handleUpdateNilaiByPeran(id, "penguji_1", nilai);
  };

  const handleUpdateNilaiPenguji2 = async (id: number, nilai: number) => {
    await handleUpdateNilaiByPeran(id, "penguji_2", nilai);
  };

  const handleUpdateNilaiPenguji3 = async (id: number, nilai: number) => {
    await handleUpdateNilaiByPeran(id, "penguji_3", nilai);
  };

  return (
    <div className="w-full space-y-6">
      <MonitoringSidangToolbar
        hideSearchBar={hideSearchBar}
      />

      {!isLoading && paginatedSidang.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="Belum Ada Hasil Sidang"
          subtitle="Data sidang akan muncul setelah jadwal dipasang di menu Plotting Jadwal."
        />
      ) : (
        <DataTable
          columns={Columns(
            currentPage,
            perPage,
            isDosen,
            handleUpdateNilaiPenyelia,
            handleUpdateNilaiPembimbing,
            handleUpdateNilaiPenguji1,
            handleUpdateNilaiPenguji2,
            handleUpdateNilaiPenguji3,
          )}
          data={paginatedSidang}
          loading={isLoading}
          pagination={{
            currentPage,
            lastPage: totalPages,
            limit,
            total: totalData,
          }}
        />
      )}
    </div>
  )
}