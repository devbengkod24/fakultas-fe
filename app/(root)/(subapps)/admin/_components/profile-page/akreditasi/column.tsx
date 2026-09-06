import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import DialogPopUp from "../../profile-page/akreditasi/dialog-popup";
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
import { Akreditasi } from "@/types/admin/profile-page/akreditasi/akreditasi";

export const Columns = (
  currentPage: number,
  perPage: number,
  onEdit?: (data: Akreditasi & { imageFile?: File }) => Promise<void>,
  onDelete?: (id: number | string) => Promise<void>
): ColumnDef<Akreditasi>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div>{number}</div>;
      },
    },
    {
      accessorKey: "image",
      header: () => (
        <div style={{ textAlign: "center", width: "100%" }}>
          Gambar Akreditasi Program Studi
        </div>
      ),
      cell: ({ row }) => {
        const src = row.original.image;
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Image
              src={src}
              alt="akreditasi "
              width={100}
              height={100}
              style={{
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Judul",
      cell: ({ row }) => {
        return <div>{row.original.title}</div>;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        return <div>{row.original.description}</div>;
      },
    },
    {
      accessorKey: "accred",
      header: "Akreditasi",
      cell: ({ row }) => {
        return <div>{row.original.accred}</div>;
      },
    },
    {
      id: "actions",
      header: "Aksi",
      enableHiding: false,
      cell: ({ row }) => {
        const akreditasi = row.original;

        const handleDelete = async () => {
          if (!onDelete || !akreditasi.id) {
            return;
          }

          try {
            await onDelete(akreditasi.id);
          } catch (error) {
            console.error(error);
          }
        };

        return (
          <div className="">
            <DialogPopUp
              mode="edit"
              initialData={akreditasi}
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
                  <AlertDialogTitle>Hapus gambar akreditasi </AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin akan menghapus akreditasi? Tindakan ini
                    tidak dapat dibatalkan.
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
