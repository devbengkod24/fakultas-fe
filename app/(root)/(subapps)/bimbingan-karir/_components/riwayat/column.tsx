"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Riwayat } from "@/types/bimbingan-karir/koordinator/riwayat/riwayat";
import { StudentDetailAction } from "./details";

export const Columns = (currentPage: number, perPage: number,): ColumnDef<Riwayat>[] => {
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
      accessorKey: "seminar",
      header: "Seminar",
    },
    {
      accessorKey: "toefl",
      header: "TOEFL",
    },
    {
      accessorKey: "lsp",
      header: "Sertifikasi LSP",
    },
    {
      accessorKey: "workshop",
      header: "Workshop",
    },
    {
      accessorKey: "softskill",
      header: "Softskill",
    },
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