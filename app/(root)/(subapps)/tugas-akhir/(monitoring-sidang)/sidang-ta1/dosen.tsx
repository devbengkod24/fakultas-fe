"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, AlertCircle, FileSearch, RefreshCcw } from "lucide-react";
import { CustomTabs } from "@/components/custom-tabs";
import { Button } from "@/components/ui/button";

import EmptyState from "@/components/empty-state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SubmissionList } from "../../_components/monitoring-sidang/submission-list";
import useSWR from "swr";
import { PlotJadwalDosenSection } from "../../_components/monitoring-sidang/plot-jadwal-dosen-section";
import { HasilSidangDosenSection } from "../../_components/monitoring-sidang/hasil-sidang-dosen-section";
import { MonitoringSidang1Service } from "@/api/tugas-akhir";
import SearchControl from "@/components/search-control";
import PaginationControls from "@/components/pagination-control";
import SubmissionSkeleton from "../../_components/monitoring-sidang/submission-skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Grid3X3, TableProperties } from "lucide-react";
import { useState } from "react";

const fetcher = (
  type: string,
  page: number,
  limit: number,
  search: string,
  status: string,
) =>
  MonitoringSidang1Service.getAllByDosen(
    type,
    page,
    limit,
    search,
    status,
  ).then((res) => res);

const subTabs = [
  { status: "pengajuan", label: "Pengajuan Form" },
  { status: "plot-jadwal", label: "Jadwal Sidang" },
  { status: "hasil-sidang", label: "Hasil Sidang" },
];

export default function SidangTa1Dosen() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sub = searchParams.get("sub") || "pengajuan";
  const type = searchParams.get("type") || "";
  const status = searchParams.get("status") || "";
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const {
    data: response,
    error,
    isLoading,
  } = useSWR(
    sub === "pengajuan"
      ? ["sidang-ta1-dosen", type, page, limit, search, status]
      : null,
    () => fetcher(type, page, limit, search, status),
    { dedupingInterval: 1000 },
  );

  const pathTabs = [
    { status: "", label: "Semua Jalur" },
    { status: "reguler", label: "Reguler" },
    { status: "publikasi", label: "Publikasi" },
  ];

  const statusFilters = [
    { status: "", label: "Semua Status" },
    { status: "pending", label: "Pending" },
    { status: "accepted", label: "Diterima" },
    { status: "revised", label: "Revisi" },
  ];

  const submissions = response?.data || [];
  const lastPages = response?.meta?.pagination.last_page ?? 1;
  const totalData = response?.meta?.pagination.total ?? 0;

  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const updateSearchParams = (newParams: { [key: string]: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`?${params.toString()}`);
  };

  const handleSubChange = (newSub: string) => {
    router.push(`?sub=${newSub}`);
  };

  const handleTabChange = (newTab: string) => {
    updateSearchParams({ type: newTab });
  };

  const handleStatusFilterChange = (newStatus: string) => {
    updateSearchParams({ status: newStatus });
  };

  return (
    <div className="space-y-6">
      <CustomTabs
        tabs={subTabs}
        activeTab={sub}
        onTabChange={handleSubChange}
      />

      {sub === "pengajuan" && (
        <>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <SearchControl placeholder="Cari berdasarkan nama, NIM, atau judul..." />
            </div>
            <div className="flex gap-2">
              <Select
                value={viewMode}
                onValueChange={(value: "card" | "table") => setViewMode(value)}
              >
                <SelectTrigger className="w-[120px] h-full">
                  <div className="flex items-center">
                    {viewMode === "card" ? (
                      <Grid3X3 className="size-4 mr-2" />
                    ) : (
                      <TableProperties className="size-4 mr-2" />
                    )}
                    <span>{viewMode === "card" ? "Kartu" : "Tabel"}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">
                    <div className="flex items-center">
                      <Grid3X3 className="size-4 mr-2" />
                      Tampilan Kartu
                    </div>
                  </SelectItem>
                  <SelectItem value="table">
                    <div className="flex items-center">
                      <TableProperties className="size-4 mr-2" />
                      Tampilan Tabel
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    {type === ""
                      ? "Semua Jalur"
                      : pathTabs.find((f) => f.status === type)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {pathTabs.map((filter) => (
                    <DropdownMenuItem
                      key={filter.status}
                      onClick={() => handleTabChange(filter.status)}
                      className={type === filter.status ? "bg-muted" : ""}
                    >
                      {filter.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    {status === ""
                      ? "Status Pengajuan"
                      : statusFilters.find((f) => f.status === status)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {statusFilters.map((filter) => (
                    <DropdownMenuItem
                      key={filter.status}
                      onClick={() => handleStatusFilterChange(filter.status)}
                      className={status === filter.status ? "bg-muted" : ""}
                    >
                      {filter.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {isLoading ? (
            <SubmissionSkeleton />
          ) : error ? (
            <EmptyState
              icon={AlertCircle}
              title="Gagal memuat data"
              subtitle="Terjadi kesalahan saat mengambil data sidang TA1."
              button={
                <Button onClick={() => router.refresh()} variant="outline">
                  <RefreshCcw className="size-4 mr-2" />
                  Coba Lagi
                </Button>
              }
            />
          ) : !submissions || submissions.length === 0 ? (
            <EmptyState
              icon={FileSearch}
              title="Tidak ada pengajuan sidang"
              subtitle="Anda belum memiliki mahasiswa yang mengajukan sidang TA1."
            />
          ) : (
            <SubmissionList
              submissions={submissions}
              isKoor={false}
              role="dosen"
              isLoading={isLoading}
              page={page}
              limit={limit}
              type={type}
              viewMode={viewMode}
            />
          )}

          <PaginationControls
            currentPage={page}
            lastPage={lastPages}
            total={totalData}
          />
        </>
      )}

      {sub === "plot-jadwal" && <PlotJadwalDosenSection tipe="ta1" />}

      {sub === "hasil-sidang" && <HasilSidangDosenSection tipe="ta1" />}
    </div>
  );
}
