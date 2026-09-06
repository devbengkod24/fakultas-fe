import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import DialogPopUp from "../program-unggulan/dialog-popup";
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
import { ProgramUnggulan } from "@/types/admin/program-unggulan/program-unggulan/program-unggulan";

export const Columns = (
  currentPage: number,
  perPage: number,
  onEdit?: (data: ProgramUnggulan) => Promise<void>,
  onDelete?: (id: number) => Promise<void>
): ColumnDef<ProgramUnggulan>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div>{number}</div>;
      },
    },
    {
      id: "title",
      header: "Judul",
      accessorKey: "title",
      enableHiding: false,
      cell: ({ row }) => {
        const programunggulan = row.original;
        return <div className="text-sm">{programunggulan.title}</div>;
      },
    },

    {
      accessorKey: "image",
      header: "Gambar",
      cell: ({ row }) => {
        const src = row.original.image;

        return (
          <div className="">
            <Image
              src={src || "/placeholder.svg?height=80&width=80"}
              alt="Program Unggulan"
              width={80}
              height={80}
              className="object-cover rounded-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/placeholder.svg?height=80&width=80";
              }}
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
        const programunggulan = row.original;

        const handleDelete = async () => {
          if (!onDelete || !programunggulan.id) {
            return;
          }

          try {
            await onDelete(programunggulan.id);
          } catch (error) {
            console.error(error);
          }
        };

        return (
          <div className="">
            <DialogPopUp
              mode="edit"
              initialData={programunggulan}
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
                    Hapus Program Unggulan Program Studi
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin akan menghapus Program Unggulan? Tindakan
                    ini tidak dapat dibatalkan.
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
