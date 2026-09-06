import { ColumnDef } from "@tanstack/react-table";
import { PenelitianSync } from "./mock-data";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

const fundingBadge = (sumber: string) => {
  if (sumber === "INTERNAL_SOURCE") return "bg-[#1e7fd9] hover:bg-[#1063b9] text-white border-transparent";
  if (sumber === "BIMA_SOURCE") return "bg-[#00a651] hover:bg-[#008a44] text-white border-transparent";
  if (sumber === "SIMLITABMAS") return "bg-[#eb8b15] hover:bg-[#d0670f] text-white border-transparent";
  return "border-gray-200 bg-gray-50 text-gray-700";
};

export const ColumnsPenelitian = (
  currentPage: number,
  perPage: number,
): ColumnDef<PenelitianSync>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div className="text-sm text-gray-700 font-medium">{number}</div>;
      },
    },
    {
      accessorKey: "judul",
      header: "Judul Penelitian",
      cell: ({ row }) => (
        <div className="font-medium text-sm text-gray-900 max-w-[300px] truncate">
          {row.original.judul}
        </div>
      ),
    },
    {
      accessorKey: "ketua",
      header: "Ketua Peneliti",
      cell: ({ row }) => (
        <div className="text-sm text-gray-700 max-w-[200px] truncate">
          {row.original.ketua}
        </div>
      ),
    },
    {
      accessorKey: "tahun",
      header: "Tahun",
      cell: ({ row }) => <span className="text-sm text-gray-700">{row.original.tahun}</span>,
    },
    {
      accessorKey: "sumber_dana",
      header: "Sumber Dana",
      cell: ({ row }) => (
        <Badge variant="outline" className={fundingBadge(row.original.sumber_dana)}>
          {row.original.sumber_dana.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="bg-[#e2eefc] text-[#0655a7] border-[#bfdbf8] hover:bg-[#e2eefc]"
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      header: "Aksi",
      cell: () => (
        <button
          type="button"
          className="text-gray-500 hover:text-primary transition-colors"
          title="Lihat detail (belum tersedia)"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];
};