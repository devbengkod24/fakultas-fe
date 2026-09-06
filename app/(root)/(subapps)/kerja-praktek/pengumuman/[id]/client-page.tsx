"use client";

import useSWR from "swr";
import dayjs from "dayjs";
import { AlertCircle, Calendar, ClockIcon, UserIcon } from "lucide-react";

import DashboardHeader from "@/components/dashboard-header";
import EmptyState from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { PengumumanService } from "@/api/kerja-praktek";
import withAuth from "@/app/(root)/hoc/withAuth";
import { sanitizeHtml } from "@/lib/sanitize-html";

const fetcher = (id: number) =>
  PengumumanService.getPengumumanById(id).then((res) => {
    if (!res.data) throw new Error("Pengumuman tidak ditemukan");
    return res.data;
  });

function PengumumanDetailPage({ id }: { id: number }) {
  const { data: pengumuman, isLoading, error } = useSWR(
    ["pengumuman-kp-detail", id],
    () => fetcher(id),
    { revalidateOnFocus: false }
  );

  if (isLoading) {
    return (
      <div>
        <DashboardHeader
          breadcrumbItems={[
            { name: "Dashboard", url: "/kerja-praktek" },
            { name: "Pengumuman", url: "/kerja-praktek" },
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
            { name: "Dashboard", url: "/kerja-praktek" },
            { name: "Pengumuman", url: "/kerja-praktek" },
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

  if (!pengumuman) {
    return null;
  }

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/kerja-praktek" },
          { name: "Pengumuman", url: "/kerja-praktek" },
          { name: "Detail Pengumuman", url: "" },
        ]}
      />
      <h1 className="text-xl font-medium">{pengumuman.judul}</h1>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground mt-1">
        <span className="flex items-center">
          <UserIcon className="h-3.5 w-3.5 mr-1" />
          {pengumuman.user || "Koordinator KP"}
        </span>
        <span className="mx-2 text-gray-300 hidden sm:inline">|</span>
        <span className="flex items-center">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          {dayjs(pengumuman.published_at).format("DD MMM YYYY")}
        </span>
        <span className="mx-2 text-gray-300 hidden sm:inline">|</span>
        <span className="flex items-center">
          <ClockIcon className="h-3.5 w-3.5 mr-1" />
          {dayjs(pengumuman.published_at).format("HH:mm")}
        </span>
      </div>

      <div
        className="mt-4 font-normal text-sm prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(pengumuman.isi) }}
      />
    </div>
  );
}

export default withAuth(PengumumanDetailPage, "kerja-praktek");
