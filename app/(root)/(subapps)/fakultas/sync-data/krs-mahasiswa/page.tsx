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
  nama_krs: string;
  nim: string;
  nama_mahasiswa: string;
  prodi_id: number;
  tahun_ajaran: string | null;
  created_at: string;
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
    accessorKey: "nama_mahasiswa",
    header: "Nama Mahasiswa",
    cell: ({ row }) => {
      const nama = row.getValue("nama_mahasiswa") as string;
      const nim = row.original.nim;
      const initial = nama?.charAt(0)?.toUpperCase() || "?";

      return (
        <div className="flex items-center gap-3 py-1">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-muted text-muted-foreground font-medium">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{nama}</span>
            <span className="text-sm text-muted-foreground">{nim}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "nim",
    header: "NIM",
  },
  {
    accessorKey: "nama_krs",
    header: "Jenis KRS",
    cell: ({ row }) => {
      const krs = row.getValue("nama_krs") as string;
      return (
        <Badge
          variant="outline"
          className={
            krs === "TA1"
              ? "bg-blue-100 text-blue-700 border-blue-200 font-medium"
              : krs === "TA2"
              ? "bg-purple-100 text-purple-700 border-purple-200 font-medium"
              : "bg-gray-100 text-gray-600 border-gray-200 font-medium"
          }
        >
          {krs}
        </Badge>
      );
    },
  },
  {
    accessorKey: "tahun_ajaran",
    header: "Tahun Ajaran",
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("tahun_ajaran") || "-"}</span>
    ),
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

const SyncDataKrsMahasiswaPage = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [isSyncing, setIsSyncing] = useState(false);

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
    setIsSyncing(true);
    try {
      const res = await FakultasSyncService.syncKrsKhs({
        prodi: selectedProdi !== "all" ? selectedProdi : "A11",
      });
      handleToastResponse(res);
    } catch {
      toast.error("Gagal melakukan sinkronisasi data KRS");
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

          <Button onClick={handleSyncData} disabled={isSyncing} className="h-10">
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
            />
            {isSyncing ? "Menyinkronkan..." : "Sync Data"}
          </Button>
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
