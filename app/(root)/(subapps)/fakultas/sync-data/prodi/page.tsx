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
import SearchControl from "@/components/search-control";
import EmptyState from "@/components/empty-state";
import { useSearchParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { SyncResultModal, SyncResultData } from "@/components/sync-result-modal";

/* eslint-disable @typescript-eslint/no-explicit-any */

type ProdiRow = {
  id: number;
  nama: string;
  kode_prodi: string;
  gelar: string;
  category_id: number;
  category: { id: number; nama: string } | null;
};

const fetcher = (page: number, limit: number, search: string) =>
  ProdiFakultasService.getAll(page, limit, search).then((res) => res);

export default function SyncDataProdiPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    show: boolean;
    success: boolean;
    message: string;
    data: SyncResultData;
  }>({ show: false, success: true, message: "", data: null });

  const mutateKey = ["prodi-list", page, limit, search];
  const { data: response, error, isLoading } = useSWR(
    mutateKey,
    () => fetcher(page, limit, search),
    { dedupingInterval: 1000 }
  );

  const rawProdi = response?.data?.data ?? response?.data ?? [];
  const prodi: ProdiRow[] = Array.isArray(rawProdi) ? rawProdi : [];

  const pagination = response?.data?.meta?.pagination ?? response?.meta?.pagination;
  const lastPages = pagination?.last_page ?? 1;
  const totalData = pagination?.total ?? 0;

  const columns: ColumnDef<ProdiRow>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {(page - 1) * limit + row.index + 1}
        </span>
      ),
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

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await FakultasSyncService.syncProdi();
      setSyncResult({
        show: true,
        success: res?.success !== false,
        message: res?.message ?? "Sync selesai",
        data: res?.data ?? null,
      });
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

  const hasData = prodi && prodi.length > 0;

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

        {!isLoading && !hasData ? (
          <EmptyState
            icon={Building2}
            title="Belum ada data prodi"
            subtitle="Belum ada program studi yang terdaftar pada sistem."
            className="h-[400px]"
          />
        ) : (
          <DataTable
            columns={columns}
            data={prodi}
            loading={isLoading}
            pagination={{
              currentPage: page,
              lastPage: lastPages,
              limit: limit,
              total: totalData,
            }}
          />
        )}
      </div>

      <SyncResultModal
        open={syncResult.show}
        onOpenChange={(open) => setSyncResult((prev) => ({ ...prev, show: open }))}
        success={syncResult.success}
        message={syncResult.message}
        data={syncResult.data}
      />
    </div>
  );
}
