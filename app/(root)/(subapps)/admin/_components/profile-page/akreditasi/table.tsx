"use client";

import { DataTable } from "@/components/data-table";
import { Columns } from "../../profile-page/akreditasi/column";
import { useState } from "react";
import { Akreditasi } from "@/types/admin/profile-page/akreditasi/akreditasi";
import { FilterAkreditasi } from "./filter";
import { handleToastResponse } from "@/lib/toast-response";
import useSWR, { mutate } from "swr";
import { AkreditasiSuperAdminService } from "@/api/superadmin";
import EmptyState from "@/components/empty-state";
import { Award } from "lucide-react";
import DialogPopUp from "../../profile-page/akreditasi/dialog-popup";
import { useProfile } from "@/context/profileUseContext";

const fetcherAkreditasi = (prodiId?: number) =>
  AkreditasiSuperAdminService.getAllAkreditasi(prodiId).then(
    (res) => res.data || res
  );

export function DataAkreditasi() {
  const { activeProdiId } = useProfile();
  const prodiId = activeProdiId;
  const [currentPage] = useState(1);
  const [perPage] = useState(10);

  const { data, error, isLoading } = useSWR<Akreditasi[]>(
    ["akreditasi", prodiId],
    () => fetcherAkreditasi(prodiId ?? undefined),
    { revalidateOnFocus: false }
  );

  const handleEdit = async (
    akreditasiData: Akreditasi & { imageFile?: File }
  ) => {
    if (!akreditasiData.id) {
      handleToastResponse({
        success: false,
        message: "ID Akreditasi tidak ditemukan",
      });
      return;
    }

    const updateData = {
      title: akreditasiData.title,
      description: akreditasiData.description,
      accred: akreditasiData.accred,
      imageFile: akreditasiData.imageFile,
    };

    let res;
    try {
      res = await AkreditasiSuperAdminService.updateAkreditasi(
        akreditasiData.id,
        updateData
      );

      // Revalidate data
      mutate(["akreditasi", prodiId]);

      handleToastResponse(res);
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal memperbarui Akreditasi Program Studi",
      });
      console.error(error);
    }
  };

  const handleAdd = async (
    akreditasiData: Akreditasi & { imageFile?: File }
  ) => {
    let res;
    try {
      res = await AkreditasiSuperAdminService.createAkreditasi({
        title: akreditasiData.title,
        description: akreditasiData.description,
        accred: akreditasiData.accred,
        imageFile: akreditasiData.imageFile,
        prodi_id: prodiId,
      });

      // Revalidate data
      mutate(["akreditasi", prodiId]);

      handleToastResponse(res);
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal menambahkan Akreditasi Program Studi",
      });
      console.error(error);
    }
  };

  const handleDelete = async (id: number | string) => {
    const numericId = typeof id === "string" ? parseInt(id, 10) : id;

    if (isNaN(numericId)) {
      handleToastResponse({
        success: false,
        message: "ID Akreditasi tidak valid",
      });
      return;
    }

    let res;
    try {
      res = await AkreditasiSuperAdminService.deleteAkreditasi(numericId);

      // Revalidate data
      mutate(["akreditasi", prodiId]);

      handleToastResponse(res);
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal menghapus Akreditasi Program Studi",
      });
      console.error(error);
    }
  };

  const columns = Columns(currentPage, perPage, handleEdit, handleDelete);

  if (error) {
    return (
      <div className="flex justify-center items-center h-32 text-red-500">
        <div>Error loading data</div>
      </div>
    );
  }

  // Display all data
  const displayData = data || [];
  const hasData = displayData.length > 0;

  // Show empty state if no data
  if (!isLoading && !error && !hasData) {
    return (
      <div>
        <div className="w-full flex flex-col gap-3">
          <EmptyState
            icon={Award}
            title="Belum Ada Data Akreditasi"
            subtitle="Belum ada data akreditasi program studi yang tersedia. Silakan tambah data akreditasi terlebih dahulu."
            button={<DialogPopUp mode="add" onSubmit={handleAdd} />}
            className="h-[400px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full flex flex-col gap-3">
        <FilterAkreditasi onAdd={handleAdd} />
        <DataTable columns={columns} data={displayData} loading={isLoading} />
      </div>
    </div>
  );
}
