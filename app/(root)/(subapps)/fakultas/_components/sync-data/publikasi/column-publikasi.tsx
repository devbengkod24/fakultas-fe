import { ColumnDef } from "@tanstack/react-table";
import { PublikasiSync } from "./mock-data";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

const badgeStyle = (akreditasi: string) => {
  if (akreditasi.startsWith("Sinta")) return "bg-blue-500 hover:bg-blue-600 text-white border-transparent";
  if (akreditasi === "GARUDA") return "border-gray-200 bg-gray-50 text-gray-700";
  if (akreditasi === "SCOPUS") return "bg-[#1e7fd9] hover:bg-[#1063b9] text-white border-transparent";
  return "border-gray-200 bg-gray-50 text-gray-700";
};

export const ColumnsPublikasi = (
  currentPage: number,
  perPage: number,
): ColumnDef<PublikasiSync>[] => {
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
      header: "Judul Publikasi",
      cell: ({ row }) => (
        <div className="font-medium text-sm text-gray-900 max-w-[280px] truncate">
          {row.original.judul}
        </div>
      ),
    },
    {
      accessorKey: "jurnal",
      header: "Jurnal",
      cell: ({ row }) => (
        <div className="text-sm text-gray-700 max-w-[220px] truncate">
          {row.original.jurnal}
        </div>
      ),
    },
    {
      accessorKey: "penulis",
      header: "Penulis",
      cell: ({ row }) => (
        <div className="text-sm text-gray-700 max-w-[200px] truncate">
          {row.original.penulis}
        </div>
      ),
    },
    {
      accessorKey: "tahun",
      header: "Tahun",
      cell: ({ row }) => <span className="text-sm text-gray-700">{row.original.tahun}</span>,
    },
    {
      accessorKey: "sitasi",
      header: "Sitasi",
      cell: ({ row }) => <span className="text-sm text-gray-700">{row.original.sitasi}</span>,
    },
    {
      accessorKey: "akreditasi",
      header: "Akreditasi",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          {row.original.akreditasi.map((a) => (
            <Badge key={a} variant="outline" className={badgeStyle(a)}>
              {a}
            </Badge>
          ))}
        </div>
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