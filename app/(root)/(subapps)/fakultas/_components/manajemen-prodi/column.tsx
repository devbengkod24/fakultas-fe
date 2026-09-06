"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { ProdiData } from "@/types/fakultas/manajemen-prodi/manajemen-prodi";
import DialogPopUp from "./dialog-popup";

export const Columns = (
  page: number,
  limit: number,
  onEdit: (prodi: ProdiData) => Promise<void>,
  onDelete: (id: number) => void
): ColumnDef<ProdiData>[] => [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => (page - 1) * limit + row.index + 1,
  },
  {
    accessorKey: "nama",
    header: "Nama Program Studi",
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">{row.original.nama}</span>
    ),
  },
  {
    accessorKey: "kode_prodi",
    header: "Kode Prodi",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono">
        {row.original.kode_prodi}
      </Badge>
    ),
  },
  {
    accessorKey: "gelar",
    header: "Gelar",
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-medium">
        {row.original.gelar}
      </Badge>
    ),
  },
  {
    accessorKey: "category",
    header: "Kategori",
    cell: ({ row }) => {
      const category = row.original.category;
      const categoryName = (category && typeof category === "object") ? category.nama : category;
      
      return (
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100">
          {categoryName || "-"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <DialogPopUp mode="edit" initialData={row.original} onSubmit={onEdit} />
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(row.original.id)}
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:border-red-300"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
