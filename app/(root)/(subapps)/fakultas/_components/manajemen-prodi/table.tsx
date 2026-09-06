"use client";

import { DataTable } from "@/components/data-table";
import { FilterProdi } from "./filter";
import { Columns } from "./column";
import type { ProdiData } from "@/types/fakultas/manajemen-prodi/manajemen-prodi";
import DialogPopUp from "./dialog-popup";
import { useSearchParams } from "next/navigation";
import { handleToastResponse } from "@/lib/toast-response";
import useSWR, { mutate } from "swr";
import { ManajemenProdiSuperAdminService } from "@/api/superadmin";
import EmptyState from "@/components/empty-state";
import { Building2, AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React, { useState } from "react";
import { toast } from "sonner";

// Improved fetcher with robust data extraction for different API response formats
const fetcherProdi = (page: number, limit: number, search?: string) =>
  ManajemenProdiSuperAdminService.getAll(page, limit, search).then((res) => {
    // Robust extraction: handles { success, data: { data, meta } } or { data, meta }
    const rawData = res?.data?.data ?? res?.data ?? [];
    const rawMeta = res?.data?.meta ?? res?.meta;

    return {
      data: Array.isArray(rawData) ? (rawData as ProdiData[]) : [],
      meta: {
        pagination: {
          last_page: Number(rawMeta?.last_page || rawMeta?.pagination?.last_page || 1),
          total: Number(rawMeta?.total || rawMeta?.pagination?.total || 0),
        },
      },
    };
  });

export function DataDaftarProdi() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const searchFromUrl = searchParams.get("search") || "";

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: response,
    error,
    isLoading,
    isValidating,
  } = useSWR(
    ["manajemen-prodi", page, limit, searchFromUrl],
    () => fetcherProdi(page, limit, searchFromUrl),
    { 
      revalidateOnFocus: false,
      keepPreviousData: true, // Smooth pagination transition
    }
  );

  // Fetch categories to map names if missing from the list response
  const { data: categoryRes } = useSWR(
    "prodi-categories",
    () => ManajemenProdiSuperAdminService.getCategories()
  );

  const categories = React.useMemo(() => {
    const raw = categoryRes?.data?.data ?? categoryRes?.data ?? categoryRes ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [categoryRes]);

  const data = React.useMemo(() => {
    const rawData = response?.data || [];
    if (categories.length === 0) return rawData;

    return rawData.map((prodi) => {
      if (prodi.category) return prodi;
      
      const category = categories.find((c) => c.id === prodi.category_id);
      return {
        ...prodi,
        category: category ? { id: category.id, nama: category.nama } : undefined,
      };
    });
  }, [response?.data, categories]);

  const meta = response?.meta;

  const totalPages = meta?.pagination?.last_page ?? 1;
  const totalData = meta?.pagination?.total ?? 0;

  // Handle add
  const handleAdd = async (prodiData: ProdiData) => {
    try {
      const res = await ManajemenProdiSuperAdminService.create({
        nama: prodiData.nama,
        kode_prodi: prodiData.kode_prodi,
        category_id: prodiData.category_id,
        gelar: prodiData.gelar,
      });

      handleToastResponse(res);
      mutate(["manajemen-prodi", page, limit, searchFromUrl]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menambahkan program studi";
      handleToastResponse({ success: false, message });
      console.error(err);
      throw err; // Rethrow to keep the dialog open
    }
  };

  // Handle edit
  const handleEdit = async (prodi: ProdiData) => {
    if (!prodi.id) {
      toast.error("ID Program Studi tidak ditemukan");
      return;
    }

    try {
      const res = await ManajemenProdiSuperAdminService.update(prodi.id, {
        nama: prodi.nama,
        kode_prodi: prodi.kode_prodi,
        category_id: prodi.category_id,
        gelar: prodi.gelar,
      });

      handleToastResponse(res);
      mutate(["manajemen-prodi", page, limit, searchFromUrl]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memperbarui program studi";
      handleToastResponse({ success: false, message });
      console.error(err);
      throw err; // Rethrow to keep the dialog open
    }
  };

  // Handle delete
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const res = await ManajemenProdiSuperAdminService.delete(deleteId);
      handleToastResponse(res);
      mutate(["manajemen-prodi", page, limit, searchFromUrl]);
      setDeleteId(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menghapus program studi";
      handleToastResponse({ success: false, message });
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <FilterProdi onAdd={handleAdd} />

      {error ? (
        <EmptyState
          icon={AlertTriangle}
          title="Terjadi Kesalahan"
          subtitle="Data program studi tidak dapat dimuat. Silakan coba lagi nanti."
          className="h-[400px]"
        />
      ) : !isLoading && data.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={searchFromUrl ? "Tidak Ada Hasil Pencarian" : "Belum Ada Data Program Studi"}
          subtitle={
            searchFromUrl
              ? `Tidak ada hasil untuk pencarian "${searchFromUrl}". Coba gunakan kata kunci yang berbeda.`
              : "Belum ada program studi yang tersedia. Silakan tambahkan program studi terlebih dahulu."
          }
          button={!searchFromUrl && <DialogPopUp mode="add" onSubmit={handleAdd} />}
          className="h-[400px]"
        />
      ) : (
        <DataTable
          columns={Columns(page, limit, handleEdit, (id) => setDeleteId(id))}
          data={data}
          loading={isLoading || isValidating} // Show loading state during re-validation
          pagination={{
            currentPage: page,
            lastPage: totalPages,
            limit,
            total: totalData,
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!deleteId} 
        onOpenChange={(open) => !open && !isDeleting && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Program Studi?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Program studi akan dihapus
              dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
