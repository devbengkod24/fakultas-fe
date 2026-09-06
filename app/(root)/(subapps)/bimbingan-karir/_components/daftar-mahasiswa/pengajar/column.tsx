import { Badge } from "@/components/ui/badge";
import { DaftarMahasiswa, Minat } from "@/types/bimbingan-karir/koordinator/daftar-mahasiswa/daftar-mahasiswa"
import { ColumnDef } from "@tanstack/react-table"

// Fungsi untuk generate warna badge berdasarkan urutan minat
const getMinatBadgeColor = (minat: string, minatList: Minat[]): string => {
  if (!minat || minat === "Belum Dipilih") {
    return "border-transparent bg-red-100 text-red-600 border-red-200";
  }

  // Array warna yang tersedia (Tailwind classes)
  const colors = [
    "border-transparent bg-green-100 text-green-600 border border-green-400/60",
    "border-transparent bg-orange-100 text-orange-600 border-orange-200",
    "border-transparent bg-primary-100 shadow-none text-primary border-primary-200",
    "border-transparent bg-yellow-100 text-yellow-600 border-yellow-300",
    "bg-pink-100 text-pink-600 border-pink-200",
    "bg-indigo-100 text-indigo-600 border-indigo-200",
    "bg-cyan-100 text-cyan-600 border-cyan-200",
    "bg-teal-100 text-teal-600 border-teal-200",
    "bg-lime-100 text-lime-600 border-lime-200",
    "bg-amber-100 text-amber-600 border-amber-200",
    "bg-yellow-100 text-yellow-600 border-yellow-200",
    "bg-sky-100 text-sky-600 border-sky-200",
    "bg-violet-100 text-violet-600 border-violet-200",
    "bg-fuchsia-100 text-fuchsia-600 border-fuchsia-200",
    "bg-rose-100 text-rose-600 border-rose-200",
    "bg-emerald-100 text-emerald-600 border-emerald-200",
    "bg-slate-100 text-slate-600 border-slate-200",
  ];

  // Cari index minat di minatList
  const minatIndex = minatList.findIndex((m) => m.nama_minat === minat);
  
  // Jika ditemukan, gunakan index tersebut (modulo jika lebih dari jumlah warna)
  if (minatIndex !== -1) {
    return colors[minatIndex % colors.length];
  }
  
  // Default jika tidak ditemukan
  return colors[0];
};

export const Columns = (
  currentPage: number, 
  perPage: number,
  minatList: Minat[],
): ColumnDef<DaftarMahasiswa>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div>{number}</div>;
      },
    },
    {
      id: "mahasiswa",
      header: "Mahasiswa",
      cell: ({ row }) => {
        const nim = row.original.nim;
        const nama = row.original.nama;
        return (
          <div className="flex flex-col">
            <span className="font-semibold">{nama}</span>
            <span className="text-sm text-gray-500">{nim}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "minat",
      header: "Minat",
      cell: ({ row }) => {
        const minat = row.original.minat;
        const colorClass = getMinatBadgeColor(minat, minatList);
        
        return (
          <Badge 
            variant="outline" 
            className={`border ${colorClass}`}
          >
            {minat}
          </Badge>
        );
      },
    },
  ]
}