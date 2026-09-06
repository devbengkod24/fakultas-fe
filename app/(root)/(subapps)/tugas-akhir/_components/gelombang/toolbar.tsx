"use client";

import useSWR from "swr";
import { PeriodeService } from "@/api/tugas-akhir";
import {
  GelombangToolbarView,
  type PeriodeOption,
} from "@/components/shared-ta-kp/gelombang/toolbar-view";

const TA_TIPE_OPTIONS = [
  { value: "ta1", label: "TA 1" },
  { value: "ta2", label: "TA 2" },
];

const periodeFetcher = () => PeriodeService.getAllPeriode().then((r) => r);

interface ToolbarProps {
  onModalClick: () => void;
  onAktifPeriodeChange?: (isAktif: boolean) => void;
  showTambah?: boolean;
}

export function GelombangToolbar({
  onModalClick,
  onAktifPeriodeChange,
  showTambah = true,
}: ToolbarProps) {
  const { data: periodeData } = useSWR("ta-periode", periodeFetcher, {
    revalidateOnFocus: false,
  });
  const periodeList: PeriodeOption[] = periodeData?.data ?? [];

  return (
    <GelombangToolbarView
      periodeList={periodeList}
      tipeOptions={TA_TIPE_OPTIONS}
      onModalClick={onModalClick}
      onAktifPeriodeChange={onAktifPeriodeChange}
      showTambah={showTambah}
    />
  );
}
