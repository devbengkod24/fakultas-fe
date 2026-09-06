"use client";

import DialogPopUp from "../../profile-page/akreditasi/dialog-popup";
import { Akreditasi } from "@/types/admin/profile-page/akreditasi/akreditasi";

interface FilterAkreditasiProps {
  onAdd?: (data: Akreditasi & { imageFile?: File }) => Promise<void>;
}

export function FilterAkreditasi({ onAdd }: FilterAkreditasiProps) {
  const handleAddAkreditasi = async (
    data: Akreditasi & { imageFile?: File }
  ) => {
    if (onAdd) {
      await onAdd(data);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <DialogPopUp mode="add" onSubmit={handleAddAkreditasi} />
      </div>
    </>
  );
}
