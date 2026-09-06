/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import DialogPopUp from "./dialog-popup";

import { PhotoActivity } from "@/types/admin/program-unggulan/photos-program/program-unggulan-photos";

import { ProgramUnggulanSuperAdminService } from "@/api/superadmin";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useProfile } from "@/context/profileUseContext";

interface FilterProgramUnggulanProps {
  onAdd?: (
    data: PhotoActivity & { imageFile?: File }
  ) => Promise<void>;

  onFilterChange?: (programId: number | null) => void;

  hideFilter?: boolean;

  prodiId?: number | null;

  selectedProgram?: number | null;
}

export function FilterProgramAktivitas({
  onAdd,
  onFilterChange,
  hideFilter = false,
  prodiId,
  selectedProgram,
}: FilterProgramUnggulanProps) {
  const { activeProdiId } = useProfile();

  const effectiveProdiId =
    prodiId ?? activeProdiId;

  const [programs, setPrograms] = useState<
    { id: number; title: string }[]
  >([]);

  // FETCH PROGRAM
  useEffect(() => {
    if (!effectiveProdiId) return;

    const fetchPrograms = async () => {
      try {
        const res =
          await ProgramUnggulanSuperAdminService.getProgramUnggulanList(
            1,
            100,
            effectiveProdiId
          );

        const rawData =
          Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.data?.data)
            ? res.data.data
            : [];

        const mapped = rawData.map((item: any) => ({
          id: item.id,
          title: item.title,
        }));

        setPrograms(mapped);
      } catch (error) {
        console.error(
          "Error fetching program unggulan:",
          error
        );
      }
    };

    fetchPrograms();
  }, [effectiveProdiId]);

  const handleAddProgramAktivitas = async (
    data: PhotoActivity & { imageFile?: File }
  ) => {
    if (onAdd) {
      await onAdd(data);
    }
  };

  // ONLY BUTTON
  if (hideFilter) {
    return (
      <div className="flex justify-end">
        <DialogPopUp
          mode="add"
          onSubmit={handleAddProgramAktivitas}
          prodiId={effectiveProdiId}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center gap-3 justify-end">
      <Select
        value={
          selectedProgram !== null &&
          selectedProgram !== undefined
            ? String(selectedProgram)
            : "all"
        }
        onValueChange={(value) => {
          const parsedValue =
            value === "all"
              ? null
              : Number(value);

          onFilterChange?.(parsedValue);
        }}
      >
        <SelectTrigger className="w-auto min-w-[260px] h-10">
          <SelectValue placeholder="Semua Program Unggulan" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            Semua Program Unggulan
          </SelectItem>

          {programs.map((program) => (
            <SelectItem
              key={program.id}
              value={String(program.id)}
            >
              {program.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DialogPopUp
        mode="add"
        onSubmit={handleAddProgramAktivitas}
        prodiId={effectiveProdiId}
      />
    </div>
  );
}