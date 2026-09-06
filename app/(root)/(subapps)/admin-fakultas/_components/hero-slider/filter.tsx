"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import DialogPopUp from "./dialog-popup";
import type { HeroSlider } from "@/types/admin-fakultas/hero-slider/hero-slider";
import SearchControl from "@/components/search-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterHeroSliderProps {
  onAdd?: (data: HeroSlider & { imageFile?: File }) => Promise<void>;
}

export function FilterHeroSlider({ onAdd }: FilterHeroSliderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "all";

  const handleAddHeroSlider = async (
    data: HeroSlider & { imageFile?: File },
  ) => {
    if (onAdd) {
      await onAdd(data);
    }
  };

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between w-full">
      <div className="w-full md:w-80">
        <SearchControl placeholder="Cari Hero Slider..." className="w-full" />
      </div>

      <div className="flex flex-row items-center gap-3 w-full md:w-auto justify-end">
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-fit min-w-[140px] h-10 text-sm font-normal shrink-0 gap-2 px-3 border-input bg-background rounded-md shadow-sm">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Nonaktif</SelectItem>
          </SelectContent>
        </Select>

        <DialogPopUp mode="add" onSubmit={handleAddHeroSlider} />
      </div>
    </div>
  );
}
