"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { EWSCapaianMahasiswaService } from "@/api/ews";
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
import {
  ArrowLeft,
  BookOpen,
  Users,
  AlertTriangle,
  Download,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MatakuliahGagal } from "@/types/ews/capaian-mahasiswa/capaian-mahasiswa";

// Struktur asli response backend:
// {
//   total_prodi: number,
//   data_per_prodi: [
//     {
//       prodi: {...},
//       tahun_angkatan?: number,   // hanya ada kalau filter tahun_masuk dikirim
//       matakuliah: MatakuliahGagal[]   // SELALU flat array, tidak pernah nested per-tahun
//     }
//   ]
// }
interface DataPerProdiEntry {
  prodi: unknown;
  tahun_angkatan?: number;
  matakuliah: MatakuliahGagal[];
}

const ITEMS_PER_PAGE = 10;

export default function AdminListMatakuliahClient() {
  const searchParams = useSearchParams();
  const tahunMasuk = searchParams.get("tahun_masuk");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: response, error, isLoading } = useSWR(
    ["admin-list-matakuliah-gagal", tahunMasuk],
    () =>
      EWSCapaianMahasiswaService.getAdminListMatakuliahGagal(
        tahunMasuk ? { tahun_masuk: tahunMasuk } : {}
      ),
    { revalidateOnFocus: false }
  );

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportError(null);

      const blob = await EWSCapaianMahasiswaService.exportAdminListMatakuliah(
        tahunMasuk ? { tahun_masuk: tahunMasuk } : {}
      );

      if (!blob || blob.size === 0) {
        throw new Error("File kosong, tidak ada data untuk diexport.");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ews-list-matakuliah-admin-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan saat export.";
      setExportError(message);
    } finally {
      setIsExporting(false);
    }
  };

  // FIX: baca dari data_per_prodi, bukan data
  const dataPerProdi: DataPerProdiEntry[] = response?.data?.data_per_prodi || [];
  const displayTahunAngkatan = tahunMasuk ? parseInt(tahunMasuk) : null;

  // FIX: matakuliah SELALU flat array di dalam tiap entry data_per_prodi.
  // tahun_angkatan (kalau ada) cuma field tambahan di level entry, bukan
  // penanda struktur berbeda. Flatten semua entry (untuk admin biasanya
  // cuma 1 entry karena admin hanya punya 1 prodi).
  const matakuliahList: (MatakuliahGagal & { tahun_angkatan?: number })[] =
    useMemo(() => {
      return dataPerProdi.flatMap((entry) =>
        (entry.matakuliah || []).map((mk) => ({
          ...mk,
          tahun_angkatan: entry.tahun_angkatan,
        }))
      );
    }, [dataPerProdi]);

  const totalGagal = useMemo(
    () => matakuliahList.reduce((sum, mk) => sum + mk.jumlah_mahasiswa_gagal, 0),
    [matakuliahList]
  );

  // Pagination
  const totalPages = Math.ceil(matakuliahList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedList = matakuliahList.slice(startIndex, endIndex);

  const pageTitle = displayTahunAngkatan
    ? `MK Gagal Angkatan ${displayTahunAngkatan}`
    : "Daftar Mata Kuliah Gagal";

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

  // ── Error state ──
  if (error) {
    return (
      <div className="text-center py-12 text-red-500 bg-red-50 rounded-2xl border border-red-100">
        Gagal memuat data. Silakan coba lagi.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between gap-4 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/ews/capaian-mahasiswa"
            aria-label="Kembali ke Capaian Mahasiswa"
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-[#2D3E50] leading-tight truncate">
              {pageTitle}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Mata kuliah dengan mahasiswa tidak lulus
            </p>
          </div>
        </div>

      </div>

      {/* ── Pesan error export ── */}
      {exportError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          ⚠️ {exportError}
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div
          className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
          style={{ borderLeftWidth: "4px", borderLeftColor: "#3B82F6" }}
        >
          <div className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium">Total MK</p>
              <p className="text-2xl font-bold text-[#2D3E50]">
                {matakuliahList.length}
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
          style={{ borderLeftWidth: "4px", borderLeftColor: "#EF4444" }}
        >
          <div className="p-4 flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
              <Users className="w-5 h-5 text-red-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium">
                Total Mahasiswa Gagal
              </p>
              <p className="text-2xl font-bold text-red-500">{totalGagal}</p>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
          style={{ borderLeftWidth: "4px", borderLeftColor: "#F59E0B" }}
        >
          <div className="p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium">
                MK Paling Bermasalah
              </p>
              <p
                className="text-base font-bold text-amber-600 truncate"
                title={matakuliahList[0]?.nama_matakuliah}
              >
                {matakuliahList[0]?.nama_matakuliah || "—"}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ── Tabel ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#2D3E50]">
              {displayTahunAngkatan
                ? `Daftar MK Gagal Angkatan ${displayTahunAngkatan}`
                : "Daftar Mata Kuliah Gagal"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Daftar mata kuliah dengan mahasiswa tidak lulus
            </p>
          </div>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export XLSX
          </Button>
        </div>

        <Table>
          <TableHeader className="bg-gray-50/70">
            <TableRow>
              <TableHead className="w-10">No</TableHead>
              <TableHead className="w-32">Kode MK</TableHead>
              <TableHead>Nama Mata Kuliah</TableHead>
              <TableHead className="text-center w-16">SKS</TableHead>
              <TableHead className="text-center w-36">Jml Mhs Gagal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedList.length > 0 ? (
              paginatedList.map((mk, index) => (
                <TableRow
                  key={mk.matakuliah_id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <TableCell className="text-gray-400 text-sm">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="font-mono text-sm font-medium text-gray-600">
                    {mk.kode_matakuliah}
                  </TableCell>
                  <TableCell className="font-medium text-[#2D3E50]">
                    <div className="max-w-md truncate" title={mk.nama_matakuliah}>
                      {mk.nama_matakuliah}
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-sm text-gray-600">
                    {mk.sks}
                  </TableCell>
                  <TableCell className="text-center">
                    <Link
                      href={`/ews/capaian-mahasiswa/mahasiswa-gagal?matakuliah_id=${mk.matakuliah_id}&tahun_masuk=${tahunMasuk || ""}&matakuliah_nama=${encodeURIComponent(mk.nama_matakuliah)}&matakuliah_kode=${encodeURIComponent(mk.kode_matakuliah)}`}
                      className="inline-block"
                    >
                      <Badge
                        variant="destructiveOutline"
                        className="cursor-pointer"
                      >
                        {mk.jumlah_mahasiswa_gagal}
                      </Badge>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                  Tidak ada data tersedia.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

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
      </div>

    </div>
  );
}