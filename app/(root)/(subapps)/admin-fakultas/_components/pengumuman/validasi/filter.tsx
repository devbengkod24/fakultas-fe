"use client";

import { LayoutGrid, List } from "lucide-react";
import SearchControl from "@/components/search-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TYPE_OPTIONS, STATUS_OPTIONS } from "./data";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { ManajemenProdiSuperAdminService } from "@/api/superadmin";

interface FilterPengumumanProps {
  filterProdi: string;
  filterType: string;
  filterStatus: string;
  viewMode: "card" | "table";
  onUpdateQuery: (updates: Record<string, string>) => void;
}

export function FilterPengumuman({
  filterProdi,
  filterType,
  filterStatus,
  viewMode,
  onUpdateQuery,
}: FilterPengumumanProps) {
  const searchParams = useSearchParams();
  // Fetch data prodi dinamis
  const { data: prodiData } = useSWR("prodi-list", () =>
    ManajemenProdiSuperAdminService.getAll(1, 50)
  );

  // Deteksi struktur data (handle paginated response)
  const rawProdis = Array.isArray(prodiData) 
    ? prodiData 
    : (Array.isArray(prodiData?.data) 
        ? prodiData.data 
        : (Array.isArray(prodiData?.data?.data) ? prodiData.data.data : []));

  const PRODI_OPTIONS = [
    { label: "Semua Prodi", value: "all" },
    ...rawProdis.map((p: any) => ({
      label: p.nama || p.name || "Unknown",
      value: p.id.toString(), // Gunakan ID sebagai value filter
    })),
  ];

  const currentSearch = searchParams.get("search") || "";

  return (
    <div className="flex flex-col xl:flex-row gap-3 items-center w-full">
      {/* Search Bar */}
      <div className="w-full xl:flex-1">
        <SearchControl
          key={`validasi-search-${currentSearch || "empty"}`}
          placeholder="Cari Pengumuman..."
          className="w-full"
          onChange={(val) => onUpdateQuery({ search: val })}
        />
      </div>

      {/* Filters & Toggle Row - Added p-1 to prevent border clipping during scroll */}
      <div className="w-full xl:w-auto overflow-x-auto no-scrollbar p-1 -m-1">
        <div className="flex items-center gap-2 min-w-max">
          {/* Prodi Filter */}
          <Select value={filterProdi} onValueChange={(val) => onUpdateQuery({ prodi: val })}>
            <SelectTrigger className="w-fit min-w-[140px] h-10 text-sm font-normal shrink-0 gap-2 px-3 border-input bg-background rounded-md shadow-sm">
              <SelectValue placeholder="Pilih Prodi" />
            </SelectTrigger>
            <SelectContent>
              {PRODI_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-sm">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Tipe Filter */}
          <Select value={filterType} onValueChange={(val) => onUpdateQuery({ type: val })}>
            <SelectTrigger className="w-fit min-w-[140px] h-10 text-sm font-normal shrink-0 gap-2 px-3 border-input bg-background rounded-md shadow-sm">
              <SelectValue placeholder="Pilih Tipe" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-sm">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={filterStatus} onValueChange={(val) => onUpdateQuery({ status: val })}>
            <SelectTrigger className="w-fit min-w-[130px] h-10 text-sm font-normal shrink-0 gap-2 px-3 border-input bg-background rounded-md shadow-sm">
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-sm">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Toggle View */}
          <div className="flex items-center p-1 rounded-lg border border-border ml-1 h-10 shadow-inner">
            <button
              onClick={() => onUpdateQuery({ view: "card" })}
              title="Card View"
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-md transition-all",
                viewMode === "card" 
                  ? "bg-primary text-white shadow-md" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => onUpdateQuery({ view: "table" })}
              title="Table View"
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-md transition-all",
                viewMode === "table" 
                  ? "bg-primary text-white shadow-md" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
