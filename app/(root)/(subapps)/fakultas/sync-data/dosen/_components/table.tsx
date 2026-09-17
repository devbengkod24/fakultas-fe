"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { AlertCircle, RefreshCw, Users } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import SearchControl from "@/components/search-control";
import EmptyState from "@/components/empty-state";
import { DosenFakultasService } from "@/api";
import { handleToastResponse } from "@/lib/toast-response";
import { Columns, SyncDosen } from "./column";

/* eslint-disable @typescript-eslint/no-explicit-any */
function adaptSyncDosen(d: any): SyncDosen {
  const prodiHomebase =
    typeof d.prodi_homebase === "object" && d.prodi_homebase !== null
      ? d.prodi_homebase.nama
      : d.prodi_homebase;

  return {
    id: d.dosen_id ?? d.user_id,
    npp: d.npp ?? "-",
    nama: d.name,
    email: d.email ?? "-",
    prodi_homebase: prodiHomebase ?? "-",
    jabatan: d.jabatan_fungsional ?? "-",
    status: d.status_dosen ?? "-",
  };
}

const fetcher = (page: number, limit: number, search: string) =>
  DosenFakultasService.getAll(page, limit, search);

export function TableSyncDosen() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [isSyncing, setIsSyncing] = useState(false);

  const mutateKey = ["sync-dosen-list", page, limit, search];

  const {
    data: response,
    error,
    isLoading,
  } = useSWR(mutateKey, () => fetcher(page, limit, search), {
    dedupingInterval: 1000,
  });

  const rawData = response?.data?.data ?? [];
  const data: SyncDosen[] = Array.isArray(rawData) ? rawData.map(adaptSyncDosen) : [];

  const pagination = response?.data?.meta?.pagination;
  const lastPage = pagination?.last_page ?? 1;
  const totalData = pagination?.total ?? 0;

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await DosenFakultasService.sync();
      mutate(mutateKey);
      if (res?.success === false) {
        toast.error(res.message || "Gagal sinkronisasi data dosen");
      } else {
        handleToastResponse(res);
      }
    } catch {
      toast.error("Gagal melakukan sinkronisasi data dosen");
    } finally {
      setIsSyncing(false);
    }
  };

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Gagal memuat data"
        subtitle="Terjadi kesalahan saat mengambil data dosen. Silakan coba lagi."
        button={<Button onClick={() => router.refresh()}>Coba Lagi</Button>}
      />
    );
  }

  const hasData = data.length > 0;

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <SearchControl placeholder="Cari nama dosen..." className="flex-1 max-w-md" />
        <Button
          onClick={handleSync}
          disabled={isSyncing}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
          Sync Data
        </Button>
      </div>

      {!isLoading && !hasData ? (
        <EmptyState
          icon={Users}
          title="Belum ada data dosen"
          subtitle="Belum ada dosen yang terdaftar pada sistem."
          className="h-[400px]"
        />
      ) : (
        <DataTable
          columns={Columns}
          data={data}
          loading={isLoading}
          pagination={{
            currentPage: page,
            lastPage,
            limit,
            total: totalData,
          }}
        />
      )}
    </div>
  );
}
