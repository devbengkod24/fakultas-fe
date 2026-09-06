"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { GelombangTA } from "@/types/tugas-akhir/gelombang";

export function createGelombangColumns(
  onEdit: (gelombang: GelombangTA) => void,
  onToggleStatus: (id: number) => void,
  onDelete: (id: number) => void,
  page = 1,
  limit = 10,
): ColumnDef<GelombangTA>[] {
  return [
    {
      id: "no",
      header: "No.",
      cell: ({ row }) => (
        <span className="font-medium">
          {(page - 1) * limit + row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "nama_gelombang",
      header: "Nama Gelombang",
    },
    {
      accessorKey: "tipe",
      header: "Tipe",
      cell: ({ row }) => (
        <Badge variant={row.original.tipe === "ta1" ? "blue" : "orange"}>
          {row.original.tipe === "ta1" ? "TA 1" : "TA 2"}
        </Badge>
      ),
    },
    {
      id: "periode",
      header: "Periode",
      cell: ({ row }) => row.original.periode?.tahun_ajaran ?? "-",
    },
    {
      accessorKey: "tgl_awal",
      header: "Tgl Awal",
      cell: ({ row }) =>
        row.original.tgl_awal
          ? new Date(row.original.tgl_awal).toLocaleDateString("id-ID")
          : "-",
    },
    {
      accessorKey: "tgl_akhir",
      header: "Tgl Akhir",
      cell: ({ row }) =>
        row.original.tgl_akhir
          ? new Date(row.original.tgl_akhir).toLocaleDateString("id-ID")
          : "-",
    },
    {
      accessorKey: "total_pendaftar",
      header: "Pendaftar",
      cell: ({ row }) => row.original.total_pendaftar ?? 0,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === 1 ? "success" : "destructiveOutline"
          }
        >
          {row.original.status === 1 ? "Aktif" : "Tidak Aktif"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const gelombang = row.original;
        return (
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => onEdit(gelombang)}
                      disabled={!gelombang.is_editable}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </span>
                </TooltipTrigger>
                {!gelombang.is_editable && (
                  <TooltipContent>
                    <p>
                      {gelombang.is_ended
                        ? "Gelombang sudah berakhir"
                        : "Gelombang sedang berlangsung"}
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          disabled={(gelombang.total_pendaftar ?? 0) > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Gelombang</AlertDialogTitle>
                          <AlertDialogDescription>
                            Yakin ingin menghapus gelombang{" "}
                            <strong>{gelombang.nama_gelombang}</strong>?
                            Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(gelombang.id!)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </span>
                </TooltipTrigger>
                {(gelombang.total_pendaftar ?? 0) > 0 && (
                  <TooltipContent>
                    <p>
                      Gelombang sudah memiliki {gelombang.total_pendaftar}{" "}
                      pendaftar, tidak dapat dihapus
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];
}
