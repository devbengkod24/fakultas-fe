"use client";

import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";
import Link from "next/link";
import type { Pengumuman } from "@/types/admin-fakultas/pengumuman/pengumuman";
import { TYPE_BADGE } from "./cards";

export const columns = (
  onApprove: (pengumuman: Pengumuman) => void,
  onReject: (pengumuman: Pengumuman) => void,
  isAdminFakultas: boolean,
): ColumnDef<Pengumuman>[] => [
  {
    header: "No",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground w-6 text-center">
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: "judul",
    header: "Judul Pengumuman",
    cell: ({ row }) => (
      <div className="max-w-[260px] min-w-[180px] truncate text-sm font-medium text-foreground">
        {row.original.judul}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Kategori",
    cell: ({ row }) => {
      const type = row.original.type?.toLowerCase() || "";
      const badge = TYPE_BADGE[type];
      const prodi = row.original.prodi;
      return (
        <div className="flex w-fit whitespace-nowrap gap-1.5">
          {prodi && (
            <Badge
              variant="secondary"
              className="text-xs font-semibold px-2.5 py-0.5 whitespace-nowrap block bg-blue-500/10 text-blue-600 border-blue-500/20"
            >
              {typeof prodi === 'string' ? prodi : prodi.nama}
            </Badge>
          )}
          {badge ? (
            <Badge
              variant={badge.variant as any}
              className="text-xs font-semibold px-2.5 py-0.5 whitespace-nowrap block"
            >
              {badge.label}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-xs font-semibold px-2.5 py-0.5 whitespace-nowrap block"
            >
              {type || "-"}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "user",
    header: "Pengirim",
    cell: ({ row }) => (
      <div className="text-sm text-foreground/80 min-w-[120px]">
        {row.original.user || "Admin Fakultas"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const p = row.original as any;
      const isApproved =
        p.status === "approved" ||
        p.status === "approve" ||
        p.status_verified === "approved" ||
        p.status_verified === "approve";
      const isRejected =
        p.status === "rejected" ||
        p.status === "reject" ||
        p.status_verified === "rejected" ||
        p.status_verified === "reject";

      return (
        <div className="flex w-fit whitespace-nowrap">
          {isApproved ? (
            <Badge
              variant="success"
              className="text-xs font-semibold px-2.5 py-0.5 whitespace-nowrap block"
            >
              Diterima
            </Badge>
          ) : isRejected ? (
            <Badge
              variant="destructiveOutline"
              className="text-xs font-semibold px-2.5 py-0.5 bg-destructive/5 whitespace-nowrap block text-destructive"
            >
              Ditolak
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-xs font-semibold px-2.5 py-0.5 bg-yellow-500/10 text-yellow-600 border-yellow-500/20 whitespace-nowrap block"
            >
              Menunggu
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "published_at",
    header: "Tanggal",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground whitespace-nowrap min-w-[100px]">
        {dayjs(row.original.published_at || row.original.created_at).format(
          "DD MMM YYYY",
        )}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Aksi</div>,
    cell: ({ row }) => {
      const p = row.original as any;
      const isApproved =
        p.status === "approved" ||
        p.status === "approve" ||
        p.status_verified === "approved" ||
        p.status_verified === "approve";
      const isRejected =
        p.status === "rejected" ||
        p.status === "reject" ||
        p.status_verified === "rejected" ||
        p.status_verified === "reject";

      const isProcessed = isApproved || isRejected;

      return (
        <div className="flex items-center justify-end gap-1.5">
          {isAdminFakultas && !isProcessed && (
            <>
              <Button
                size="icon"
                className="h-8 w-8 bg-primary text-white hover:bg-primary/90 shadow-sm"
                onClick={() => onApprove(p)}
                title="Terima"
              >
                <Check className="size-4 text-white" />
              </Button>
              <Button
                size="icon"
                variant="destructiveOutline"
                className="h-8 w-8 bg-background shadow-sm"
                onClick={() => onReject(p)}
                title="Tolak"
              >
                <X className="size-4 text-destructive" />
              </Button>
            </>
          )}
          <Link href={`/admin-fakultas/pengumuman/validasi/${row.original.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground border border-border hover:text transition-colors"
              title="Lihat Detail"
            >
              <Eye className="size-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];