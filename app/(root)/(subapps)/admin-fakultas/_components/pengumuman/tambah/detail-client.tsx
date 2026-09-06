"use client";

import { useRouter } from "next/navigation";
import {
  Calendar,
  ClockIcon,
  UserIcon,
  AlertCircle,
  ArrowLeft,
  Rss,
  BellRing,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/empty-state";
import DashboardHeader from "@/components/dashboard-header";
import dayjs from "dayjs";
import { useProfile } from "@/context/profileUseContext";
import { PengumumanService } from "@/api";
import type { FakultasPengumuman } from "@/data/fakultas/tambah-pengumuman";
import { cn } from "@/lib/utils";
import withAuth from "@/app/(root)/hoc/withAuth";
import useSWR from "swr";
import { sanitizeHtml } from "@/lib/sanitize-html";

function TambahPengumumanDetailClient({ id }: { id: number }) {
  const router = useRouter();
  const { profile } = useProfile();

  const { data, isLoading, error } = useSWR(
    id ? ["admin-fakultas-pengumuman-detail", id] : null,
    () => PengumumanService.getAdminFakultasPengumumanById(id)
  );

  const pengumuman = data?.data;

  const breadcrumb = [
    { name: "Dashboard", url: "/admin-fakultas" },
    { name: "Kelola Pengumuman", url: "/admin-fakultas/pengumuman/tambah" },
    { name: "Detail Pengumuman", url: "" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <DashboardHeader breadcrumbItems={breadcrumb} />
        <div className="px-2 space-y-4">
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
      </div>
    );
  }

  if (error || !pengumuman) {
    return (
      <div>
        <DashboardHeader breadcrumbItems={breadcrumb} />
        <EmptyState
          icon={AlertCircle}
          title="Pengumuman tidak ditemukan"
          subtitle="Pengumuman yang Anda cari tidak dapat ditemukan atau telah dihapus."
        />
      </div>
    );
  }

  return (
    <div className="max-w-none mx-auto pb-20 space-y-4">
      <DashboardHeader breadcrumbItems={breadcrumb} />
      
      <div className="px-2 mt-2 space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-medium text-foreground tracking-tight leading-tight mt-2">
              {pengumuman.judul}
            </h1>
            <div className="flex flex-wrap gap-1.5">
              {pengumuman.is_active && (
                <Badge variant="success" className="text-[10px] font-semibold px-2.5 py-0.5 whitespace-nowrap flex items-center gap-1 uppercase">
                  <Rss className="size-2.5" />
                  BERITA
                </Badge>
              )}
              {pengumuman.is_popup && (
                <Badge variant="outline" className="text-[10px] font-semibold px-2.5 py-0.5 whitespace-nowrap bg-purple-500/10 text-purple-600 border-purple-500/20 flex items-center gap-1 uppercase">
                  <BellRing className="size-2.5" />
                  POP-UP
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center text-sm text-muted-foreground">
            <div className="flex items-center">
              <UserIcon className="h-3.5 w-3.5 mr-1 text-primary/60" />
              <span>{pengumuman.user || "Admin Fakultas"}</span>
            </div>
            <span className="mx-2 text-border">|</span>
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1 text-primary/60" />
              <span>{dayjs(pengumuman.published_at || pengumuman.created_at).format("DD MMMM YYYY")}</span>
            </div>
            <span className="mx-2 text-border">|</span>
            <div className="flex items-center">
              <ClockIcon className="h-3.5 w-3.5 mr-1 text-primary/60" />
              <span>{dayjs(pengumuman.published_at || pengumuman.created_at).format("HH:mm")} WIB</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <div
            className="prose prose-slate dark:prose-invert max-w-none text-foreground font-normal leading-relaxed text-justify"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(pengumuman.isi) }}
          />
        </div>

        <div className="mt-16 pt-8 border-t border-border flex items-center justify-start gap-4">
          <Button
            variant="ghost"
            className="h-10 w-10 p-0 lg:w-auto lg:h-10 lg:px-4 text-muted-foreground hover:text-foreground border border-border rounded-md"
            onClick={() => router.push("/admin-fakultas/pengumuman/tambah")}
            title="Kembali ke Daftar"
          >
            <ArrowLeft className={cn("size-4", "lg:mr-2")} />
            <span className="hidden lg:inline">Kembali ke Daftar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default withAuth(TambahPengumumanDetailClient, "admin-fakultas", ["admin_fakultas", "super_fakultas"]);

