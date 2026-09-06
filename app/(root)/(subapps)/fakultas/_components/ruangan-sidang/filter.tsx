"use client";

import DialogPopUp from "./dialog-popup";
import type { RuanganSidangFormData } from "@/types/fakultas/ruangan-sidang/ruangan-sidang";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterRuanganSidangProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
  onAdd?: (data: RuanganSidangFormData) => Promise<void>;
}

export function FilterRuanganSidang({
  searchValue = "",
  onSearchChange,
  statusFilter = "all",
  onStatusFilterChange,
  onAdd,
}: FilterRuanganSidangProps) {
  const handleAddRuangan = async (data: RuanganSidangFormData) => {
    if (onAdd) {
      await onAdd(data);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between w-full">

      <div className="w-full md:w-80 xl:w-96">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari ruangan..."
            className="pl-10 w-full h-10"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-row items-center gap-3 w-full md:w-auto justify-end">
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusFilterChange?.(value)}
        >
          <SelectTrigger className="w-fit min-w-[140px] h-10 text-sm font-normal shrink-0 gap-2 px-3 border-input bg-background rounded-md shadow-sm">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="aktif">Aktif</SelectItem>
            <SelectItem value="nonaktif">Nonaktif</SelectItem>
          </SelectContent>
        </Select>

        <DialogPopUp mode="add" onSubmit={handleAddRuangan} />
      </div>

    </div>
  );
}