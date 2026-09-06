"use client";

import DialogPopUp from "./dialog-popup";
import { PeminatanItem } from "@/types/admin/akademik-page/peminatan/peminatan";

export function FilterDaftarPeminatan({
  onAdd,
}: {
  onAdd?: (data: PeminatanItem) => Promise<void>;
}) {
  const handleAddPeminatan = async (data: PeminatanItem) => {
    try {
      if (onAdd) {
        await onAdd(data);
      }
    } catch (error) {
      console.error("Error adding peminatan:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <DialogPopUp mode="add" onSubmit={handleAddPeminatan} />
      </div>
    </div>
  );
}
