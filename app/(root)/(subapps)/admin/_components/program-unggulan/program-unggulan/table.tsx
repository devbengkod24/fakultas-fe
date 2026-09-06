"use client";

import { DataTable } from "@/components/data-table";
import { FilterProgramUnggulan } from "../program-unggulan/filter";
import { Columns } from "../program-unggulan/column";
import { useSearchParams } from "next/navigation";
import { ProgramUnggulan } from "@/types/admin/program-unggulan/program-unggulan/program-unggulan";
import { handleToastResponse } from "@/lib/toast-response";
import useSWR, { mutate } from "swr";
import { ProgramUnggulanSuperAdminService } from "@/api/superadmin";
import EmptyState from "@/components/empty-state";
import { GraduationCap } from "lucide-react";
import DialogPopUp from "./dialog-popup";
import { useProfile } from "@/context/profileUseContext";

// API Response interfaces
interface APIBenefit {
  id: number;
  program_id: number;
  benefit: string;
}

interface APIRequirement {
  id: number;
  program_id: number;
  requirement: string;
}

interface APIPhoto {
  id: number;
  program_id: number;
  title: string;
  description: string;
  image: string;
}

interface APIStatistic {
  id: number;
  name: string;
  pivot: {
    program_id: number;
    statistic_id: number;
    value: number;
  };
}

interface APIProgramUnggulan {
  id: number;
  title: string;
  short_desc: string;
  image: string | null;
  description: string;
  partner: string;
  duration: string;
  location: string;
  application_deadline: string;
  application_link: string;
  created_at: string;
  updated_at: string;
  program_benefits?: APIBenefit[];
  program_photos?: APIPhoto[];
  program_requirements?: APIRequirement[];
  statistics?: APIStatistic[];
}

const fetcherProgramUnggulan = (page: number, limit: number, prodiId?: number) =>
  ProgramUnggulanSuperAdminService.getProgramUnggulanList(page, limit, prodiId).then(
    (res) => {
      if (res.meta?.success && Array.isArray(res.data)) {
        const transformedData: ProgramUnggulan[] = res.data.map(
          (item: APIProgramUnggulan) => ({
            ...item,
            image: item.image,
            shortDesc: item.short_desc,
            applicationDeadline: item.application_deadline,
            applicationLink: item.application_link,
            benefits:
              item.program_benefits?.map((b: APIBenefit) => b.benefit) || [],
            requirements:
              item.program_requirements?.map(
                (r: APIRequirement) => r.requirement
              ) || [],
            statisticsData:
              item.statistics?.map((s: APIStatistic) => ({
                name: s.name,
                value: s.pivot.value,
              })) || [],
            statistics:
              item.statistics?.map((s: APIStatistic) => ({
                id: s.id,
                name: s.name,
                pivot: {
                  program_id: s.pivot.program_id,
                  statistic_id: s.pivot.statistic_id,
                  value: s.pivot.value,
                },
              })) || [],
          })
        );

        return {
          data: transformedData,
          meta: { pagination: res.meta.pagination },
        };
      }

      return {
        data: [] as ProgramUnggulan[],
        meta: { pagination: undefined },
      };
    }
  );

export function DataProgramUnggulan() {
  const { activeProdiId } = useProfile();
  const prodiId = activeProdiId;
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const {
    data: response,
    error,
    isLoading,
  } = useSWR<{
    data: ProgramUnggulan[];
    meta: { pagination?: { last_page: number; total: number } };
  }>(
    ["program-unggulan", page, limit, prodiId],
    () => fetcherProgramUnggulan(page, limit, prodiId ?? undefined),
    {
      revalidateOnFocus: false,
    }
  );

  const data = response?.data || [];
  const meta = response?.meta;

  // Get pagination info from backend meta (similar to hero slider)
  const totalPages = meta?.pagination?.last_page ?? 1;
  const totalData = meta?.pagination?.total ?? data.length;

  // Handle add function
  const handleAdd = async (
    programUnggulanData: ProgramUnggulan & { imageFile?: File }
  ) => {
    let res;
    try {
      // Map the form data to API structure
      const apiData = {
        title: programUnggulanData.title,
        short_desc: programUnggulanData.shortDesc,
        imageFile: programUnggulanData.imageFile,
        description: programUnggulanData.description,
        partner: programUnggulanData.partner,
        duration: programUnggulanData.duration,
        location: programUnggulanData.location,
        application_deadline: programUnggulanData.applicationDeadline,
        application_link: programUnggulanData.applicationLink,
        benefits: programUnggulanData.benefits,
        requirements: programUnggulanData.requirements,
        statistics:
          programUnggulanData.statisticsData || programUnggulanData.statistics,
        prodi_id: prodiId,
      };

      res = await ProgramUnggulanSuperAdminService.createProgramUnggulan(
        apiData
      );

      // Check if API response is successful
      if (!res.success) {
        throw new Error(res.message || "Gagal menambahkan Program Unggulan");
      }

      // Revalidate data
      mutate(["program-unggulan", page, limit, prodiId]);

      // Show toast based on server response
      handleToastResponse({
        success: res.success,
        message:
          res.message ||
          (res.success
            ? "Program Unggulan berhasil ditambahkan"
            : "Gagal menambahkan Program Unggulan"),
      });
    } catch (error) {
      console.error("Error creating program unggulan:", error);
      handleToastResponse({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal menambahkan Program Unggulan",
      });
      // Re-throw error to prevent dialog from closing
      throw error;
    }
  };

  // Handle edit function
  const handleEdit = async (programUnggulan: ProgramUnggulan) => {
    if (!programUnggulan.id) {
      const errorMsg = "ID Program Unggulan tidak ditemukan";
      handleToastResponse({
        success: false,
        message: errorMsg,
      });
      throw new Error(errorMsg);
    }

    const updateData = {
      title: programUnggulan.title,
      short_desc: programUnggulan.shortDesc,
      imageFile: programUnggulan.imageFile,
      description: programUnggulan.description,
      partner: programUnggulan.partner,
      duration: programUnggulan.duration,
      location: programUnggulan.location,
      application_deadline: programUnggulan.applicationDeadline,
      application_link: programUnggulan.applicationLink,
      benefits: programUnggulan.benefits,
      requirements: programUnggulan.requirements,
      statistics: programUnggulan.statisticsData || programUnggulan.statistics,
    };

    let res;

    try {
      res = await ProgramUnggulanSuperAdminService.updateProgramUnggulan(
        programUnggulan.id,
        updateData
      );

      // Check if API response is successful
      if (!res.success) {
        throw new Error(res.message || "Gagal memperbarui Program Unggulan");
      }

      // Revalidate data
      mutate(["program-unggulan", page, limit]);

      // Show success toast
      handleToastResponse({
        success: res.success,
        message: res.message || "Program Unggulan berhasil diperbarui",
      });
    } catch (error) {
      console.error("Error updating program unggulan:", error);
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Gagal memperbarui Program Unggulan";
      handleToastResponse({
        success: false,
        message: errorMsg,
      });
      // Re-throw error to prevent dialog from closing
      throw error;
    }
  };

  // Handle delete function
  const handleDelete = async (id: number) => {
    try {
      const res = await ProgramUnggulanSuperAdminService.deleteProgramUnggulan(
        id
      );

      // Revalidate data
      mutate(["program-unggulan", page, limit]);

      // Show toast based on server response
      handleToastResponse({
        success: res.success,
        message:
          res.message ||
          (res.success
            ? "Program Unggulan berhasil dihapus"
            : "Gagal menghapus Program Unggulan"),
      });
    } catch (error) {
      console.error("Error deleting program unggulan:", error);
      handleToastResponse({
        success: false,
        message: "Gagal menghapus Program Unggulan",
      });
    }
  };

  // Handle error state
  if (error) {
    return (
      <div>
        <div className="w-full flex flex-col gap-3">
          <EmptyState
            icon={GraduationCap}
            title="Belum Ada Data Program Unggulan"
            subtitle="Belum ada program unggulan yang tersedia. Silakan tambah program unggulan terlebih dahulu."
            button={<DialogPopUp mode="add" onSubmit={handleAdd} />}
            className="h-[400px]"
          />
        </div>
      </div>
    );
  }

  // Display all data with proper validation
  const displayData: ProgramUnggulan[] = response?.data || [];

  // Show empty state if no data
  if (!isLoading && !error && displayData.length === 0) {
    return (
      <div>
        <div className="w-full flex flex-col gap-3">
          <EmptyState
            icon={GraduationCap}
            title="Belum Ada Data Program Unggulan"
            subtitle="Belum ada program unggulan yang tersedia. Silakan tambah program unggulan terlebih dahulu."
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
        <FilterProgramUnggulan onAdd={handleAdd} />

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
      </div>
    </div>
  );
}
