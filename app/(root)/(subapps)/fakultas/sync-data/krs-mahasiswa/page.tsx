"use client";

import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { KrsFakultasService } from "@/api/fakultas";
import { FakultasSyncService } from "@/api";
import { handleToastResponse } from "@/lib/toast-response";
import EmptyState from "@/components/empty-state";
import { AlertCircle } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

type KrsRow = {
  id: number;
  mahasiswa: { nama: string; nim: string };
  mata_kuliah: { nama: string; kode?: string };
  kelompok: { kode: string };
  semester_ambil: string;
  status: string;
  absen: number;
  nilai_akhir_angka: number;
  nilai_akhir_huruf: string;
  nilai_uts?: number;
  nilai_uas?: number;
};

const fetcher = (page: number, limit: number, search: string, prodi: string) =>
  KrsFakultasService.getAll({
    page,
    limit,
    search: search || undefined,
    prodi: prodi !== "all" ? prodi : undefined,
  });

const columns: ColumnDef<KrsRow>[] = [
  {
    id: "no",
    header: () => <div className="text-center w-8">No</div>,
    cell: ({ row }) => <div className="text-center w-8">{row.index + 1}</div>,
  },
  {
    accessorKey: "mahasiswa",
    header: "Mahasiswa",
    cell: ({ row }) => {
      const mhs = row.original.mahasiswa || { nama: "?", nim: "?" };
      const initial = mhs.nama?.charAt(0)?.toUpperCase() || "?";

      return (
        <div className="flex items-center gap-3 py-1">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-muted text-muted-foreground font-medium">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{mhs.nama}</span>
            <span className="text-sm text-muted-foreground">{mhs.nim}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "mata_kuliah",
    header: "Mata Kuliah",
    cell: ({ row }) => {
      const mk = row.original.mata_kuliah || { nama: "-", kode: "-" };
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{mk.nama}</span>
          <span className="text-sm text-muted-foreground">{mk.kode || "-"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "kelompok",
    header: "Kelas & SMT",
    cell: ({ row }) => {
      const klp = row.original.kelompok?.kode || "-";
      const smt = row.original.semester_ambil || "-";
      return (
        <div className="flex flex-col">
          <span className="font-bold text-sm">{klp}</span>
          <span className="text-sm text-muted-foreground">Smt {smt}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status & Absen",
    cell: ({ row }) => {
      const status = row.original.status || "-";
      const absen = row.original.absen || 0;
      return (
        <div className="flex flex-col gap-1 items-start">
          <Badge variant={status === "Ulang" ? "destructive" : "default"}>
            {status}
          </Badge>
          <span className="text-sm text-muted-foreground">{absen}x Hadir</span>
        </div>
      );
    },
  },
  {
    accessorKey: "rincian_nilai",
    header: "Rincian Nilai",
    cell: ({ row }) => {
      const uts = row.original.nilai_uts ?? "-";
      const uas = row.original.nilai_uas ?? "-";
      return (
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">UTS: {uts}</span>
          <span className="text-xs text-muted-foreground">UAS: {uas}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "nilai_akhir_angka",
    header: "Nilai Akhir",
    cell: ({ row }) => {
      const angka = row.original.nilai_akhir_angka ?? 0;
      const huruf = row.original.nilai_akhir_huruf ?? "-";
      return (
        <span className="font-semibold">
          {angka} ({huruf})
        </span>
      );
    },
  },
];

const SyncDataKrsMahasiswaPage = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [syncPhase, setSyncPhase] = useState<"idle" | "kelompok" | "krs">("idle");
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncProdi, setSyncProdi] = useState("A11");
  const [syncMaxItems, setSyncMaxItems] = useState("");

  const mutateKey = ["krs-list", page, limit, searchTerm, selectedProdi];

  const { data: response, error, isLoading } = useSWR(
    mutateKey,
    () => fetcher(page, limit, searchTerm, selectedProdi),
    { dedupingInterval: 1000 }
  );

  const rawData = response?.data ?? [];
  const data: KrsRow[] = Array.isArray(rawData) ? rawData : [];
  const pagination = response?.meta?.pagination;
  const lastPage = pagination?.last_page ?? 1;
  const totalData = pagination?.total ?? 0;

  const handleSyncData = async () => {
    setSyncDialogOpen(false);
    try {
      const max_items = syncMaxItems ? parseInt(syncMaxItems) : undefined;

      setSyncPhase("kelompok");
      await FakultasSyncService.syncKelompokMatkul({ prodi: syncProdi, max_items });

      setSyncPhase("krs");
      const res = await FakultasSyncService.syncKrsKhs({ prodi: syncProdi, max_items });

      handleToastResponse(res);
    } catch (err: any) {
      toast.error(err?.message || "Gagal melakukan sinkronisasi data KRS");
    } finally {
      setSyncPhase("idle");
    }
  };

  if (error) {
    return (
      <div>
        <DashboardHeader
          breadcrumbItems={[
            { name: "Dashboard", url: "/fakultas" },
            { name: "Sync Data", url: "/fakultas/sync-data" },
            { name: "KRS Mahasiswa", url: "/fakultas/sync-data/krs-mahasiswa" },
          ]}
          titleItems={[
            {
              title: "Sinkronisasi Data KRS Mahasiswa",
              subtitle: "Sinkronkan data KRS mahasiswa fakultas dengan sistem pusat.",
            },
          ]}
        />
        <EmptyState
          icon={AlertCircle}
          title="Gagal memuat data"
          subtitle="Terjadi kesalahan saat mengambil data KRS."
          className="h-[400px]"
        />
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          { name: "Sync Data", url: "/fakultas/sync-data" },
          { name: "KRS Mahasiswa", url: "/fakultas/sync-data/krs-mahasiswa" },
        ]}
        titleItems={[
          {
            title: "Sinkronisasi Data KRS Mahasiswa",
            subtitle: "Sinkronkan data KRS mahasiswa fakultas dengan sistem pusat.",
          },
        ]}
      />

      <div className="mt-4 flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="relative w-full md:w-1/4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari nama atau NIM..."
            className="pl-9 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
          <div className="w-full md:w-48">
            <Select value={selectedProdi} onValueChange={setSelectedProdi}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Pilih Prodi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Prodi</SelectItem>
                <SelectItem value="A11">S1 Teknik Informatika</SelectItem>
                <SelectItem value="A12">S1 Sistem Informasi</SelectItem>
                <SelectItem value="A14">S1 Teknologi Informasi</SelectItem>
                <SelectItem value="A15">D3 Teknik Komputer</SelectItem>
                <SelectItem value="A16">D3 Manajemen Informatika</SelectItem>
                <SelectItem value="A17">D3 Komputerisasi Akuntansi</SelectItem>
                <SelectItem value="A22">S1 Informatika (Kediri)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={syncPhase !== "idle"} className="h-10 min-w-[200px]">
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${syncPhase !== "idle" ? "animate-spin" : ""}`}
                />
                {syncPhase === "idle"
                  ? "Sync Data"
                  : syncPhase === "kelompok"
                  ? "Syncing Kelompok Matkul..."
                  : "Syncing KRS/KHS..."}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sinkronisasi KRS/KHS</DialogTitle>
                <DialogDescription>
                  Pilih program studi dan jumlah data yang ingin disinkronkan. Proses akan menjalankan sync Kelompok Matkul terlebih dahulu, lalu sync KRS/KHS.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Program Studi</Label>
                  <Select value={syncProdi} onValueChange={setSyncProdi}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Prodi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A11">S1 Teknik Informatika</SelectItem>
                      <SelectItem value="A12">S1 Sistem Informasi</SelectItem>
                      <SelectItem value="A14">S1 Teknologi Informasi</SelectItem>
                      <SelectItem value="A15">D3 Teknik Komputer</SelectItem>
                      <SelectItem value="A16">D3 Manajemen Informatika</SelectItem>
                      <SelectItem value="A17">D3 Komputerisasi Akuntansi</SelectItem>
                      <SelectItem value="A22">S1 Informatika (Kediri)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Jumlah Data Maksimal</Label>
                  <Input
                    type="number"
                    placeholder="Kosong = ambil semua data"
                    value={syncMaxItems}
                    onChange={(e) => setSyncMaxItems(e.target.value)}
                    min={1}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSyncDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleSyncData}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Mulai Sync
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-3">
        <DataTable
          columns={columns}
          data={data}
          loading={isLoading}
          pagination={{
            currentPage: page,
            lastPage: lastPage,
            limit: limit,
            total: totalData,
          }}
        />
      </div>
    </div>
  );
};

export default SyncDataKrsMahasiswaPage;
