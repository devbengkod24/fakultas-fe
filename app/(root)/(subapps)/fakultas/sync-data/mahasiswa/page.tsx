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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
      const statusMap: Record<string, { label: string; className: string }> = {
        aktif: {
          label: "Aktif",
          className:
            "border-green-200 bg-green-100 text-green-700 hover:bg-green-100/80",
        },
        tidak_aktif: {
          label: "Tidak Aktif",
          className:
            "border-red-200 bg-red-100 text-red-700 hover:bg-red-100/80",
        },
        lulus: {
          label: "Lulus",
          className:
            "border-blue-200 bg-blue-100 text-blue-700 hover:bg-blue-100/80",
        },
        cuti: {
          label: "Cuti",
          className:
            "border-orange-200 bg-orange-100 text-orange-700 hover:bg-orange-100/80",
        },
        DO: {
          label: "DO",
          className:
            "border-rose-300 bg-rose-100 text-rose-800 hover:bg-rose-100/80",
        },
        mangkir: {
          label: "Mangkir",
          className:
            "border-yellow-200 bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80",
        },
      };
      const entry = status
        ? (statusMap[status] ?? {
            label: status,
            className:
              "border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-100/80",
          })
        : null;
      return (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={entry ? `font-medium ${entry.className}` : ""}
          >
            {entry ? entry.label : "-"}
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
  const router = useRouter();
  const pathname = usePathname();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const resetPage = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [syncFilters, setSyncFilters] = useState({
    prodi: "all",
    nim: "",
    angkatan: "",
    status: "",
    status_mhs: "",
  });

  const mutateKey = ["mahasiswa-list", page, limit, searchTerm, selectedProdi];

  const {
    data: response,
    error,
    isLoading,
    mutate,
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

  const handleStartSync = async () => {
    setIsSyncing(true);
    try {
      const res = await FakultasSyncService.syncMahasiswa({
        prodi: syncFilters.prodi !== "all" ? syncFilters.prodi : undefined,
        nim: syncFilters.nim || undefined,
        angkatan: syncFilters.angkatan || undefined,
        status: syncFilters.status || undefined,
        status_mhs: syncFilters.status_mhs || undefined,
      });
      handleToastResponse(res);
      mutate();
      setIsSyncDialogOpen(false);
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
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari nama atau NIM..."
            className="h-10 pl-9"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              resetPage();
            }}
          />
        </div>

        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
          <Select
            value={selectedProdi}
            onValueChange={(value) => {
              setSelectedProdi(value);
              resetPage();
            }}
          >
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

          <Button
            onClick={() => setIsSyncDialogOpen(true)}
            disabled={isSyncing}
            className="h-10"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
            />
            {isSyncing ? "Menyinkronkan..." : "Sync Data"}
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

      <Dialog open={isSyncDialogOpen} onOpenChange={setIsSyncDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Sync Data Mahasiswa</DialogTitle>
            <DialogDescription>
              Kosongkan semua field untuk sync seluruh mahasiswa 7 prodi FIK.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Prodi</Label>
              <Select
                value={syncFilters.prodi}
                onValueChange={(value) =>
                  setSyncFilters((prev) => ({ ...prev, prodi: value }))
                }
              >
                <SelectTrigger className="h-10 w-full">
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

            <div className="grid gap-2">
              <Label>NIM</Label>
              <Input
                placeholder="Kosongkan untuk semua NIM"
                value={syncFilters.nim}
                onChange={(e) =>
                  setSyncFilters((prev) => ({ ...prev, nim: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Angkatan</Label>
              <Input
                placeholder="Contoh: 2024"
                value={syncFilters.angkatan}
                onChange={(e) =>
                  setSyncFilters((prev) => ({
                    ...prev,
                    angkatan: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Status</Label>
              <Input
                placeholder="Contoh: aktif"
                value={syncFilters.status}
                onChange={(e) =>
                  setSyncFilters((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Status Mahasiswa</Label>
              <Input
                placeholder="Opsional"
                value={syncFilters.status_mhs}
                onChange={(e) =>
                  setSyncFilters((prev) => ({
                    ...prev,
                    status_mhs: e.target.value,
                  }))
                }
              />
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
            <Button onClick={handleStartSync} disabled={isSyncing}>
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
              />
              {isSyncing ? "Menyinkronkan..." : "Mulai Sync"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SyncDataMahasiswaPage;
