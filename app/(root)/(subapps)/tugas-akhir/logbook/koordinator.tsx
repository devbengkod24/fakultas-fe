"use client";

import Link from "next/link";
import {
  ExternalLink,
  FileText,
  AlertCircle,
  GraduationCap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import PaginationControls from "@/components/pagination-control";
import SearchControl from "@/components/search-control";
import EmptyState from "@/components/empty-state";
import RekapSkeleton from "../_components/logbook/rekap-skeleton";
import { LogbookService } from "@/api/tugas-akhir";

const fetcher = (page: number, limit: number, search: string) =>
  LogbookService.getAllRekap(page, limit, search).then((res) => res);

const siapSidangFetcher = () =>
  LogbookService.getSiapSidang().then((res) => res);

interface DosenLogbook {
  id: string;
  dosen_id: number;
  nama_dosen: string;
  npp: string;
  totalbab1: number;
  totalbab2: number;
  totalbab3: number;
  totalbab4: number;
  totalbab4_acc: number;
  totalbab5: number;
  totalbab5_acc: number;
  totalbab4_5_acc: number;
  total_sidang2: number;
  total_mahasiswa: number;
}

export default function KoordinatorLogbook() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const {
    data: response,
    error,
    isLoading,
  } = useSWR(
    ["sidang-ta1", page, limit, search],
    () => fetcher(page, limit, search),
    { dedupingInterval: 1000 },
  );

  const {
    data: siapSidangData,
    error: siapSidangError,
    isLoading: siapSidangLoading,
  } = useSWR("siap-sidang", siapSidangFetcher, { dedupingInterval: 1000 });

  const logbooks: DosenLogbook[] = response?.data || [];
  const lastPages = response?.meta?.pagination.last_page ?? 1;
  const totalData = response?.meta?.pagination.total ?? 0;

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Gagal memuat data"
        subtitle="Terjadi kesalahan saat mengambil data logbook. Silakan coba lagi."
        button={<Button onClick={() => router.refresh()}>Coba Lagi</Button>}
      />
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-4 md:flex-row items-center justify-between">
        <div className="w-full md:w-1/4">
          <SearchControl placeholder="Cari..." />
        </div>

        <div
          className={`rounded-xl p-2.5 bg-blue-500/10 flex items-center gap-4`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-blue-500/10 text-blue-500`}>
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className={`text-blue-500`}>
                {siapSidangLoading ? (
                  <span className="animate-pulse">--</span>
                ) : siapSidangError ? (
                  <span className="text-red-500 text-sm">Error</span>
                ) : (
                  siapSidangData?.data?.total || 0
                )}
              </CardTitle>
              <CardDescription className="text-xs">
                Total Mahasiswa Siap Sidang
              </CardDescription>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">No.</TableHead>
              {/* <TableHead className="text-center">NPP</TableHead> */}
              <TableHead className="text-center">Nama Dosen</TableHead>
              <TableHead className="text-center">Logbook Mhs.</TableHead>
              <TableHead className="text-center">Bab 1</TableHead>
              <TableHead className="text-center">Bab 2</TableHead>
              <TableHead className="text-center">Bab 3</TableHead>
              <TableHead className="text-center" colSpan={2}>
                <div className="text-center">Bab 4</div>
              </TableHead>
              <TableHead className="text-center" colSpan={2}>
                <div className="text-center">Bab 5</div>
              </TableHead>
              <TableHead className="text-center">
                Total ACC Bab 4 dan Bab 5
              </TableHead>
              <TableHead className="text-center">Sidang TA2</TableHead>
              <TableHead className="text-center">Total Mhs.</TableHead>
            </TableRow>

            <TableRow>
              <TableHead className=""></TableHead>
              <TableHead className=""></TableHead>
              <TableHead className=""></TableHead>
              <TableHead className=""></TableHead>
              <TableHead className=""></TableHead>
              <TableHead className=""></TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">ACC</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">ACC</TableHead>
              <TableHead className=""></TableHead>
              <TableHead className=""></TableHead>
              <TableHead className=""></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <RekapSkeleton />
            ) : logbooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="p-0">
                  <EmptyState
                    icon={FileText}
                    title="Tidak ada data logbook"
                    subtitle="Belum ada data logbook dosen yang dapat ditampilkan."
                  />
                </TableCell>
              </TableRow>
            ) : (
              logbooks.map((dosen, index) => (
                <TableRow
                  key={index}
                  className={index % 2 === 0 ? "bg-muted/50" : "bg-white"}
                >
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>
                    <p className="flex flex-col">
                      <span>{dosen.nama_dosen}</span>
                      <span className="text-sm text-muted-foreground">
                        {dosen.npp}
                      </span>
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`logbook/detail/${dosen.dosen_id}`}>
                      <Button size={"sm"} variant={"primaryOutline"}>
                        Detail Logbook
                        <ExternalLink className="size-4" />
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    {dosen.totalbab1}
                  </TableCell>
                  <TableCell className="text-center">
                    {dosen.totalbab2}
                  </TableCell>
                  <TableCell className="text-center">
                    {dosen.totalbab3}
                  </TableCell>
                  <TableCell className="text-center">
                    {dosen.totalbab4}
                  </TableCell>
                  <TableCell className="text-center">
                    {dosen.totalbab4_acc}
                  </TableCell>
                  <TableCell className="text-center">
                    {dosen.totalbab5}
                  </TableCell>
                  <TableCell className="text-center">
                    {dosen.totalbab5_acc}
                  </TableCell>
                  <TableCell className="text-center">
                    {dosen.totalbab4_5_acc}
                  </TableCell>
                  <TableCell className="text-center">
                    {dosen.total_sidang2}
                  </TableCell>
                  <TableCell className="text-center">
                    {dosen.total_mahasiswa}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {logbooks.length > 0 && !isLoading && (
        <PaginationControls
          currentPage={page}
          lastPage={lastPages}
          total={totalData}
        />
      )}
    </>
  );
}
