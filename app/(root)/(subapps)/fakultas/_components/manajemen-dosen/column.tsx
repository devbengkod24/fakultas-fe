"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Dosen, ProdiInfo } from "@/types/fakultas/penelitian/penelitian";
import { Eye } from "lucide-react";
import Link from "next/link";

export const Columns = (
  currentPage: number,
  perPage: number,
  baseUrl: string = "/fakultas/manajemen-dosen/detail",
): ColumnDef<Dosen>[] => {
  return [
    {
      id: "no",
      header: () => <div className="text-center w-full">No</div>,
      size: 60,
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div className="text-center w-full">{number}</div>;
      },
    },
    {
      id: "nama_npp",
      header: "Nama Dosen",
      size: 220,
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
      accessorKey: "jabatan",
      header: "Jabatan",
      size: 140,
    },
    {
      accessorKey: "prodi_homebase",
      header: "Prodi Homebase",
      size: 150,
      cell: ({ row }) => {
        const prodi = row.getValue("prodi_homebase") as ProdiInfo | string;
        if (typeof prodi === "object" && prodi !== null) {
          return <div className="truncate">{prodi.nama}</div>;
        }
        return <div>{prodi ?? "-"}</div>;
      },
    },
    {
      accessorKey: "prodi_tugas",
      header: "Prodi Tugas",
      size: 280,
      cell: ({ row }) => {
        const prodis = row.getValue("prodi_tugas") as ProdiInfo[] | string;
        if (Array.isArray(prodis)) {
          if (prodis.length === 0) return <div>-</div>;
          return (
            <div className="flex flex-wrap gap-1 max-w-full">
              {prodis.map((p) => (
                <span
                  key={p.id}
                  className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 whitespace-nowrap"
                >
                  {p.nama}
                </span>
              ))}
            </div>
          );
        }
        return <div>{prodis ?? "-"}</div>;
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
              href={`${baseUrl}/${dosen.dosen_id ?? dosen.user_id}`}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent"
            >
              <Eye className="h-4 w-4" />
            </Link>
          </div>
        );
      },
    },
  ];
};