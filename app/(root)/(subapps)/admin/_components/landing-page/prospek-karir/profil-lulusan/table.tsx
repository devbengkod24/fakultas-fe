"use client"
import { DataTable } from "@/components/data-table";
import { FilterProfilLulusan } from "./filter";
import { Columns } from "./column";
import { useSearchParams } from "next/navigation";
import { ProfilLulusan } from "@/types/admin/landing-page/prospek-karir/profil-lulusan";
import { handleToastResponse } from "@/lib/toast-response";
import useSWR, { mutate } from "swr";
import { ProfilLulusanSuperAdminService } from "@/api/superadmin";

import { useProfile } from "@/context/profileUseContext";

const fetcherProfilLulusan = (page: number, limit: number, prodiId?: number) =>
  ProfilLulusanSuperAdminService.getAll(page, limit, prodiId).then((res) => {
    if ((res.success || res.data) && Array.isArray(res.data?.data)) {
      return {
        data: res.data.data,
        meta: { pagination: res.data },
      };
    }
    return { data: [] as ProfilLulusan[], meta: { pagination: undefined } };
  });

export function DataProfilLulusan() {
  const { activeProdiId } = useProfile();
  const prodiId = activeProdiId;
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const { data: response, error, isLoading } = useSWR(
    ["profil-lulusan", page, limit, prodiId],
    () => fetcherProfilLulusan(page, limit, prodiId ?? undefined),
    { revalidateOnFocus: false }
  );

  const data = response?.data || [];
  const meta = response?.meta;

  const totalPages = meta?.pagination?.last_page ?? 1;
  const totalData = meta?.pagination?.total ?? data.length;

  const handleAdd = async (profilData: ProfilLulusan) => {
    try {
      const apiData = {
        kode: profilData.kode,
        deskripsi: profilData.deskripsi,
        prodi_id: prodiId,
      };

      const res = await ProfilLulusanSuperAdminService.create(apiData);
      mutate(["profil-lulusan", page, limit, prodiId]);
      handleToastResponse({ success: res.success || !!res.data, message: res.message || "Berhasil menambahkan Profil Lulusan" });
    } catch (error) {
      handleToastResponse({ success: false, message: error instanceof Error ? error.message : "Gagal menambahkan data" });
      throw error;
    }
  };

  const handleEdit = async (profilData: ProfilLulusan) => {
    if (!profilData.id) throw new Error("ID tidak ditemukan");

    try {
      const updateData = {
        kode: profilData.kode,
        deskripsi: profilData.deskripsi,
        prodi_id: prodiId,
      };

      const res = await ProfilLulusanSuperAdminService.update(profilData.id, updateData);
      mutate(["profil-lulusan", page, limit, prodiId]);
      handleToastResponse({ success: res.success || !!res.data, message: res.message || "Berhasil memperbarui Profil Lulusan" });
    } catch (error) {
      handleToastResponse({ success: false, message: error instanceof Error ? error.message : "Gagal memperbarui data" });
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await ProfilLulusanSuperAdminService.delete(id);
      mutate(["profil-lulusan", page, limit, prodiId]);
      handleToastResponse({ success: res.success || !!res.data, message: res.message || "Berhasil menghapus Profil Lulusan" });
    } catch (error) {
      handleToastResponse({ success: false, message: "Gagal menghapus data" });
    }
  };

  return (
    <div>
      <div className="w-full flex flex-col gap-3">
        <FilterProfilLulusan onAdd={handleAdd} />
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
