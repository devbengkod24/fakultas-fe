"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import DialogPopUp from "./dialog-popup";
import Image from "next/image";
import type { SambutanKaprodi } from "@/types/admin/landing-page/sambutan-kaprodi/sambutan-kaprodi";
import { sanitizeHtml } from "@/lib/sanitize-html";

export const Columns = (
  currentPage: number,
  perPage: number,
  onEdit?: (data: SambutanKaprodi & { imageFile?: File }) => Promise<void>
): ColumnDef<SambutanKaprodi>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div className="text-center">{number}</div>;
      },
    },
    {
      accessorKey: "image",
      header: "Gambar Kepala Program Studi",
      cell: ({ row }) => {
        const src = row.original.image;

        return (
          <div className="flex justify-center">
            <Image
              src={src || "/placeholder.svg?height=80&width=80"}
              alt="Kata Sambutan Kaprodi"
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
      accessorKey: "name",
      header: "Nama Kepala Program Studi",
      cell: ({ row }) => {
        return (
          <div className="max-w-[300px] text-sm text-muted-foreground text-justify">
            {row.original.name}
          </div>
        );
      },
    },
    {
      accessorKey: "paragraph",
      header: "Sambutan Kepala Program Studi",
      cell: ({ row }) => {
        const paragraph = row.getValue("paragraph") as string;

        return (
          <div className="max-w-[300px] text-sm text-muted-foreground text-justify">
            <div
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(paragraph) }}
              className="mb-2"
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
        const sambutan = row.original;

        return (
          <div className="flex items-center gap-2">
            <DialogPopUp
              mode="edit"
              initialData={sambutan}
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
          </div>
        );
      },
    },
  ];
};
