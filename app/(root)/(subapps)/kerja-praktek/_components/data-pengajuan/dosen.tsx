"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { DataTable } from "@/components/data-table"
import useSWR from "swr"
import { GelombangSelector } from "../gelombang-selector"
import SearchControl from "@/components/search-control"
import { MonitoringSidangService } from "@/api/kerja-praktek"
import { ColumnDef } from "@tanstack/react-table"
import EmptyState from "@/components/empty-state"
import { FileText, CalendarCheck, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface PengajuanSidangItem {
  sidang_id: number;
  pengajuan_sidang_id: number;
  pembimbing: {
    id: number;
    nama: string;
  } | null;
  mahasiswa: {
    id: number;
    nama: string;
    nim: string;
    judul?: string;
  };
  dokumen: {
    laporan_akhir: string | null;
    dokumen_penyelia: string | null;
  };
  nilai_penyelia?: number | null;
  gelombang?: {
    id: number;
    nama: string;
  };
  tanggal_pengajuan: string | null;
}

const fetcher = (gelombang_id?: number, search?: string, page?: number, limit?: number) =>
  MonitoringSidangService.getDataPengajuanDosen(gelombang_id, search, page, limit).then((res) => res);

export default function DataPengajuanDosen({ hideSearchBar = false }: { hideSearchBar?: boolean } = {}) {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const searchTerm = searchParams.get("search") ?? "";
  const gelombangId = Number(searchParams.get("gelombang_id"));

  const { data, isLoading } = useSWR(
    ["data-pengajuan-sidang-dosen", page, limit, searchTerm, gelombangId],
    () => fetcher(gelombangId, searchTerm, page, limit),
    { revalidateOnFocus: false }
  );

  const pengajuanData = data?.data ?? [];
  const totalPages = data?.meta?.pagination?.last_page ?? 1;
  const totalData = data?.meta?.pagination?.total ?? 0;
  const currentPage = data?.meta?.pagination?.current_page ?? 1;
  const perPage = data?.meta?.pagination?.per_page ?? limit;

  const [selectedDokumen, setSelectedDokumen] = useState<PengajuanSidangItem | null>(null);

  const columns: ColumnDef<PengajuanSidangItem>[] = [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div className="min-w-[50px]">{number}</div>;
      },
      size: 50,
    },
    {
      accessorKey: "mahasiswa.nama",
      header: "Mahasiswa",
      cell: ({ row }) => {
        const mahasiswa = row.original.mahasiswa;
        return (
          <div className="min-w-[200px] max-w-[280px]">
            <div className="font-medium truncate">{mahasiswa?.nama}</div>
            <div className="text-sm text-muted-foreground">{mahasiswa?.nim}</div>
          </div>
        );
      },
      size: 200,
    },
    {
      accessorKey: "pembimbing.nama",
      header: "Pembimbing",
      cell: ({ row }) => {
        const pembimbing = row.original.pembimbing;
        if (!pembimbing?.nama) return <span className="inline-block">-</span>;
        return <div className="truncate">{pembimbing.nama}</div>;
      },
      size: 180,
    },
    {
      accessorKey: "mahasiswa.judul",
      header: "Judul",
      cell: ({ row }) => {
        const judul = row.original.mahasiswa?.judul;
        if (!judul) return <span className="text-muted-foreground">-</span>;
        return <div className="whitespace-normal break-words">{judul}</div>;
      },
      size: 300,
    },
    {
      id: "dokumen",
      header: "Dokumen",
      cell: ({ row }) => {
        const dokumen = row.original.dokumen;
        const hasDokumen = dokumen?.laporan_akhir || dokumen?.dokumen_penyelia;
        if (!hasDokumen) return <span className="text-muted-foreground">-</span>;
        return (
          <Button variant="outline" size="sm" className="h-8" onClick={() => setSelectedDokumen(row.original)}>
            <FileText className="h-4 w-4 mr-1" />
            Lihat
          </Button>
        );
      },
      size: 100,
    },
    {
      accessorKey: "nilai_penyelia",
      header: "Nilai Penyelia",
      cell: ({ row }) => {
        const nilai = row.original.nilai_penyelia;
        if (nilai === null || nilai === undefined) return <span className="text-muted-foreground">-</span>;
        return <div>{nilai}</div>;
      },
      size: 100,
    },
    {
      accessorKey: "gelombang.nama",
      header: "Gelombang",
      cell: ({ row }) => {
        const gelombang = row.original.gelombang;
        if (!gelombang) return <span className="text-muted-foreground">-</span>;
        return <div>{gelombang.nama}</div>;
      },
      size: 100,
    },
    {
      accessorKey: "tanggal_pengajuan",
      header: "Tanggal Pengajuan",
      cell: ({ row }) => {
        const tanggal = row.original.tanggal_pengajuan;
        if (!tanggal) {
          return (
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarCheck className="h-4 w-4" />
              <span>Belum ada jadwal</span>
            </div>
          );
        }

        try {
          const date = new Date(tanggal);
          const formattedDate = date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });
          return <div className="whitespace-nowrap">{formattedDate}</div>;
        } catch {
          return <div>{tanggal}</div>;
        }
      },
      size: 140,
    },
  ];

  return (
    <div className="container mx-auto space-y-4 sm:space-y-6 px-3 sm:px-0">
      {!hideSearchBar && (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center justify-between mb-3">
          <SearchControl placeholder="Cari Mahasiswa..." className="w-1/4" />
          <div className="w-full sm:w-[200px] flex-shrink-0 sm:ml-auto">
            <GelombangSelector />
          </div>
        </div>
      )}

      {!isLoading && pengajuanData.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="Belum Ada Pengajuan Sidang"
          subtitle="Data pengajuan sidang akan muncul setelah mahasiswa mengajukan sidang."
        />
      ) : (
        <DataTable
          columns={columns}
          data={pengajuanData}
          loading={isLoading}
          pagination={{
            currentPage: page,
            lastPage: totalPages,
            limit,
            total: totalData,
          }}
        />
      )}

      {/* Dokumen Dialog */}
      <Dialog open={!!selectedDokumen} onOpenChange={(open) => !open && setSelectedDokumen(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dokumen Mahasiswa</DialogTitle>
          </DialogHeader>
          {selectedDokumen && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">
                {selectedDokumen.mahasiswa?.nama} — {selectedDokumen.mahasiswa?.nim}
              </p>
              <div className="flex flex-col gap-2">
                {selectedDokumen.dokumen?.laporan_akhir && (
                  <a
                    href={selectedDokumen.dokumen.laporan_akhir}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Laporan Akhir</span>
                    <ExternalLink className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
                  </a>
                )}
                {selectedDokumen.dokumen?.dokumen_penyelia && (
                  <a
                    href={selectedDokumen.dokumen.dokumen_penyelia}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Dokumen Penyelia</span>
                    <ExternalLink className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}