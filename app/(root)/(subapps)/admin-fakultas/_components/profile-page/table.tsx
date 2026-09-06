/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable } from "@/components/data-table";
import { Columns } from "./column";
import { useState, useEffect, useCallback } from "react";
import { handleToastResponse } from "@/lib/toast-response";
import EmptyState from "@/components/empty-state";
import { BookOpen } from "lucide-react";
import DialogPopUp from "./dialog-popup";
import type { Pengertian } from "@/types/fakultas/profile-page/pengenalan/pengenalan";
import { PengertianAdminService, PengertianFakultasService } from "@/api/fakultas";
import Filter from "./filter";

export function Datapengenalan() {
  const [data, setData] = useState<Pengertian[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage] = useState(1);
  const [perPage] = useState(10);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await PengertianFakultasService.getAllPengertian();
      
      let result = response.data?.data || response.data || response;
      
      if (result && !Array.isArray(result) && typeof result === 'object') {
        result = [result];
      }
      
      setData(Array.isArray(result) ? result : []);
    } catch (error: any) {
      console.error("Error fetching pengertian:", error);
      handleToastResponse({
        success: false,
        message: "Gagal mengambil data pengenalan",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = async (formData: Pengertian) => {
    try {
      const response = await PengertianAdminService.createPengertian({
        pengertian: formData.pengertian,
      });
      handleToastResponse({
        ...response,
        message: response?.success ? "Pengenalan berhasil ditambahkan" : response?.message
      });
      fetchData();
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal menambahkan pengenalan",
      });
    }
  };

  const handleEdit = async (formData: Pengertian) => {
    if (!formData.id) return;
    try {
      const response = await PengertianAdminService.updatePengertian(formData.id, {
        pengertian: formData.pengertian,
      });
      handleToastResponse({
        ...response,
        message: response?.success ? "Pengenalan berhasil diupdate" : response?.message
      });
      fetchData();
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal memperbarui pengenalan",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await PengertianAdminService.deletePengertian(id);
      handleToastResponse({
        ...response,
        message: response?.success ? "Pengenalan berhasil dihapus" : response?.message
      });
      fetchData();
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal menghapus pengenalan",
      });
    }
  };

  const columns = Columns(currentPage, perPage, handleEdit, handleDelete);
  const hasData = Array.isArray(data) && data.length > 0;

  if (!isLoading && !hasData) {
    return (
      <div className="w-full flex flex-col gap-3">
        <Filter onAdd={handleAdd} hasData={hasData} />
        <EmptyState
          icon={BookOpen}
          title="Belum Ada Data Pengenalan"
          subtitle="Belum ada pengertian fakultas yang tersedia. Silakan tambah data pengenalan terlebih dahulu."
          button={<DialogPopUp mode="add" onSubmit={handleAdd} />}
          className="h-[400px]"
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <Filter onAdd={handleAdd} hasData={hasData} />
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