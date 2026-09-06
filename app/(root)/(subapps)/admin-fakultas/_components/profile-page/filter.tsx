"use client";

import DialogPopUp from "./dialog-popup";
import type { Pengertian } from "@/types/fakultas/profile-page/pengenalan/pengenalan";

interface FilterProps {
  onAdd: (data: Pengertian) => Promise<void>;
  hasData?: boolean;
}

const Filter = ({ onAdd, hasData }: FilterProps) => {
  const handleAdd = async (data: Pengertian) => {
    try {
      await onAdd(data);
    } catch (error) {
      console.error("Error adding pengertian:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {!hasData && <DialogPopUp mode="add" onSubmit={handleAdd} />}
    </div>
  );
};

export default Filter;
