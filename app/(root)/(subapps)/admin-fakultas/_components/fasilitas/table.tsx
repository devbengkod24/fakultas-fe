"use client";

import { DataTable } from "@/components/data-table";
import { FilterFasilitas } from "./filter";
import { Columns } from "./column";
import { useSearchParams } from "next/navigation";
import { FasilitasFakultas } from "@/types/admin-fakultas/fasilitas/fasilitas";
import { handleToastResponse } from "@/lib/toast-response";
import useSWR, { mutate } from "swr";
import { AdminFakultasFasilitasService } from "@/api/admin-fakultas";
import EmptyState from "@/components/empty-state";
import { Building, AlertTriangle } from "lucide-react";
import DialogPopUp from "./dialog-popup";

const fetcherFasilitas = async (
  page: number,
  limit: number,
  search: string,
) => {
  try {
    const response = await AdminFakultasFasilitasService.getAllFasilitas(
      page,
      limit,
      search,
    );
    const result = Array.isArray(response.data) ? response.data : [];
    const pagination = response.meta?.pagination;

    return { data: result, pagination };
  } catch (error) {
    console.error("Gagal fetch fasilitas:", error);
    return { data: [], pagination: undefined };
  }
};

export function DataFasilitas() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const { data: response, error, isLoading } = useSWR(
    ["admin-fasilitas-fakultas", currentPage, perPage, search],
    () => fetcherFasilitas(currentPage, perPage, search),
    { revalidateOnFocus: false },
  );

  const data = response?.data as FasilitasFakultas[] | undefined;
  const pagination = response?.pagination;

  const handleEdit = async (
    fasilitasData: FasilitasFakultas & { imageFile?: File },
  ) => {
    if (!fasilitasData.id) {
      handleToastResponse({
        success: false,
        message: "ID Fasilitas tidak ditemukan",
      });
      return;
    }

    const updateData = {
      judul: fasilitasData.judul,
      deskripsi: fasilitasData.deskripsi,
      gambar: fasilitasData.imageFile,
    };

    try {
      const res = await AdminFakultasFasilitasService.updateFasilitas(
        fasilitasData.id,
        updateData,
      );

      mutate(
        (key) => Array.isArray(key) && key[0] === "admin-fasilitas-fakultas",
      );
      handleToastResponse(res);
    } catch (err: unknown) {
      console.error(err);
      handleToastResponse({
        success: false,
        message: err instanceof Error ? err.message : "Gagal memperbarui Fasilitas",
      });
    }
  };

  const handleAdd = async (
    fasilitasData: FasilitasFakultas & { imageFile?: File },
  ) => {
    try {
      const res = await AdminFakultasFasilitasService.createFasilitas({
        judul: fasilitasData.judul,
        deskripsi: fasilitasData.deskripsi,
        gambar: fasilitasData.imageFile,
      });

      mutate(
        (key) => Array.isArray(key) && key[0] === "admin-fasilitas-fakultas",
      );
      handleToastResponse(res);
    } catch (err: unknown) {
      console.error(err);
      handleToastResponse({
        success: false,
        message: err instanceof Error ? err.message : "Gagal menambahkan Fasilitas",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await AdminFakultasFasilitasService.deleteFasilitas(id);

      mutate(
        (key) => Array.isArray(key) && key[0] === "admin-fasilitas-fakultas",
      );
      handleToastResponse(res);
    } catch (err: unknown) {
      console.error(err);
      handleToastResponse({
        success: false,
        message: err instanceof Error ? err.message : "Gagal menghapus Fasilitas",
      });
    }
  };

  const columns = Columns(currentPage, perPage, handleEdit, handleDelete);

  if (error) {
    return (
      <div className="w-full flex justify-center py-10">
        <EmptyState
          icon={AlertTriangle}
          title="Terjadi Kesalahan"
          subtitle="Data fasilitas tidak dapat dimuat. Silakan coba lagi nanti."
        />
      </div>
    );
  }

  const displayData = Array.isArray(data) ? data : [];

  if (!isLoading && !error && displayData.length === 0) {
    return (
      <div className="w-full flex justify-center py-10 flex-col items-center gap-4">
        <EmptyState
          icon={Building}
          title="Belum Ada Data Fasilitas"
          subtitle="Tambahkan data fasilitas untuk menampilkannya di halaman fakultas."
          button={<DialogPopUp mode="add" onSubmit={handleAdd} />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FilterFasilitas onAdd={handleAdd} />

      <DataTable
        columns={columns}
        data={displayData}
        loading={isLoading}
        pagination={{
          currentPage: pagination?.current_page || currentPage,
          lastPage: pagination?.last_page || 1,
          limit: pagination?.per_page || perPage,
          total: pagination?.total ?? displayData.length,
        }}
      />
    </div>
  );
}
