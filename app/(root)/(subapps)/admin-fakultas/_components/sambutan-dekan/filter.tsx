"use client";

import DialogPopUp from "./dialog-popup";
// Import type baru yang sudah kamu buat
import { SambutanDekan } from "@/types/admin-fakultas/sambutan-dekan/sambutan-dekan";

interface FilterSambutanDekanProps {
  onAdd?: (data: SambutanDekan & { imageFile?: File }) => Promise<void>;
  hasData?: boolean;
}

export function FilterSambutanDekan({
  onAdd,
  hasData,
}: FilterSambutanDekanProps) {
  const handleAddSambutanDekan = async (
    data: SambutanDekan & { imageFile?: File },
  ) => {
    if (onAdd) {
      await onAdd(data);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {!hasData && <DialogPopUp mode="add" onSubmit={handleAddSambutanDekan} />}
    </div>
  );
}
