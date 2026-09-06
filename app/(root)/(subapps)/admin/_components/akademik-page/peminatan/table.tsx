"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { DataTable } from "@/components/data-table";
import { FilterDaftarPeminatan } from "./filter";
import { Columns } from "./column";
import { PeminatanItem } from "@/types/admin/akademik-page/peminatan/peminatan";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "@/components/empty-state";
import { mutate } from "swr";
import { PeminatanSuperAdminService } from "@/api/superadmin";
import { handleToastResponse } from "@/lib/toast-response";
import { Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import DialogPopUp from "./dialog-popup";
import { useProfile } from "@/context/profileUseContext";

const fetcherPeminatan = (prodiId?: number) =>
  PeminatanSuperAdminService.getPeminatan(prodiId).then(
    (res: { data?: PeminatanItem[] }) => {
      // Handle the response structure
      if (res.data) {
        return {
          data: Array.isArray(res.data) ? res.data : [],
        };
      }

      // Fallback to empty array
      return { data: [] };
    }
  );

export function DataPeminatan() {
  const { activeProdiId } = useProfile();
  const prodiId = activeProdiId;

  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const {
    data: response,
    error,
    isLoading,
  } = useSWR<{
    data: PeminatanItem[];
  }>(["peminatan", prodiId], () => fetcherPeminatan(prodiId ?? undefined), { revalidateOnFocus: false });

  // All peminatan data
  const allData = response?.data || [];

  // Client-side pagination for UI display only
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = allData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(allData.length / limit);
  const totalData = allData.length;

  // Handle add function
  const handleAdd = async (peminatanData: PeminatanItem) => {
    try {
      const response = await PeminatanSuperAdminService.createPeminatan({
        ...peminatanData,
        prodi_id: prodiId,
      });

      if (response.success || response.data) {
        handleToastResponse({
          success: true,
          message: "Peminatan berhasil ditambahkan",
        });

        // Revalidate the data
        mutate(["peminatan", prodiId]);
      } else {
        throw new Error(response.message || "Gagal menambahkan peminatan");
      }
    } catch (error: unknown) {
      console.error("Error adding peminatan:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menambahkan peminatan";
      handleToastResponse({
        success: false,
        message: errorMessage,
      });
      throw error;
    }
  };

  // Handle edit function
  const handleEdit = async (peminatan: PeminatanItem) => {
    if (!peminatan.id) {
      handleToastResponse({
        success: false,
        message: "ID Peminatan tidak ditemukan",
      });
      return;
    }

    try {
      const response = await PeminatanSuperAdminService.updatePeminatan(
        peminatan.id,
        { ...peminatan, prodi_id: prodiId }
      );

      if (response.success || response.data) {
        handleToastResponse({
          success: true,
          message: "Peminatan berhasil diperbarui",
        });

        // Revalidate the data
        mutate(["peminatan", prodiId]);
      } else {
        throw new Error(response.message || "Gagal memperbarui peminatan");
      }
    } catch (error: unknown) {
      console.error("Error updating peminatan:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Gagal memperbarui peminatan";
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
        message: "ID Peminatan tidak valid",
      });
      return;
    }

    try {
      const response = await PeminatanSuperAdminService.deletePeminatan(
        numericId
      );

      if (response.success || response.data) {
        handleToastResponse({
          success: true,
          message: "Peminatan berhasil dihapus",
        });

        // Revalidate the data
        mutate(["peminatan", prodiId]);
      } else {
        throw new Error(response.message || "Gagal menghapus peminatan");
      }
    } catch (error: unknown) {
      console.error("Error deleting peminatan:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menghapus peminatan";
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
            Terjadi kesalahan saat memuat data peminatan.
            <br />
            <button
              onClick={() => mutate(["peminatan", prodiId])}
              className="mt-2 text-blue-500 underline"
            >
              Coba lagi
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show empty state if no data
  if (!isLoading && !error && allData.length === 0) {
    return (
      <EmptyState
        icon={Book}
        title="Belum ada peminatan"
        subtitle="Mulai dengan menambahkan peminatan pertama Anda."
        button={<DialogPopUp mode="add" onSubmit={handleAdd} />}
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
      <FilterDaftarPeminatan onAdd={handleAdd} />

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
