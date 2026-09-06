"use client";

import { DataTable } from "@/components/data-table";
import { FilterSyncMataKuliah } from "./filter";
import { Columns } from "./column";
import { useSearchParams } from "next/navigation";
import { MataKuliahSync } from "@/types/fakultas/sync-data/mata-kuliah";
import { handleToastResponse } from "@/lib/toast-response";
import useSWR, { mutate } from "swr";
import EmptyState from "@/components/empty-state";
import { BookOpen, AlertTriangle } from "lucide-react";
import { INITIAL_MOCK_COURSES, SYNCABLE_COURSES, MOCK_PRODIS } from "./mock-data";

// Stateful mock database in memory acting as local server
let mockDatabase: MataKuliahSync[] = [...INITIAL_MOCK_COURSES];

const fetchMockCourses = async (
  page: number,
  limit: number,
  search: string,
  tipe: string
) => {
  // Simulate network latency to allow verifying skeletal loading/shimmer UI
  await new Promise((resolve) => setTimeout(resolve, 600));

  let filtered = [...mockDatabase];

  // Search filter (name or code)
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.kode.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    );
  }

  // Tipe Mata Kuliah filter
  if (tipe !== "all") {
    filtered = filtered.filter((c) => c.tipe_mk === tipe);
  }

  // Join relationship mapping to get Program Studi name based on prodi_id
  const withRelationships = filtered.map((course) => ({
    ...course,
    prodi: MOCK_PRODIS.find((p) => p.id === course.prodi_id),
  }));

  // Pagination
  const total = withRelationships.length;
  const last_page = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginatedData = withRelationships.slice(startIndex, startIndex + limit);

  return {
    data: paginatedData,
    meta: {
      pagination: {
        last_page: last_page || 1,
        total,
      },
    },
  };
};

export function DataDaftarMataKuliah() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const searchFromUrl = searchParams.get("search") || "";
  const tipeFromUrl = searchParams.get("tipe") || "all";

  const {
    data: response,
    error,
    isLoading,
  } = useSWR(
    ["sync-mata-kuliah", page, limit, searchFromUrl, tipeFromUrl],
    () => fetchMockCourses(page, limit, searchFromUrl, tipeFromUrl),
    { revalidateOnFocus: false }
  );

  const data = response?.data || [];
  const meta = response?.meta;

  const totalPages = meta?.pagination?.last_page ?? 1;
  const totalData = meta?.pagination?.total ?? 0;

  // Handle sync data function
  const handleSync = async () => {
    // Simulate sync API network request latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let addedCount = 0;
    SYNCABLE_COURSES.forEach((course) => {
      if (!mockDatabase.some((c) => c.id === course.id)) {
        mockDatabase.unshift(course); // Add newly synced courses to the beginning
        addedCount++;
      }
    });

    // Invalidate SWR cache keys to force revalidation
    mutate((key) => Array.isArray(key) && key[0] === "sync-mata-kuliah");

    if (addedCount > 0) {
      handleToastResponse({
        success: true,
        message: `${addedCount} data mata kuliah baru berhasil disinkronkan.`,
      });
    } else {
      handleToastResponse({
        success: true,
        message: "Data mata kuliah sudah sinkron dengan sistem pusat.",
      });
    }
  };

  if (error) {
    return (
      <div className="w-full flex flex-col gap-3">
        <FilterSyncMataKuliah onSync={handleSync} />
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
      <FilterSyncMataKuliah onSync={handleSync} />

      {/* Show empty state or data table */}
      {!isLoading && data.length === 0 ? (
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
          data={data}
          loading={isLoading}
          pagination={{
            currentPage: page,
            lastPage: totalPages,
            limit,
            total: totalData,
          }}
        />
      )}
    </div>
  );
}
