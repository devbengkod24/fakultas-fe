"use client";

import { LayoutGrid, List, PlusCircle, Filter } from "lucide-react";
import SearchControl from "@/components/search-control";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface FilterTambahPengumumanProps {
  viewMode: "card" | "table";
  onViewChange: (view: "card" | "table") => void;
  onAdd: () => void;
}

export function FilterTambahPengumuman({
  viewMode,
  onViewChange,
  onAdd,
}: FilterTambahPengumumanProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentStatus = searchParams.get("status") || "all";
  const currentpopup = searchParams.get("popup") || "all";

  const currentSearch = searchParams.get("search") || "";

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col lg:flex-row gap-3 items-center w-full">
        {/* Search Bar */}
        <div className="w-full lg:flex-1">
          <SearchControl
            key={`tambah-search-${currentSearch || "empty"}`}
            placeholder="Cari judul pengumuman..."
            className="w-full h-10 shadow-sm"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Filter Status Aktif */}
          <Select value={currentStatus} onValueChange={(v) => updateQuery("status", v)}>
            <SelectTrigger className="h-10 w-[140px] bg-background shadow-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="published">Dipublikasi</SelectItem>
              <SelectItem value="archived">Diarsipkan</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter Status Pop-up */}
          <Select value={currentpopup} onValueChange={(v) => updateQuery("popup", v)}>
            <SelectTrigger className="h-10 w-[150px] bg-background shadow-sm">
              <SelectValue placeholder="Mode Pop-up" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Mode</SelectItem>
              <SelectItem value="popup">Pop-up Aktif</SelectItem>
              <SelectItem value="no-popup">Pop-up Mati</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-lg border border-border h-10 shadow-sm bg-background">
            <button
              onClick={() => onViewChange("card")}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-md transition-all",
                viewMode === "card"
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => onViewChange("table")}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-md transition-all",
                viewMode === "table"
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <List className="size-4" />
            </button>
          </div>

          <Button
            onClick={onAdd}
            className="h-10 px-5 bg-primary hover:bg-primary/90 text-white shadow-md font-semibold shrink-0"
          >
            <PlusCircle className="size-4 mr-2" />
            Buat Pengumuman
          </Button>
        </div>
      </div>
    </div>
  );
}