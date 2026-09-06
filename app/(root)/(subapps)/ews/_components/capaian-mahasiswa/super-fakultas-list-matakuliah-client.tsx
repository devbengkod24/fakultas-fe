/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import useSWR from "swr";
import { EWSCapaianMahasiswaService } from "@/api/ews";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PaginationControls from "@/components/pagination-control";
import { BookOpen, Users, AlertTriangle, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MatakuliahGagal } from "@/types/ews/capaian-mahasiswa/capaian-mahasiswa";

interface ProdiData {
  prodi: {
    id: number;
    kode_prodi: string;
    nama_prodi: string;
  };
  matakuliah: MatakuliahGagal[];
}

const ITEMS_PER_PAGE = 10;

export default function SuperFakultasListMatakuliahClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prodiId = searchParams.get("prodi_id");
  const prodiNama = searchParams.get("prodi_nama") || "";
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: response, error, isLoading } = useSWR(
    ["super-fakultas-list-matakuliah-gagal", prodiId],
    () => EWSCapaianMahasiswaService.getSuperFakultasListMatakuliahGagal({ prodi_id: prodiId || "" }),
    { revalidateOnFocus: false }
  );

  const handleExport = () => {
    setIsExporting(true);
    EWSCapaianMahasiswaService.exportSuperFakultasListMatakuliah({ prodi_id: prodiId || undefined })
      .then((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ews-list-matakuliah-super-fakultas-${new Date().toISOString().split("T")[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error: any) => alert("Export gagal: " + error.message))
      .finally(() => setIsExporting(false));
  };

  const allData: ProdiData[] = response?.data?.data_per_prodi || [];
  const selectedProdiData = prodiId
    ? allData.find((p: ProdiData) => p.prodi.id.toString() === prodiId)
    : null;

  const matakuliahList = selectedProdiData?.matakuliah || [];
  const totalGagal = matakuliahList.reduce((sum, mk) => sum + mk.jumlah_mahasiswa_gagal, 0);

  // Pagination
  const totalPages = Math.ceil(matakuliahList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedList = matakuliahList.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-20 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-500 bg-red-50 rounded-2xl">Gagal memuat data. Silakan coba lagi.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-4 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg border hover:bg-gray-50 transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div>
          <p className="text-lg font-medium-bold text-gray-800">
            {prodiNama || selectedProdiData?.prodi.nama_prodi || "-"}
          </p>
          <p className="text-xs text-gray-500">Program Studi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 shadow-sm rounded-xl" style={{ borderLeft: "4px solid #3B82F6" }}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg"><BookOpen className="w-5 h-5 text-blue-500" /></div>
            <div>
              <p className="text-xs text-gray-500">Total MK</p>
              <p className="text-2xl font-bold text-gray-800">{matakuliahList.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-sm rounded-xl" style={{ borderLeft: "4px solid #EF4444" }}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg"><Users className="w-5 h-5 text-red-500" /></div>
            <div>
              <p className="text-xs text-gray-500">Total Mahasiswa Gagal</p>
              <p className="text-2xl font-bold text-gray-800">{totalGagal}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-sm rounded-xl" style={{ borderLeft: "4px solid #F59E0B" }}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg"><AlertTriangle className="w-5 h-5 text-amber-500" /></div>
            <div>
              <p className="text-xs text-gray-500">MK Paling Bermasalah</p>
              <p
                className="text-lg font-bold text-gray-800 truncate max-w-[150px]"
                title={matakuliahList[0]?.nama_matakuliah}
              >
                {matakuliahList[0]?.nama_matakuliah || "-"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="shadow-none border-none p-0">
        <CardHeader className="pt-6 flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle>Daftar Mata Kuliah Gagal</CardTitle>
            <CardDescription className="text-sm">
              Daftar mata kuliah dengan mahasiswa tidak lulus untuk program studi ini.
            </CardDescription>
          </div>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
          >
            <Download className="w-4 h-4" /> Export XLSX
          </Button>
        </CardHeader>
        <CardContent className="px-0">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-16">No</TableHead>
                  <TableHead>Kode MK</TableHead>
                  <TableHead>Nama Mata Kuliah</TableHead>
                  <TableHead className="text-center">SKS</TableHead>
                  <TableHead className="text-center">Jml Mhs Gagal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100">
                {paginatedList.map((mk, index) => (
                  <TableRow key={mk.matakuliah_id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                    <TableCell className="font-mono font-semibold text-gray-700">{mk.kode_matakuliah}</TableCell>
                    <TableCell>
                      <div className="max-w-md truncate font-semibold" title={mk.nama_matakuliah}>{mk.nama_matakuliah}</div>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-gray-600">{mk.sks}</TableCell>
                    <TableCell className="text-center">
                      <Link href={`/ews/capaian-mahasiswa/mahasiswa-gagal?matakuliah_id=${mk.matakuliah_id}&prodi_id=${prodiId}&prodi_nama=${encodeURIComponent(prodiNama)}&matakuliah_nama=${encodeURIComponent(mk.nama_matakuliah)}&matakuliah_kode=${encodeURIComponent(mk.kode_matakuliah)}`} className="inline-block">
                        <Badge variant="secondary" className="cursor-pointer">
                          {mk.jumlah_mahasiswa_gagal}
                        </Badge>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {matakuliahList.length === 0 && <div className="text-center py-12 text-gray-500 italic">Tidak ada data tersedia.</div>}

          {matakuliahList.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-3">
              <PaginationControls
                currentPage={currentPage}
                lastPage={totalPages}
                total={matakuliahList.length}
                defaultLimit={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
                onLimitChange={() => setCurrentPage(1)}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}