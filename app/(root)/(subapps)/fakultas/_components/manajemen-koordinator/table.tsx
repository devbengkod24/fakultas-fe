"use client";

import { DataTable } from "@/components/data-table";
import { FilterKoordinator } from "./filter";
import { Columns } from "./column";
import { useSearchParams } from "next/navigation";
import { AkunUser } from "@/types/fakultas/users/user";
import { handleToastResponse } from "@/lib/toast-response";
import useSWR, { mutate } from "swr";
import { ManajemenKoordinatorSuperAdminService } from "@/api/superadmin";
import EmptyState from "@/components/empty-state";
import { Users, AlertTriangle } from "lucide-react";
import DialogPopUp from "./dialog-popup";

interface UserApiResponse {
  data: {
    data: AkunUser[];
    meta: {
      pagination: {
        last_page: number;
        total: number;
      };
    };
  };
}

const fetcherUser = (page: number, limit: number, search?: string) =>
  ManajemenKoordinatorSuperAdminService.getKoordinatorAll(
    page,
    limit,
    search,
  ).then((res: UserApiResponse) => ({
    data: Array.isArray(res.data?.data) ? res.data.data : [],
    meta: res.data?.meta || null,
  }));

export function DataDaftarKoordinator() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const searchFromUrl = searchParams.get("search") || "";

  const {
    data: response,
    error,
    isLoading,
  } = useSWR<{
    data: AkunUser[];
    meta: { pagination?: { last_page: number; total: number } };
  }>(
    ["manajemen-koordinator", page, limit, searchFromUrl],
    () => fetcherUser(page, limit, searchFromUrl),
    { revalidateOnFocus: false },
  );

  const data = response?.data || [];
  const meta = response?.meta;

  // Get pagination info from backend meta
  const totalPages = meta?.pagination?.last_page ?? 1;
  const totalData = meta?.pagination?.total ?? 0;

  // Handle add function
  const handleAdd = async (userData: AkunUser) => {
    try {
      const res = await ManajemenKoordinatorSuperAdminService.createKoordinator(
        {
          name: userData.name,
          email: userData.email,
          permissions: userData.permissions,
          prodi_id: userData.prodi_id,
          password: userData.password,
          dosen_id: userData.dosen_id,
        },
      );

      // Revalidate data
      mutate(["manajemen-koordinator", page, limit, searchFromUrl]);

      handleToastResponse(res);
    } catch (err: unknown) {
      console.error(err);
      handleToastResponse({
        success: false,
        message: err instanceof Error ? err.message : "Gagal menambahkan data",
      });
    }
  };

  // Handle edit function
  const handleEdit = async (user: AkunUser) => {
    if (!user.id) {
      handleToastResponse({
        success: false,
        message: "ID Akun User tidak ditemukan",
      });
      return;
    }

    const updateData = {
      name: user.name,
      email: user.email,
      permissions: user.permissions,
      prodi_id: user.prodi_id,
      dosen_id: user.dosen_id,
      ...(user.password && { password: user.password }),
    };

    try {
      const res = await ManajemenKoordinatorSuperAdminService.updateKoordinator(
        Number(user.id),
        updateData,
      );

      // Revalidate data
      mutate(["manajemen-koordinator", page, limit, searchFromUrl]);

      handleToastResponse(res);
    } catch (err: unknown) {
      console.error(err);
      handleToastResponse({
        success: false,
        message: err instanceof Error ? err.message : "Gagal memperbarui data",
      });
    }
  };

  // Handle delete function
  const handleDelete = async (id: number) => {
    try {
      const res =
        await ManajemenKoordinatorSuperAdminService.deleteKoordinator(id);

      // Revalidate data
      mutate(["manajemen-koordinator", page, limit, searchFromUrl]);

      handleToastResponse(res);
    } catch (err: unknown) {
      console.error(err);
      handleToastResponse({
        success: false,
        message: err instanceof Error ? err.message : "Gagal menghapus data",
      });
    }
  };

  // Handle error state
  if (error) {
    return (
      <div>
        <div className="w-full flex flex-col gap-3">
          <FilterKoordinator onAdd={handleAdd} />
          <EmptyState
            icon={AlertTriangle}
            title="Terjadi Kesalahan"
            subtitle="Data koordinator tidak dapat dimuat. Silakan coba lagi nanti."
            className="h-[400px]"
          />
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (!isLoading && !error && data.length === 0 && !searchFromUrl) {
    return (
      <div>
        <div className="w-full flex flex-col gap-3">
          <FilterKoordinator onAdd={handleAdd} />
          <EmptyState
            icon={Users}
            title="Belum Ada Data Koordinator"
            subtitle="Belum ada data akun koordinator yang tersedia. Silakan tambah akun koordinator terlebih dahulu."
            button={<DialogPopUp mode="add" onSubmit={handleAdd} />}
            className="h-[400px]"
          />
        </div>
      </div>
    );
  }

  // Show empty search results
  if (!isLoading && !error && searchFromUrl && data.length === 0) {
    return (
      <div>
        <div className="w-full flex flex-col gap-3">
          <FilterKoordinator onAdd={handleAdd} />
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

  return (
    <div>
      <div className="w-full flex flex-col gap-3">
        <FilterKoordinator onAdd={handleAdd} />

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
    </div>
  );
}
