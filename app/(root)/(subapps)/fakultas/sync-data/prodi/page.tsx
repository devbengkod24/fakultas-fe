"use client";

import { useState } from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Building2 } from "lucide-react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { ProdiFakultasService } from "@/api/fakultas";
import { FakultasSyncService } from "@/api";
import { handleToastResponse } from "@/lib/toast-response";
import SearchControl from "@/components/search-control";
import EmptyState from "@/components/empty-state";
import { useSearchParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

/* eslint-disable @typescript-eslint/no-explicit-any */

type ProdiRow = {
  id: number;
  nama: string;
  kode_prodi: string;
  gelar: string;
  category_id: number;
  category: { id: number; nama: string } | null;
};

const fetcher = () => ProdiFakultasService.getAll(1000);

const columns: ColumnDef<ProdiRow>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => <span className="text-muted-foreground">{row.index + 1}</span>,
  },
  {
    accessorKey: "kode_prodi",
    header: "Kode Prodi",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold bg-gray-50 px-2 py-1 rounded border border-gray-100">
        {row.original.kode_prodi}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Kategori",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.category?.nama ?? "-"}</span>
    ),
  },
  {
    accessorKey: "nama",
    header: "Nama Program Studi",
    cell: ({ row }) => (
      <span className="font-medium text-sm">{row.original.nama}</span>
    ),
  },
  {
    accessorKey: "gelar",
    header: "Gelar",
    cell: ({ row }) => (
      <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
        {row.original.gelar}
      </Badge>
    ),
  },
];

export default function SyncDataProdiPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [isSyncing, setIsSyncing] = useState(false);

  const mutateKey = ["prodi-list"];
  const { data: response, error, isLoading } = useSWR(mutateKey, fetcher, {
    dedupingInterval: 1000,
  });

  const rawProdi = response?.data?.data ?? response?.data ?? [];
  const data: ProdiRow[] = Array.isArray(rawProdi) ? rawProdi : [];
  const totalData = data.length;
  const lastPage = Math.ceil(totalData / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedData = data.slice(startIndex, startIndex + limit);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await FakultasSyncService.syncProdi();
      handleToastResponse(res);
      mutate(mutateKey);
    } catch {
      toast.error("Gagal melakukan sinkronisasi data prodi");
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
            { name: "Prodi", url: "/fakultas/sync-data/prodi" },
          ]}
          titleItems={[
            {
              title: "Sinkronisasi Data Prodi",
              subtitle: "Sinkronkan data program studi fakultas dengan sistem pusat.",
            },
          ]}
        />
        <EmptyState
          icon={AlertCircle}
          title="Gagal memuat data"
          subtitle="Terjadi kesalahan saat mengambil data prodi."
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
          { name: "Prodi", url: "/fakultas/sync-data/prodi" },
        ]}
        titleItems={[
          {
            title: "Sinkronisasi Data Prodi",
            subtitle: "Sinkronkan data program studi fakultas dengan sistem pusat. Data prodi digunakan sebagai referensi untuk sinkronisasi dosen, mahasiswa, dan mata kuliah.",
          },
        ]}
      />

      <div className="flex flex-col justify-center space-y-4 mt-4">
        <div className="gap-4 flex flex-col">
          <div className="flex justify-between items-center gap-2 w-full">
            <SearchControl placeholder="Cari prodi..." className="w-1/4" />
            <Button
              onClick={handleSync}
              variant="default"
              className="h-9"
              disabled={isSyncing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-1.5 ${isSyncing ? "animate-spin" : ""}`}
              />
              Sync Data
            </Button>
          </div>
        </div>

        {!isLoading && paginatedData.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Belum ada data prodi"
            subtitle="Belum ada program studi yang terdaftar pada sistem."
            className="h-[400px]"
          />
        ) : (
          <DataTable
            columns={columns}
            data={paginatedData}
            loading={isLoading}
            pagination={{
              currentPage: page,
              lastPage: lastPage,
              limit: limit,
              total: totalData,
            }}
          />
        )}
      </div>
    </div>
  );
}
