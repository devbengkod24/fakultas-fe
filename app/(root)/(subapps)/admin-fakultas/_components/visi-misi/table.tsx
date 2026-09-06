/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable } from "@/components/data-table";
import { Columns } from "../visi-misi/column";
import { useState, useEffect, useCallback } from "react";
import { handleToastResponse } from "@/lib/toast-response";
import EmptyState from "@/components/empty-state";
import { Target } from "lucide-react";
import DialogPopUp from "../visi-misi/dialog-popup";
import { VisiMisi } from "@/types/fakultas/profile-page/visi-misi/visi-misi";
import { VisiMisiAdminService, VisiMisiFakultasService } from "@/api/fakultas";

export function DataVisiMisi() {
  const [currentPage] = useState(1);
  const [perPage] = useState(10);
  const [data, setData] = useState<VisiMisi[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await VisiMisiFakultasService.getAllVisiMisi();
      
      let result = response.data?.data || response.data || response;
      
      if (result && !Array.isArray(result) && typeof result === 'object') {
        result = [result];
      }
      
      setData(Array.isArray(result) ? result : []);
    } catch (error: any) {
      console.error("Error fetching visi misi:", error);
      handleToastResponse({
        success: false,
        message: "Gagal mengambil data visi misi",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = async (visiMisiData: VisiMisi) => {
    try {
      const response = await VisiMisiAdminService.createVisiMisi({
        visi: visiMisiData.visi,
        misi: Array.isArray(visiMisiData.misi) ? visiMisiData.misi : [visiMisiData.misi],
      });
      handleToastResponse(response);
      fetchData();
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal menambahkan Visi Misi fakultas",
      });
    }
  };

  const handleEdit = async (visiMisiData: VisiMisi) => {
    if (!visiMisiData.id) {
      handleToastResponse({
        success: false,
        message: "ID Visi Misi tidak ditemukan",
      });
      return;
    }

    try {
      const response = await VisiMisiAdminService.updateVisiMisi(visiMisiData.id, {
        visi: visiMisiData.visi,
        misi: Array.isArray(visiMisiData.misi) ? visiMisiData.misi : [visiMisiData.misi],
      });
      handleToastResponse(response);
      fetchData();
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal memperbarui Visi Misi fakultas",
      });
    }
  };

  const columns = Columns(currentPage, perPage, handleEdit);
  const hasData = Array.isArray(data) && data.length > 0;

  if (!isLoading && !hasData) {
    return (
      <div className="w-full flex flex-col gap-3">
        <EmptyState
          icon={Target}
          title="Belum Ada Data Visi Misi"
          subtitle="Belum ada visi misi fakultas yang tersedia. Silakan tambah data visi misi terlebih dahulu."
          button={<DialogPopUp mode="add" onSubmit={handleAdd} />}
          className="h-[400px]"
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        pagination={{
          currentPage: currentPage,
          lastPage: 1,
          limit: perPage,
          total: data.length,
        }}
      />
    </div>
  );
}