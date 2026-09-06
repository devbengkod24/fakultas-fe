"use client";

import { Pengertian } from "@/types/admin/profile-page/pengertian/pengertian";
import { PengertianSuperAdminService } from "@/api/superadmin";
import useSWR, { mutate } from "swr";
import { DataTable } from "@/components/data-table";
import { Columns } from "./column";
import { useState } from "react";
import { handleToastResponse } from "@/lib/toast-response";
import EmptyState from "@/components/empty-state";
import { BookOpen } from "lucide-react";
import DialogPopUp from "./dialog-popup";
import { useProfile } from "@/context/profileUseContext";

const fetcherPengertian = (prodiId?: number) =>
  PengertianSuperAdminService.getAllPengertian(prodiId).then((res) => {
    const data = res?.data ?? res;
    return Array.isArray(data) ? data : [];
  });

export function DataPengertian() {
  const { activeProdiId } = useProfile();
  const prodiId = activeProdiId;
  const [currentPage] = useState(1);
  const [perPage] = useState(10);

  const { data, error, isLoading } = useSWR<Pengertian[]>(
    ["pengertian", prodiId],
    () => fetcherPengertian(prodiId ?? undefined),
    { revalidateOnFocus: false }
  );

  const handleEdit = async (pengertianData: Pengertian) => {
    if (!pengertianData.id) {
      handleToastResponse({
        success: false,
        message: "ID Pengertian tidak ditemukan",
      });
      return;
    }

    let res;
    try {
      res = await PengertianSuperAdminService.updatePengertian(
        pengertianData.id,
        {
          pengertian: pengertianData.pengertian,
        }
      );

      // Revalidate data
      mutate(["pengertian", prodiId]);

      handleToastResponse(res);
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal memperbarui Pengertian Program Studi",
      });
      console.error(error);
    }
  };

  const handleAdd = async (pengertianData: Pengertian) => {
    let res;
    try {
      res = await PengertianSuperAdminService.createPengertian({
        pengertian: pengertianData.pengertian,
        prodi_id: prodiId,
      });

      // Revalidate data
      mutate(["pengertian", prodiId]);

      handleToastResponse(res);
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal menambahkan Pengertian Program Studi",
      });
      console.error(error);
    }
  };

  const columns = Columns(currentPage, perPage, handleEdit);

  if (error) {
    return (
      <div className="flex justify-center items-center h-32 text-red-500">
        <div>Error loading data</div>
      </div>
    );
  }

  const hasData = Array.isArray(data) && data.length > 0;
  const displayData = hasData ? [data[0]] : [];

  // Show empty state if no data
  if (!isLoading && !error && !hasData) {
    return (
      <div>
        <div className="w-full flex flex-col gap-3">
          <EmptyState
            icon={BookOpen}
            title="Belum Ada Data Pengertian"
            subtitle="Belum ada pengertian program studi yang tersedia. Silakan tambah data pengertian terlebih dahulu."
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
        <DataTable columns={columns} data={displayData} loading={isLoading} />
      </div>
    </div>
  );
}
