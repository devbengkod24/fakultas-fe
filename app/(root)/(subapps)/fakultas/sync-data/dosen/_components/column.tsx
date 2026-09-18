"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface SyncDosen {
  id: number;
  npp: string;
  nama: string;
  email: string;
  prodi_homebase: string;
  jabatan: string;
  status: string;
}

export const Columns: ColumnDef<SyncDosen>[] = [
  {
    id: "no",
    header: () => <div className="text-center w-full">No</div>,
    size: 60,
    cell: ({ row }) => <div className="text-center w-full">{row.index + 1}</div>,
  },
  {
    id: "nama_npp",
    header: "Nama Dosen",
    size: 240,
    cell: ({ row }) => {
      const dosen = row.original;
      const initial = dosen.nama.charAt(0).toUpperCase();
      return (
        <div className="flex items-center gap-3 py-1">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-muted text-muted-foreground font-medium">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{dosen.nama}</span>
            <span className="text-xs text-muted-foreground">{dosen.npp}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 220,
  },
  {
    accessorKey: "prodi_homebase",
    header: "Prodi Homebase",
    size: 170,
  },
  {
    accessorKey: "jabatan",
    header: "Jabatan",
    size: 140,
    cell: ({ row }) => {
      const value = row.getValue("jabatan") as string;
      return (
        <Badge variant="outline" className="text-xs">
          {value}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 110,
    cell: ({ row }) => {
      const value = row.getValue("status") as string;
      const isActive = value.toLowerCase() === "aktif";
      return (
        <Badge
          variant={isActive ? "primary" : "secondary"}
          className="text-xs"
        >
          {value}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center w-full">Aksi</div>,
    size: 80,
    enableHiding: false,
    cell: ({ row }) => {
      const dosen = row.original;
      return (
        <div className="flex justify-center w-full">
          <Link
            href={`/fakultas/manajemen-dosen/detail/${dosen.id}`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      );
    },
  },
];
