"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import DialogPopUp from "./dialog-popup";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { RuanganSidang } from "@/types/fakultas/ruangan-sidang/ruangan-sidang";

export const Columns = (
  currentPage: number,
  perPage: number,
  onEdit?: (data: RuanganSidang) => Promise<void>,
  onDelete?: (id: number) => Promise<void>,
): ColumnDef<RuanganSidang>[] => {
  return [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div>{number}</div>;
      },
    },
    {
      accessorKey: "nama_ruangan",
      header: "Nama Ruangan",
      cell: ({ row }) => (
        <span className="w-full font-medium text-gray-900 block">
          {row.original.nama_ruangan}
        </span>
      ),
    },
    {
      accessorKey: "gedung",
      header: "Gedung",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 block">
          {row.original.gedung || "-"}
        </span>
      ),
    },
    {
      accessorKey: "kapasitas",
      header: "Kapasitas",
      cell: ({ row }) => (
        <span className="block">
          {row.original.kapasitas ?? "-"}
        </span>
      ),
    },
    {
      accessorKey: "is_online",
      header: "Tipe",
      enableSorting: false,
      cell: ({ row }) => {
        const isOnline = row.original.is_online;
        return (
          <Badge
            variant="secondary"
            className={
              isOnline
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-gray-50 text-gray-600 border-gray-200"
            }
          >
            {isOnline ? "Online" : "Fisik"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      enableSorting: false,
      cell: ({ row }) => {
        const isActive = row.original.is_active;
        return (
          <Badge
            variant="secondary"
            className={
              isActive
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-gray-50 text-gray-600 border-gray-200"
            }
          >
            {isActive ? "Aktif" : "Nonaktif"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Aksi</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const ruangan = row.original;

        const handleDelete = async () => {
          if (!onDelete || !ruangan.id) {
            return;
          }

          try {
            await onDelete(ruangan.id);
          } catch (error) {
            console.error(error);
          }
        };

        return (
          <div className="flex items-center justify-center gap-2">
            <DialogPopUp
              mode="edit"
              initialData={ruangan}
              onSubmit={async (data: any) => {
                if (onEdit && ruangan.id) {
                  await onEdit({ ...data, id: ruangan.id });
                }
              }}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="border border-gray-300 rounded-lg"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="border border-red-500 rounded-lg"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Ruangan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin akan menghapus ruangan "{ruangan.nama_ruangan}"?
                    Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                  >
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];
};