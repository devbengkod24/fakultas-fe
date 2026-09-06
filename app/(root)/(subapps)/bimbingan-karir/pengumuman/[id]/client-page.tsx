"use client";

import useSWR from "swr";
import { Calendar, ClockIcon, UserIcon, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/empty-state";

import DashboardHeader from "@/components/dashboard-header";
import dayjs from "dayjs";
import { BkPengumumanService } from "@/api/bimbingan-karir";
import DOMPurify from "isomorphic-dompurify";

const fetcher = (id: number) =>
  BkPengumumanService.getPengumumanById(id).then((res) => {
    if (!res.data) throw new Error("Pengumuman tidak ditemukan");
    return res.data;
  });

export default function PengumumanClient({ id }: { id: number }) {
  const {
    data: pengumuman,
    isLoading,
    error,
  } = useSWR(["pengumuman", id], () => fetcher(id), {
    revalidateOnFocus: false,
  });

  if (isLoading) {
    return (
      <div>
        <DashboardHeader
          breadcrumbItems={[
            { name: "Dashboard", url: "/bimbingan-karir" },
            { name: "Pengumuman", url: "/bimbingan-karir/pengumuman" },
            { name: "Detail Pengumuman", url: "" },
          ]}
        />
        <Skeleton className="h-8 w-3/4 mb-2" />
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <DashboardHeader
          breadcrumbItems={[
            { name: "Dashboard", url: "/bimbingan-karir" },
            { name: "Pengumuman", url: "/bimbingan-karir/pengumuman" },
            { name: "Detail Pengumuman", url: "" },
          ]}
        />
        <EmptyState
          icon={AlertCircle}
          title="Pengumuman tidak ditemukan"
          subtitle="Pengumuman yang Anda cari tidak dapat ditemukan atau telah dihapus."
        />
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/bimbingan-karir" },
          { name: "Pengumuman", url: "/bimbingan-karir/pengumuman" },
          { name: "Detail Pengumuman", url: "" },
        ]}
      />
      <h1 className="text-xl font-medium">{pengumuman.judul}</h1>
      <div className="flex items-center text-sm text-muted-foreground mt-1">
        <UserIcon className="h-3.5 w-3.5 mr-1" />
        {pengumuman.user || "Koordinator TA"}
        <span className="mx-2 text-gray-300">|</span>
        <Calendar className="h-3.5 w-3.5 mr-1" />
        {dayjs(pengumuman.published_at).format("DD MMM YYYY")}
        <span className="mx-2 text-gray-300">|</span>
        <ClockIcon className="h-3.5 w-3.5 mr-1" />
        {dayjs(pengumuman.published_at).format("HH:mm")}
      </div>

      <div
        className="mt-4 font-normal text-sm whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pengumuman.isi) }}
      />
    </div>
  );
}
