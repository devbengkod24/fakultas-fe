"use client";

import SearchControl from "@/components/search-control";
import DialogPopUp from "./dialog-popup";
import type { ProdiData } from "@/types/fakultas/manajemen-prodi/manajemen-prodi";

interface FilterProdiProps {
  onAdd: (data: ProdiData) => Promise<void>;
}

export function FilterProdi({ onAdd }: FilterProdiProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-3">
      <SearchControl placeholder="Cari program studi..." className="w-full sm:w-80" />
      <DialogPopUp mode="add" onSubmit={onAdd} />
    </div>
  );
}
