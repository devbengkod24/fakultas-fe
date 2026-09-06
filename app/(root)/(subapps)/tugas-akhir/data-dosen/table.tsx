/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { BulkActivateModal } from "./bulk-activate-modal";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AlertCircle,
  GraduationCap,
  CheckCircle,
  XCircle,
  Users,
  ListChecks,
  RefreshCcw,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/data-table";
import { PlotStudentsDialog } from "./plot";

import { useSearchParams, useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import EmptyState from "@/components/empty-state";
import { toast } from "sonner";
import { DosenService } from "@/api/tugas-akhir";
import SearchControl from "@/components/search-control";
import { handleToastResponse } from "@/lib/toast-response";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Dosen {
  dosen_id: number;
  npp: string;
  name: string;
  gelar_depan?: string;
  gelar_belakang: string;
  email: string;
  bidang_kajian?: string;
  status_dosen?: string;
  jumlah_lulusan: number;
  lulus_persen: number;
  total_mhs_ta: number;
  total_mhs_saat_ini: number;
  kuota_ta_baru: number;
  kuota: number;
  sisa_kuota: number;
  aktif_periode: boolean;
  dosen_periode_id?: number;
}

const fetcher = (
  page: number,
  limit: number,
  search: string,
  filter_kuota: string,
) =>
  DosenService.getAll(page, limit, search, filter_kuota, "").then((res) => res);

export default function TableDataDosen() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const filter_kuota = searchParams.get("filter_kuota") || "";

  const [bulkOpen, setBulkOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dosenToDelete, setDosenToDelete] = useState<Dosen | null>(null);
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);
  const [dosenToToggle, setDosenToToggle] = useState<Dosen | null>(null);
  const [isTogglingDosen, setIsTogglingDosen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    // TODO: implement sync logic
    setIsSyncing(false);
  };
  const [selectedDosenForPlot, setSelectedDosenForPlot] =
    useState<Dosen | null>(null);

  const {
    data: response,
    error,
    isLoading,
  } = useSWR(
    ["dosen-list", page, limit, search, filter_kuota],
    () => fetcher(page, limit, search, filter_kuota),
    { dedupingInterval: 1000 },
  );

  const dosenList: Dosen[] = response?.data || [];
  const lastPages = response?.meta?.pagination.last_page ?? 1;
  const totalData = response?.meta?.pagination.total ?? 0;

  const mutateKey = ["dosen-list", page, limit, search, filter_kuota];

  const handleDeleteDosen = async () => {
    if (!dosenToDelete) return;
    try {
      const response = await DosenService.delete(dosenToDelete.dosen_id);
      mutate(mutateKey);
      setIsDeleteDialogOpen(false);
      setDosenToDelete(null);
      handleToastResponse(response);
    } catch (error: any) {
      toast.error("Gagal menghapus dosen");
    }
  };

  const handleToggleAktif = async () => {
    if (!dosenToToggle) return;
    setIsTogglingDosen(true);
    try {
      const response = await DosenService.toggleAktifPeriode(
        dosenToToggle.dosen_id,
      );
      mutate(mutateKey);
      setIsToggleDialogOpen(false);
      setDosenToToggle(null);
      handleToastResponse(response);
    } catch (error: any) {
      toast.error(
        dosenToToggle.aktif_periode
          ? "Gagal menonaktifkan dosen"
          : "Gagal mengaktifkan dosen",
      );
    } finally {
      setIsTogglingDosen(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const columns: ColumnDef<Dosen>[] = [
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
      id: "nama",
      header: "Nama",
      cell: ({ row }) => {
        const dosen = row.original;
        const fullName = `${dosen.gelar_depan ? dosen.gelar_depan + " " : ""}${dosen.name}${dosen.gelar_belakang ? ", " + dosen.gelar_belakang : ""}`;
        return (
          <Link
            href={`/tugas-akhir/data-dosen/${dosen.dosen_id}`}
            className="font-medium hover:text-primary flex flex-col"
          >
            <span className="line-clamp-1">{fullName}</span>
            <span className="text-sm text-muted-foreground">
              {dosen.npp}
              {dosen.bidang_kajian ? ` - ${dosen.bidang_kajian}` : ""}
            </span>
          </Link>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "mahasiswa_bimbingan",
      header: "Mahasiswa Bimbingan",
      cell: ({ row }) => {
        const dosen = row.original;
        const quota = dosen.kuota || 0;
        const current = quota - (dosen.sisa_kuota || 0);
        const isFull = quota > 0 && dosen.sisa_kuota <= 0;
        return (
          <div className="flex items-center gap-2">
            <span className="w-12">
              {current}
              <span className="text-muted-foreground/70"> / {quota}</span>
            </span>
            <Badge
              variant={
                quota === 0
                  ? "secondary"
                  : isFull
                    ? "destructiveOutline"
                    : "success"
              }
            >
              {quota === 0 ? "Tidak Tersedia" : isFull ? "Penuh" : "Tersedia"}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "status_periode",
      header: "Status Periode",
      cell: ({ row }) => {
        const dosen = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant={dosen.aktif_periode ? "default" : "outline"}
              size="sm"
              className="h-8"
              onClick={() => {
                setDosenToToggle(dosen);
                setIsToggleDialogOpen(true);
              }}
            >
              {dosen.aktif_periode ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                  Aktif
                </>
              ) : (
                <>
                  <XCircle className="h-3.5 w-3.5 mr-1.5" />
                  Nonaktif
                </>
              )}
            </Button>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const dosen = row.original;
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedDosenForPlot(dosen)}
            disabled={dosen.sisa_kuota <= 0}
            className="flex items-center gap-1.5"
          >
            <Users className="h-3.5 w-3.5" />
            Plot Mahasiswa
            {dosen.sisa_kuota > 0 ? ` (Sisa: ${dosen.sisa_kuota})` : " (Penuh)"}
          </Button>
        );
      },
    },
  ];

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

  const hasData = dosenList && dosenList.length > 0;

  return (
    <>
      <div className="gap-4 flex flex-col">
        {/* Filters */}
        <div className="flex justify-between items-center gap-2 w-full">
          <SearchControl placeholder="Cari dosen..." className="w-1/4" />
          <div className="flex items-center gap-2">
            <Select
              value={filter_kuota || "all"}
              onValueChange={(value) =>
                handleFilterChange("filter_kuota", value)
              }
            >
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Status Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="nonaktif">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="default"
              className="h-9"
              onClick={() => setBulkOpen(true)}
            >
              <ListChecks className="h-4 w-4 mr-1.5" />
              Pilih Banyak
            </Button>
            <Button
              onClick={handleSync}
              variant="default"
              size="icon"
              className="h-9 w-9"
              title="Sync data dosen"
            >
              <RefreshCcw
                className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </div>

      {!isLoading && !hasData ? (
        <EmptyState
          icon={GraduationCap}
          title="Belum ada data dosen"
          subtitle="Belum ada dosen yang terdaftar pada periode ini."
          className="h-[400px]"
        />
      ) : (
        <DataTable
          columns={columns}
          data={dosenList}
          loading={isLoading}
          pagination={{
            currentPage: page,
            lastPage: lastPages,
            limit: limit,
            total: totalData,
          }}
        />
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Dosen</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus dosen{" "}
              <strong>{dosenToDelete?.name}</strong>? Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDosenToDelete(null)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDosen}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isToggleDialogOpen}
        onOpenChange={setIsToggleDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dosenToToggle?.aktif_periode ? "Nonaktifkan" : "Aktifkan"} Dosen
              Periode Ini
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dosenToToggle?.aktif_periode ? (
                <>
                  Apakah Anda yakin ingin <strong>menonaktifkan</strong> dosen{" "}
                  <strong>{dosenToToggle?.name}</strong> dari periode ini? Dosen
                  masih akan tampil di daftar Data Dosen, namun tidak akan
                  tampil di halaman Kuota Dosen.
                </>
              ) : (
                <>
                  Apakah Anda yakin ingin <strong>mengaktifkan</strong> dosen{" "}
                  <strong>{dosenToToggle?.name}</strong> untuk periode ini?
                  Dosen akan tampil di halaman Kuota Dosen dengan kuota awal 0.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDosenToToggle(null)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleAktif}
              disabled={isTogglingDosen}
              className={
                dosenToToggle?.aktif_periode
                  ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  : "bg-primary hover:bg-primary/90 text-primary-50"
              }
            >
              {isTogglingDosen ? (
                "Memproses..."
              ) : dosenToToggle?.aktif_periode ? (
                <>
                  <XCircle className="h-4 w-4 mr-1.5" />
                  Nonaktifkan
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-1.5" />
                  Aktifkan
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Plot Mahasiswa Dialog - rendered when selected from toolbar */}
      {selectedDosenForPlot && (
        <PlotStudentsDialog
          isOpen={true}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedDosenForPlot(null);
            }
          }}
          dosen={{
            dosen_id: selectedDosenForPlot.dosen_id,
            name: selectedDosenForPlot.name,
            sisa_kuota: selectedDosenForPlot.sisa_kuota,
            currentStudents: selectedDosenForPlot.total_mhs_saat_ini || 0,
            quota: selectedDosenForPlot.kuota,
          }}
          onPlotSuccess={() => {
            mutate(mutateKey);
            setSelectedDosenForPlot(null);
          }}
        />
      )}

      {/* Bulk Activate Modal */}
      <BulkActivateModal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        mutateKey={mutateKey}
      />
    </>
  );
}
