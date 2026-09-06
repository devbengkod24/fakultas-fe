"use client";

import { SubmissionList } from "./submission-list";
import SearchInput from "./search-input";
import { PengajuanService } from "@/api/kerja-praktek";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { SubmissionListSkeleton } from "./submission-list-skeleton";
import PaginationControls from "@/components/pagination-control";
import { useProfile } from "@/context/profileUseContext";

const fetcher = (page?: number, limit?: number, search?: string, prodi_id?: number) =>
  PengajuanService.getAllPengajuan(page, limit, search, prodi_id).then((res) => res);

export default function MahasiswaBimbinganKoordinator() {
  const searchParams = useSearchParams();
  const { activeProdiId } = useProfile();
  const searchTerm = searchParams.get("search") ?? ""

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const { data, error, isLoading, mutate } = useSWR(
    ["pengajuan", page, limit, searchTerm, activeProdiId ?? undefined],
    () => fetcher(page, limit, searchTerm, activeProdiId ?? undefined),
    { revalidateOnFocus: false }
  );

  const daftarPengajuan = data?.data ?? [];
  const lastPages = data?.meta?.pagination.last_page ?? 1;
  const totalData = data?.meta?.pagination.total ?? 0;

  const handleStatusChange = () => {
    mutate();
  };

  return (
    <div className="space-y-6">
      <SearchInput placeholder="Cari berdasarkan nama, NIM, atau judul..." />
      
      {isLoading ? (
        <SubmissionListSkeleton />
      ) : error ? (
        <div className="flex justify-center items-center p-8 text-destructive">
          <p>Terjadi kesalahan saat memuat data</p>
        </div>
      ) : (
        <SubmissionList 
          submissions={daftarPengajuan} 
          onStatusChange={handleStatusChange} 
        />
      )}

      {daftarPengajuan.length > 0 && (
        <PaginationControls
          currentPage={page}
          lastPage={lastPages}
          total={totalData}
        />
      )}
    </div>
  );
}