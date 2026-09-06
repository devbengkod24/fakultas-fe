"use client";

import DialogPopUp from "../visi-misi/dialog-popup";
import { VisiMisi } from "@/types/admin/profile-page/visi-misi/visi-misi";

interface FilterVisiMisiProps {
  onAdd: (data: VisiMisi) => Promise<void>;
  hasData?: boolean;
}

export function FilterVisiMisi({ onAdd, hasData }: FilterVisiMisiProps) {
  const handleAddVisiMisi = async (data: VisiMisi) => {
    try {
      await onAdd(data);
    } catch (error) {
      console.error("Error adding visi-misi:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        {!hasData && <DialogPopUp mode="add" onSubmit={handleAddVisiMisi} />}
      </div>
    </>
  );
}
