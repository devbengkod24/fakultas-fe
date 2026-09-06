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
import { PeminatanItem } from "@/types/admin/akademik-page/peminatan/peminatan";

export const Columns = (
  currentPage: number,
  perPage: number,
  onEdit?: (data: PeminatanItem) => Promise<void>,
  onDelete?: (id: string) => Promise<void>
): ColumnDef<PeminatanItem>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div className="">{number}</div>;
      },
    },
    {
      accessorKey: "peminatan",
      header: "Nama Peminatan",
    },
    {
      id: "actions",
      header: "Aksi",
      enableHiding: false,
      cell: ({ row }) => {
        const peminatan = row.original;

        const handleDelete = async () => {
          if (!onDelete || !peminatan.id) {
            return;
          }

          await onDelete(peminatan.id.toString());
        };

        return (
          <div className="flex items-center gap-2">
            <DialogPopUp
              mode="edit"
              initialData={peminatan}
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
                  <AlertDialogTitle>Hapus Peminatan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin akan menghapus peminatan &quot;
                    {peminatan.peminatan}&quot;? Tindakan ini tidak dapat
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
