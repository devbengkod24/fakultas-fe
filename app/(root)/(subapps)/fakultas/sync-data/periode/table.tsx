/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  RefreshCcw,
} from "lucide-react";
import { DataTable } from "@/components/data-table";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import EmptyState from "@/components/empty-state";
import { toast } from "sonner";
import { PeriodeFakultasService } from "@/api/fakultas";
import SearchControl from "@/components/search-control";
import { handleToastResponse } from "@/lib/toast-response";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";
import "dayjs/locale/id";

interface Periode {
  id: number;
  kode_periode: string | number;
  tahun_ajaran: string;
  tgl_awal: string | null;
  tgl_akhir: string | null;
  status: boolean | number;
}

const fetcher = (
  page: number,
  limit: number,
  search: string,
  status: string,
) =>
  PeriodeFakultasService.getAll(
    page,
    limit,
    search,
    undefined,
    status && status !== "all" ? status : undefined
  ).then((res) => res);

const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  return dayjs(dateString).locale("id").format("DD MMMM YYYY");
};

export default function TableSyncPeriode() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const filter_status = searchParams.get("status") || "all";

  const [isSyncing, setIsSyncing] = useState(false);

  const mutateKey = ["periode-list", page, limit, search, filter_status];

  const {
    data: response,
    error,
    isLoading,
  } = useSWR(
    mutateKey,
    () => fetcher(page, limit, search, filter_status),
    { dedupingInterval: 1000 }
  );

  const rawPeriodes = response?.data?.data ?? response?.data ?? [];
  const periodes: Periode[] = Array.isArray(rawPeriodes) ? rawPeriodes : [];
  
  const pagination = response?.data?.meta?.pagination ?? response?.meta?.pagination;
  const lastPages = pagination?.last_page ?? 1;
  const totalData = pagination?.total ?? 0;

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await PeriodeFakultasService.sync();
      mutate(mutateKey);
      if (res?.success === false) {
        toast.error(res.message || "Gagal sinkronisasi data periode");
      } else {
        handleToastResponse(res);
      }
    } catch (error: any) {
      toast.error("Gagal melakukan sinkronisasi data periode");
    } finally {
      setIsSyncing(false);
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

  const columns: ColumnDef<Periode>[] = [
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
      accessorKey: "kode_periode",
      header: "Kode Periode",
    },
    {
      accessorKey: "tahun_ajaran",
      header: "Tahun Ajaran",
    },
    {
      accessorKey: "tgl_awal",
      header: "Tanggal Mulai",
      cell: ({ row }) => formatDate(row.getValue("tgl_awal")),
    },
    {
      accessorKey: "tgl_akhir",
      header: "Tanggal Selesai",
      cell: ({ row }) => formatDate(row.getValue("tgl_akhir")),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const periode = row.original;
        const isActive = periode.status === 1 || periode.status === true;
        return (
          <Badge variant={isActive ? "blue" : "destructiveOutline"}>
            {isActive ? "Aktif" : "Tidak aktif"}
          </Badge>
        );
      },
    },
  ];

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Gagal memuat data"
        subtitle="Terjadi kesalahan saat mengambil data periode. Silakan coba lagi."
        button={<Button onClick={() => router.refresh()}>Coba Lagi</Button>}
      />
    );
  }

  const hasData = periodes && periodes.length > 0;

  return (
    <>
      <div className="gap-4 flex flex-col">
        {/* Filters */}
        <div className="flex justify-between items-center gap-2 w-full">
          <SearchControl placeholder="Cari periode..." className="w-1/4" />
          <div className="flex items-center gap-2">
            <Select
              value={filter_status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-[180px] h-9 text-xs font-normal">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">Semua Status</SelectItem>
                <SelectItem value="1" className="text-xs">Aktif</SelectItem>
                <SelectItem value="0" className="text-xs">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleSync}
              variant="default"
              className="h-9"
              disabled={isSyncing}
            >
              <RefreshCcw
                className={`h-4 w-4 mr-1.5 ${isSyncing ? "animate-spin" : ""}`}
              />
              Sync Data
            </Button>
          </div>
        </div>
      </div>

      {!isLoading && !hasData ? (
        <EmptyState
          icon={CalendarIcon}
          title="Belum ada data periode"
          subtitle="Belum ada periode yang terdaftar pada sistem."
          className="h-[400px]"
        />
      ) : (
        <DataTable
          columns={columns}
          data={periodes}
          loading={isLoading}
          pagination={{
            currentPage: page,
            lastPage: lastPages,
            limit: limit,
            total: totalData,
          }}
        />
      )}
    </>
  );
}
