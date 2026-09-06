"use client";

import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import DialogPopUp from "./dialog-popup";
import type { FasilitasFakultas } from "@/types/admin-fakultas/fasilitas/fasilitas";
import { sanitizeHtml } from "@/lib/sanitize-html";
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

export const Columns = (
  currentPage: number,
  perPage: number,
  onEdit?: (data: FasilitasFakultas & { imageFile?: File }) => Promise<void>,
  onDelete?: (id: number) => Promise<void>,
): ColumnDef<FasilitasFakultas>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div>{number}</div>;
      },
    },
    {
      accessorKey: "gambar",
      header: "Gambar",
      cell: ({ row }) => {
        const src = row.original.gambar;

        if (!src) {
          return (
            <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
              Tidak ada gambar
            </div>
          );
        }

        return (
          <Image
            src={src}
            alt={row.original.judul || "Fasilitas"}
            width={80}
            height={80}
            style={{
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        );
      },
    },
    {
      accessorKey: "judul",
      header: "Judul Fasilitas",
      cell: ({ row }) => {
        return (
          <div className="max-w-[300px] text-sm text-foreground text-justify font-medium">
            {row.original.judul}
          </div>
        );
      },
    },
    {
      accessorKey: "deskripsi",
      header: "Deskripsi",
      cell: ({ row }) => {
        const deskripsi = row.getValue("deskripsi") as string;

        return (
          <div className="max-w-[400px] text-sm text-muted-foreground text-justify line-clamp-3">
            <div
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(deskripsi) }}
              className="mb-2"
            />
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      enableHiding: false,
      cell: ({ row }) => {
        const fasilitas = row.original;

        const handleDelete = async () => {
          if (!onDelete || !fasilitas.id) {
            return;
          }

          try {
            await onDelete(fasilitas.id);
          } catch (error) {
            console.error(error);
          }
        };

        return (
          <div className="flex gap-2">
            <DialogPopUp
              mode="edit"
              initialData={fasilitas}
              onSubmit={async (data) => {
                if (onEdit) {
                  await onEdit(data);
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
                  <AlertDialogTitle>Hapus Fasilitas</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin akan menghapus fasilitas &quot;
                    {fasilitas.judul}&quot;? Tindakan ini tidak dapat
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
