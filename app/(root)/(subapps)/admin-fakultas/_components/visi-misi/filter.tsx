"use client";

import DialogPopUp from "./dialog-popup";
import { VisiMisi } from "@/types/fakultas/profile-page/visi-misi/visi-misi";

interface FilterVisiMisiProps {
  onAdd: (data: VisiMisi) => Promise<void>;
  hasData?: boolean;
}

export function FilterVisiMisi({ onAdd, hasData }: FilterVisiMisiProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 mb-2 w-full">
      {!hasData && (
        <DialogPopUp 
          mode="add" 
          onSubmit={onAdd} 
        />
      )}
    </div>
  );
}