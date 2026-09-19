"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, RefreshCw, Users, XCircle } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import SearchControl from "@/components/search-control";
import EmptyState from "@/components/empty-state";
import { DosenFakultasService, FakultasSyncService } from "@/api";
import { ProdiFakultasService } from "@/api/fakultas";
import { Columns, SyncDosen } from "./column";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { SyncResult } from "@/api/fakultas-sync";
import type { Prodi } from "@/api/fakultas/prodi";

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
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [syncResult, setSyncResult] = useState<{
    show: boolean;
    success: boolean;
    message: string;
    data: SyncResult | null;
    prodiName: string;
  }>({
    show: false,
    success: true,
    message: "",
    data: null,
    prodiName: "",
  });

  const mutateKey = ["sync-dosen-list", page, limit, search];

  const {
    data: response,
    error,
    isLoading,
  } = useSWR(mutateKey, () => fetcher(page, limit, search), {
    dedupingInterval: 1000,
  });

  const { data: prodiResponse } = useSWR("prodi-list-fakultas", () =>
    ProdiFakultasService.getAll(1, 100)
  );
  const prodiList: Prodi[] =
    prodiResponse?.data?.data ?? prodiResponse?.data ?? [];

  const rawData = response?.data?.data ?? [];
  const data: SyncDosen[] = Array.isArray(rawData) ? rawData.map(adaptSyncDosen) : [];

  const pagination = response?.data?.meta?.pagination;
  const lastPage = pagination?.last_page ?? 1;
  const totalData = pagination?.total ?? 0;

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const kodeProdi = selectedProdi !== "all" ? selectedProdi : undefined;
      const prodiName =
        selectedProdi !== "all"
          ? prodiList.find((p) => p.kode_prodi === selectedProdi)?.nama ?? selectedProdi
          : "Semua Prodi FIK";

      const res = await FakultasSyncService.syncDosen(kodeProdi);

      const resultData = (res as any)?.data;
      setSyncResult({
        show: true,
        success: res?.success !== false,
        message: res?.message ?? "Sync selesai",
        data: resultData ?? null,
        prodiName,
      });

      mutate(mutateKey);
      setIsSyncDialogOpen(false);
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
          onClick={() => setIsSyncDialogOpen(true)}
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

      {/* Sync Dialog — pilih prodi sebelum sync */}
      <Dialog open={isSyncDialogOpen} onOpenChange={setIsSyncDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sync Data Dosen</DialogTitle>
            <DialogDescription>
              Pilih prodi untuk sinkronisasi. Jika "Semua Prodi FIK" dipilih, semua 11 prodi FIK akan disinkronkan.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Prodi</Label>
              <Select value={selectedProdi} onValueChange={setSelectedProdi}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Pilih Prodi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Prodi FIK (11 Prodi)</SelectItem>
                  {prodiList.map((prodi) => (
                    <SelectItem key={prodi.id} value={prodi.kode_prodi}>
                      {prodi.nama} ({prodi.kode_prodi})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSyncDialogOpen(false)}
              disabled={isSyncing}
            >
              Batal
            </Button>
            <Button onClick={handleSync} disabled={isSyncing}>
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
              />
              {isSyncing ? "Menyinkronkan..." : "Mulai Sync"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Result Dialog — tampilkan hasil sync */}
      <Dialog
        open={syncResult.show}
        onOpenChange={(open) => setSyncResult((prev) => ({ ...prev, show: open }))}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {syncResult.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              {syncResult.success
                ? "Sinkronisasi Berhasil"
                : "Sinkronisasi Selesai dengan Error"}
            </DialogTitle>
            <DialogDescription>{syncResult.message}</DialogDescription>
          </DialogHeader>

          {syncResult.data && (
            <div className="space-y-3">
              <div className="rounded-lg border p-4 space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Prodi: <span className="text-foreground font-semibold">{syncResult.prodiName}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {syncResult.data.total_fetched}
                    </div>
                    <div className="text-xs text-muted-foreground">Diambil</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {syncResult.data.total_synced}
                    </div>
                    <div className="text-xs text-muted-foreground">Berhasil</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${syncResult.data.errors > 0 ? "text-red-600" : "text-gray-400"}`}>
                      {syncResult.data.errors}
                    </div>
                    <div className="text-xs text-muted-foreground">Gagal</div>
                  </div>
                </div>
              </div>

              {syncResult.data.error_details.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-800 mb-2">Detail Error:</p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {syncResult.data.error_details.map((err: any, idx: number) => (
                      <p key={idx} className="text-xs text-red-700">
                        <span className="font-mono">{err.item ?? "-"}</span>: {err.error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setSyncResult((prev) => ({ ...prev, show: false }))}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
