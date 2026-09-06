"use client";

import { DataTable } from "@/components/data-table";
import { FilterDaftarMataKuliahPeminatan } from "./filter";
import { Columns } from "./column";
import { useSearchParams } from "next/navigation";
import { MataKuliahPeminatanItem } from "@/types/admin/akademik-page/mata-kuliah-peminatan/mata-kuliah-peminatan";
import { handleToastResponse } from "@/lib/toast-response";
import useSWR, { mutate } from "swr";
import { MataKuliahPeminatanSuperAdminService } from "@/api/superadmin";
import { Book, AlertTriangle } from "lucide-react";
import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/context/profileUseContext";

const fetcherMataKuliahPeminatan = (peminatan?: string, prodiId?: number) =>
  MataKuliahPeminatanSuperAdminService.getMataKuliahPeminatanAll(
    peminatan,
    prodiId
  ).then((res: { data?: MataKuliahPeminatanItem[] }) => ({
    data: res.data ?? [],
  }));

export function DataMataKuliahPeminatan() {
  const { activeProdiId } = useProfile();
  const prodiId = activeProdiId;

  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const peminatanFilter = searchParams.get("peminatan") || "";

  const {
    data: response,
    error,
    isLoading,
  } = useSWR<{
    data: MataKuliahPeminatanItem[];
  }>(
    ["mata-kuliah-peminatan", peminatanFilter, prodiId],
    () => fetcherMataKuliahPeminatan(peminatanFilter || undefined, prodiId ?? undefined),
    { revalidateOnFocus: false }
  );

  // Filter mata kuliah peminatan data
  // Filter out mata kuliah with null peminatan
  const allData = (response?.data || []).filter(
    (item) => item.peminatan !== null
  );

  // Client-side pagination for UI display only
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = allData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(allData.length / limit);
  const totalData = allData.length;

  // Handle add function
  const handleAdd = async (mataKuliahData: MataKuliahPeminatanItem) => {
    try {
      const response =
        await MataKuliahPeminatanSuperAdminService.createMataKuliah({
          ...mataKuliahData,
          prodi_id: prodiId,
        });

      if (response.success || response.data) {
        handleToastResponse({
          success: true,
          message: response.message,
        });

        // Revalidate data
        mutate(["mata-kuliah-peminatan", peminatanFilter, prodiId]);
      } else {
        handleToastResponse({
          success: false,
          message: response.message,
        });
      }
    } catch (error: unknown) {
      console.error("Error adding mata-kuliah-peminatan:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal menambahkan mata kuliah peminatan";
      handleToastResponse({
        success: false,
        message: errorMessage,
      });
      throw error;
    }
  };

  // Handle edit function
  const handleEdit = async (mataKuliah: MataKuliahPeminatanItem) => {
    if (!mataKuliah.id) {
      handleToastResponse({
        success: false,
        message: "ID Mata Kuliah Peminatan tidak ditemukan",
      });
      return;
    }

    try {
      const response =
        await MataKuliahPeminatanSuperAdminService.updateMataKuliah(
          mataKuliah.id,
          { ...mataKuliah, prodi_id: prodiId }
        );

      if (response.success || response.data) {
        handleToastResponse({
          success: true,
          message: response.message,
        });

        // Revalidate data
        mutate(["mata-kuliah-peminatan", peminatanFilter, prodiId]);
      } else {
        handleToastResponse({
          success: false,
          message: response.message,
        });
      }
    } catch (error: unknown) {
      console.error("Error updating mata-kuliah-peminatan:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal memperbarui mata kuliah peminatan";
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
        message: "ID Mata Kuliah Peminatan tidak valid",
      });
      return;
    }

    try {
      const response =
        await MataKuliahPeminatanSuperAdminService.deleteMataKuliah(numericId);

      if (response.success || response.data) {
        handleToastResponse({
          success: true,
          message: response.message,
        });

        // Revalidate data
        mutate(["mata-kuliah-peminatan", peminatanFilter, prodiId]);
      } else {
        handleToastResponse({
          success: false,
          message: response.message,
        });
      }
    } catch (error: unknown) {
      console.error("Error deleting mata-kuliah-peminatan:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal menghapus mata kuliah peminatan";
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
      <EmptyState
        icon={AlertTriangle}
        title="Terjadi Kesalahan"
        subtitle="Terjadi kesalahan saat memuat data mata kuliah peminatan."
        button={
          <FilterDaftarMataKuliahPeminatan onAdd={handleAdd} hideFilter />
        }
      />
    );
  }

  // Show empty state if no data and no filter
  if (!isLoading && !error && allData.length === 0 && !peminatanFilter) {
    return (
      <EmptyState
        icon={Book}
        title="Belum ada mata kuliah peminatan"
        subtitle="Mulai dengan menambahkan mata kuliah peminatan pertama Anda."
        button={
          <FilterDaftarMataKuliahPeminatan onAdd={handleAdd} hideFilter />
        }
      />
    );
  }

  // Show empty filter results
  if (!isLoading && !error && peminatanFilter && allData.length === 0) {
    return (
      <EmptyState
        icon={Book}
        title="Tidak ada mata kuliah peminatan ditemukan"
        subtitle={`Tidak ditemukan mata kuliah peminatan untuk peminatan ${peminatanFilter}.`}
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
      <FilterDaftarMataKuliahPeminatan onAdd={handleAdd} />

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
