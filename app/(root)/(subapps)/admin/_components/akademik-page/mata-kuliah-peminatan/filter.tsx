"use client";

import DialogPopUp from "./dialog-popup";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import * as React from "react";
import {
  MataKuliahPeminatanItem,
  Peminatan,
} from "@/types/admin/akademik-page/mata-kuliah-peminatan/mata-kuliah-peminatan";
import { X } from "lucide-react";
import { PeminatanSuperAdminService } from "@/api/superadmin";
import useSWR from "swr";

const fetcherPeminatan = () =>
  PeminatanSuperAdminService.getPeminatan().then(
    (res: { data?: Peminatan[] }) => {
      if (res.data) {
        return {
          data: Array.isArray(res.data) ? res.data : [],
        };
      }
      return { data: [] };
    }
  );

export function FilterDaftarMataKuliahPeminatan({
  onAdd,
  hideFilter = false,
}: {
  onAdd?: (data: MataKuliahPeminatanItem) => Promise<void>;
  hideFilter?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPeminatan, setSelectedPeminatan] = useState(
    searchParams.get("peminatan") || ""
  );

  const { data: peminatanResponse } = useSWR<{
    data: Peminatan[];
  }>("peminatan-options", fetcherPeminatan, { revalidateOnFocus: false });

  const peminatanOptions = peminatanResponse?.data || [];

  const handlePeminatanChange = (value: string) => {
    setSelectedPeminatan(value);
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      params.set("peminatan", value);
    } else {
      params.delete("peminatan");
    }

    params.set("page", "1"); // Reset to page 1 when filtering
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedPeminatan("");
    const params = new URLSearchParams();
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const hasActiveFilters = selectedPeminatan && selectedPeminatan !== "all";

  const handleAddMataKuliah = async (data: MataKuliahPeminatanItem) => {
    try {
      if (onAdd) {
        await onAdd(data);
      }
    } catch (error) {
      console.error("Error adding mata-kuliah-peminatan:", error);
    }
  };

  // If hideFilter is true, only show the add button
  if (hideFilter) {
    return (
      <div className="flex justify-end">
        <DialogPopUp mode="add" onSubmit={handleAddMataKuliah} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2">
          <Select
            value={selectedPeminatan}
            onValueChange={handlePeminatanChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Peminatan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Peminatan</SelectItem>
              {peminatanOptions.map((option) => (
                <SelectItem key={option.id} value={option.peminatan}>
                  {option.peminatan}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="icon"
              onClick={clearFilters}
              title="Clear filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <DialogPopUp mode="add" onSubmit={handleAddMataKuliah} />
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">
            <span>Peminatan: {selectedPeminatan}</span>
            <button
              onClick={() => {
                setSelectedPeminatan("");
                const params = new URLSearchParams(searchParams.toString());
                params.delete("peminatan");
                params.set("page", "1");
                router.push(`?${params.toString()}`);
              }}
              className="ml-1 hover:bg-green-200 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
