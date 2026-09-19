"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { FilterSyncMataKuliah } from "./filter";
import { Columns } from "./column";
import { useSearchParams } from "next/navigation";
import { MataKuliahSync } from "@/types/fakultas/sync-data/mata-kuliah";
import useSWR, { mutate } from "swr";
import EmptyState from "@/components/empty-state";
import { BookOpen, AlertTriangle } from "lucide-react";
import { MataKuliahFakultasService } from "@/api/fakultas";
import { FakultasSyncService } from "@/api";
import { toast } from "sonner";
import { SyncResultModal, SyncResultData } from "@/components/sync-result-modal";

/* eslint-disable @typescript-eslint/no-explicit-any */

function adaptMataKuliah(raw: any): MataKuliahSync {
  return {
    id: raw.id,
    kode: raw.kode,
    name: raw.name,
    sks: raw.sks,
    semester_ditawarkan: raw.semester ?? 0,
    tipe_mk: raw.tipe_mk ?? "prodi",
    prodi_id: raw.prodi_id ?? null,
    peminatan_id: raw.peminatan_id ?? null,
    prodi: raw.prodi ?? undefined,
  };
}

const fetcher = () =>
  MataKuliahFakultasService.getAll().then((res) => {
    const items = res?.data ?? [];
    return Array.isArray(items) ? items.map(adaptMataKuliah) : [];
  });

export function DataDaftarMataKuliah() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const searchFromUrl = searchParams.get("search") || "";
  const tipeFromUrl = searchParams.get("tipe") || "all";
  const prodiFromUrl = searchParams.get("prodi") || "all";
  const semesterFromUrl = searchParams.get("semester") || "all";

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    show: boolean;
    success: boolean;
    message: string;
    data: SyncResultData;
  }>({ show: false, success: true, message: "", data: null });

  const {
    data: allData,
    error,
    isLoading,
  } = useSWR("sync-mata-kuliah", fetcher, { revalidateOnFocus: false });

  const filteredData = useMemo(() => {
    if (!allData) return [];
    let filtered = [...allData];

    if (searchFromUrl) {
      const q = searchFromUrl.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.kode.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
      );
    }

    if (tipeFromUrl !== "all") {
      if (tipeFromUrl === "peminatan") {
        filtered = filtered.filter(
          (c) => c.tipe_mk === "peminatan" || c.peminatan_id != null
        );
      } else {
        filtered = filtered.filter((c) => c.tipe_mk === tipeFromUrl);
      }
    }

    if (prodiFromUrl !== "all") {
      filtered = filtered.filter((c) => String(c.prodi_id) === prodiFromUrl);
    }

    if (semesterFromUrl !== "all") {
      filtered = filtered.filter(
        (c) => String(c.semester_ditawarkan) === semesterFromUrl
      );
    }

    return filtered;
  }, [allData, searchFromUrl, tipeFromUrl, prodiFromUrl, semesterFromUrl]);

  const prodiOptions = useMemo(() => {
    if (!allData) return [];
    const map = new Map<number | null, string>();
    for (const item of allData) {
      const key = item.prodi_id ?? null;
      if (!map.has(key)) {
        map.set(key, item.prodi?.nama || (key === null ? "Tanpa Program Studi" : `Prodi ID: ${key}`));
      }
    }
    return Array.from(map.entries())
      .map(([id, nama]) => ({ id, nama }))
      .sort((a, b) => {
        if (a.id === null) return 1;
        if (b.id === null) return -1;
        return a.nama.localeCompare(b.nama);
      });
  }, [allData]);

  const totalData = filteredData.length;
  const totalPages = Math.ceil(totalData / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedData = filteredData.slice(startIndex, startIndex + limit);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await FakultasSyncService.syncMatkul();
      setSyncResult({
        show: true,
        success: res?.success !== false,
        message: res?.message ?? "Sync selesai",
        data: res?.data ?? null,
      });
      mutate("sync-mata-kuliah");
    } catch {
      toast.error("Gagal melakukan sinkronisasi data mata kuliah");
    } finally {
      setIsSyncing(false);
    }
  };

  if (error) {
    return (
      <div className="w-full flex flex-col gap-3">
        <FilterSyncMataKuliah onSync={handleSync} prodiOptions={prodiOptions} />
        <EmptyState
          icon={AlertTriangle}
          title="Terjadi Kesalahan"
          subtitle="Data mata kuliah tidak dapat dimuat. Silakan coba lagi nanti."
          className="h-[400px]"
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <FilterSyncMataKuliah onSync={handleSync} prodiOptions={prodiOptions} />

      {!isLoading && paginatedData.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={searchFromUrl ? "Tidak Ada Hasil Pencarian" : "Belum Ada Data Mata Kuliah"}
          subtitle={
            searchFromUrl
              ? `Tidak ada hasil pencarian untuk "${searchFromUrl}". Coba gunakan kata kunci lain.`
              : "Belum ada data mata kuliah yang disinkronkan. Silakan klik tombol 'Sync Data' untuk mengunduh data."
          }
          className="h-[350px]"
        />
      ) : (
        <DataTable
          columns={Columns(page, limit)}
          data={paginatedData}
          loading={isLoading}
          pagination={{
            currentPage: page,
            lastPage: totalPages,
            limit,
            total: totalData,
          }}
        />
      )}

      <SyncResultModal
        open={syncResult.show}
        onOpenChange={(open) => setSyncResult((prev) => ({ ...prev, show: open }))}
        success={syncResult.success}
        message={syncResult.message}
        data={syncResult.data}
      />
    </div>
  );
}
