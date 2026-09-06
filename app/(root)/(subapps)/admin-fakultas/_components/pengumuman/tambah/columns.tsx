"use client";

import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Pencil, 
  Trash2, 
  Eye, 
  Rss, 
  BellRing, 
  MoreVertical 
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FakultasPengumuman } from "@/data/fakultas/tambah-pengumuman";
import { cn } from "@/lib/utils";

export const columns = (
  onEdit: (pengumuman: FakultasPengumuman) => void,
  onDelete: (pengumuman: FakultasPengumuman) => void,
  onToggleActive?: (pengumuman: FakultasPengumuman) => void,
  onTogglepopup?: (pengumuman: FakultasPengumuman) => void
): ColumnDef<FakultasPengumuman>[] => [
  {
    header: "No",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground w-6 text-center">{row.index + 1}</div>
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
    header: "Fitur & Status",
    cell: ({ row }) => {
      const p = row.original;
      // Tentukan variant badge berdasarkan status
      const statusVariant = p.status === 'published' ? 'success' : p.status === 'archived' ? 'secondary' : 'yellow';
      const statusLabel = p.status === 'published' ? 'Dipublikasi' : p.status === 'archived' ? 'Diarsipkan' : 'Konsep';
      return (
        <div className="flex flex-wrap gap-1.5 w-fit">
          <Badge variant={statusVariant} className="text-[10px] font-semibold px-2 py-0.5 whitespace-nowrap flex items-center gap-1">
            {statusLabel}
          </Badge>
          {p.status === 'published' && p.is_popup && (
            <Badge variant="outline" className="text-[10px] font-semibold px-2 py-0.5 whitespace-nowrap bg-purple-500/10 text-purple-600 border-purple-500/20 flex items-center gap-1">
              Pop-up
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
      <div className="text-sm text-foreground/80 min-w-[120px] font-medium">
        {row.original.user || "Admin Fakultas"}
      </div>
    ),
  },
  {
    accessorKey: "published_at",
    header: "Tanggal",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground whitespace-nowrap min-w-[100px]">
        {dayjs(row.original.published_at || row.original.created_at).format("DD MMM YYYY")}
      </div>
    ),
  },
  {
    id: "detail",
    header: () => <div className="text-center">Detail</div>,
    cell: ({ row }) => (
      <div className="flex justify-center w-12 mx-auto">
        <Link href={`/admin-fakultas/pengumuman/tambah/${row.original.id}`}>
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
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Aksi</div>,
    cell: ({ row }) => {
      const pengumuman = row.original;

      return (
        <div className="flex items-center justify-center gap-1.5 min-w-[80px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground border border-border hover:text transition-colors"
                title="Aksi"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48" usePortal={true}>
              <DropdownMenuItem onClick={() => onEdit(pengumuman)} className="cursor-pointer py-2.5">
                <Pencil className="mr-3 size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Edit</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onToggleActive?.(pengumuman)} className="cursor-pointer py-2.5">
                <Rss className={cn("mr-3 size-4", pengumuman.status === "archived" ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-sm font-medium", pengumuman.status === "archived" ? "text-primary" : "text-foreground")}>
                  {pengumuman.status === "archived" ? "Aktifkan" : "Arsipkan"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onTogglepopup?.(pengumuman)} 
                className={cn("cursor-pointer py-2.5", pengumuman.status === "archived" && "opacity-50 pointer-events-none")}
              >
                <BellRing className={cn("mr-3 size-4", pengumuman.is_popup ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-sm font-medium", pengumuman.is_popup ? "text-primary" : "text-foreground")}>
                  {pengumuman.is_popup ? "Pop-up Nonaktif" : "Pop-up Aktif"}
                </span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(pengumuman)}
                className="cursor-pointer py-2.5 text-destructive focus:text-destructive focus:bg-destructive/5"
              >
                <Trash2 className="mr-3 size-4" />
                <span className="text-sm font-medium">Hapus</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
