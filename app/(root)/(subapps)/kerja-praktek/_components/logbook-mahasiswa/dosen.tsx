"use client";

import SearchControl from "@/components/search-control";
import LogbookTableMahasiswa from "./table-mahasiswa";
import { LogbookService } from "@/api/kerja-praktek";
import { useSearchParams } from "next/navigation"
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import PaginationControls from "@/components/pagination-control";

const fetcher = (page: number, limit: number, search: string, periode_id?: number) =>
  LogbookService.getAllLogbookDosen(page, limit, search, periode_id).then((res) => res);

const LogbookMahasiswaDosen = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") ?? "";

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const periode_id = Number(searchParams.get("periode_id")) || undefined;

  const { data, error, isLoading, mutate } = useSWR(
    ["logbook", page, limit, searchTerm, periode_id],
    () => fetcher(page, limit, searchTerm, periode_id),
  );

  const daftarLogbook = data?.data ?? [];
  const totalPages = data?.meta?.pagination.last_page ?? 1;
  const totalData = data?.meta?.pagination.total ?? 0;
  const currentPage = data?.meta?.pagination.current_page ?? 1;

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-3 md:items-end">
        <div className="flex-grow">
          <SearchControl placeholder="Cari logbook mahasiswa" className="w-1/4" />
        </div>
      </div>

      {error ? (
        <div className="text-center text-red-500">
          Error: Gagal mengambil data logbook
          <Button
            size="sm"
            onClick={() => mutate()}
            className="mt-2"
            variant="outline"
          >
            Coba Lagi
          </Button>
        </div>
      ) : (
        <div>
          <LogbookTableMahasiswa
            logbooks={daftarLogbook}
            isLoading={isLoading}
          />
          {!isLoading && daftarLogbook.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              lastPage={totalPages}
              total={totalData}
            />
          )}
        </div>
      )}
    </div>
  )
};

export default LogbookMahasiswaDosen;
