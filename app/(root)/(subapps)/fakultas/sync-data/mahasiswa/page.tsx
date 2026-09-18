"use client";

import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { MahasiswaFakultasService, ProdiFakultasService } from "@/api/fakultas";
import type { Mahasiswa } from "@/api/fakultas/mahasiswa";
import type { Prodi } from "@/api/fakultas/prodi";
import { FakultasSyncService } from "@/api";
import { handleToastResponse } from "@/lib/toast-response";
import EmptyState from "@/components/empty-state";
import { AlertCircle } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

type MahasiswaRow = Mahasiswa;

const fetcher = (page: number, limit: number, search: string, prodi: string) =>
  MahasiswaFakultasService.getAll({
    page,
    limit,
    search: search || undefined,
    prodi: prodi !== "all" ? prodi : undefined,
  });

const columns: ColumnDef<MahasiswaRow>[] = [
  {
    id: "no",
    header: () => <div className="w-8 text-center">No</div>,
    cell: ({ row }) => <div className="w-8 text-center">{row.index + 1}</div>,
  },
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => {
      const nama = row.getValue("name") as string;
      const nim = row.original.nim;
      const initial = nama?.charAt(0)?.toUpperCase() || "?";

      return (
        <div className="flex items-center gap-3 py-1">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-muted font-medium text-muted-foreground">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{nama}</span>
            <span className="text-sm text-muted-foreground">{nim}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "prodi",
    header: "Prodi",
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("prodi") || "-"}</span>
    ),
  },
  {
    accessorKey: "angkatan",
    header: () => <div className="text-center">Angkatan</div>,
    cell: ({ row }) => {
      const angkatan = row.getValue("angkatan") as string | null;
      return (
        <div className="text-center">
          {!angkatan || angkatan === "0000" ? "-" : angkatan}
        </div>
      );
    },
  },
  {
    accessorKey: "semester_aktif",
    header: () => <div className="text-center">Semester Aktif</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("semester_aktif") ?? "-"}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string | null;
      const isAktif = status === "aktif";
      return (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={
              isAktif
                ? "border-green-200 bg-green-100 font-medium text-green-700 hover:bg-green-100/80"
                : "border-amber-200 bg-amber-100 font-medium text-amber-700 hover:bg-amber-100/80"
            }
          >
            {status ?? "-"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "ipk",
    header: () => <div className="text-center">IPK</div>,
    cell: ({ row }) => {
      const ipk = row.getValue("ipk");
      return <div className="text-center">{ipk ?? "-"}</div>;
    },
  },
  {
    accessorKey: "sks_lulus",
    header: () => <div className="text-center">SKS Lulus</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("sks_lulus") ?? "-"}</div>
    ),
  },
  {
    accessorKey: "sks_aktif",
    header: () => <div className="text-center">SKS Aktif</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("sks_aktif") ?? "-"}</div>
    ),
  },
  {
    accessorKey: "sks_gagal",
    header: () => <div className="text-center">SKS Gagal</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("sks_gagal") ?? "-"}</div>
    ),
  },
  {
    accessorKey: "minat",
    header: "Minat",
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("minat") || "-"}</span>
    ),
  },
  {
    accessorKey: "cuti",
    header: "Cuti",
    cell: ({ row }) => {
      const cuti = row.getValue("cuti") as string | null;
      return <span className="text-sm">{cuti === "yes" ? "Ya" : "Tidak"}</span>;
    },
  },
];

const SyncDataMahasiswaPage = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [isSyncing, setIsSyncing] = useState(false);

  const mutateKey = ["mahasiswa-list", page, limit, searchTerm, selectedProdi];

  const {
    data: response,
    error,
    isLoading,
  } = useSWR(mutateKey, () => fetcher(page, limit, searchTerm, selectedProdi), {
    dedupingInterval: 1000,
  });

  const { data: prodiResponse } = useSWR("prodi-list-fakultas", () =>
    ProdiFakultasService.getAll(1000)
  );
  const prodiList: Prodi[] =
    prodiResponse?.data?.data ?? prodiResponse?.data ?? [];

  const rawData = response?.data ?? [];
  const data: MahasiswaRow[] = Array.isArray(rawData) ? rawData : [];
  const pagination = response?.meta?.pagination;
  const lastPage = pagination?.last_page ?? 1;
  const totalData = pagination?.total ?? 0;

  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      const res = await FakultasSyncService.syncMahasiswa();
      handleToastResponse(res);
    } catch {
      toast.error("Gagal melakukan sinkronisasi data mahasiswa");
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
            { name: "Mahasiswa", url: "/fakultas/sync-data/mahasiswa" },
          ]}
          titleItems={[
            {
              title: "Sinkronisasi Data Mahasiswa",
              subtitle:
                "Sinkronkan data mahasiswa fakultas dengan sistem pusat.",
            },
          ]}
        />
        <EmptyState
          icon={AlertCircle}
          title="Gagal memuat data"
          subtitle="Terjadi kesalahan saat mengambil data mahasiswa."
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
          { name: "Mahasiswa", url: "/fakultas/sync-data/mahasiswa" },
        ]}
        titleItems={[
          {
            title: "Sinkronisasi Data Mahasiswa",
            subtitle: "Sinkronkan data mahasiswa fakultas dengan sistem pusat.",
          },
        ]}
      />

      <div className="mt-4 flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari nama atau NIM..."
              className="h-10 pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={selectedProdi} onValueChange={setSelectedProdi}>
            <SelectTrigger className="h-10 w-full md:w-48">
              <SelectValue placeholder="Semua Prodi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Prodi</SelectItem>
              {prodiList.map((prodi) => (
                <SelectItem key={prodi.id} value={prodi.kode_prodi}>
                  {prodi.nama}
                </SelectItem>
              ))}
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

export default SyncDataMahasiswaPage;
