"use client";

import { DataTable } from "@/components/data-table";
import { FilterStrukturOrganisasi } from "../../profile-page/struktur-organisasi/filter";
import { Columns } from "../../profile-page/struktur-organisasi/column";
import { useSearchParams } from "next/navigation";
import { StrukturOrganisasi } from "@/types/admin/profile-page/struktur-organisasi/struktur-organisasi";
import { handleToastResponse } from "@/lib/toast-response";
import useSWR, { mutate } from "swr";
import { StrukturOrganisasiSuperAdminService } from "@/api/superadmin";
import EmptyState from "@/components/empty-state";
import { Users } from "lucide-react";
import DialogPopUp from "../../profile-page/struktur-organisasi/dialog-popup";
import { useProfile } from "@/context/profileUseContext";

const fetcherStrukturOrganisasi = (
  page: number,
  limit: number,
  search?: string,
  prodiId?: number
) =>
  StrukturOrganisasiSuperAdminService.getStrukturOrgnisasiAll(
    page,
    limit,
    search,
    prodiId
  ).then((res) => ({
    data: res?.data?.data ?? [],
    meta: res?.data?.meta ?? null,
  }));

export function DataStrukturOrganisasi() {
  const { activeProdiId } = useProfile();
  const prodiId = activeProdiId;
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const searchFromUrl = searchParams.get("search") || "";

  const {
    data: response,
    error,
    isLoading,
  } = useSWR<{
    data: StrukturOrganisasi[];
    meta: { pagination?: { last_page: number; total: number } };
  }>(
    ["struktur-organisasi", page, limit, searchFromUrl, prodiId],
    () => fetcherStrukturOrganisasi(page, limit, searchFromUrl, prodiId ?? undefined),
    { revalidateOnFocus: false }
  );

  const data = response?.data || [];
  const meta = response?.meta;

  // Debug logs
  console.log("Response:", response);
  console.log("Data length:", data.length);
  console.log("Loading:", isLoading);
  console.log("Error:", error);
  console.log("Search from URL:", searchFromUrl);

  // Get pagination info from backend meta (similar to pengumuman)
  const totalPages = meta?.pagination?.last_page ?? 1;
  const totalData = meta?.pagination?.total ?? 0;

  // Handle add function
  const handleAdd = async (
    strukturOrganisasiData: StrukturOrganisasi & { imageFile?: File }
  ) => {
    let res;
    try {
      res = await StrukturOrganisasiSuperAdminService.createStrukturOrganisasi({
        name: strukturOrganisasiData.name,
        position: strukturOrganisasiData.position,
        order_no: strukturOrganisasiData.order_no,
        imageFile: strukturOrganisasiData.imageFile,
        prodi_id: prodiId,
      });

      // Revalidate data
      mutate(["struktur-organisasi", page, limit, searchFromUrl, prodiId]);

      handleToastResponse(res);
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal menambahkan Struktur Organisasi",
      });
      console.error(error);
    }
  };

  // Handle edit function
  const handleEdit = async (strukturOrganisasi: StrukturOrganisasi) => {
    if (!strukturOrganisasi.id) {
      handleToastResponse({
        success: false,
        message: "ID Struktur Organisasi tidak ditemukan",
      });
      return;
    }

    const updateData = {
      name: strukturOrganisasi.name,
      position: strukturOrganisasi.position,
      order_no: strukturOrganisasi.order_no,
      imageFile: strukturOrganisasi.imageFile,
    };

    let res;
    try {
      res = await StrukturOrganisasiSuperAdminService.updateStrukturOrganisasi(
        Number(strukturOrganisasi.id),
        updateData
      );

      // Revalidate data
      mutate(["struktur-organisasi", page, limit, searchFromUrl, prodiId]);

      handleToastResponse(res);
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal memperbarui Struktur Organisasi",
      });
      console.error(error);
      throw error;
    }
  };

  // Handle delete function
  const handleDelete = async (id: number) => {
    let res;
    try {
      res = await StrukturOrganisasiSuperAdminService.deleteStrukturOrganisasi(
        id
      );

      // Revalidate data
      mutate(["struktur-organisasi", page, limit, searchFromUrl, prodiId]);

      handleToastResponse(res);
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal menghapus Struktur Organisasi",
      });
      console.error(error);
      throw error;
    }
  };

  // Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500">Error loading data</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (!isLoading && !error && data.length === 0 && !searchFromUrl) {
    console.log("Showing empty state - conditions:", {
      isLoading,
      error,
      dataLength: data.length,
      searchFromUrl,
    });

    return (
      <div>
        <div className="w-full flex flex-col gap-3">
          <FilterStrukturOrganisasi onAdd={handleAdd} />
          <EmptyState
            icon={Users}
            title="Belum Ada Data Struktur Organisasi"
            subtitle="Belum ada data struktur organisasi program studi yang tersedia. Silakan tambah data struktur organisasi terlebih dahulu."
            button={<DialogPopUp mode="add" onSubmit={handleAdd} />}
            className="h-[400px]"
          />
        </div>
      </div>
    );
  }

  // Show empty search results
  if (!isLoading && !error && searchFromUrl && data.length === 0) {
    console.log("Showing empty search results - conditions:", {
      isLoading,
      error,
      searchFromUrl,
      dataLength: data.length,
    });

    return (
      <div>
        <div className="w-full flex flex-col gap-3">
          <FilterStrukturOrganisasi onAdd={handleAdd} />
          <EmptyState
            icon={Users}
            title="Tidak Ada Hasil Pencarian"
            subtitle={`Tidak ada hasil untuk pencarian "${searchFromUrl}". Coba gunakan kata kunci yang berbeda.`}
            className="h-[400px]"
          />
        </div>
      </div>
    );
  }

  console.log("Showing data table - conditions:", {
    isLoading,
    error,
    dataLength: data.length,
    searchFromUrl,
  });

  return (
    <div>
      <div className="w-full flex flex-col gap-3">
        <FilterStrukturOrganisasi onAdd={handleAdd} />

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

        {/* Remove separate PaginationControls since it's now handled by DataTable */}
      </div>
    </div>
  );
}
