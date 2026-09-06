/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable } from "@/components/data-table";
import { FilterBerita } from "./filter";
import { Columns } from "./column";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Berita } from "@/types/admin-fakultas/manajemen-berita/berita";
import { useState, useEffect } from "react";
import { AdminBeritaService } from "@/api";
import { toast } from "sonner";

const VALID_TIPE = new Set(["prestasi", "kegiatan", "berita"]);

const normalizeBeritaItem = (item: any): Berita | null => {
  if (!item || typeof item !== "object") return null;

  const rawTipe = item.tipe ?? item.type;
  const tipe = VALID_TIPE.has(rawTipe) ? rawTipe : "berita";

  return {
    id: item.id,
    tipe,
    judul: item.judul ?? item.title ?? "",
    konten: item.konten ?? item.content ?? "",
    gambar:
      item.gambar ??
      item.image ??
      item.thumbnail ??
      item.foto ??
      item.gambar_url ??
      item.image_url ??
      item.photo_url ??
      item.url ??
      "",
    user_id: item.user_id,
    user_name: item.user_name,
    published_at: item.published_at,
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
};

const extractBeritaArray = (response: any): Berita[] => {
  const rawData = response?.data?.data ?? response?.data ?? [];

  if (!Array.isArray(rawData)) return [];

  return rawData
    .map(normalizeBeritaItem)
    .filter((item): item is Berita => item !== null);
};

const isValidBeritaPayload = (response: any): boolean => {
  return Array.isArray(response?.data?.data) || Array.isArray(response?.data);
};

export function DataDaftarBerita() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const searchValue = searchParams.get("search") || "";
  const tipeFilter = searchParams.get("type") || "all";
  const month = searchParams.get("month") || "";
  const year = searchParams.get("year") || "";

  const [data, setData] = useState<Berita[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    limit,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateQuery = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    if (!updates.page) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const loadData = async () => {
    setIsLoading(true);

    try {
      const response = await AdminBeritaService.getBeritaList(
        page,
        limit,
        searchValue,
        tipeFilter,
        month,
        year,
      );

      const fetchedData = extractBeritaArray(response);

      if (isValidBeritaPayload(response)) {
        setData(fetchedData);

        const meta = response?.data;
        setPagination({
          currentPage: meta?.current_page || page,
          lastPage: meta?.last_page || 1,
          limit: meta?.per_page || limit,
          total: meta?.total ?? fetchedData.length,
        });
      } else {
        toast.error("Gagal memuat data berita");
      }

      setError(null);
    } catch (err) {
      console.error("Error loading berita:", err);
      setError("Gagal memuat data berita");
      toast.error("Gagal memuat data berita");
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadData();
  }, [page, limit, searchValue, tipeFilter, month, year]);

  const handleAdd = async (beritaData: any) => {
    try {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("judul", beritaData.judul);
      formData.append("konten", beritaData.konten);
      formData.append("type", beritaData.tipe);

      if (beritaData.gambarFile) {
        formData.append("gambar", beritaData.gambarFile);
      }

      const response = await AdminBeritaService.createBerita(formData);

      if (response.success === true || response.data || response.id) {
        toast.success("Berita berhasil ditambahkan");
        await loadData();
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : String(err);

      console.error("[handleAdd] Error:", errorMsg);

      toast.error(`Gagal: ${errorMsg}`);

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (berita: Berita) => {
    try {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("judul", berita.judul);
      formData.append("konten", berita.konten);
      formData.append("type", berita.tipe);

      if (berita.gambarFile instanceof File) {
        formData.append("gambar", berita.gambarFile);
      }

      const response = await AdminBeritaService.updateBerita(
        berita.id!,
        formData,
      );

      if (response.success === true || response.data || response.id) {
        toast.success("Berita berhasil diperbarui");
        await loadData();
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : String(err);

      console.error("[handleEdit] Error:", errorMsg);

      toast.error(`Gagal memperbarui berita: ${errorMsg}`);

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);

      const response = await AdminBeritaService.deleteBerita(id);

      if (response.success === true || response.data || response.message) {
        toast.success("Berita berhasil dihapus");
        await loadData();
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : String(err);

      console.error("[handleDelete] Error:", errorMsg);

      toast.error(`Gagal menghapus berita: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="w-full flex flex-col gap-3">
        <FilterBerita
          tipeFilter={tipeFilter}
          onTipeFilterChange={(v) => updateQuery({ type: v })}
          month={month}
          year={year}
          onMonthFilterChange={(v) => updateQuery({ month: v })}
          onYearFilterChange={(v) => updateQuery({ year: v })}
          onAdd={handleAdd}
        />

        <div className="h-[400px] flex items-center justify-center text-red-500">
          Terjadi kesalahan saat memuat data
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <FilterBerita
        tipeFilter={tipeFilter}
        onTipeFilterChange={(v) => updateQuery({ type: v })}
        month={month}
        year={year}
        onMonthFilterChange={(v) => updateQuery({ month: v })}
        onYearFilterChange={(v) => updateQuery({ year: v })}
        onAdd={handleAdd}
      />

      <DataTable
        columns={Columns(
          pagination.currentPage,
          pagination.limit,
          handleEdit,
          handleDelete,
        )}
        data={data}
        loading={isLoading}
        pagination={pagination}
      />
    </div>
  );
}
