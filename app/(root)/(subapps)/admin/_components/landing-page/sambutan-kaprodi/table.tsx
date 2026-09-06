"use client";

import { DataTable } from "@/components/data-table";
import { FilterSambutanKaprodi } from "./filter";
import { Columns } from "./column";
import { useState } from "react";
import { SambutanKaprodi } from "@/types/admin/landing-page/sambutan-kaprodi/sambutan-kaprodi";
import { handleToastResponse } from "@/lib/toast-response";
import useSWR, { mutate } from "swr";
import { SambutanKaprodiSuperAdminService } from "@/api/superadmin";
import EmptyState from "@/components/empty-state";
import { MessageCircle, AlertTriangle } from "lucide-react";
import DialogPopUp from "./dialog-popup";
import { useProfile } from "@/context/profileUseContext";

const fetcherSambutanKaprodi = (prodiId?: number) =>
  SambutanKaprodiSuperAdminService.getAllSambutan(prodiId).then((res) => {
    // res.data is expected to be a single object from backend successResponse
    const data = res?.data;
    
    if (!data) return [];
    
    // If it's already an array, return it. If it's a single object, wrap it.
    return Array.isArray(data) ? data : [data];
  });

export function DataSambutanKaprodi() {
  const { activeProdiId } = useProfile();
  const prodiId = activeProdiId;
  const [currentPage] = useState(1);
  const [perPage] = useState(10);

  const { data, error, isLoading } = useSWR<SambutanKaprodi[]>(
    ["sambutan-kaprodi", prodiId],
    () => fetcherSambutanKaprodi(prodiId ?? undefined),
    { revalidateOnFocus: false }
  );

  const handleEdit = async (
    sambutanData: SambutanKaprodi & { imageFile?: File }
  ) => {
    if (!sambutanData.id) {
      handleToastResponse({
        success: false,
        message: "ID Sambutan tidak ditemukan",
      });
      return;
    }

    const updateData = {
      name: sambutanData.name,
      paragraph: sambutanData.paragraph,
      imageFile: sambutanData.imageFile,
    };

    let res;
    try {
      res = await SambutanKaprodiSuperAdminService.updateSambutan(
        sambutanData.id,
        updateData
      );

      // Revalidate data
      mutate(["sambutan-kaprodi", prodiId]);

      handleToastResponse(res);
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal memperbarui Sambutan Kaprodi",
      });
      console.error(error);
    }
  };

  const handleAdd = async (
    sambutanData: SambutanKaprodi & { imageFile?: File }
  ) => {
    let res;
    try {
      res = await SambutanKaprodiSuperAdminService.createSambutan({
        name: sambutanData.name,
        paragraph: sambutanData.paragraph,
        imageFile: sambutanData.imageFile,
        prodi_id: prodiId,
      });

      // Revalidate data
      mutate(["sambutan-kaprodi", prodiId]);

      handleToastResponse(res);
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal menambahkan Sambutan Kaprodi",
      });
      console.error(error);
    }
  };

  const columns = Columns(currentPage, perPage, handleEdit);

  if (error) {
    return (
      <div>
        <div className="w-full flex flex-col gap-3">
          <FilterSambutanKaprodi onAdd={handleAdd} hasData={false} />
          <EmptyState
            icon={AlertTriangle}
            title="Terjadi Kesalahan"
            subtitle="Data sambutan tidak dapat dimuat. Silakan coba lagi nanti."
            className="h-[400px]"
          />
        </div>
      </div>
    );
  }

  // Display all data with proper validation
  const displayData = Array.isArray(data) ? data : data ? [data] : [];
  const hasData = displayData.length > 0;

  // Show empty state if no data
  if (!isLoading && !error && displayData.length === 0) {
    return (
      <div>
        <div className="w-full flex flex-col gap-3">
          <FilterSambutanKaprodi onAdd={handleAdd} hasData={hasData} />
          <EmptyState
            icon={MessageCircle}
            title="Belum Ada Data Sambutan Kaprodi"
            subtitle="Belum ada kata sambutan kepala program studi yang tersedia. Silakan tambah data sambutan kaprodi terlebih dahulu."
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
