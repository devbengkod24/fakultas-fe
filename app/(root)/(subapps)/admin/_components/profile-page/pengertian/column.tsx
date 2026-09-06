import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import DialogPopUp from "../../profile-page/pengertian/dialog-popup";
import { Pengertian } from "@/types/admin/profile-page/pengertian/pengertian";
import { sanitizeHtml } from "@/lib/sanitize-html";

export const Columns = (
  currentPage: number,
  perPage: number,
  onEdit?: (data: Pengertian) => Promise<void>
): ColumnDef<Pengertian>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div>{number}</div>;
      },
    },
    {
      accessorKey: "pengertian",
      header: "Pengertian Program Studi",
      cell: ({ row }) => {
        const pengertian = row.getValue("pengertian") as string;

        return (
          <div className="max-w-[800px] text-justify">
            <div
              className="text-sm text-muted-foreground prose prose-sm max-w-none [&>*]:my-0 [&>p]:my-1 text-justify"
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
        const pengertian = row.original;

        return (
          <div className="">
            <DialogPopUp
              mode="edit"
              initialData={pengertian}
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
