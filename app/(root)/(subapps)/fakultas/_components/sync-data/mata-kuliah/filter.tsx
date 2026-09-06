"use client";

import SearchControl from "@/components/search-control";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface FilterSyncMataKuliahProps {
  onSync?: () => Promise<void>;
}

export function FilterSyncMataKuliah({ onSync }: FilterSyncMataKuliahProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isSyncingLocal, setIsSyncingLocal] = useState(false);

  const filterTipe = searchParams.get("tipe") || "all";

  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset to page 1 on filter change
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSync = async () => {
    if (!onSync) return;
    setIsSyncingLocal(true);
    try {
      await onSync();
    } finally {
      setIsSyncingLocal(false);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Search */}
      <div className="w-full md:w-80">
        <SearchControl placeholder="Cari kode atau nama..." className="w-full" />
      </div>

      {/* Select filters & Sync button */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
        {/* Filter Tipe Mata Kuliah */}
        <Select
          value={filterTipe}
          onValueChange={(val) => updateQueryParams("tipe", val)}
        >
          <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs font-normal">
            <SelectValue placeholder="Tipe Mata Kuliah" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">Semua Tipe Mata Kuliah</SelectItem>
            <SelectItem value="nasional" className="text-xs">Nasional</SelectItem>
            <SelectItem value="fakultas" className="text-xs">Fakultas</SelectItem>
            <SelectItem value="prodi" className="text-xs">Prodi</SelectItem>
          </SelectContent>
        </Select>

        {/* Sync Action */}
        <Button
          onClick={handleSync}
          variant="default"
          size="sm"
          className="h-9 px-4 font-medium flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-white w-full sm:w-auto ml-auto"
          disabled={isSyncingLocal || isPending}
        >
          <RefreshCcw
            className={`h-3.5 w-3.5 ${isSyncingLocal ? "animate-spin" : ""}`}
          />
          Sync Data
        </Button>
      </div>
    </div>
  );
}
