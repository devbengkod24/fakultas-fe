"use client";

import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { MahasiswaFakultasService } from "@/api/fakultas";
import { FakultasSyncService } from "@/api";
import { handleToastResponse } from "@/lib/toast-response";
import EmptyState from "@/components/empty-state";
import { AlertCircle } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

type MahasiswaRow = {
  mahasiswa_id: number;
  nim: string;
  name: string;
  email: string;
  ipk: number;
  dosen_name: string;
  krs_ta1: number;
  krs_ta2: number;
};

const fetcher = (page: number, limit: number, search: string) =>
  MahasiswaFakultasService.getAll({ page, limit, search: search || undefined });

const columns: ColumnDef<MahasiswaRow>[] = [
  {
    id: "no",
    header: () => <div className="text-center w-8">No</div>,
    cell: ({ row }) => <div className="text-center w-8">{row.index + 1}</div>,
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
    accessorKey: "ipk",
    header: () => <div className="text-center">IPK</div>,
    cell: ({ row }) => {
      const ipk = row.getValue("ipk");
      return <div className="text-center">{ipk ?? "-"}</div>;
    },
  },
  {
    accessorKey: "dosen_name",
    header: "Dosen Wali",
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("dosen_name") || "-"}</span>
    ),
  },
  {
    accessorKey: "krs_ta1",
    header: () => <div className="text-center">KRS TA1</div>,
    cell: ({ row }) => {
      const val = row.getValue("krs_ta1") as number;
      return (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={
              val
                ? "bg-green-100 text-green-700 border-green-200 font-medium"
                : "bg-gray-100 text-gray-500 border-gray-200"
            }
          >
            {val ? "Ya" : "Tidak"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "krs_ta2",
    header: () => <div className="text-center">KRS TA2</div>,
    cell: ({ row }) => {
      const val = row.getValue("krs_ta2") as number;
      return (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={
              val
                ? "bg-green-100 text-green-700 border-green-200 font-medium"
                : "bg-gray-100 text-gray-500 border-gray-200"
            }
          >
            {val ? "Ya" : "Tidak"}
          </Badge>
        </div>
      );
    },
  },
];

const SyncDataMahasiswaPage = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const mutateKey = ["mahasiswa-list", page, limit, searchTerm];

  const { data: response, error, isLoading } = useSWR(
    mutateKey,
    () => fetcher(page, limit, searchTerm),
    { dedupingInterval: 1000 }
  );

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
              subtitle: "Sinkronkan data mahasiswa fakultas dengan sistem pusat.",
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
