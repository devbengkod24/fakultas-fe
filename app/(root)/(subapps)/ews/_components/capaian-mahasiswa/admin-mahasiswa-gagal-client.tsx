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
import { ArrowLeft, Users, BookOpen, Download } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Mahasiswa {
  mahasiswa_id: number;
  nim: string;
  nama_mahasiswa: string;
  presensi: number;
}

interface DataPerAngkatan {
  tahun_angkatan: number;
  dosen_pengampu: string;
  kode_kelompok: string;
  jumlah_mahasiswa: number;
  mahasiswa: Mahasiswa[];
}

const ITEMS_PER_PAGE = 10;

export default function AdminMahasiswaGagalClient() {
  const searchParams = useSearchParams();
  const matakuliahId = searchParams.get("matakuliah_id");
  const tahunMasuk = searchParams.get("tahun_masuk");
  const matakuliahNama = searchParams.get("matakuliah_nama") || "";
  const matakuliahKode = searchParams.get("matakuliah_kode") || "";
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: response, error, isLoading } = useSWR(
    ["admin-mahasiswa-gagal", matakuliahId, tahunMasuk],
    () => EWSCapaianMahasiswaService.getAdminListMahasiswaGagal({
      matakuliah_id: matakuliahId || "",
      tahun_masuk: tahunMasuk || undefined,
    }),
    { revalidateOnFocus: false }
  );

  const handleExport = () => {
    setIsExporting(true);
    EWSCapaianMahasiswaService.exportAdminMahasiswaGagal({
      matakuliah_id: matakuliahId || "",
      tahun_masuk: tahunMasuk || undefined,
    })
      .then((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ews-mahasiswa-gagal-admin-${new Date().toISOString().split("T")[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error: any) => alert("Export gagal: " + error.message))
      .finally(() => setIsExporting(false));
  };

  const dataPerAngkatan: DataPerAngkatan[] = response?.data?.data || [];
  const totalMahasiswa = dataPerAngkatan.reduce((sum, d) => sum + d.jumlah_mahasiswa, 0);

  const allStudents = dataPerAngkatan.flatMap((data) =>
    data.mahasiswa.map((mhs) => ({
      ...mhs,
      tahun_angkatan: data.tahun_angkatan,
      dosen_pengampu: data.dosen_pengampu,
      kode_kelompok: data.kode_kelompok,
    }))
  );

  // Pagination
  const totalPages = Math.ceil(allStudents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedStudents = allStudents.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-500 bg-red-50 rounded-2xl border border-red-100">Gagal memuat data. Silakan coba lagi.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/ews/capaian-mahasiswa/list-matakuliah?tahun_masuk=${tahunMasuk || ""}`}
            aria-label="Kembali ke Daftar Mata Kuliah"
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-[#2D3E50] leading-tight truncate">
              {matakuliahNama || "Detail Mahasiswa Gagal"}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {matakuliahKode} {tahunMasuk ? `- Angkatan ${tahunMasuk}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden" style={{ borderLeftWidth: "4px", borderLeftColor: "#EF4444" }}>
          <div className="p-4 flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg flex-shrink-0"><Users className="w-5 h-5 text-red-500" /></div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Mhs Gagal</p>
              <p className="text-2xl font-bold text-red-500">{totalMahasiswa}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden" style={{ borderLeftWidth: "4px", borderLeftColor: "#3B82F6" }}>
          <div className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0"><BookOpen className="w-5 h-5 text-blue-600" /></div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Mata Kuliah</p>
              <p className="text-lg font-bold text-[#2D3E50] truncate" title={matakuliahNama}>{matakuliahNama}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden" style={{ borderLeftWidth: "4px", borderLeftColor: "#F59E0B" }}>
          <div className="p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg flex-shrink-0"><BookOpen className="w-5 h-5 text-amber-500" /></div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Kode MK</p>
              <p className="text-lg font-bold text-amber-600">{matakuliahKode}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#2D3E50]">Daftar Mahasiswa Gagal</p>
            <p className="text-xs text-gray-400 mt-0.5">Daftar mahasiswa yang tidak lulus pada mata kuliah ini.</p>
          </div>
          <Button onClick={handleExport} disabled={isExporting} size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export XLSX
          </Button>
        </div>

        <Table>
          <TableHeader className="bg-gray-50/70">
            <TableRow>
              <TableHead className="w-10">No</TableHead>
              <TableHead>NIM</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead className="text-center">Angkatan</TableHead>
              <TableHead>Dosen Pengampu</TableHead>
              <TableHead className="text-center">Kelas</TableHead>
              <TableHead className="text-center">Presensi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((mhs, index) => (
                <TableRow key={mhs.mahasiswa_id} className="hover:bg-gray-50/60 transition-colors">
                  <TableCell className="text-gray-400 text-sm">{startIndex + index + 1}</TableCell>
                  <TableCell className="font-mono text-sm font-medium text-gray-600">{mhs.nim}</TableCell>
                  <TableCell className="font-medium text-[#2D3E50]">{mhs.nama_mahasiswa}</TableCell>
                  <TableCell className="text-center text-sm text-gray-600">{mhs.tahun_angkatan}</TableCell>
                  <TableCell className="text-sm text-gray-600">{mhs.dosen_pengampu || "-"}</TableCell>
                  <TableCell className="text-center text-sm text-gray-600">{mhs.kode_kelompok || "-"}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={mhs.presensi >= 80 ? "success" : mhs.presensi >= 60 ? "yellow" : "destructiveOutline"}>
                      {mhs.presensi}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-400 text-sm">Tidak ada data tersedia.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {allStudents.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-3">
            <PaginationControls
              currentPage={currentPage}
              lastPage={totalPages}
              total={allStudents.length}
              defaultLimit={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
              onLimitChange={() => setCurrentPage(1)}
            />
          </div>
        )}
      </div>
    </div>
  );
}


