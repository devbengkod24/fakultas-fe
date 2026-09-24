"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, Download, RefreshCw, Users, XCircle } from "lucide-react";

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
import type { SyncResult, SyncErrorDetail, SyncWarningDetail } from "@/api/fakultas-sync";
import type { Prodi } from "@/api/fakultas/prodi";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Kode dari fakultas-sync (klasifikasi by isinstance exception, lihat _classify_sync_error
// di services/sync_dosen.py) -- kode yang gak ada di tabel ini (termasuk "unknown") fallback
// ke `error.error` mentah, jadi gak pernah hilang, cuma belum secantik yang lain.
const ERROR_CODE_LABELS: Record<string, string> = {
  duplicate_nidn: "NIDN sudah dipakai dosen lain",
  duplicate_npp: "NPP sudah terdaftar",
  duplicate_email: "Email sudah dipakai akun lain",
  duplicate_key: "Data duplikat di database",
  email_kosong: "Email institusi & alternatif kosong",
  npp_kosong: "NPP kosong di data sumber",
  role_missing: "Role 'dosen' belum ada di sistem",
  nidn_name_mismatch: "NIDN sudah dipakai dosen lain dengan nama berbeda",
  ambiguous_name_match: "Nama cocok ke beberapa dosen, butuh review manual",
  ambiguous_user_match: "Nama cocok ke beberapa akun, butuh review manual",
  fetch_failed: "Gagal ambil data prodi ini dari API kampus, coba sync ulang",
};

// Kode buat peringatan non-blocking (bukan error) -- lihat SyncWarningDetail.
const WARNING_CODE_LABELS: Record<string, string> = {
  possible_duplicate_sibling: "Kemungkinan ada dosen lain dengan nama sama",
};

function formatSyncError(err: SyncErrorDetail): string {
  return (err.code && ERROR_CODE_LABELS[err.code]) || err.error;
}

function formatSyncWarning(w: SyncWarningDetail): string {
  return (w.code && WARNING_CODE_LABELS[w.code]) || w.warning;
}

// Kegagalan TOTAL (fakultas-sync gak kesambung sama sekali) -- Laravel balikin pesan mentah
// dari Guzzle/libcurl di `message`, bukan per-item kayak error_details. Pola "cURL error N"
// stabil (bagian libcurl), aman diformat di sini tanpa perlu ubah backend.
function formatSyncMessage(message: string): string {
  if (message.includes("cURL error 7") || message.includes("Couldn't connect to server")) {
    return "Gagal terhubung ke server sync (fakultas-sync). Pastikan service-nya sedang berjalan.";
  }
  if (message.includes("cURL error 28") || message.toLowerCase().includes("operation timed out")) {
    return "Sinkronisasi terlalu lama dan berhenti (timeout). Coba sync per-prodi satu-satu, bukan Semua Prodi FIK sekaligus.";
  }
  if (message.startsWith("cURL error")) {
    return "Gagal terhubung ke server sync. Coba lagi beberapa saat.";
  }
  return message;
}

// Sebelumnya biner (ada error sedikit pun langsung "Selesai dengan Error", padahal mayoritas
// bisa aja sukses -- mis. 384/501). Sekarang 3 level: 0 error = berhasil penuh, ada yang
// synced = sebagian berhasil (bukan kegagalan), 0 yang synced = gagal beneran.
function getSyncStatusMeta(data: SyncResult | null, fallbackSuccess: boolean) {
  if (!data) {
    return fallbackSuccess
      ? { title: "Sinkronisasi Berhasil", icon: "success" as const }
      : { title: "Sinkronisasi Gagal", icon: "error" as const };
  }
  if (data.errors === 0) {
    return { title: "Sinkronisasi Berhasil", icon: "success" as const };
  }
  if (data.total_synced === 0) {
    return { title: "Sinkronisasi Gagal", icon: "error" as const };
  }
  return {
    title: "Sinkronisasi Selesai — Sebagian Berhasil",
    icon: "partial" as const,
  };
}

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

const fetcher = (page: number, limit: number, search: string, prodi: string) =>
  DosenFakultasService.getAll(page, limit, search, prodi !== "all" ? prodi : undefined);

export function TableSyncDosen() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const filterProdi = searchParams.get("prodi") || "all";

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

  const mutateKey = ["sync-dosen-list", page, limit, search, filterProdi];

  const {
    data: response,
    error,
    isLoading,
  } = useSWR(mutateKey, () => fetcher(page, limit, search, filterProdi), {
    dedupingInterval: 1000,
  });

  const handleFilterProdiChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== "all") {
      params.set("prodi", value);
    } else {
      params.delete("prodi");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

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
        message: formatSyncMessage(res?.message ?? "Sync selesai"),
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
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={filterProdi} onValueChange={handleFilterProdiChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Semua Prodi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Prodi</SelectItem>
              {prodiList.map((prodi) => (
                <SelectItem key={prodi.id} value={String(prodi.id)}>
                  {prodi.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => setIsSyncDialogOpen(true)}
            disabled={isSyncing}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
            Sync Data
          </Button>
        </div>
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
        <DialogContent className="sm:max-w-[480px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            {(() => {
              const status = getSyncStatusMeta(syncResult.data, syncResult.success);
              return (
                <DialogTitle className="flex items-center gap-2">
                  {status.icon === "success" && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                  {status.icon === "partial" && <AlertCircle className="h-5 w-5 text-amber-500" />}
                  {status.icon === "error" && <XCircle className="h-5 w-5 text-destructive" />}
                  {status.title}
                </DialogTitle>
              );
            })()}
            {/* Pesan mentah cuma ditampilin kalau gak ada data (mis. gagal koneksi) --
                kalau ada data, title + stat card di bawah udah cukup, gak perlu diulang. */}
            {!syncResult.data && (
              <DialogDescription>{syncResult.message}</DialogDescription>
            )}
          </DialogHeader>

          {syncResult.data && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-muted-foreground">
                Prodi: <span className="text-foreground font-semibold">{syncResult.prodiName}</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-border bg-muted p-3 text-center">
                  <Download className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-xl font-bold text-foreground">
                    {syncResult.data.total_fetched}
                  </div>
                  <div className="text-xs text-muted-foreground">Diambil</div>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center">
                  <CheckCircle2 className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                  <div className="text-xl font-bold text-blue-600">
                    {syncResult.data.total_synced}
                  </div>
                  <div className="text-xs text-blue-600/80">Berhasil</div>
                </div>
                <div
                  className={`rounded-lg border p-3 text-center ${
                    syncResult.data.errors > 0 ? "border-destructive/30 bg-destructive/10" : "border-border bg-muted"
                  }`}
                >
                  <XCircle
                    className={`h-4 w-4 mx-auto mb-1 ${syncResult.data.errors > 0 ? "text-destructive" : "text-muted-foreground"}`}
                  />
                  <div className={`text-xl font-bold ${syncResult.data.errors > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                    {syncResult.data.errors}
                  </div>
                  <div className={`text-xs ${syncResult.data.errors > 0 ? "text-destructive/80" : "text-muted-foreground"}`}>
                    Gagal
                  </div>
                </div>
              </div>

              {syncResult.data.error_details.length > 0 && (
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium mb-2 flex items-center gap-1.5 text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    Rincian ({syncResult.data.error_details.length})
                  </p>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {syncResult.data.error_details.map((err, idx) => (
                      <div key={idx} className="text-xs rounded-md bg-muted/50 px-2.5 py-1.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-medium">{err.nama || "(nama tidak diketahui)"}</span>
                          <span className="font-mono text-[10px] text-muted-foreground shrink-0">{err.item ?? "-"}</span>
                        </div>
                        <div className="text-muted-foreground">{formatSyncError(err)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Peringatan non-blocking -- item di sini TETAP sukses ter-sync (masuk
                  total_synced), cuma perlu direview manual. Amber, bukan merah,
                  biar gak keliatan seolah gagal kayak section Rincian di atas. */}
              {(syncResult.data.warnings?.length ?? 0) > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-sm font-medium mb-2 flex items-center gap-1.5 text-amber-700">
                    <AlertCircle className="h-4 w-4" />
                    Perlu Ditinjau ({syncResult.data.warnings!.length})
                  </p>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {syncResult.data.warnings!.map((w, idx) => (
                      <div key={idx} className="text-xs rounded-md bg-white/60 px-2.5 py-1.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-medium text-amber-900">{w.nama || "(nama tidak diketahui)"}</span>
                          <span className="font-mono text-[10px] text-amber-700/70 shrink-0">{w.item ?? "-"}</span>
                        </div>
                        <div className="text-amber-700/90">{formatSyncWarning(w)}</div>
                      </div>
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
