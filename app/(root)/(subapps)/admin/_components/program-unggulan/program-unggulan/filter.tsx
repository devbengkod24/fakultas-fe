"use client";

import DialogPopUp from "../program-unggulan/dialog-popup";
import { ProgramUnggulan } from "@/types/admin/program-unggulan/program-unggulan/program-unggulan";

interface FilterProgramUnggulanProps {
  onAdd?: (data: ProgramUnggulan & { imageFile?: File }) => Promise<void>;
}

export function FilterProgramUnggulan({ onAdd }: FilterProgramUnggulanProps) {
  const handleAddProgramUnggulan = async (
    data: ProgramUnggulan & { imageFile?: File }
  ) => {
    if (onAdd) {
      await onAdd(data);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <DialogPopUp mode="add" onSubmit={handleAddProgramUnggulan} />
      </div>
    </>
  );
}
