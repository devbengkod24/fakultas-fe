"use client";

import { DataTable } from "@/components/data-table";
import { Columns } from "../visi-misi/column";
import { useState } from "react";
import { VisiMisi } from "@/types/admin/profile-page/visi-misi/visi-misi";
import { VisiMisiSuperAdminService } from "@/api/superadmin";
import { handleToastResponse } from "@/lib/toast-response";
import useSWR, { mutate } from "swr";
import EmptyState from "@/components/empty-state";
import { Target } from "lucide-react";
import DialogPopUp from "../visi-misi/dialog-popup";
import { useProfile } from "@/context/profileUseContext";

const fetcherVisiMisi = (prodiId?: number) =>
  VisiMisiSuperAdminService.getAllVisiMisi(prodiId).then((res) => {
    const data = res?.data;
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  });

export function DataVisiMisi() {
  const { activeProdiId } = useProfile();
  const prodiId = activeProdiId;
  const [currentPage] = useState(1);
  const [perPage] = useState(10);

  const { data, error, isLoading } = useSWR<VisiMisi[]>(
    ["visi-misi", prodiId],
    () => fetcherVisiMisi(prodiId ?? undefined),
    { revalidateOnFocus: false }
  );

  const handleEdit = async (visiMisiData: VisiMisi) => {
    if (!visiMisiData.id) {
      handleToastResponse({
        success: false,
        message: "ID Visi Misi tidak ditemukan",
      });
      return;
    }

    let res;
    try {
      res = await VisiMisiSuperAdminService.updateVisiMisi(visiMisiData.id, {
        visi: visiMisiData.visi,
        misi: visiMisiData.misi,
        prodi_id: prodiId,
      });

      // Revalidate data
      mutate(["visi-misi", prodiId]);

      handleToastResponse(res);
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal memperbarui Visi Misi Program Studi",
      });
      console.error(error);
    }
  };

  const handleAdd = async (visiMisiData: VisiMisi) => {
    let res;
    try {
      res = await VisiMisiSuperAdminService.createVisiMisi({
        visi: visiMisiData.visi,
        misi: visiMisiData.misi,
        prodi_id: prodiId,
      });

      // Revalidate data
      mutate(["visi-misi", prodiId]);

      handleToastResponse(res);
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal menambahkan Visi Misi Program Studi",
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

  // Only show first data if exists
  const displayData = data && data.length > 0 ? [data[0]] : [];
  const hasData = data && data.length > 0;

  // Show empty state if no data
  if (!isLoading && !error && !hasData) {
    return (
      <div>
        <div className="w-full flex flex-col gap-3">
          <EmptyState
            icon={Target}
            title="Belum Ada Data Visi Misi"
            subtitle="Belum ada visi misi program studi yang tersedia. Silakan tambah data visi misi terlebih dahulu."
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
        <DataTable
          columns={columns}
          data={displayData}
          loading={isLoading}
          pagination={{
            currentPage: currentPage,
            lastPage: 1,
            limit: perPage,
            total: displayData.length,
          }}
        />
      </div>
    </div>
  );
}
