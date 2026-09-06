"use client";

import { SearchInput } from "@/components/search-input";

interface FilterAllDaftarNilaiProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function FilterAllDaftarNilai({
  searchTerm,
  setSearchTerm,
}: FilterAllDaftarNilaiProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <SearchInput
          placeholder="Cari berdasarkan Nama Kegiatan..."
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value);
          }}
        />
      </div>
    </>
  );
}
