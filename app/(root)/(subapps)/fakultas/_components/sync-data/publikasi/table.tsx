"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { FilterSyncPublikasi } from "./filter";
import { ColumnsPublikasi } from "./column-publikasi";
import { ColumnsPenelitian } from "./column-penelitian";
import { useSearchParams } from "next/navigation";
import { handleToastResponse } from "@/lib/toast-response";
import useSWR, { mutate } from "swr";
import EmptyState from "@/components/empty-state";
import { BookOpen, FlaskConical, AlertTriangle } from "lucide-react";
import {
  INITIAL_MOCK_PUBLIKASI,
  SYNCABLE_PUBLIKASI,
  INITIAL_MOCK_PENELITIAN,
  SYNCABLE_PENELITIAN,
  PublikasiSync,
  PenelitianSync,
} from "./mock-data";

let mockPublikasiDb: PublikasiSync[] = [...INITIAL_MOCK_PUBLIKASI];
let mockPenelitianDb: PenelitianSync[] = [...INITIAL_MOCK_PENELITIAN];

const fetchMockPublikasi = async (page: number, limit: number, search: string) => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  let filtered = [...mockPublikasiDb];
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((p) => p.judul.toLowerCase().includes(q));
  }

  const total = filtered.length;
  const last_page = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return { data: paginated, meta: { pagination: { last_page, total } } };
};

const fetchMockPenelitian = async (page: number, limit: number, search: string) => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  let filtered = [...mockPenelitianDb];
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((p) => p.judul.toLowerCase().includes(q));
  }

  const total = filtered.length;
  const last_page = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return { data: paginated, meta: { pagination: { last_page, total } } };
};

export function DataSyncPublikasi() {
  const [activeTab, setActiveTab] = useState<"publikasi" | "penelitian">("publikasi");
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  /* ================= PUBLIKASI ================= */
  const {
    data: pubResponse,
    error: pubError,
    isLoading: pubLoading,
  } = useSWR(
    activeTab === "publikasi" ? ["sync-publikasi", page, limit, search] : null,
    () => fetchMockPublikasi(page, limit, search),
    { revalidateOnFocus: false }
  );

  /* ================= PENELITIAN ================= */
  const {
    data: penResponse,
    error: penError,
    isLoading: penLoading,
  } = useSWR(
    activeTab === "penelitian" ? ["sync-penelitian", page, limit, search] : null,
    () => fetchMockPenelitian(page, limit, search),
    { revalidateOnFocus: false }
  );

  const handleSyncPublikasi = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    let addedCount = 0;
    SYNCABLE_PUBLIKASI.forEach((item) => {
      if (!mockPublikasiDb.some((p) => p.id === item.id)) {
        mockPublikasiDb.unshift(item);
        addedCount++;
      }
    });
    mutate((key) => Array.isArray(key) && key[0] === "sync-publikasi");
    handleToastResponse({
      success: true,
      message:
        addedCount > 0
          ? `${addedCount} data publikasi baru berhasil disinkronkan.`
          : "Data publikasi sudah sinkron dengan sistem pusat.",
    });
  };

  const handleSyncPenelitian = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    let addedCount = 0;
    SYNCABLE_PENELITIAN.forEach((item) => {
      if (!mockPenelitianDb.some((p) => p.id === item.id)) {
        mockPenelitianDb.unshift(item);
        addedCount++;
      }
    });
    mutate((key) => Array.isArray(key) && key[0] === "sync-penelitian");
    handleToastResponse({
      success: true,
      message:
        addedCount > 0
          ? `${addedCount} data penelitian baru berhasil disinkronkan.`
          : "Data penelitian sudah sinkron dengan sistem pusat.",
    });
  };

  const pubData = pubResponse?.data || [];
  const pubTotalPages = pubResponse?.meta?.pagination?.last_page ?? 1;
  const pubTotal = pubResponse?.meta?.pagination?.total ?? 0;

  const penData = penResponse?.data || [];
  const penTotalPages = penResponse?.meta?.pagination?.last_page ?? 1;
  const penTotal = penResponse?.meta?.pagination?.total ?? 0;

  return (
    <div className="mt-4 rounded-xl border bg-white p-5">
      <div className="mb-4">
        <h2 className="font-semibold">Data Publikasi &amp; Penelitian</h2>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 mb-5">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("publikasi")}
            className={`pb-3 px-1 text-sm font-medium relative flex items-center gap-2 ${
              activeTab === "publikasi" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <BookOpen className="size-4" />
            Publikasi
            {activeTab === "publikasi" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("penelitian")}
            className={`pb-3 px-1 text-sm font-medium relative flex items-center gap-2 ${
              activeTab === "penelitian" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <FlaskConical className="size-4" />
            Penelitian
            {activeTab === "penelitian" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* ── TAB PUBLIKASI ── */}
      {activeTab === "publikasi" && (
        pubError ? (
          <EmptyState
            icon={AlertTriangle}
            title="Terjadi Kesalahan"
            subtitle="Data publikasi tidak dapat dimuat. Silakan coba lagi nanti."
            className="h-[350px]"
          />
        ) : (
          <div className="flex flex-col gap-4">
            <FilterSyncPublikasi onSync={handleSyncPublikasi} searchPlaceholder="Cari berdasarkan judul..." />
            {!pubLoading && pubData.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title={search ? "Tidak Ada Hasil Pencarian" : "Belum Ada Data Publikasi"}
                subtitle={
                  search
                    ? `Tidak ada hasil pencarian untuk "${search}".`
                    : "Belum ada data publikasi yang disinkronkan. Silakan klik tombol 'Sync Data'."
                }
                className="h-[300px]"
              />
            ) : (
              <DataTable
                columns={ColumnsPublikasi(page, limit)}
                data={pubData}
                loading={pubLoading}
                pagination={{
                  currentPage: page,
                  lastPage: pubTotalPages,
                  limit,
                  total: pubTotal,
                }}
              />
            )}
          </div>
        )
      )}

      {/* ── TAB PENELITIAN ── */}
      {activeTab === "penelitian" && (
        penError ? (
          <EmptyState
            icon={AlertTriangle}
            title="Terjadi Kesalahan"
            subtitle="Data penelitian tidak dapat dimuat. Silakan coba lagi nanti."
            className="h-[350px]"
          />
        ) : (
          <div className="flex flex-col gap-4">
            <FilterSyncPublikasi onSync={handleSyncPenelitian} searchPlaceholder="Cari berdasarkan judul..." />
            {!penLoading && penData.length === 0 ? (
              <EmptyState
                icon={FlaskConical}
                title={search ? "Tidak Ada Hasil Pencarian" : "Belum Ada Data Penelitian"}
                subtitle={
                  search
                    ? `Tidak ada hasil pencarian untuk "${search}".`
                    : "Belum ada data penelitian yang disinkronkan. Silakan klik tombol 'Sync Data'."
                }
                className="h-[300px]"
              />
            ) : (
              <DataTable
                columns={ColumnsPenelitian(page, limit)}
                data={penData}
                loading={penLoading}
                pagination={{
                  currentPage: page,
                  lastPage: penTotalPages,
                  limit,
                  total: penTotal,
                }}
              />
            )}
          </div>
        )
      )}
    </div>
  );
}