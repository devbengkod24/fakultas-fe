"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import DialogPopUp from "./dialog-popup";
import type { Pengertian } from "@/types/fakultas/profile-page/pengenalan/pengenalan";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { sanitizeHtml } from "@/lib/sanitize-html";

const ActionCell = ({
  data,
  onEdit,
  onDelete,
}: {
  data: Pengertian;
  onEdit?: (data: Pengertian) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}) => {
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  return (
    <div className="flex items-center gap-2">
      <DialogPopUp
        mode="edit"
        initialData={data}
        onSubmit={async (updatedData) => {
          if (onEdit) {
            await onEdit(updatedData);
          }
        }}
        trigger={
          <Button variant="ghost" size="icon" className="border border-gray-300 rounded-lg">
            <Edit className="h-4 w-4" />
          </Button>
        }
      />

      {onDelete && data.id && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="border border-red-300 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          {/* Modal Konfirmasi */}
          <ConfirmationModal
            open={isDeleteOpen}
            setOpen={setIsDeleteOpen}
            type="delete" 
            onConfirm={async () => {
              await onDelete(data.id!);
              setIsDeleteOpen(false); 
            }}
          />
        </>
      )}
    </div>
  );
};


export const Columns = (
  currentPage: number,
  perPage: number,
  onEdit?: (data: Pengertian) => Promise<void>,
  onDelete?: (id: number) => Promise<void>
): ColumnDef<Pengertian>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div className="text-center">{number}</div>;
      },
    },
    {
      accessorKey: "pengertian",
      header: "Pengenalan Fakultas",
      cell: ({ row }) => {
        const pengertian = row.getValue("pengertian") as string;

        return (
          <div className="max-w-[800px] text-justify">
            <div
              className="text-sm text-muted-foreground prose prose-sm max-w-none [&>*]:my-0 [&>p]:my-1 text-justify line-clamp-3"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(pengertian) }}
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
        return <ActionCell data={row.original} onEdit={onEdit} onDelete={onDelete} />;
      },
    },
  ];
};