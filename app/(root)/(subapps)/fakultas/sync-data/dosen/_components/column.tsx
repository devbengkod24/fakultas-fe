"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    header: "No",
    cell: ({ row }) => row.index + 1,
  },
  {
    id: "nama_npp",
    header: "Nama Dosen",
    cell: ({ row }) => {
      const dosen = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{dosen.nama}</span>
          <span className="text-xs text-muted-foreground">{dosen.npp}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "prodi_homebase",
    header: "Prodi Homebase",
  },
  {
    accessorKey: "jabatan",
    header: "Jabatan",
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
    header: "Aksi",
    enableHiding: false,
    cell: () => (
      <Button variant="ghost" size="icon">
        <Eye className="h-4 w-4" />
      </Button>
    ),
  },
];
