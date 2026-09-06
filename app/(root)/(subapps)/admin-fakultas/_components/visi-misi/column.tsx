"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import DialogPopUp from "./dialog-popup"; 
import { VisiMisi } from "@/types/fakultas/profile-page/visi-misi/visi-misi";
import { sanitizeHtml } from "@/lib/sanitize-html";

export const Columns = (
  currentPage: number,
  perPage: number,
  onEdit?: (data: VisiMisi) => Promise<void>
): ColumnDef<VisiMisi>[] => { 
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div className="text-center">{number}</div>;
      },
    },
    {
      accessorKey: "visi",
      header: "Visi Fakultas",
      cell: ({ row }) => {
        const visi = row.getValue("visi") as string;

        return (
          <div className="max-w-[300px]">
            <div
              className="text-sm text-muted-foreground prose prose-sm max-w-none [&>*]:my-0 [&>p]:my-1 text-justify line-clamp-3"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(visi) }}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "misi",
      header: "Misi Fakultas",
      cell: ({ row }) => {
        const misiRaw = row.getValue("misi");

        const misiHtml = Array.isArray(misiRaw) ? misiRaw.join("") : (misiRaw as string);

        return (
          <div className="max-w-[400px]"> 
            <div
              className="text-sm text-muted-foreground prose prose-sm max-w-none [&>*]:my-0 [&>p]:my-1 text-justify line-clamp-4"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(misiHtml) }}
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
        const visimisi = row.original;

        return (
          <div className="flex items-center gap-2">
            <DialogPopUp
              mode="edit"
              initialData={visimisi}
              onSubmit={async (data) => {
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
          </div>
        );
      },
    },
  ];
};