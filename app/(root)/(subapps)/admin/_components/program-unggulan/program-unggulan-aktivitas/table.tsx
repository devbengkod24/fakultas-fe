/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { FilterProgramAktivitas } from "../program-unggulan-aktivitas/filter";
import { Columns } from "../program-unggulan-aktivitas/column";
import { useSearchParams } from "next/navigation";
import { PhotoActivity } from "@/types/admin/program-unggulan/photos-program/program-unggulan-photos";
import { handleToastResponse } from "@/lib/toast-response";
import useSWR from "swr";
import { ProgramUnggulanSuperAdminService } from "@/api/superadmin";
import { AktivitasProgramUnggulanSuperAdminService } from "@/api/superadmin";
import EmptyState from "@/components/empty-state";
import { GraduationCap, AlertCircle } from "lucide-react";
import { useProfile } from "@/context/profileUseContext";

interface APIPhoto {
  id: number;
  program_id: number;
  title: string;
  description: string;
  image: string;
  created_at: string;
  updated_at?: string;
}

interface APIProgramUnggulan {
  id: number;
  title: string;
  program_photos?: APIPhoto[];
}

async function fetcherProgramAktivitas(
  page: number,
  limit: number,
  prodiId?: number | null
) {
  const aktivitasRes =
    await AktivitasProgramUnggulanSuperAdminService.getProgramUnggulanActivitiesAll(
      page,
      limit,
      prodiId ?? undefined
    );

  const programRes =
    await ProgramUnggulanSuperAdminService.getProgramUnggulanList(
      1,
      100,
      prodiId ?? undefined
    );

  const aktivitasData: APIPhoto[] =
    aktivitasRes?.data?.data ||
    aktivitasRes?.data ||
    [];

  const programData: APIProgramUnggulan[] =
    programRes?.data?.data ||
    programRes?.data ||
    [];

  const programMap = new Map<
    number,
    { id: number; title: string }
  >();

  programData.forEach((program) => {
    programMap.set(Number(program.id), {
      id: Number(program.id),
      title: program.title,
    });
  });

  const transformedData: PhotoActivity[] =
    aktivitasData.map((item) => {
      const pId = Number(item.program_id);

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        image: item.image,
        created_at: item.created_at,
        updated_at: item.updated_at,

        program_id: pId,

        program: programMap.get(pId),
      };
    });

  return {
    data: transformedData,
    meta: {
      pagination: {
        last_page:
          aktivitasRes?.data?.last_page || 1,

        total:
          aktivitasRes?.data?.total ||
          transformedData.length,
      },
    },
  };
}

export function DataAktivitasProgram({
  prodiId,
}: {
  prodiId?: number | null;
}) {
  const { activeProdiId } = useProfile();

  const effectiveProdiId =
    prodiId ?? activeProdiId;

  const searchParams = useSearchParams();

  const page =
    Number(searchParams.get("page")) || 1;

  const limit =
    Number(searchParams.get("limit")) || 10;

  const [selectedProgram, setSelectedProgram] =
    useState<number | null>(null);

  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useSWR<{
    data: PhotoActivity[];
    meta: {
      pagination?: {
        last_page: number;
        total: number;
      };
    };
  }>(
    [
      "program-unggulan-photos",
      page,
      limit,
      effectiveProdiId,
    ],
    () =>
      fetcherProgramAktivitas(
        page,
        limit,
        effectiveProdiId
      ),
    {
      revalidateOnFocus: false,
    }
  );

  const rawData = response?.data || [];

  // ✅ FILTER LOKAL
  const displayData = useMemo(() => {
    if (!selectedProgram) {
      return rawData;
    }

    return rawData.filter(
      (item) =>
        Number(item.program_id) ===
        Number(selectedProgram)
    );
  }, [rawData, selectedProgram]);

  const meta = response?.meta;

  const totalPages =
    meta?.pagination?.last_page ?? 1;

  const totalData = displayData.length;

  const handleFilterChange = (
    programId: number | null
  ) => {
    setSelectedProgram(programId);
  };

  const handleAdd = async (
    aktivitasProgramData: PhotoActivity & {
      imageFile?: File;
    }
  ) => {
    try {
      const res =
        await AktivitasProgramUnggulanSuperAdminService.createActivityPhoto(
          aktivitasProgramData.program_id,
          aktivitasProgramData
        );

      mutate();

      handleToastResponse({
        success: res.success,
        message:
          res.message ||
          "Aktivitas berhasil ditambahkan",
      });
    } catch (error) {
      console.error(error);

      handleToastResponse({
        success: false,
        message:
          "Gagal menambahkan aktivitas",
      });
    }
  };

  const handleEdit = async (
    aktivitasProgram: PhotoActivity
  ) => {
    try {
      const res =
        await AktivitasProgramUnggulanSuperAdminService.editActivityPhoto(
          aktivitasProgram.program_id,
          aktivitasProgram
        );

      mutate();

      handleToastResponse({
        success: res.success,
        message:
          res.message ||
          "Aktivitas berhasil diperbarui",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteActivityPhoto =
    async (
      photoId: number,
      programId: number
    ) => {
      try {
        const result =
          await AktivitasProgramUnggulanSuperAdminService.deleteActivityPhoto(
            programId,
            photoId
          );

        mutate();

        handleToastResponse({
          success: result.success,
          message:
            result.message ||
            "Aktivitas berhasil dihapus",
        });

        return result;
      } catch (error) {
        console.error(error);

        throw error;
      }
    };

  if (error) {
    return (
      <div className="w-full flex flex-col gap-3">
        <EmptyState
          icon={AlertCircle}
          title="Error memuat data"
          subtitle="Terjadi kesalahan saat memuat data aktivitas program"
          button={
            <FilterProgramAktivitas
              onAdd={handleAdd}
              prodiId={effectiveProdiId}
              hideFilter
            />
          }
        />
      </div>
    );
  }

  if (
    !isLoading &&
    !error &&
    displayData.length === 0
  ) {
    return (
      <div className="w-full flex flex-col gap-3">
        <EmptyState
          icon={GraduationCap}
          title={
            selectedProgram === null
              ? "Belum ada aktivitas program"
              : "Data tidak ditemukan"
          }
          subtitle="Tambahkan aktivitas baru untuk program studi Anda."
          button={
            <FilterProgramAktivitas
              onAdd={handleAdd}
              onFilterChange={
                handleFilterChange
              }
              prodiId={effectiveProdiId}
              selectedProgram={
                selectedProgram
              }
            />
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div className="w-full flex flex-col gap-3">
        <FilterProgramAktivitas
          onAdd={handleAdd}
          onFilterChange={
            handleFilterChange
          }
          prodiId={effectiveProdiId}
          selectedProgram={
            selectedProgram
          }
        />

        <DataTable
          columns={Columns(
            page,
            limit,
            handleEdit,
            handleDeleteActivityPhoto
          )}
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