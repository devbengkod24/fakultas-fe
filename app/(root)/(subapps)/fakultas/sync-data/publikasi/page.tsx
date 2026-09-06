"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Link2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { ImportPublikasiSuperAdminService } from "@/api/superadmin";
import DashboardHeader from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import withAuth from "@/app/(root)/hoc/withAuth";
import { DataSyncPublikasi } from "@/app/(root)/(subapps)/fakultas/_components/sync-data/publikasi/table";

interface RelinkFailedItem {
  penulis_id: number;
  sinta_id?: string | null;
  nama_penulis?: string | null;
}

interface RelinkResult {
  total: number;
  linked: number;
  unlinked: number;
  failed?: RelinkFailedItem[];
}

const SyncDataPublikasiPage = () => {
  const [isRelinking, setIsRelinking] = useState(false);
  const [result, setResult] = useState<RelinkResult | null>(null);

  const handleRelink = async () => {
    setIsRelinking(true);
    const toastId = toast.loading("Menghubungkan penulis dengan data dosen...");

    try {
      const response = await ImportPublikasiSuperAdminService.relinkPenulis();
      if (!response.success) {
        throw new Error(response.message || "Re-link penulis gagal");
      }

      setResult((response.data as RelinkResult | null) ?? null);
      toast.success(response.message || "Re-link penulis selesai", {
        id: toastId,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Re-link penulis gagal";
      toast.error(message, { id: toastId });
    } finally {
      setIsRelinking(false);
    }
  };

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          { name: "Sync Data", url: "/fakultas/sync-data" },
          {
            name: "Publikasi",
            url: "/fakultas/sync-data/publikasi",
          },
        ]}
        titleItems={[
          {
            title: "Sinkronisasi Data Publikasi",
            subtitle:
              "Hubungkan kembali data penulis publikasi dengan data dosen STI.",
          },
        ]}
      />

      <div className="mt-4 rounded-xl border bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Link2 className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Auto-link dan Re-link Penulis</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Mengaitkan penulis publikasi dengan data dosen berdasarkan
                kecocokan nama.
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleRelink}
            disabled={isRelinking}
            className="shrink-0"
          >
            {isRelinking ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Link2 />
            )}
            {isRelinking ? "Menjalankan..." : "Jalankan Re-link"}
          </Button>
        </div>

        {result && (
          <div className="mt-5 space-y-4 border-t pt-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <ResultCard label="Total diperiksa" value={result.total} />
              <ResultCard
                label="Berhasil tertaut"
                value={result.linked}
                className="border-green-200 bg-green-50 text-green-700"
              />
              <ResultCard
                label="Belum tertaut"
                value={result.unlinked}
                className="border-amber-200 bg-amber-50 text-amber-700"
              />
            </div>

            {result.unlinked === 0 ? (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                <CheckCircle2 className="size-4" />
                Semua penulis berhasil ditautkan dengan data dosen.
              </div>
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <AlertTriangle className="size-4" />
                  {result.unlinked} penulis belum ditemukan di STI API.
                </div>

                {result.failed && result.failed.length > 0 && (
                  <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto text-sm">
                    {result.failed.slice(0, 30).map((item) => (
                      <li
                        key={item.penulis_id}
                        className="rounded-md border border-amber-200 bg-white/70 px-3 py-2"
                      >
                        <span className="font-medium">
                          {item.nama_penulis || "Nama penulis tidak tersedia"}
                        </span>
                        <span className="ml-2 text-xs text-amber-700">
                          ID {item.penulis_id}
                          {item.sinta_id ? ` · SINTA ${item.sinta_id}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Tabel Data Publikasi & Penelitian (UI dummy, belum ada endpoint) ── */}
      <DataSyncPublikasi />
    </div>
  );
};

function ResultCard({
  label,
  value,
  className = "border-border bg-muted/30 text-foreground",
}: {
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border p-4 ${className}`}>
      <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

export default withAuth(SyncDataPublikasiPage, "fakultas", [
  "super_fakultas",
]);