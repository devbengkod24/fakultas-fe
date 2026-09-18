"use client";

import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";
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

const fetcher = (page: number, limit: number, search: string) =>
  KelompokMatkulFakultasService.getAll({
    page,
    limit,
    search: search || undefined,
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [maxItems, setMaxItems] = useState("");

  const mutateKey = ["kelompok-matkul-list", page, limit, searchTerm];

  const { data: response, error, isLoading } = useSWR(
    mutateKey,
    () => fetcher(page, limit, searchTerm),
    { dedupingInterval: 1000 }
  );

  const rawData = response?.data ?? [];
  const data: KelompokMatkulRow[] = Array.isArray(rawData) ? rawData : [];
  const pagination = response?.meta?.pagination;
  const lastPage = pagination?.last_page ?? 1;
  const totalData = pagination?.total ?? 0;

  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      const res = await FakultasSyncService.syncKelompokMatkul({
        prodi: "A11",
        max_items: maxItems ? parseInt(maxItems) : undefined,
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
          <Input
            type="number"
            placeholder="Max data (kosong = semua)"
            className="h-10 w-full md:w-48"
            value={maxItems}
            onChange={(e) => setMaxItems(e.target.value)}
            min={1}
          />

          <Button onClick={handleSyncData} disabled={isSyncing} className="h-10">
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
            />
            {isSyncing ? "Menyinkronkan..." : "Sync Kelompok Matkul"}
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

export default SyncDataKelompokMatkulPage;
