"use client";

import { DaftarMahasiswaToolbar } from "./toolbar";
import { MahasiswaService } from "@/api/kerja-praktek";
import useSWR from "swr";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { Columns } from "./column";
import { Button } from "@/components/ui/button";
import { Users2, AlertCircle } from "lucide-react";
import { DaftarMahasiswaTableSkeleton } from "./skeleton";
import EmptyState from "@/components/empty-state";
import { SortConfig } from "@/types/kerja-praktek/sortconfig";
import { useProfile } from "@/context/profileUseContext";

const getSortValueFromConfig = (sortConfig: SortConfig): string => {
  if (sortConfig.nim === "asc") return "nim-asc";
  if (sortConfig.nim === "desc") return "nim-desc";
  if (sortConfig.name === "asc") return "name-asc";
  if (sortConfig.name === "desc") return "name-desc";
  if (sortConfig.pembimbing === "asc") return "pembimbing-asc";
  if (sortConfig.pembimbing === "desc") return "pembimbing-desc";
  if (sortConfig.pembimbing === "none") return "pembimbing-none";
  return "default";
};

const fetcher = (page: number, limit: number, search: string, periode_id?: number, sort?: SortConfig, prodi_id?: number) =>
  MahasiswaService.getAllMahasiswa(page, limit, search, periode_id, sort, prodi_id).then((res) => res);

export default function DaftarMahasiswaKoordinator() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { activeProdiId } = useProfile();

  const searchTerm = searchParams.get("search") ?? "";

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const periode_id = Number(searchParams.get("periode_id")) || undefined;
  const dosenIdQuery = Number(searchParams.get("dosen_id")) || undefined;

  const sortParam = searchParams.get("sort");
  const sortConfig: SortConfig | undefined = sortParam ? JSON.parse(decodeURIComponent(sortParam)) : undefined;

  const { data, error, isLoading, mutate } = useSWR(
    ["mahasiswa", page, limit, searchTerm, periode_id, sortConfig, activeProdiId ?? undefined],
    () => fetcher(page, limit, searchTerm, periode_id, sortConfig, activeProdiId ?? undefined),
    { revalidateOnFocus: false }
  );

  const daftarMahasiswa = data?.data ?? [];
  let filteredMahasiswa = daftarMahasiswa;
  if (dosenIdQuery) {
    filteredMahasiswa = daftarMahasiswa.filter((m: any) => m.dosen_pembimbing?.id === dosenIdQuery);
  }

  const totalPages = dosenIdQuery ? 1 : data?.meta?.pagination?.last_page ?? 1;
  const totalData = dosenIdQuery ? filteredMahasiswa.length : data?.meta?.pagination?.total ?? 0;
  const currentPage = dosenIdQuery ? 1 : data?.meta?.pagination?.current_page ?? 1;
  const perPage = dosenIdQuery ? filteredMahasiswa.length : data?.meta?.pagination?.per_page ?? limit;

  const handleTableSort = (newSortConfig: SortConfig) => {
    const params = new URLSearchParams(searchParams.toString());
    if (Object.keys(newSortConfig).length > 0) {
      params.set("sort", encodeURIComponent(JSON.stringify(newSortConfig)));
    } else {
      params.delete("sort");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <DaftarMahasiswaToolbar onImported={() => mutate()} />

      {isLoading ? (
        <DaftarMahasiswaTableSkeleton />
      ) : error ? (
        <EmptyState
          icon={AlertCircle}
          title="Terjadi Kesalahan"
          subtitle={`Gagal memuat data mahasiswa: ${error.message}`}
          button={
            <Button onClick={() => mutate()} variant="outline">
              Coba Lagi
            </Button>
          }
        />
      ) : filteredMahasiswa.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="Belum ada Mahasiswa"
          subtitle={
            searchTerm
              ? `Tidak ada mahasiswa dengan kata kunci "${searchTerm}"`
              : "Belum ada mahasiswa yang terdaftar pada periode ini."
          }
        />
      ) : (
        <>
          {dosenIdQuery && (
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Menampilkan mahasiswa untuk dosen pembimbing ID: {dosenIdQuery}</div>
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  onClick={() => router.push(`/kerja-praktek/plotting-jadwal?pembimbing_id=${dosenIdQuery}`)}
                  className="flex items-center gap-2"
                >
                  Plot Mahasiswa
                </Button>
                <Button variant="outline" onClick={() => router.push('/kerja-praktek/data-mahasiswa')}>Reset Filter</Button>
              </div>
            </div>
          )}

          <DataTable
            columns={Columns(
              currentPage,
              perPage,
              sortConfig,
              handleTableSort
            )}
            data={filteredMahasiswa}
            loading={false}
            pagination={{
              currentPage: page,
              lastPage: totalPages,
              limit,
              total: totalData,
            }}
          />
        </>
      )}

    </div>
  );
}