import { ColumnDef } from "@tanstack/react-table";
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
import { AkunUser } from "@/types/fakultas/users/user";
import { Badge } from "@/components/ui/badge";

export const Columns = (
  currentPage: number,
  perPage: number,
  onEdit?: (data: AkunUser) => Promise<void>,
  onDelete?: (id: number) => Promise<void>,
): ColumnDef<AkunUser>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div>{number}</div>;
      },
    },
    {
      accessorKey: "name",
      header: "Nama",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "prodi_id",
      header: "Program Studi",
      cell: ({ row }) => {
        const user = row.original as AkunUser & { prodi?: string };
        return <div>{user.prodi|| "-"}</div>;
      },
    },
    {
      accessorKey: "permissions",
      header: "Permission",
      cell: ({ row }) => {
        const permissions = row.getValue("permissions") as string[];

        const getVariant = (value: string) => {
          switch (value) {
            case "tugas-akhir": return "orange";
            case "kerja-praktek": return "primary";
            case "bimbingan-karir": return "yellow";
            case "admin": return "destructiveOutline";
            default: return "default";
          }
        };

        return (
          <div className="flex flex-wrap gap-1 max-w-[220px]">
            {(permissions || []).map((permission) => {
              const label =
                permissionOptions.find((p) => p.value === permission)?.label ||
                permission;

              return (
                <Badge key={permission} variant={getVariant(permission)}>
                  {label}
                </Badge>
              );
            })}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        const handleDelete = async () => {
          if (!onDelete || !user.id) {
            return;
          }

          try {
            await onDelete(Number(user.id));
          } catch (error) {
            console.error(error);
          }
        };

        return (
          <div className="">
            <DialogPopUp
              mode="edit"
              initialData={user}
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
                  <AlertDialogTitle>Hapus Admin</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin akan menghapus akun admin? Tindakan
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

const permissionOptions = [
  { value: "admin", label: "Admin" },
  { value: "bimbingan-karir", label: "Bimbingan Karir" },
  { value: "tugas-akhir", label: "Tugas Akhir" },
  { value: "kerja-praktek", label: "Kerja Praktek" },
];
