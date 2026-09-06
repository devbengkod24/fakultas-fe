"use client";

import useSWR from "swr";
import { TAPengumumanService } from "@/api/tugas-akhir";
import { AnnouncementListView } from "@/components/shared-ta-kp/dashboard/announcement-list-view";

const DashboardAnnouncements = () => {
  const { data: response, error, isLoading } = useSWR(
    ["ta-pengumuman-list", 1, 10, ""],
    () => TAPengumumanService.getAll(1, 10, ""),
    { dedupingInterval: 1000 },
  );

  return (
    <AnnouncementListView
      announcements={response?.data || []}
      loading={isLoading}
      error={!!error}
      getDetailHref={(id) => `/tugas-akhir/pengumuman/${id}`}
    />
  );
};

export default DashboardAnnouncements;
