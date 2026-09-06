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
import { MataKuliahItem } from "@/types/admin/akademik-page/daftar-mata-kuliah/daftar-mata-kuliah";
import { X } from "lucide-react";

export function FilterDaftarMataKuliah({
  onAdd,
  hideFilter = false,
}: {
  onAdd?: (data: MataKuliahItem) => Promise<void>;
  hideFilter?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSemester, setSelectedSemester] = useState(
    searchParams.get("semester") || ""
  );

  const handleSemesterChange = (value: string) => {
    setSelectedSemester(value);
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      params.set("semester", value);
    } else {
      params.delete("semester");
    }

    params.set("page", "1"); // Reset to page 1 when filtering
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedSemester("");
    const params = new URLSearchParams();
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const hasActiveFilters = selectedSemester && selectedSemester !== "all";

  const handleAddMataKuliah = async (data: MataKuliahItem) => {
    try {
      if (onAdd) {
        await onAdd(data);
      }
    } catch (error) {
      console.error("Error adding mata-kuliah:", error);
    }
  };

  return (
    <div className="space-y-4">
      {hideFilter ? (
        <div className="flex justify-end">
          <DialogPopUp mode="add" onSubmit={handleAddMataKuliah} />
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-2">
            <Select
              value={selectedSemester}
              onValueChange={handleSemesterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Semester</SelectItem>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <SelectItem key={sem} value={sem.toString()}>
                    Semester {sem}
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
      )}

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">
            <span>Semester: {selectedSemester}</span>
            <button
              onClick={() => {
                setSelectedSemester("");
                const params = new URLSearchParams(searchParams.toString());
                params.delete("semester");
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
