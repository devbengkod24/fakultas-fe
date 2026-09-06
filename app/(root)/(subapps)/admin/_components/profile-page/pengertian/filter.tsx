"use client";

import DialogPopUp from "../../profile-page/pengertian/dialog-popup";
import { Pengertian } from "@/types/admin/profile-page/pengertian/pengertian";

interface FilterPengertianProps {
  onAdd: (data: Pengertian) => Promise<void>;
  hasData?: boolean;
}

export function FilterPengertian({ onAdd, hasData }: FilterPengertianProps) {
  const handleAddPengertian = async (data: Pengertian) => {
    try {
      await onAdd(data);
    } catch (error) {
      console.error("Error adding pengertian:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {!hasData && <DialogPopUp mode="add" onSubmit={handleAddPengertian} />}
    </div>
  );
}
