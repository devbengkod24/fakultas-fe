/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { DataTable } from "@/components/data-table";
import { Columns } from "./column";
import { FilterPengumumanProgram } from "./filter";
import { PengumumanProgram } from "@/types/admin/program-unggulan/pengumuman-program/pengumuman-program";
import { handleToastResponse } from "@/lib/toast-response";
import {
  PengumumanProgramUnggulanSuperAdminService,
  ProgramUnggulanSuperAdminService,
} from "@/api/superadmin";
import EmptyState from "@/components/empty-state";
import { AlertCircle, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/context/profileUseContext";

// API Response interface
type APIPengumumanProgram = {
  id: number;
  program_id: number;
  title: string;
  description: string;
  date: string;
  type: "hasil" | "pendaftaran" | "acara";
  created_at: string;
  updated_at?: string;
};

type APIProgramUnggulan = {
  id: number;
  title: string;
};

function fetcherPengumumanProgram(
  page: number,
  limit: number,
  programId?: number | null,
  prodiId?: number | null
) {
  return (async () => {
    // Fetch aktivitas program (all or by program) dan program unggulan list
    let pengumumanRes: any;
    if (programId) {
      pengumumanRes =
        await PengumumanProgramUnggulanSuperAdminService.getProgramUnggulanPengumumanByIdProgramUnggulan(
          programId,
          page,
          limit,
          prodiId ?? undefined
        );
    } else {
      pengumumanRes =
        await PengumumanProgramUnggulanSuperAdminService.getProgramUnggulanPenggumuman(
          page,
          limit,
          prodiId ?? undefined
        );
    }
    const programRes: any =
      await ProgramUnggulanSuperAdminService.getProgramUnggulanList(
        1,
        100,
        prodiId ?? undefined
      );

    // ... rest of fetcher logic ...


    // Handle pengumuman program response
    const pengumumanData: APIPengumumanProgram[] =
      pengumumanRes &&
      pengumumanRes.success &&
      pengumumanRes.data &&
      Array.isArray(pengumumanRes.data.data)
        ? pengumumanRes.data.data
        : [];

    // Handle program unggulan response
    const programData: APIProgramUnggulan[] =
      programRes && programRes.data && Array.isArray(programRes.data)
        ? programRes.data
        : [];

    // Create a map for quick program lookup
    const programMap = new Map<number, { id: number; title: string }>();
    programData.forEach((program) => {
      programMap.set(program.id, {
        id: program.id,
        title: program.title,
      });
    });

    // Transform API data to match component expectations with program details
    // Only include items that belong to a program in the current prodi
    const transformedData: PengumumanProgram[] = pengumumanData
      .map((item: APIPengumumanProgram) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        date: item.date,
        program_id: item.program_id,
        type: item.type,
        program: programMap.get(item.program_id),
      }))
      .filter((item) => item.program !== undefined);

    const pagination =
      pengumumanRes && pengumumanRes.data
        ? {
            last_page: pengumumanRes.data.last_page || 1,
            total: pengumumanRes.data.total || transformedData.length,
          }
        : {
            last_page: 1,
            total: transformedData.length,
          };

    return {
      data: transformedData,
      meta: { pagination },
    };
  })();
}

export function DataPengumumanProgram() {
  const { activeProdiId } = useProfile();
  const prodiId = activeProdiId;
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);

  // Handler to reset query params (page, limit) when filter changes
  const handleFilterChange = (programId: number | null) => {
    setSelectedProgram(programId);
    // Remove page & limit params from URL
    const params = new URLSearchParams(window.location.search);
    params.delete("page");
    params.delete("limit");
    router.replace(
      window.location.pathname + (params.toString() ? `?${params}` : "")
    );
  };

  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useSWR<{
    data: PengumumanProgram[];
    meta: { pagination?: { last_page: number; total: number } };
  }>(
    ["pengumuman-program", page, limit, selectedProgram, prodiId],
    () => fetcherPengumumanProgram(page, limit, selectedProgram, prodiId),
    {
      revalidateOnFocus: false,
    }
  );

  const data = response?.data || [];
  const meta = response?.meta;

  // Get pagination info from backend meta
  const totalPages = meta?.pagination?.last_page ?? 1;
  const totalData = meta?.pagination?.total ?? data.length;

  // Handle add function
  const handleAdd = async (pengumumanProgramData: PengumumanProgram) => {
    let res;
    try {
      // For add operation, backend expects format: pengumuman[1][field]
      const addData = {
        title: pengumumanProgramData.title,
        description: pengumumanProgramData.description,
        date: pengumumanProgramData.date,
        program_id: pengumumanProgramData.program_id,
        type: pengumumanProgramData.type,
        prodi_id: prodiId,
      };

      res =
        await PengumumanProgramUnggulanSuperAdminService.createProgramUnggulanPengumuman(
          addData
        );

      // Revalidate data
      mutate();

      // Show toast based on server response
      handleToastResponse({
        success: res.success,
        message: res.message,
      });
    } catch (error) {
      handleToastResponse({
        success: false,
        message: res?.message || "Gagal menambahkan pengumuman program",
      });
      throw error;
    }
  };

  // Handle edit function
  const handleEdit = async (pengumumanProgram: PengumumanProgram) => {
    if (!pengumumanProgram.id) {
      handleToastResponse({
        success: false,
        message: "ID Pengumuman Program tidak ditemukan",
      });
      return;
    }

    // For edit operation, backend expects direct field names
    const updateData = {
      title: pengumumanProgram.title,
      description: pengumumanProgram.description,
      date: pengumumanProgram.date,
      program_id: pengumumanProgram.program_id,
      type: pengumumanProgram.type,
    };

    let res;
    try {
      res =
        await PengumumanProgramUnggulanSuperAdminService.updateProgramUnggulanPengumuman(
          pengumumanProgram.id,
          updateData
        );

      // Revalidate data
      mutate();

      // Show toast based on server response
      handleToastResponse({
        success: res.success,
        message: res.message,
      });
    } catch (error) {
      handleToastResponse({
        success: false,
        message: res?.message,
      });
      throw error;
    }
  };

  // Handle delete function
  const handleDelete = async (id: number) => {
    let res;
    try {
      res =
        await PengumumanProgramUnggulanSuperAdminService.deleteProgramUnggulanPengumuman(
          id
        );

      // Revalidate data
      mutate();

      // Show toast based on server response
      handleToastResponse({
        success: res.success,
        message: res.message,
      });
    } catch (error) {
      handleToastResponse({
        success: false,
        message: res?.message,
      });
      throw error;
    }
  };

  // Handle error state
  if (error) {
    return (
      <div className="w-full flex flex-col gap-3">
        <EmptyState
          icon={AlertCircle}
          title="Error memuat data"
          subtitle="Terjadi kesalahan saat memuat data pengumuman program"
          button={<FilterPengumumanProgram onAdd={handleAdd} hideFilter />}
        />
      </div>
    );
  }

  // Display all data with proper validation
  const displayData: PengumumanProgram[] = response?.data || [];

  // Show empty state if no data
  if (!isLoading && !error && displayData.length === 0) {
    return (
      <div className="w-full flex flex-col gap-3">
        <EmptyState
          icon={FileText}
          title={
            selectedProgram === null
              ? "Belum ada pengumuman program unggulan"
              : "Belum ada pengumuman program untuk program unggulan yang dipilih"
          }
          subtitle={
            selectedProgram === null
              ? "Tambahkan pengumuman baru untuk program unggulan."
              : "Coba pilih program unggulan lain atau tambahkan pengumuman baru."
          }
          button={
            selectedProgram === null ? (
              <FilterPengumumanProgram onAdd={handleAdd} hideFilter />
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set("page", "1");
                  window.location.search = params.toString();
                }}
              >
                Reset Filter
              </Button>
            )
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3">
        <FilterPengumumanProgram
          onAdd={handleAdd}
          onFilterChange={handleFilterChange}
        />

        <DataTable
          columns={Columns(page, limit, handleEdit, handleDelete)}
          data={displayData}
          loading={isLoading}
          pagination={{
            currentPage: page,
            lastPage: totalPages || 1,
            limit,
            total: totalData,
          }}
        />
      </div>
    </div>
  );
}
