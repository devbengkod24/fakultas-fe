/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable } from "@/components/data-table";
import { FilterRuanganSidang } from "./filter";
import { Columns } from "./column";
import { useSearchParams } from "next/navigation";
import type { RuanganSidang } from "@/types/fakultas/ruangan-sidang/ruangan-sidang";
import { useState, useEffect, useMemo } from "react";
import { RuanganSidangService } from "@/api/fakultas";
import { toast } from "sonner";

const extractRuanganArray = (response: any): RuanganSidang[] => {
  const rawData = response?.data?.data ?? response?.data ?? [];

  if (!Array.isArray(rawData)) return [];

  return rawData.filter((item: any): item is RuanganSidang => {
    return item && typeof item === "object" && typeof item.id === "number";
  });
};

const isValidRuanganPayload = (response: any): boolean => {
  return Array.isArray(response?.data?.data) || Array.isArray(response?.data);
};

export function DataRuanganSidang() {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [data, setData] = useState<RuanganSidang[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // SEARCH & FILTER
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // LOAD DATA
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const response = await RuanganSidangService.getAll({
          search: "",
          limit: 100,
        });

        const fetchedData = extractRuanganArray(response);

        if (isValidRuanganPayload(response)) {
          setData(fetchedData);
        } else {
          toast.error("Gagal memuat data ruangan");
        }

        setError(null);
      } catch (err) {
        console.error("Error loading ruangan:", err);
        setError("Gagal memuat data ruangan");
        toast.error("Gagal memuat data ruangan");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [page, limit]);

  // FILTER DATA
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const keyword = searchValue.toLowerCase();

      const matchSearch =
        item.nama_ruangan?.toLowerCase().includes(keyword) ||
        (item.gedung && item.gedung.toLowerCase().includes(keyword));

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "aktif" && item.is_active) ||
        (statusFilter === "nonaktif" && !item.is_active);

      return matchSearch && matchStatus;
    });
  }, [data, searchValue, statusFilter]);

  const handleAdd = async (ruanganData: any) => {
    try {
      setIsLoading(true);

      const response = await RuanganSidangService.create(ruanganData);

      if (response.success === true || response.data || response.id) {
        toast.success("Ruangan berhasil ditambahkan");

        const reloadResponse = await RuanganSidangService.getAll({
          search: "",
          limit: 100,
        });

        const newData = extractRuanganArray(reloadResponse);

        if (isValidRuanganPayload(reloadResponse)) {
          setData(newData);
        }
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

  const handleEdit = async (ruangan: RuanganSidang) => {
    try {
      setIsLoading(true);

      const response = await RuanganSidangService.update(
        ruangan.id!,
        ruangan,
      );

      if (response.success === true || response.data || response.id) {
        toast.success("Ruangan berhasil diperbarui");

        const reloadResponse = await RuanganSidangService.getAll({
          search: "",
          limit: 100,
        });

        const newData = extractRuanganArray(reloadResponse);

        if (isValidRuanganPayload(reloadResponse)) {
          setData(newData);
        }
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : String(err);

      console.error("[handleEdit] Error:", errorMsg);

      toast.error(`Gagal memperbarui ruangan: ${errorMsg}`);

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);

      const response = await RuanganSidangService.delete(id);

      if (response.success === true || response.data || response.message) {
        toast.success("Ruangan berhasil dihapus");

        const reloadResponse = await RuanganSidangService.getAll({
          search: "",
          limit: 100,
        });

        const newData = extractRuanganArray(reloadResponse);

        if (isValidRuanganPayload(reloadResponse)) {
          setData(newData);
        }
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : String(err);

      console.error("[handleDelete] Error:", errorMsg);

      toast.error(`Gagal menghapus ruangan: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="w-full flex flex-col gap-3">
        <FilterRuanganSidang
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
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
      <FilterRuanganSidang
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onAdd={handleAdd}
      />

      <DataTable
        columns={Columns(
          page,
          limit,
          handleEdit,
          handleDelete,
        )}
        data={filteredData}
        loading={isLoading}
        pagination={{
          currentPage: page,
          lastPage: 1,
          limit,
          total: filteredData.length,
        }}
      />
    </div>
  );
}