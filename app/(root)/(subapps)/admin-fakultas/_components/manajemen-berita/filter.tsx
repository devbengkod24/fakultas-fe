"use client";

import DialogPopUp from "./dialog-popup";
import type {
  BeritaFormData,
} from "@/types/admin-fakultas/manajemen-berita/berita";
import SearchControl from "@/components/search-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MONTHS = [
  { value: "1", label: "Januari" },
  { value: "2", label: "Februari" },
  { value: "3", label: "Maret" },
  { value: "4", label: "April" },
  { value: "5", label: "Mei" },
  { value: "6", label: "Juni" },
  { value: "7", label: "Juli" },
  { value: "8", label: "Agustus" },
  { value: "9", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => String(currentYear - i));

interface FilterBeritaProps {
  tipeFilter?: string;
  onTipeFilterChange?: (value: string) => void;
  month?: string;
  year?: string;
  onMonthFilterChange?: (value: string) => void;
  onYearFilterChange?: (value: string) => void;
  onAdd?: (data: BeritaFormData & { gambarFile?: File }) => Promise<void>;
}

export function FilterBerita({
  tipeFilter = "all",
  onTipeFilterChange,
  month = "",
  year = "",
  onMonthFilterChange,
  onYearFilterChange,
  onAdd,
}: FilterBeritaProps) {
  const handleAddBerita = async (
    data: BeritaFormData & { gambarFile?: File },
  ) => {
    if (onAdd) {
      await onAdd(data);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between w-full">
      <div className="w-full md:w-80 xl:w-96">
        <SearchControl placeholder="Cari berita..." className="w-full" />
      </div>

      <div className="flex flex-row flex-wrap items-center gap-3 w-full md:w-auto justify-end">
        <Select
          value={month || "all"}
          onValueChange={(value) =>
            onMonthFilterChange?.(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-fit min-w-[110px] h-10 text-sm font-normal shrink-0 gap-2 px-3 border-input bg-background rounded-md shadow-sm">
            <SelectValue placeholder="Bulan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Bulan</SelectItem>
            {MONTHS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={year || "all"}
          onValueChange={(value) =>
            onYearFilterChange?.(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-fit min-w-[100px] h-10 text-sm font-normal shrink-0 gap-2 px-3 border-input bg-background rounded-md shadow-sm">
            <SelectValue placeholder="Tahun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tahun</SelectItem>
            {YEARS.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={tipeFilter}
          onValueChange={(value) => onTipeFilterChange?.(value)}
        >
          <SelectTrigger className="w-fit min-w-[140px] h-10 text-sm font-normal shrink-0 gap-2 px-3 border-input bg-background rounded-md shadow-sm">
            <SelectValue placeholder="Semua Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="prestasi">Prestasi</SelectItem>
            <SelectItem value="kegiatan">Kegiatan</SelectItem>
            <SelectItem value="berita">Berita</SelectItem>
          </SelectContent>
        </Select>

        <DialogPopUp mode="add" onSubmit={handleAddBerita} />
      </div>
    </div>
  );
}
