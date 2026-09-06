/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable } from "@/components/data-table";
import { FilterSambutanDekan } from "./filter";
import { Columns } from "./column";
import { useState } from "react";
import { SambutanDekan } from "@/types/admin-fakultas/sambutan-dekan/sambutan-dekan";
import { handleToastResponse } from "@/lib/toast-response";
import useSWR, { mutate } from "swr";
import {
  SambutanAdminService,
  SambutanFakultasService,
} from "@/api/admin-fakultas";
import EmptyState from "@/components/empty-state";
import { MessageCircle, AlertTriangle } from "lucide-react";
import DialogPopUp from "./dialog-popup";
import { useProfile } from "@/context/profileUseContext";

const fetcherSambutan = async (prodiId?: number) => {
  try {
    const response = await SambutanFakultasService.getAllSambutan(prodiId);

    const result = response.data?.data || response.data;

    if (!result || (Array.isArray(result) && result.length === 0)) {
      return [];
    }

    return Array.isArray(result) ? result : [result];
  } catch (error) {
    console.error("Gagal fetch sambutan:", error);
    return []; // Pastikan selalu me-return array
  }
};

export function DataSambutanDekan() {
  const { profile } = useProfile();
  const prodiId = profile?.prodi?.id;
  const [currentPage] = useState(1);
  const [perPage] = useState(10);

  const { data, error, isLoading } = useSWR<SambutanDekan[]>(
    ["sambutan-dekan", prodiId],
    () => fetcherSambutan(prodiId),
    { revalidateOnFocus: false },
  );

  const handleEdit = async (
    sambutanData: SambutanDekan & { imageFile?: File },
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
      image: sambutanData.imageFile,
    };

    let res;
    try {
      res = await SambutanAdminService.updateSambutan(
        sambutanData.id,
        updateData,
      );

      mutate(["sambutan-dekan", prodiId]);
      handleToastResponse(res);
    } catch (error: any) {
      handleToastResponse({
        success: false,
        message: error.message || "Gagal memperbarui Sambutan Dekan",
      });
      console.error(error);
    }
  };

  const handleAdd = async (
    sambutanData: SambutanDekan & { imageFile?: File },
  ) => {
    let res;
    try {
      res = await SambutanAdminService.createSambutan({
        name: sambutanData.name,
        paragraph: sambutanData.paragraph,
        image: sambutanData.imageFile,
        prodi_id: prodiId,
      });

      mutate(["sambutan-dekan", prodiId]);
      handleToastResponse(res);
    } catch (error: any) {
      handleToastResponse({
        success: false,
        message: error.message || "Gagal menambahkan Sambutan Dekan",
      });
      console.error(error);
    }
  };

  const columns = Columns(currentPage, perPage, handleEdit);

  if (error) {
    return (
      <div>
        <div className="w-full flex flex-col gap-3">
          <FilterSambutanDekan onAdd={handleAdd} hasData={false} />
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

  if (!isLoading && !error && displayData.length === 0) {
    return (
      <div>
        <div className="w-full flex flex-col gap-3">
          <FilterSambutanDekan onAdd={handleAdd} hasData={hasData} />
          <EmptyState
            icon={MessageCircle}
            title="Belum Ada Data Sambutan Dekan"
            subtitle="Belum ada kata sambutan dekan yang tersedia. Silakan tambah data sambutan dekan terlebih dahulu."
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
