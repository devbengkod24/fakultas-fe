/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { ManajemenDosen } from "@/types/bimbingan-karir/koordinator/manajemen-dosen/manajemen";
import { ColumnDef } from "@tanstack/react-table";
import DeletePengajarButton from "./delete";
import { KeyedMutator } from "swr";

export const Columns = (
  currentPage: number, 
  perPage: number, 
  mutate: KeyedMutator<any>
): ColumnDef<ManajemenDosen>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div>{number}</div>;
      },
    },
    {
      accessorKey: "name",
      header: "Nama",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "aksi",
      header: "Aksi",
      cell: ({ row }) => {
        return (
          <DeletePengajarButton 
            id={row.original.id} 
            name={row.original.name}
            mutate={mutate}
          />
        );
      },
    }
  ];
};
