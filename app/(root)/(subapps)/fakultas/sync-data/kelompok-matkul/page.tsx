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
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { FakultasSyncService } from "@/api";
import { KelompokMatkulFakultasService } from "@/api/fakultas";
import { handleToastResponse } from "@/lib/toast-response";
import EmptyState from "@/components/empty-state";
import { AlertCircle } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

type KelompokMatkulRow = {
  id: number;
  kode: string;
  mata_kuliah: { kode: string; nama: string };
  dosen_pengampu: { nama: string };
  created_at: string;
};

const fetcher = (page: number, limit: number, search: string, prodi: string) =>
  KelompokMatkulFakultasService.getAll({
    page,
    limit,
    search: search || undefined,
    prodi: prodi !== "all" ? prodi : undefined,
  });

const columns: ColumnDef<KelompokMatkulRow>[] = [
  {
    id: "no",
    header: () => <div className="text-center w-8">No</div>,
    cell: ({ row }) => <div className="text-center w-8">{row.index + 1}</div>,
  },
  {
    accessorKey: "kode",
    header: "Kelas",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-bold">
        {row.getValue("kode")}
      </Badge>
    ),
  },
  {
    accessorKey: "mata_kuliah",
    header: "Mata Kuliah",
    cell: ({ row }) => {
      const mk = row.original.mata_kuliah || { kode: "-", nama: "-" };
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{mk.nama}</span>
          <span className="text-sm text-muted-foreground">{mk.kode}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "dosen_pengampu",
    header: "Dosen Pengampu",
    cell: ({ row }) => {
      const dosen = row.original.dosen_pengampu?.nama;
      if (!dosen) {
        return (
          <Badge variant="secondary" className="text-gray-500">
            Belum Diset
          </Badge>
        );
      }
      return <span className="text-sm">{dosen}</span>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Tanggal Dibuat",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;
      if (!date) return <span className="text-sm">-</span>;
      return (
        <span className="text-sm">
          {new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      );
    },
  },
];

const SyncDataKelompokMatkulPage = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncProdi, setSyncProdi] = useState("A11");
  const [syncMaxItems, setSyncMaxItems] = useState("");

  const mutateKey = ["kelompok-matkul-list", page, limit, searchTerm, selectedProdi];

  const { data: response, error, isLoading } = useSWR(
    mutateKey,
    () => fetcher(page, limit, searchTerm, selectedProdi),
    { dedupingInterval: 1000 }
  );

  const rawData = response?.data ?? [];
  const data: KelompokMatkulRow[] = Array.isArray(rawData) ? rawData : [];
  const pagination = response?.meta?.pagination;
  const lastPage = pagination?.last_page ?? 1;
  const totalData = pagination?.total ?? 0;

  const handleSyncData = async () => {
    setSyncDialogOpen(false);
    setIsSyncing(true);
    try {
      const res = await FakultasSyncService.syncKelompokMatkul({
        prodi: syncProdi,
        max_items: syncMaxItems ? parseInt(syncMaxItems) : undefined,
      });
      handleToastResponse(res);
    } catch (err: any) {
      toast.error(err?.message || "Gagal melakukan sinkronisasi data Kelompok Matkul");
    } finally {
      setIsSyncing(false);
    }
  };

  if (error) {
    return (
      <div>
        <DashboardHeader
          breadcrumbItems={[
            { name: "Dashboard", url: "/fakultas" },
            { name: "Sync Data", url: "/fakultas/sync-data" },
            { name: "Kelompok Matkul", url: "/fakultas/sync-data/kelompok-matkul" },
          ]}
          titleItems={[
            {
              title: "Sinkronisasi Data Kelompok Matkul",
              subtitle: "Sinkronkan data kelompok/kelas mata kuliah dari sistem pusat.",
            },
          ]}
        />
        <EmptyState
          icon={AlertCircle}
          title="Gagal memuat data"
          subtitle="Terjadi kesalahan saat mengambil data kelompok matkul."
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
          { name: "Kelompok Matkul", url: "/fakultas/sync-data/kelompok-matkul" },
        ]}
        titleItems={[
          {
            title: "Sinkronisasi Data Kelompok Matkul",
            subtitle: "Sinkronkan data kelompok/kelas mata kuliah dari sistem pusat.",
          },
        ]}
      />

      <div className="mt-4 flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="relative w-full md:w-1/4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari kode kelas..."
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
              <Button disabled={isSyncing} className="h-10">
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
                />
                {isSyncing ? "Menyinkronkan..." : "Sync Kelompok Matkul"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sinkronisasi Kelompok Matkul</DialogTitle>
                <DialogDescription>
                  Pilih program studi dan jumlah data yang ingin disinkronkan dari sistem pusat.
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

export default SyncDataKelompokMatkulPage;
