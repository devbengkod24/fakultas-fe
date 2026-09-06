"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import DialogPopUp from "./dialog-popup";
import { ProfilLulusan } from "@/types/admin/landing-page/prospek-karir/profil-lulusan";
import { useState } from "react";
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
  page: number,
  limit: number,
  handleEdit: (profil: ProfilLulusan) => Promise<void>,
  handleDelete: (id: number) => Promise<void>
): ColumnDef<ProfilLulusan>[] => [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => {
      const rowIndex = row.index;
      const rowNumber = (page - 1) * limit + rowIndex + 1;
      return <div>{rowNumber}</div>;
    },
  },
  {
    accessorKey: "kode",
    header: "Kode PL",
    cell: ({ row }) => {
      const { kode } = row.original;
      return <div className="min-w-[50px]">{kode || "-"}</div>;
    },
  },
  {
    accessorKey: "deskripsi",
    header: "Deskripsi Profil Lulusan",
    cell: ({ row }) => {
      const { deskripsi } = row.original;
      return (
        <div className="min-w-[300px]">
          {deskripsi}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Cell({ row }) {
      const profilData = row.original as ProfilLulusan;
      const [isOpenDelete, setIsOpenDelete] = useState(false);
      const [dropdownOpen, setDropdownOpen] = useState(false);
      const [dialogOpen, setDialogOpen] = useState(false);

      const confirmDelete = async () => {
        if (profilData.id) {
          await handleDelete(profilData.id);
          setIsOpenDelete(false);
        }
      };

      return (
        <>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(profilData.id?.toString() || "");
                }}
              >
                <Copy className="mr-2 h-4 w-4" /> Copy ID
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setDropdownOpen(false);
                  setDialogOpen(true);
                }}
                className="text-blue-600 focus:text-blue-600"
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setIsOpenDelete(true);
                }}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={isOpenDelete} onOpenChange={setIsOpenDelete}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Profil Lulusan?</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus profil lulusan ini? Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {dialogOpen && (
            <DialogPopUp
              mode="edit"
              initialData={{
                ...profilData,
              }}
              onSubmit={handleEdit}
              open={dialogOpen}
              onOpenChange={setDialogOpen}
            />
          )}
        </>
      );
    },
  },
];
