/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import SearchControl from "@/components/search-control"
import AddDosenButton from "./add"
import { KeyedMutator } from "swr"

interface FilterManajemenDosenProps {
  mutate: KeyedMutator<any>
}

export function FilterManajemenDosen({ mutate }: FilterManajemenDosenProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex gap-2 w-full items-center">
          <SearchControl placeholder="Cari NIM atau Mahasiswa..." className="w-full md:w-80 xl:w-80" />
        </div>
        <div className="flex items-center gap-2">
          <AddDosenButton mutate={mutate} />
        </div>
      </div>
    </>
  )
}
