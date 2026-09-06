import { ColumnDef } from "@tanstack/react-table";
import { MataKuliahSync } from "@/types/fakultas/sync-data/mata-kuliah";
import { Badge } from "@/components/ui/badge";

export const Columns = (
  currentPage: number,
  perPage: number,
): ColumnDef<MataKuliahSync>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div className="text-sm text-gray-700 font-medium">{number}</div>;
      },
    },
    {
      accessorKey: "kode",
      header: "Kode",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-gray-900 bg-gray-50 px-2 py-1 rounded border border-gray-100">
          {row.original.kode}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Nama Mata Kuliah",
      cell: ({ row }) => (
        <div className="font-medium text-sm text-gray-900 max-w-[300px] truncate">
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "sks",
      header: "SKS",
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">{row.original.sks} SKS</span>
      ),
    },
    {
      accessorKey: "semester_ditawarkan",
      header: "Semester Ditawarkan",
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">Semester {row.original.semester_ditawarkan}</span>
      ),
    },
    {
      accessorKey: "tipe_mk",
      header: "Tipe Mata Kuliah",
      cell: ({ row }) => {
        const tipe = row.original.tipe_mk;
        
        let badgeStyle = "border-gray-200 bg-gray-50 text-gray-700";
        if (tipe === "nasional") {
          badgeStyle = "border-red-200 bg-red-50 text-red-700";
        } else if (tipe === "fakultas") {
          badgeStyle = "border-blue-200 bg-blue-50 text-blue-700";
        } else if (tipe === "prodi") {
          badgeStyle = "border-green-200 bg-green-50 text-green-700";
        }

        // Capitalize first letter for display
        const displayLabel = tipe.charAt(0).toUpperCase() + tipe.slice(1);

        return (
          <Badge variant="outline" className={badgeStyle}>
            {displayLabel}
          </Badge>
        );
      },
    },
    {
      accessorKey: "prodi_id",
      header: "Program Studi",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <span className="text-sm text-gray-700">
            {item.prodi?.nama || `Prodi ID: ${item.prodi_id}`}
          </span>
        );
      },
    },
  ];
};
