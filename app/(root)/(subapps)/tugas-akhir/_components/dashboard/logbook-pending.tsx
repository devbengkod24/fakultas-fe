"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import useSWR from "swr";
import { DashboardService } from "@/api/tugas-akhir";
import EmptyState from "@/components/empty-state";
import { AlertCircle, FileText, ExternalLink, Calendar } from "lucide-react";
import { formatDateFull } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface LogbookItem {
  id: number;
  tanggal: string;
  uraian: string;
  bab: number;
  status: string;
  dokumen: string;
  mahasiswa_id: number;
  mahasiswa_nim: string;
  mahasiswa_name: string;
  mahasiswa_photo: string;
}

interface LogbookResponse {
  data: LogbookItem[];
  meta: {
    success: boolean;
    message: string;
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  };
}

const LogbookPending = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 5;

  const {
    data: response,
    error,
    isLoading,
  } = useSWR<LogbookResponse>(
    ["pending-logbook", page, limit],
    () => DashboardService.getPendingLogbook(page, limit),
    {
      dedupingInterval: 1000,
    }
  );

  const columns: ColumnDef<LogbookItem>[] = [
    {
      accessorKey: "mahasiswa_name",
      header: "Mahasiswa",
      cell: ({ row }) => {
        const logbook = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={logbook.mahasiswa_photo}
                alt={logbook.mahasiswa_name}
                className="object-cover"
              />
              <AvatarFallback>
                {logbook.mahasiswa_name
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <span className="max-w-[200px] truncate font-medium capitalize">
                {logbook.mahasiswa_name.toLowerCase()}
              </span>
              <span className="text-sm text-muted-foreground">
                {logbook.mahasiswa_nim}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "tanggal",
      header: "Tanggal",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {formatDateFull(row.original.tanggal)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "bab",
      header: "Bab",
      cell: ({ row }) => {
        return <p>Bab {row.original.bab}</p>;
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const logbook = row.original;
        return (
          <div className="flex gap-2">
            {logbook.dokumen && (
              <Button size="sm" variant="outline" asChild>
                <Link
                  className="text-primary"
                  href={`/tugas-akhir/logbook/${logbook.mahasiswa_id}`}
                >
                  <ExternalLink className="h-4 w-4" />
                  Detail
                </Link>
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-80" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-lg border p-4"
            >
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Gagal memuat data"
        subtitle="Data logbook pending tidak dapat ditampilkan"
        variant="small"
      />
    );
  }

  if (!response?.data || response.data.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <EmptyState
          icon={FileText}
          title="Tidak ada logbook pending"
          subtitle="Semua logbook sudah ditinjau"
          variant="small"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={response.data}
        pagination={{
          currentPage: response.meta.pagination.current_page,
          lastPage: response.meta.pagination.last_page,
          limit: response.meta.pagination.per_page,
          total: response.meta.pagination.total,
        }}
        loading={isLoading}
      />
    </div>
  );
};

export default LogbookPending;
