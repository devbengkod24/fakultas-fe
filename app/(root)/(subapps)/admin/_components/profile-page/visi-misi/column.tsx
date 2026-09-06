import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import DialogPopUp from "../visi-misi/dialog-popup";
import { VisiMisi } from "@/types/admin/profile-page/visi-misi/visi-misi";
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
        return <div>{number}</div>;
      },
    },
    {
      accessorKey: "visi",
      header: "Visi Program Studi",
      cell: ({ row }) => {
        const visi = row.getValue("visi") as string;

        return (
          <div className="max-w-[300px]">
            <div
              className="text-sm text-muted-foreground prose prose-sm max-w-none [&>*]:my-0 [&>p]:my-1 text-justify"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(visi) }}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "misi",
      header: "Misi Program Studi",
      cell: ({ row }) => {
        const misi = row.getValue("misi") as string;

        return (
          <div className="max-w-[300px]">
            <div
              className="text-sm text-muted-foreground prose prose-sm max-w-none [&>*]:my-0 [&>p]:my-1 text-justify"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(misi) }}
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
          <div className="">
            <DialogPopUp
              mode="edit"
              initialData={visimisi}
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
