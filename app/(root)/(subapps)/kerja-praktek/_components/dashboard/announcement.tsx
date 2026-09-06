/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useSWR from "swr";
import { PengumumanService } from "@/api/kerja-praktek";
import { AnnouncementListView } from "@/components/shared-ta-kp/dashboard/announcement-list-view";
import type { AnnouncementItem } from "@/components/shared-ta-kp/dashboard/announcement-list-view";

const DashboardAnnouncements = () => {
  const {
    data: response,
    error,
    isLoading,
  } = useSWR(
    "pengumuman-kp-list",
    () => PengumumanService.getPengumumanList(),
    { dedupingInterval: 1000 }
  );

  const announcements: AnnouncementItem[] = response?.data || [];

  return (
    <AnnouncementListView
      announcements={announcements}
      loading={isLoading}
      error={!!error}
      getDetailHref={(id) => `/kerja-praktek/pengumuman/${id}`}
    />
  );
};

export default DashboardAnnouncements;