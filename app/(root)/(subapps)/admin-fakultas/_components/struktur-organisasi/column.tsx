import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import DialogPopUp from "../struktur-organisasi/dialog-popup";
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
import { StrukturOrganisasi } from "@/types/fakultas/profile-page/struktur-organisasi/struktur-organisasi";

export const Columns = (
  currentPage: number,
  perPage: number,
  onEdit?: (data: StrukturOrganisasi) => Promise<void>,
  onDelete?: (id: number) => Promise<void>
): ColumnDef<StrukturOrganisasi>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div>{number}</div>;
      },
    },
    {
      accessorKey: "foto",
      header: "Foto Dosen",
      cell: ({ row }) => {
        const foto = row.original.image;
        return (
          <Image
            src={foto}
            alt="preview"
            width={100}
            height={100}
            style={{
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        );
      },
    },
    {
      accessorKey: "name",
      header: "Nama Dosen",
      cell: ({ row }) => {
        return (
          <div className="text-sm text-muted-foreground text-justify">
            {row.getValue("name")}
          </div>
        );
      },
    },
    {
      accessorKey: "position",
      header: "Jabatan Dosen",
      cell: ({ row }) => {
        return (
          <div className="text-sm text-muted-foreground text-justify">
            {row.getValue("position")}
          </div>
        );
      },
    },
    {
      accessorKey: "order_no",
      header: "Order No",
      cell: ({ row }) => {
        return (
          <div className="text-sm text-muted-foreground text-justify">
            {row.getValue("order_no")}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      enableHiding: false,
      cell: ({ row }) => {
        const struktur = row.original;

        const handleDelete = async () => {
          if (!onDelete || !struktur.id) {
            return;
          }

          try {
            await onDelete(Number(struktur.id));
            // Toast akan ditangani oleh table component setelah API response
          } catch (error) {
            // Error toast sudah ditangani di table component
            console.error(error);
          }
        };

        return (
          <div className="flex gap-2">
            <DialogPopUp
              mode="edit"
              initialData={struktur}
              onSubmit={async (data: any) => {
                if (onEdit) {
                  await onEdit(data);
                }
              }}
              trigger={
                <Button variant="ghost" size="icon" className="border border-gray-300 rounded-lg">
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                 <Button variant="ghost" size="icon" className="border border-red-500 rounded-lg">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Struktur Organisasi</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin akan menghapus Struktur Organisasi
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
