import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import DetailDialog from "./detail-dialog";
import { Research } from "@/types/admin/publikasi-page/riset-ilmiah/riset-ilmiah";
import { Badge } from "@/components/ui/badge";

export const Columns = (
  currentPage: number,
  perPage: number
): ColumnDef<Research>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div>{number}</div>;
      },
    },
    {
      accessorKey: "title",
      header: "Judul Riset",
      cell: ({ row }) => {
        const title = row.getValue("title") as string;
        return (
          <div className="max-w-[300px]">
            <p className="truncate text-sm font-medium" title={title}>
              {title}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "leader_name",
      header: "Ketua Peneliti",
      cell: ({ row }) => {
        const leader_name = row.getValue("leader_name") as string;
        return (
          <div className="max-w-[200px]">
            <p className="truncate text-sm" title={leader_name}>
              {leader_name === "Unknown" ? "-" : leader_name}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "jenis_penelitian",
      header: "Jenis Penelitian",
      cell: ({ row }) => {
        const jenis = row.getValue("jenis_penelitian") as string;
        return (
          <div className="max-w-[200px]">
            <Badge variant="outline" className="text-xs">
              {jenis}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "year",
      header: "Tahun",
    },
    {
      accessorKey: "dana_penelitian",
      header: "Dana Penelitian",
      cell: ({ row }) => (
        <Badge variant="primary" className="text-xs">
          Rp. {Number(row.original.dana_penelitian).toLocaleString("id-ID")}
        </Badge>
      ),
    },
    {
      accessorKey: "status_penelitian",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status_penelitian === "Approved"
              ? "primary"
              : row.original.status_penelitian === "Selesai"
              ? "primary"
              : "secondary"
          }
          className="text-xs"
        >
          {row.original.status_penelitian}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      enableHiding: false,
      cell: ({ row }) => {
        const riset = row.original;

        return (
          <div className="flex items-center gap-1">
            <DetailDialog
              riset={riset}
              trigger={
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              }
            />
          </div>
        );
      },
    },
  ];
};
