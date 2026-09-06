/* eslint-disable @typescript-eslint/no-explicit any */
"use client";

import React, { useEffect, useState } from "react";
import DialogPopUp from "../pengumuman-program/dialog-popup";
import { PengumumanProgram } from "@/types/admin/program-unggulan/pengumuman-program/pengumuman-program";
import { ProgramUnggulanSuperAdminService } from "@/api/superadmin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfile } from "@/context/profileUseContext";

interface FilterPengumumanProgramProps {
  onAdd?: (data: PengumumanProgram) => Promise<void>;
  onFilterChange?: (programId: number | null) => void;
  hideFilter?: boolean;
  prodiId?: number | null;
}

export function FilterPengumumanProgram({
  onAdd,
  onFilterChange,
  hideFilter = false,
  prodiId,
}: FilterPengumumanProgramProps) {
  const { activeProdiId } = useProfile();
  const effectiveProdiId = prodiId ?? activeProdiId;

  const [programs, setPrograms] = useState<{ id: number; title: string }[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);

  useEffect(() => {
    if (!effectiveProdiId) return;

    ProgramUnggulanSuperAdminService.getProgramUnggulanList(
      1,
      100,
      effectiveProdiId ?? undefined
    ).then((res) => {
      if (res.data && Array.isArray(res.data)) {
        setPrograms(res.data.map((p: any) => ({ id: p.id, title: p.title })));
      }
    });
  }, [effectiveProdiId]);

  const handleAddPengumumanProgram = async (data: PengumumanProgram) => {
    if (onAdd) {
      await onAdd(data);
    }
  };

  if (hideFilter) {
    return (
      <div>
        <DialogPopUp 
        mode="add" 
        onSubmit={handleAddPengumumanProgram} 
        prodiId={effectiveProdiId} 
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Select
          value={selectedProgram !== null ? String(selectedProgram) : "all"}
          onValueChange={(value) => {
            const num = value === "all" ? null : Number(value);
            setSelectedProgram(num);
            if (onFilterChange) onFilterChange(num);
          }}
        >
          <SelectTrigger className="w-auto border px-2 py-1">
            <SelectValue placeholder="Pilih Program Unggulan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Program Unggulan</SelectItem>
            {programs.map((option) => (
              <SelectItem key={option.id} value={String(option.id)}>
                {option.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogPopUp mode="add" onSubmit={handleAddPengumumanProgram} prodiId={effectiveProdiId} />
      </div>
    </>
  );
}
