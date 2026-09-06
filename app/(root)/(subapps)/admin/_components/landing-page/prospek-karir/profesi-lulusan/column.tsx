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
import * as LucideIcons from "lucide-react";
import DialogPopUp from "./dialog-popup";
import { ProfesiLulusan } from "@/types/admin/landing-page/prospek-karir/profesi-lulusan";
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
  handleEdit: (profesi: ProfesiLulusan) => Promise<void>,
  handleDelete: (id: number) => Promise<void>
): ColumnDef<ProfesiLulusan>[] => [
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
    accessorKey: "nama_profesi",
    header: "Nama Profesi",
    cell: ({ row }) => {
      const { nama_profesi } = row.original;
      return <div className="font-medium min-w-[150px]">{nama_profesi}</div>;
    },
  },
  {
    accessorKey: "icon",
    header: "Icon Lucide",
    cell: ({ row }) => {
      const { icon } = row.original;
      const IconComponent = icon ? (LucideIcons as any)[icon] : null;
      return (
        <div className="flex items-center gap-2">
          {IconComponent ? <IconComponent className="h-5 w-5" /> : <span>-</span>}
          <span>{icon || "-"}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Cell({ row }) {
      const profesiData = row.original as ProfesiLulusan;
      const [isOpenDelete, setIsOpenDelete] = useState(false);
      const [dropdownOpen, setDropdownOpen] = useState(false);
      const [dialogOpen, setDialogOpen] = useState(false);

      const confirmDelete = async () => {
        if (profesiData.id) {
          await handleDelete(profesiData.id);
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
                  navigator.clipboard.writeText(profesiData.id?.toString() || "");
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
                <AlertDialogTitle>Hapus Profesi Lulusan?</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus profesi lulusan ini? Tindakan ini tidak dapat dibatalkan.
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
                ...profesiData,
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
