"use client"
import { DataTable } from "@/components/data-table";
import { FilterProfesiLulusan } from "./filter";
import { Columns } from "./column";
import { useSearchParams } from "next/navigation";
import { ProfesiLulusan } from "@/types/admin/landing-page/prospek-karir/profesi-lulusan";
import { handleToastResponse } from "@/lib/toast-response";
import useSWR, { mutate } from "swr";
import { ProfesiLulusanSuperAdminService } from "@/api/superadmin";

import { useProfile } from "@/context/profileUseContext";

const fetcherProfesiLulusan = (page: number, limit: number, prodiId?: number) =>
  ProfesiLulusanSuperAdminService.getAll(page, limit, prodiId).then((res) => {
    if ((res.success || res.data) && Array.isArray(res.data?.data)) {
      return {
        data: res.data.data,
        meta: { pagination: res.data },
      };
    }
    return { data: [] as ProfesiLulusan[], meta: { pagination: undefined } };
  });

export function DataProfesiLulusan() {
  const { activeProdiId } = useProfile();
  const prodiId = activeProdiId;
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const { data: response, error, isLoading } = useSWR(
    ["profesi-lulusan", page, limit, prodiId],
    () => fetcherProfesiLulusan(page, limit, prodiId ?? undefined),
    { revalidateOnFocus: false }
  );

  const data = response?.data || [];
  const meta = response?.meta;

  const totalPages = meta?.pagination?.last_page ?? 1;
  const totalData = meta?.pagination?.total ?? data.length;

  const handleAdd = async (profesiData: ProfesiLulusan) => {
    try {
      const apiData = {
        nama_profesi: profesiData.nama_profesi,
        icon: profesiData.icon,
        prodi_id: prodiId,
      };

      const res = await ProfesiLulusanSuperAdminService.create(apiData);
      mutate(["profesi-lulusan", page, limit, prodiId]);
      handleToastResponse({ success: res.success || !!res.data, message: res.message || "Berhasil menambahkan Profesi Lulusan" });
    } catch (error) {
      handleToastResponse({ success: false, message: error instanceof Error ? error.message : "Gagal menambahkan data" });
      throw error;
    }
  };

  const handleEdit = async (profesiData: ProfesiLulusan) => {
    if (!profesiData.id) throw new Error("ID tidak ditemukan");

    try {
      const updateData = {
        nama_profesi: profesiData.nama_profesi,
        icon: profesiData.icon,
        prodi_id: prodiId,
      };

      const res = await ProfesiLulusanSuperAdminService.update(profesiData.id, updateData);
      mutate(["profesi-lulusan", page, limit, prodiId]);
      handleToastResponse({ success: res.success || !!res.data, message: res.message || "Berhasil memperbarui Profesi Lulusan" });
    } catch (error) {
      handleToastResponse({ success: false, message: error instanceof Error ? error.message : "Gagal memperbarui data" });
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await ProfesiLulusanSuperAdminService.delete(id);
      mutate(["profesi-lulusan", page, limit, prodiId]);
      handleToastResponse({ success: res.success || !!res.data, message: res.message || "Berhasil menghapus Profesi Lulusan" });
    } catch (error) {
      handleToastResponse({ success: false, message: "Gagal menghapus data" });
    }
  };

  return (
    <div>
      <div className="w-full flex flex-col gap-3">
        <FilterProfesiLulusan onAdd={handleAdd} />
        <DataTable
          columns={Columns(page, limit, handleEdit, handleDelete)}
          data={data}
          loading={isLoading}
          pagination={{ currentPage: page, lastPage: totalPages, limit, total: totalData }}
        />
      </div>
    </div>
  );
}
