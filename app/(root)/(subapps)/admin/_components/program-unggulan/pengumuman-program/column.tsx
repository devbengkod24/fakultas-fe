import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import DialogPopUp from "../pengumuman-program/dialog-popup";
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
import { PengumumanProgram } from "@/types/admin/program-unggulan/pengumuman-program/pengumuman-program";

export const Columns = (
  currentPage: number,
  perPage: number,
  onEdit?: (data: PengumumanProgram) => Promise<void>,
  onDelete?: (id: number) => Promise<void>
): ColumnDef<PengumumanProgram>[] => {
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
      header: "Nama Pengumuman",
      accessorKey: "title",
      enableHiding: false,
      cell: ({ row }) => {
        const pengumumanProgram = row.original;
        return <div className="text-sm">{pengumumanProgram.title}</div>;
      },
    },
    {
      id: "program",
      header: "Program Unggulan",
      accessorKey: "program",
      enableHiding: false,
      cell: ({ row }) => {
        const pengumumanProgram = row.original;
        return (
          <div className="text-sm">
            {pengumumanProgram.program?.title || "-"}
          </div>
        );
      },
    },
    {
      id: "type",
      header: "Tipe",
      accessorKey: "type",
      enableHiding: false,
      cell: ({ row }) => {
        const pengumumanProgram = row.original;
        const typeLabels = {
          hasil: "Hasil",
          pendaftaran: "Pendaftaran",
          acara: "Acara",
        };
        return (
          <div className="text-sm capitalize">
            {typeLabels[pengumumanProgram.type] || pengumumanProgram.type}
          </div>
        );
      },
    },
    {
      id: "date",
      header: "Tanggal",
      accessorKey: "date",
      enableHiding: false,
      cell: ({ row }) => {
        const pengumumanProgram = row.original;
        return (
          <div className="text-sm">
            {new Date(pengumumanProgram.date).toLocaleDateString("id-ID")}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      enableHiding: false,
      cell: ({ row }) => {
        const pengumumanProgram = row.original;

        const handleDelete = async () => {
          if (!onDelete || !pengumumanProgram.id) {
            return;
          }

          try {
            await onDelete(pengumumanProgram.id);
          } catch (error) {
            console.error(error);
          }
        };

        return (
          <div className="">
            <DialogPopUp
              mode="edit"
              initialData={pengumumanProgram}
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
                  <AlertDialogTitle>Hapus Pengumuman Program</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin akan menghapus Pengumuman Program?
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
