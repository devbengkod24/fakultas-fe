"use client";

import DialogPopUp from "./dialog-popup";
import { SambutanKaprodi } from "@/types/admin/landing-page/sambutan-kaprodi/sambutan-kaprodi";

interface FilterSambutanKaprodiProps {
  onAdd?: (data: SambutanKaprodi & { imageFile?: File }) => Promise<void>;
  hasData?: boolean;
}

export function FilterSambutanKaprodi({
  onAdd,
  hasData,
}: FilterSambutanKaprodiProps) {
  const handleAddSambutanKaprodi = async (
    data: SambutanKaprodi & { imageFile?: File }
  ) => {
    if (onAdd) {
      await onAdd(data);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {!hasData && (
        <DialogPopUp mode="add" onSubmit={handleAddSambutanKaprodi} />
      )}
    </div>
  );
}
