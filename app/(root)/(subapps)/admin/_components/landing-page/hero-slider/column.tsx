import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import DialogPopUp from "./dialog-popup";
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
import { HeroSlider } from "@/types/admin/landing-page/hero-slider/hero-slider";
import { Badge } from "@/components/ui/badge";

export const Columns = (
  currentPage: number,
  perPage: number,
  onEdit?: (data: HeroSlider) => Promise<void>,
  onDelete?: (id: number) => Promise<void>
): ColumnDef<HeroSlider>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div>{number}</div>;
      },
    },
    {
      accessorKey: "src",
      header: "Gambar Hero Slider",
      cell: ({ row }) => {
        const src = row.original.image;
        return (
          <Image
            src={src}
            alt="Hero Slider"
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
      accessorKey: "title",
      header: "Judul Hero Slider",
    },
    {
      accessorKey: "subtitle",
      header: "Subjudul Hero Slider",
    },
    {
      accessorKey: "isActive",
      header: "Status Aktif",
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <Badge variant={isActive === 1 ? "success" : "destructiveOutline"}>
            {isActive === 1 ? "Aktif" : "Tidak Aktif"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      enableHiding: false,
      cell: ({ row }) => {
        const hero = row.original;

        const handleDelete = async () => {
          if (!onDelete || !hero.id) {
            return;
          }

          try {
            await onDelete(hero.id);
          } catch (error) {
            console.error(error);
          }
        };

        return (
          <div className="">
            <DialogPopUp
              mode="edit"
              initialData={hero}
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
                  <AlertDialogTitle>Hapus Hero Slider</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin akan menghapus gambar hero slider?
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
