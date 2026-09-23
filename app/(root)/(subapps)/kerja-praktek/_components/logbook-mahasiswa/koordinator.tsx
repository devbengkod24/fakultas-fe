"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import SearchControl from "@/components/search-control";
import { LogbookService } from "@/api/kerja-praktek";
import { useSearchParams, useRouter } from "next/navigation"
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import PaginationControls from "@/components/pagination-control";
import { useProfile } from "@/context/profileUseContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import EmptyState from "@/components/empty-state";

const fetcher = (page: number, limit: number, search: string, periode_id?: number, prodi_id?: number) =>
  LogbookService.getDosenList(page, limit, search, periode_id, prodi_id).then((res) => res);

const LogbookMahasiswaKoordinator = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { activeProdiId } = useProfile();
  const searchTerm = searchParams.get("search") ?? "";

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const periode_id = Number(searchParams.get("periode_id")) || undefined;

  const { data, error, isLoading, mutate } = useSWR(
    ["logbook-dosen", page, limit, searchTerm, periode_id, activeProdiId],
    () => fetcher(page, limit, searchTerm, periode_id, activeProdiId ?? undefined),
  );

  const daftarDosen = data?.data ?? [];
  const pagination = data?.meta?.pagination ?? data ?? {};
  const totalPages = pagination?.last_page ?? 1;
  const totalData = pagination?.total ?? 0;
  const currentPage = pagination?.current_page ?? page;

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-3 md:items-end">
        <div className="flex-grow">
          <SearchControl placeholder="Cari dosen pembimbing" className="w-1/4" />
        </div>
      </div>

      {error ? (
        <div className="text-center text-red-500">
          Error: Gagal mengambil data dosbim
          <Button
            size="sm"
            onClick={() => mutate()}
            className="mt-2"
            variant="outline"
          >
            Coba Lagi
          </Button>
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">Memuat...</div>
      ) : daftarDosen.length === 0 ? (
        <EmptyState
          icon={ExternalLink}
          title="Tidak ada data dosbim"
          subtitle="Belum ada dosbim yang memiliki mahasiswa dengan logbook"
        />
      ) : (
        <div>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">No.</TableHead>
                  <TableHead className="text-start">Nama Dosen</TableHead>
                  <TableHead className="text-center">Logbook Mhs.</TableHead>
                  <TableHead className="text-center">Bab 1</TableHead>
                  <TableHead className="text-center">Bab 2</TableHead>
                  <TableHead className="text-center">Bab 3</TableHead>
                  <TableHead className="text-center">Bab 4</TableHead>
                  <TableHead className="text-center">Bab 5</TableHead>
                  <TableHead className="text-center">Pending</TableHead>
                  <TableHead className="text-center">Total Mhs.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {daftarDosen.map((dosen: any, index: number) => (
                  <TableRow key={dosen.dosen_id}>
                    <TableCell className="text-center">{(currentPage - 1) * limit + index + 1}</TableCell>
                    <TableCell>
                      <p className="flex flex-col">
                        <span className="font-medium">{dosen.nama_dosen}</span>
                        <span className="text-sm text-muted-foreground">
                          {dosen.npp}
                        </span>
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={`/kerja-praktek/logbook-mahasiswa/dosen/${dosen.dosen_id}`}>
                        <Button size="sm" variant="primaryOutline">
                          Detail Logbook
                          <ExternalLink className="size-4 ml-1" />
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      {dosen.total_bab1 || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      {dosen.total_bab2 || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      {dosen.total_bab3 || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      {dosen.total_bab4 || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      {dosen.total_bab5 || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      {Number(dosen.total_pending) > 0 ? (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                          Pending : {dosen.total_pending}
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-1 rounded">
                          Belum Ada
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {dosen.total_mahasiswa}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {daftarDosen.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              lastPage={totalPages}
              total={totalData}
              limit={limit}
            />
          )}
        </div>
      )}
    </div>
  )
};

export default LogbookMahasiswaKoordinator;
