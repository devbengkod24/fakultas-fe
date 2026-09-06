"use client";

import { DataTable } from "@/components/data-table";
import { FilterHeroSlider } from "./filter";
import { Columns } from "./column";
import { useSearchParams } from "next/navigation";
import type { HeroSlider } from "@/types/admin-fakultas/hero-slider/hero-slider";
import useSWR, { mutate } from "swr";
import { handleToastResponse } from "@/lib/toast-response";
import { AdminFakultasHeroSliderService } from "@/api/admin-fakultas";
import EmptyState from "@/components/empty-state";
import { Images, AlertTriangle } from "lucide-react";
import DialogPopUp from "./dialog-popup";

const fetcherHeroSlider = (
  page: number,
  limit: number,
  search?: string,
  status?: string,
) =>
  AdminFakultasHeroSliderService.getHeroSliderList(
    page,
    limit,
    undefined,
    search,
    status,
  ).then((res) => ({
    data: Array.isArray(res.data?.data) ? res.data.data : [],
    meta: res.data?.meta || null,
  }));

export function DataHeroSlider() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const {
    data: response,
    error,
    isLoading,
  } = useSWR<{
    data: HeroSlider[];
    meta: { pagination?: { last_page: number; total: number } };
  }>(
    ["hero-slider", page, limit, search, status],
    () => fetcherHeroSlider(page, limit, search, status),
    {
      revalidateOnFocus: false,
    },
  );

  const data = response?.data || [];
  const meta = response?.meta;

  // Get pagination info from backend meta (similar to pengumuman)
  const totalPages = meta?.pagination?.last_page ?? 1;
  const totalData = meta?.pagination?.total ?? data.length;

  // Handle add function
  const handleAdd = async (
    heroSliderData: HeroSlider & { imageFile?: File },
  ) => {
    let res;
    try {
      res = await AdminFakultasHeroSliderService.createHeroSlider({
        title: heroSliderData.title,
        subtitle: heroSliderData.subtitle,
        isActive: heroSliderData.isActive,
        imageFile: heroSliderData.imageFile,
      });

      // Revalidate data
      mutate(["hero-slider", page, limit, search, status]);

      handleToastResponse(res);
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal menambahkan Hero Slider",
      });
      console.error(error);
    }
  };

  // Handle edit function
  const handleEdit = async (heroSlider: HeroSlider) => {
    if (!heroSlider.id) {
      handleToastResponse({
        success: false,
        message: "ID Hero Slider tidak ditemukan",
      });
      return;
    }

    const updateData = {
      title: heroSlider.title,
      subtitle: heroSlider.subtitle,
      isActive: heroSlider.isActive,
      imageFile: heroSlider.imageFile,
    };

    let res;
    try {
      res = await AdminFakultasHeroSliderService.updateHeroSlider(
        heroSlider.id,
        updateData,
      );

      // Revalidate data
      mutate(["hero-slider", page, limit, search, status]);

      handleToastResponse(res);
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal memperbarui Hero Slider",
      });
      console.error(error);
      throw error;
    }
  };

  // Handle delete function
  const handleDelete = async (id: number) => {
    let res;
    try {
      res = await AdminFakultasHeroSliderService.deleteHeroSlider(id);

      // Revalidate data
      mutate(["hero-slider", page, limit, search, status]);

      handleToastResponse(res);
    } catch (error) {
      handleToastResponse({
        success: false,
        message: "Gagal menghapus Hero Slider",
      });
      console.error(error);
      throw error;
    }
  };

  // Handle error state
  if (error) {
    return (
      <div>
        <div className="w-full flex flex-col gap-3">
          <FilterHeroSlider onAdd={handleAdd} />
          <EmptyState
            icon={AlertTriangle}
            title="Terjadi Kesalahan"
            subtitle="Data hero slider tidak dapat dimuat. Silakan coba lagi nanti."
            className="h-[400px]"
          />
        </div>
      </div>
    );
  }

  // Display all data with proper validation
  const displayData: HeroSlider[] = response?.data || [];

  // Show empty state if no data
  if (!isLoading && !error && displayData.length === 0) {
    return (
      <div>
        <div className="w-full flex flex-col gap-3">
          <FilterHeroSlider onAdd={handleAdd} />
          <EmptyState
            icon={Images}
            title="Belum Ada Data Hero Slider"
            subtitle="Belum ada gambar hero slider yang tersedia. Silakan tambah gambar hero slider terlebih dahulu."
            button={<DialogPopUp mode="add" onSubmit={handleAdd} />}
            className="h-[400px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full flex flex-col gap-3">
        <FilterHeroSlider onAdd={handleAdd} />

        <DataTable
          columns={Columns(page, limit, handleEdit, handleDelete)}
          data={displayData}
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
