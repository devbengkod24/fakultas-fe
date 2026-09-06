"use client";

import DialogPopUp from "./dialog-popup";
import { FasilitasFakultas } from "@/types/admin-fakultas/fasilitas/fasilitas";
import SearchControl from "@/components/search-control";

interface FilterFasilitasProps {
  onAdd?: (data: FasilitasFakultas & { imageFile?: File }) => Promise<void>;
}

export function FilterFasilitas({
  onAdd,
}: FilterFasilitasProps) {
  const handleAddFasilitas = async (
    data: FasilitasFakultas & { imageFile?: File },
  ) => {
    if (onAdd) {
      await onAdd(data);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between w-full">
      <div className="w-full md:w-80">
        <SearchControl placeholder="Cari Fasilitas..." className="w-full" />
      </div>
      <DialogPopUp mode="add" onSubmit={handleAddFasilitas} />
    </div>
  );
}
