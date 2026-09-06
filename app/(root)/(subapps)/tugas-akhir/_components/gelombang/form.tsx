"use client";

import useSWR from "swr";
import { PeriodeService } from "@/api/tugas-akhir";
import {
  GelombangFormView,
  type GelombangFormData,
} from "@/components/shared-ta-kp/gelombang/form-view";
import type { PeriodeOption } from "@/components/shared-ta-kp/gelombang/toolbar-view";
import { GelombangTA } from "@/types/tugas-akhir/gelombang";

const TA_TIPE_OPTIONS = [
  { value: "ta1", label: "TA 1" },
  { value: "ta2", label: "TA 2" },
];

const fetcher = () => PeriodeService.getAllPeriode().then((res) => res);

interface GelombangFormProps {
  onClose: () => void;
  onSave: (data: GelombangTA) => void;
  editData?: GelombangTA | null;
}

export function GelombangForm({ onClose, onSave, editData }: GelombangFormProps) {
  const { data: periodeResponse } = useSWR("ta-periode", fetcher);
  const periodeList: PeriodeOption[] = periodeResponse?.data ?? [];

  const editFormData: GelombangFormData | null = editData
    ? {
        id: editData.id,
        nama_gelombang: editData.nama_gelombang ?? "",
        tipe: editData.tipe ?? "",
        periode_id: editData.periode_id ?? editData.periode?.id ?? 0,
        tgl_awal: editData.tgl_awal ?? "",
        tgl_akhir: editData.tgl_akhir ?? "",
      }
    : null;

  const handleSave = (data: GelombangFormData) => {
    onSave(data as GelombangTA);
  };

  return (
    <GelombangFormView
      periodeList={periodeList}
      tipeOptions={TA_TIPE_OPTIONS}
      onClose={onClose}
      onSave={handleSave}
      editData={editFormData}
      formTitle="Gelombang"
      formDescription="Isi informasi gelombang sidang tugas akhir."
    />
  );
}
