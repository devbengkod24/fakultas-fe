"use client";

import type { ColumnDef } from "@tanstack/react-table";
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
import { Badge } from "@/components/ui/badge";
import { MataKuliahPeminatanItem } from "@/types/admin/akademik-page/mata-kuliah-peminatan/mata-kuliah-peminatan";

export const Columns = (
  currentPage: number,
  perPage: number,
  onEdit?: (data: MataKuliahPeminatanItem) => Promise<void>,
  onDelete?: (id: string) => Promise<void>
): ColumnDef<MataKuliahPeminatanItem>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div className="">{number}</div>;
      },
    },
    {
      accessorKey: "kode",
      header: "Kode Mata Kuliah Peminatan",
    },
    {
      accessorKey: "name",
      header: "Nama Mata Kuliah Peminatan",
    },
    {
      accessorKey: "sks",
      header: "SKS",
    },
    {
      accessorKey: "peminatan",
      header: "Peminatan",
      cell: ({ row }) => {
        const mataKuliah = row.original;
        const peminatan = mataKuliah.peminatan || "Unknown";
        return (
          <div className="">
            <Badge variant="secondary" className="text-xs">
              {peminatan}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      enableHiding: false,
      cell: ({ row }) => {
        const mataKuliah = row.original;

        const handleDelete = async () => {
          if (!onDelete || !mataKuliah.id) {
            return;
          }

          await onDelete(mataKuliah.id.toString());
        };

        return (
          <div className="flex items-center gap-2">
            <DialogPopUp
              mode="edit"
              initialData={mataKuliah}
              onSubmit={async (data) => {
                if (onEdit) {
                  await onEdit(data);
                }
              }}
              trigger={
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Hapus Mata Kuliah Peminatan
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin akan menghapus mata kuliah peminatan
                    &quot;
                    {mataKuliah.name}&quot;? Tindakan ini tidak dapat
                    dibatalkan.
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

export default Columns;
