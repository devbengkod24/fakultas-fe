"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import DialogPopUp from "./dialog-popup";
import type { SambutanDekan } from "@/types/admin-fakultas/sambutan-dekan/sambutan-dekan";
import { sanitizeHtml } from "@/lib/sanitize-html";

export const Columns = (
  currentPage: number,
  perPage: number,
  onEdit?: (data: SambutanDekan & { imageFile?: File }) => Promise<void>,
): ColumnDef<SambutanDekan>[] => {
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
      header: "Foto Dekan",
      cell: ({ row }) => {
        const src = row.original.image;
        const fallbackSvg =
          "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12px' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

        return (
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src || fallbackSvg}
              alt={row.original.name || "Foto Dekan"}
              className="w-20 h-20 object-cover rounded-md border border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = fallbackSvg;
              }}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Nama Dekan",
      cell: ({ row }) => {
        return (
          <div className="max-w-[300px] text-sm text-foreground text-justify font-medium">
            {row.original.name}
          </div>
        );
      },
    },
    {
      accessorKey: "paragraph",
      header: "Sambutan Dekan",
      cell: ({ row }) => {
        const paragraph = row.getValue("paragraph") as string;

        return (
          <div className="max-w-[400px] text-sm text-muted-foreground text-justify line-clamp-3">
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
                <Button variant="outline" size="icon">
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
