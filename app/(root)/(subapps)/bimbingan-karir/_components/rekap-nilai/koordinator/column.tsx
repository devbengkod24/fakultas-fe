"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RekapTables } from "@/types/bimbingan-karir/koordinator/rekap-nilai/rekap-nilai";
import { StudentDetailAction } from "./details";
import { Kategori } from "@/api/bimbingan-karir/koordinator/kategori/kategori";

export const Columns = (currentPage: number, perPage: number, categories: Kategori[] = []): ColumnDef<RekapTables>[] => {
  const generatedColumns: ColumnDef<RekapTables>[] = categories.map((kat) => ({
    accessorKey: kat.kode,
    header: kat.nama,
  }));

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
    ...generatedColumns,
    {
      accessorKey: "nilai_akhir",
      header: "Nilai Akhir",
    },
    {
      id: "action",
      header: "Aksi",
      cell: ({ row }) => {
        const id = row.original.id;
        return <StudentDetailAction studentId={id} />;
      },
    },
  ]
}
