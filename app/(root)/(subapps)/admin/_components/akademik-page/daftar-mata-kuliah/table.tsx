"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { DataTable } from "@/components/data-table";
import { FilterDaftarMataKuliah } from "./filter";
import { Columns } from "./column";
import { MataKuliahItem } from "@/types/admin/akademik-page/daftar-mata-kuliah/daftar-mata-kuliah";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "@/components/empty-state";
import { mutate } from "swr";
import { MataKuliahSuperAdminService } from "@/api/superadmin";
import { handleToastResponse } from "@/lib/toast-response";
import { Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/context/profileUseContext";

const fetcherMataKuliah = (semester?: string, prodiId?: number) =>
  MataKuliahSuperAdminService.getMataKuliahAll(semester, prodiId).then(
    (res: { data?: MataKuliahItem[] }) => ({
      data: res.data ?? [],
    })
  );

export function DataMataKuliah() {
  const { activeProdiId } = useProfile();
  const prodiId = activeProdiId;

  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const semesterFilter = searchParams.get("semester") || "";

  const {
    data: response,
    error,
    isLoading,
  } = useSWR<{
    data: MataKuliahItem[];
  }>(
    ["mata-kuliah", semesterFilter, prodiId],
    () => fetcherMataKuliah(semesterFilter || undefined, prodiId ?? undefined),
    { revalidateOnFocus: false }
  );

  // Filter out mata kuliah with null semester
  const allData = (response?.data || []).filter(
    (item) => item.semester !== null
  );

  // Client-side pagination for UI display only
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = allData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(allData.length / limit);
  const totalData = allData.length;

  // Handle add function
  const handleAdd = async (mataKuliahData: MataKuliahItem) => {
    try {
      const response = await MataKuliahSuperAdminService.createMataKuliah({
        ...mataKuliahData,
        prodi_id: prodiId,
      });

      if (response.success || response.data) {
        handleToastResponse({
          success: true,
          message: response.message,
        });

        // Revalidate the data
        mutate(["mata-kuliah", semesterFilter, prodiId]);
      } else {
        handleToastResponse({
          success: false,
          message: response.message,
        });
      }
    } catch (error: unknown) {
      console.error("Error adding mata-kuliah:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal menambahkan mata kuliah";
      handleToastResponse({
        success: false,
        message: errorMessage,
      });
      throw error;
    }
  };

  // Handle edit function
  const handleEdit = async (mataKuliah: MataKuliahItem) => {
    if (!mataKuliah.id) {
      handleToastResponse({
        success: false,
        message: "ID Mata Kuliah tidak ditemukan",
      });
      return;
    }

    try {
      const response = await MataKuliahSuperAdminService.updateMataKuliah(
        mataKuliah.id,
        { ...mataKuliah, prodi_id: prodiId }
      );

      if (response.success || response.data) {
        handleToastResponse({
          success: true,
          message: response.message,
        });

        // Revalidate the data
        mutate(["mata-kuliah", semesterFilter, prodiId]);
      } else {
        handleToastResponse({
          success: false,
          message: response.message,
        });
      }
    } catch (error: unknown) {
      console.error("Error updating mata-kuliah:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal memperbarui mata kuliah";
      handleToastResponse({
        success: false,
        message: errorMessage,
      });
      throw error;
    }
  };

  // Handle delete function
  const handleDelete = async (id: string) => {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      handleToastResponse({
        success: false,
        message: "ID Mata Kuliah tidak valid",
      });
      return;
    }

    try {
      const response = await MataKuliahSuperAdminService.deleteMataKuliah(
        numericId
      );

      if (response.success || response.data) {
        handleToastResponse({
          success: true,
          message: response.message,
        });

        // Revalidate the data
        mutate(["mata-kuliah", semesterFilter, prodiId]);
      } else {
        handleToastResponse({
          success: false,
          message: response.message,
        });
      }
    } catch (error: unknown) {
      console.error("Error deleting mata-kuliah:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menghapus mata kuliah";
      handleToastResponse({
        success: false,
        message: errorMessage,
      });
      throw error;
    }
  };

  // Handle error state
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Terjadi kesalahan saat memuat data mata kuliah.
            <br />
            <button
              onClick={() => mutate(["mata-kuliah", semesterFilter, prodiId])}
              className="mt-2 text-blue-500 underline"
            >
              Silahkan Coba lagi Nanti
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show empty state if no data and no filter
  if (!isLoading && !error && allData.length === 0 && !semesterFilter) {
    return (
      <EmptyState
        icon={Book}
        title="Belum ada mata kuliah"
        subtitle="Mulai dengan menambahkan mata kuliah pertama Anda."
        button={<FilterDaftarMataKuliah onAdd={handleAdd} hideFilter />}
      />
    );
  }

  // Show empty filter results
  if (!isLoading && !error && semesterFilter && allData.length === 0) {
    return (
      <EmptyState
        icon={Book}
        title="Tidak ada mata kuliah ditemukan"
        subtitle={`Tidak ditemukan mata kuliah untuk semester ${semesterFilter}.`}
        button={
          <Button
            variant="outline"
            onClick={() => {
              const params = new URLSearchParams();
              params.set("page", "1");
              window.location.search = params.toString();
            }}
          >
            Reset Filter
          </Button>
        }
      />
    );
  }

  // Show empty page results (when pagination goes beyond available data)
  if (!isLoading && !error && data.length === 0 && page > 1) {
    return (
      <EmptyState
        icon={Book}
        title="Halaman tidak ditemukan"
        subtitle="Halaman yang Anda cari tidak tersedia."
        button={
          <Button
            variant="outline"
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              params.set("page", "1");
              window.location.search = params.toString();
            }}
          >
            Kembali ke Halaman 1
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <FilterDaftarMataKuliah onAdd={handleAdd} />

      <DataTable
        columns={Columns(page, limit, handleEdit, handleDelete)}
        data={data}
        loading={isLoading}
        pagination={{
          currentPage: page,
          lastPage: totalPages,
          limit,
          total: totalData,
        }}
      />
    </div>
  );
}
