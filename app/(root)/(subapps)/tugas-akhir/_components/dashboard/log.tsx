"use client";

import useSWR from "swr";
import { LogAktivitasService } from "@/api/tugas-akhir";
import { ActivityLogView } from "@/components/shared-ta-kp/dashboard/activity-log-view";
import { useProfile } from "@/context/profileUseContext";

const DashboardActivityLog = ({
  maxHeightClassName,
}: {
  maxHeightClassName?: string;
}) => {
  const { profile } = useProfile();
  const isDosen = profile?.roles === "dosen";
  const page = 1;
  const limit = 10;

  const {
    data: response,
    error,
    isLoading,
  } = useSWR(
    ["log-aktivitas-mahasiswa", page, limit, isDosen],
    () =>
      isDosen
        ? LogAktivitasService.getMahasiswaByDosen(page, limit)
        : LogAktivitasService.getAllMahasiswa(page, limit),
    { dedupingInterval: 1000 }
  );

  const activities = response?.data || [];

  return (
    <ActivityLogView
      activities={activities}
      loading={isLoading}
      error={!!error}
      maxHeightClassName={maxHeightClassName}
    />
  );
};

export default DashboardActivityLog;
