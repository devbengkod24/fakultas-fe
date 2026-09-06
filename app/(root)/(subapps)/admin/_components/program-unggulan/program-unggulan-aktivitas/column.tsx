import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import DialogPopUp from "../program-unggulan-aktivitas/dialog-popup";
import Image from "next/image";

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
import { PhotoActivity } from "@/types/admin/program-unggulan/photos-program/program-unggulan-photos";

export const Columns = (
  currentPage: number,
  perPage: number,
  onEdit?: (data: PhotoActivity) => Promise<void>,
  onDelete?: (photoId: number, programId: number) => Promise<void>
): ColumnDef<PhotoActivity>[] => {
  return [
    {
      accessorKey: "no",
      header: "No",
      cell: ({ row }) => {
        return (currentPage - 1) * perPage + row.index + 1;
      },
    },
    {
      accessorKey: "image",
      header: "Foto",
      cell: ({ row }) => {
        const image = row.getValue("image") as string;
        return (
          <div className="relative w-16 h-16">
            <img
              src={image || "/placeholder.svg"}
              alt={row.original.title}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Judul Aktivitas",
    },
    {
      accessorKey: "description",
      header: "Deskripsi",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="max-w-[300px] truncate" title={description}>
            {description}
          </div>
        );
      },
    },
    {
      accessorKey: "program",
      header: "Program Unggulan",
      cell: ({ row }) => {
        const program = row.original.program;
        return <div>{program?.title || "-"}</div>;
      },
    },
    {
      id: "actions",
      header: "Aksi",
      enableHiding: false,
      cell: ({ row }) => {
        const programAktivitas = row.original;

        const handleDelete = async () => {
          if (!onDelete || !programAktivitas.id) {
            return;
          }

          try {
            // Use program_id from data, or fallback to program.id if available
            const programId =
              programAktivitas.program_id || programAktivitas.program?.id || 0;
            await onDelete(programAktivitas.id, programId);
          } catch (error) {
            console.error(error);
          }
        };

        return (
          <div className="flex items-center gap-2">
            <DialogPopUp
              mode="edit"
              initialData={programAktivitas}
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
                    Hapus Aktivitas Program Unggulan
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin akan menghapus Aktivitas Program Unggulan?
                    Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete()}
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
