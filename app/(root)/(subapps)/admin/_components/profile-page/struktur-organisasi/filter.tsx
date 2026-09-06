"use client";

import SearchControl from "@/components/search-control";
import DialogPopUp from "../../profile-page/struktur-organisasi/dialog-popup";
import { StrukturOrganisasi } from "@/types/admin/profile-page/struktur-organisasi/struktur-organisasi";

interface FilterStrukturOrganisasiProps {
  onAdd?: (data: StrukturOrganisasi & { imageFile?: File }) => Promise<void>;
}

export function FilterStrukturOrganisasi({
  onAdd,
}: FilterStrukturOrganisasiProps) {
  const handleAddStrukturOrganisasi = async (
    data: StrukturOrganisasi & { imageFile?: File }
  ) => {
    if (onAdd) {
      await onAdd(data);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full">
          <SearchControl placeholder="Cari Dosen..." className="w-full" />
        </div>
        <DialogPopUp mode="add" onSubmit={handleAddStrukturOrganisasi} />
      </div>
    </>
  );
}
