"use client";

import { DataTable } from "@/components/data-table";
import { FilterStrukturOrganisasi } from "../struktur-organisasi/filter";
import { Columns } from "../struktur-organisasi/column";
import { useCallback, useEffect, useState } from "react";
import type { StrukturOrganisasi } from "@/types/fakultas/profile-page/struktur-organisasi/struktur-organisasi";
import { handleToastResponse } from "@/lib/toast-response";
import EmptyState from "@/components/empty-state";
import { Users } from "lucide-react";
import DialogPopUp from "../struktur-organisasi/dialog-popup";
import { StrukturOrganisasiService } from "@/api";

import { useSearchParams } from "next/navigation";

export function DataStrukturOrganisasi() {
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get("search") || "";
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const limitFromUrl = Number(searchParams.get("limit")) || 10;

  const [data, setData] = useState<StrukturOrganisasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    limit: 10,
    total: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await StrukturOrganisasiService.getStrukturAdmin(
        pageFromUrl,
        limitFromUrl,
        searchFromUrl
      );
      if (response.success) {
        // Handle nested data if any, standardizing to array
        const responseData = response.data as unknown as { data?: StrukturOrganisasi[]; meta?: any };
        const result = Array.isArray(response.data)
          ? response.data
          : responseData?.data || [];
        setData(result);

        // Update pagination from response if available, otherwise use local defaults
        const pag = responseData?.meta?.pagination;
        if (pag) {
          setPagination({
            currentPage: pag.current_page || pageFromUrl,
            lastPage: pag.last_page || 1,
            limit: pag.per_page || limitFromUrl,
            total: pag.total ?? result.length,
          });
        } else {
          setPagination({
            currentPage: pageFromUrl,
            lastPage: 1,
            limit: limitFromUrl,
            total: result.length,
          });
        }
      } else {
        handleToastResponse({
          success: false,
          message: response.message || "Gagal mengambil data struktur organisasi",
        });
      }
    } catch (error) {
      console.error(error);
      handleToastResponse({
        success: false,
        message: "Terjadi kesalahan saat mengambil data",
      });
    } finally {
      setLoading(false);
    }
  }, [pageFromUrl, limitFromUrl, searchFromUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = async (
    strukturOrganisasiData: StrukturOrganisasi & { imageFile?: File }
  ) => {
    try {
      const formData = new FormData();
      formData.append("name", strukturOrganisasiData.name);
      formData.append("position", strukturOrganisasiData.position);
      if (strukturOrganisasiData.order_no) {
        formData.append("order_no", String(strukturOrganisasiData.order_no));
      }
      if (strukturOrganisasiData.imageFile) {
        formData.append("image", strukturOrganisasiData.imageFile);
      }

      const response = await StrukturOrganisasiService.createStruktur(formData);

      if (response.success) {
        fetchData();
        handleToastResponse({
          success: true,
          message: "Struktur Organisasi berhasil ditambahkan",
        });
      } else {
        handleToastResponse({
          success: false,
          message: response.message || "Gagal menambahkan Struktur Organisasi",
        });
      }
    } catch (error: unknown) {
      let errorMessage = "Gagal menambahkan Struktur Organisasi";
      if (error instanceof Error) {
        const match = error.message.match(/HTTP \d+:\s*(.*)/);
        if (match) {
          errorMessage = `Gagal menambahkan Struktur Organisasi (${match[1]})`;
        }
      }
      handleToastResponse({
        success: false,
        message: errorMessage,
      });
      console.error(error);
    }
  };

  const handleEdit = async (strukturOrganisasi: StrukturOrganisasi) => {
    if (!strukturOrganisasi.id) {
      handleToastResponse({
        success: false,
        message: "ID Struktur Organisasi tidak ditemukan",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", strukturOrganisasi.name);
      formData.append("position", strukturOrganisasi.position);
      if (strukturOrganisasi.order_no) {
        formData.append("order_no", String(strukturOrganisasi.order_no));
      }
      
      // Method spoofing for PUT with FormData if needed by backend
      // formData.append("_method", "PUT");

      const response = await StrukturOrganisasiService.updateStruktur(
        strukturOrganisasi.id,
        formData
      );

      if (response.success) {
        fetchData();
        handleToastResponse({
          success: true,
          message: "Struktur Organisasi berhasil diperbarui",
        });
      } else {
        handleToastResponse({
          success: false,
          message: response.message || "Gagal memperbarui Struktur Organisasi",
        });
      }
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal memperbarui Struktur Organisasi",
      });
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await StrukturOrganisasiService.deleteStruktur(id);
      if (response.success) {
        fetchData();
        handleToastResponse({
          success: true,
          message: "Struktur Organisasi berhasil dihapus",
        });
      } else {
        handleToastResponse({
          success: false,
          message: response.message || "Gagal menghapus Struktur Organisasi",
        });
      }
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal menghapus Struktur Organisasi",
      });
      console.error(error);
    }
  };

  const columns = Columns(
    pagination.currentPage,
    pagination.limit,
    handleEdit,
    handleDelete
  );

  const hasData = data && data.length > 0;

  if (!hasData && !loading) {
    return (
      <div>
        <div className="w-full flex flex-col gap-3">
          <FilterStrukturOrganisasi onAdd={handleAdd} />
          <EmptyState
            icon={Users}
            title={searchFromUrl ? "Data Tidak Ditemukan" : "Belum Ada Data Struktur Organisasi"}
            subtitle={searchFromUrl 
              ? `Tidak ada data struktur organisasi yang cocok dengan pencarian "${searchFromUrl}"`
              : "Belum ada data struktur organisasi fakultas yang tersedia. Silakan tambah data struktur organisasi terlebih dahulu."}
            button={!searchFromUrl && <DialogPopUp mode="add" onSubmit={handleAdd} />}
            className="h-[400px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full flex flex-col gap-3">
        <FilterStrukturOrganisasi onAdd={handleAdd} />
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          pagination={pagination}
        />
      </div>
    </div>
  );
}
