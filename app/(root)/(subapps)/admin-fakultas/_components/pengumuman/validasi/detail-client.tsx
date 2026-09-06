"use client";

import { useRouter } from "next/navigation";
import {
  Calendar,
  ClockIcon,
  UserIcon,
  AlertCircle,
  Check,
  X,
  ArrowLeft,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/empty-state";
import DashboardHeader from "@/components/dashboard-header";
import dayjs from "dayjs";
import { toast } from "sonner";
import { useProfile } from "@/context/profileUseContext";
import { PengumumanService } from "@/api";
import { TYPE_BADGE } from "@/app/(root)/(subapps)/admin-fakultas/_components/pengumuman/validasi/cards";
import type { Pengumuman } from "@/types/admin-fakultas/pengumuman/pengumuman";
import { cn } from "@/lib/utils";
import withAuth from "@/app/(root)/hoc/withAuth";
import useSWR from "swr";
import { sanitizeHtml } from "@/lib/sanitize-html";

function PengumumanDetailClient({ id }: { id: number }) {
  const router = useRouter();
  const { profile } = useProfile();

  const { data, isLoading, error, mutate } = useSWR(
    id ? ["fakultas-pengumuman-detail", id] : null,
    () => PengumumanService.getAdminFakultasPengumumanById(id),
  );

  const pengumuman = data?.data;

  const isAdminFakultas =
    profile?.roles === "admin_fakultas" || profile?.roles === "super_fakultas";

  const isPending =
    !pengumuman?.status ||
    pengumuman?.status === "pending" ||
    (pengumuman as any)?.status_verified === "pending";

  const handleApprove = async () => {
    if (!pengumuman) return;
    try {
      await PengumumanService.verifyAdminFakultasPengumuman(id, "approve");
      toast.success("Pengumuman berhasil diterima");
      mutate();
      router.back();
    } catch {
      toast.error("Gagal menerima pengumuman");
    }
  };

  const handleReject = async () => {
    if (!pengumuman) return;
    try {
      await PengumumanService.verifyAdminFakultasPengumuman(id, "reject");
      toast.success("Pengumuman berhasil ditolak");
      mutate();
      router.back();
    } catch {
      toast.error("Gagal menolak pengumuman");
    }
  };

  const breadcrumb = [
    { name: "Dashboard", url: "/admin-fakultas" },
    { name: "Pengumuman", url: "/admin-fakultas/pengumuman/validasi" },
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

  const typeLower = pengumuman.type?.toLowerCase() ?? "";
  const typeBadge = TYPE_BADGE[typeLower];

  return (
    <div className="max-w-none mx-auto pb-20 space-y-4">
      <DashboardHeader breadcrumbItems={breadcrumb} />

      <div className="px-2 mt-2 space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-medium text-foreground tracking-tight leading-tight mt-2">
              {pengumuman.judul}
            </h1>
            <div className="flex gap-2">
              {pengumuman.prodi && (
                <Badge
                  variant="secondary"
                  className="text-[10px] font-semibold px-2.5 py-0.5 whitespace-nowrap uppercase bg-blue-500/10 text-blue-600 border-blue-500/20"
                >
                  {typeof pengumuman.prodi === 'string' ? pengumuman.prodi : pengumuman.prodi.nama}
                </Badge>
              )}
              {typeBadge && (
                <Badge
                  variant={typeBadge.variant as any}
                  className="text-[10px] font-semibold px-2.5 py-0.5 whitespace-nowrap uppercase"
                >
                  {typeBadge.label}
                </Badge>
              )}
              {pengumuman.status === "approved" ? (
                <Badge
                  variant="success"
                  className="text-[10px] font-semibold px-2.5 py-0.5 whitespace-nowrap uppercase"
                >
                  DITERIMA
                </Badge>
              ) : pengumuman.status === "rejected" ? (
                <Badge
                  variant="destructiveOutline"
                  className="text-[10px] font-semibold px-2.5 py-0.5 bg-destructive/5 whitespace-nowrap text-destructive uppercase"
                >
                  DITOLAK
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-[10px] font-semibold px-2.5 py-0.5 bg-yellow-500/10 text-yellow-600 border-yellow-500/20 whitespace-nowrap uppercase"
                >
                  MENUNGGU
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
              <span>
                {dayjs(pengumuman.published_at || pengumuman.created_at).format(
                  "DD MMMM YYYY",
                )}
              </span>
            </div>
            <span className="mx-2 text-border">|</span>
            <div className="flex items-center">
              <ClockIcon className="h-3.5 w-3.5 mr-1 text-primary/60" />
              <span>
                {dayjs(pengumuman.published_at || pengumuman.created_at).format(
                  "HH:mm",
                )}{" "}
                WIB
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <div
            className="prose prose-slate dark:prose-invert max-w-none text-foreground font-normal leading-relaxed text-justify"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(pengumuman.isi) }}
          />
        </div>

        <div className="mt-16 pt-8 border-t border-border flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            className="h-10 w-10 p-0 lg:w-auto lg:h-10 lg:px-4 text-muted-foreground hover:text-foreground border border-border rounded-md"
            onClick={() => router.back()}
            title="Kembali ke Daftar"
          >
            <ArrowLeft className={cn("size-4", "lg:mr-2")} />
            <span className="hidden lg:inline">Kembali ke Daftar</span>
          </Button>

          {isAdminFakultas && isPending && (
            <div className="flex items-center gap-2">
              <Button
                className="w-10 h-10 p-0 lg:w-auto lg:h-10 lg:px-6 bg-primary hover:bg-primary/90 text-white shadow-md"
                onClick={handleApprove}
                title="Terima Pengumuman"
              >
                <Check className={cn("size-4 text-white", "lg:mr-2")} />
                <span className="text-white font-semibold hidden lg:inline">
                  Terima Pengumuman
                </span>
              </Button>
              <Button
                variant="destructiveOutline"
                className="w-10 h-10 p-0 lg:w-auto lg:h-10 lg:px-6 bg-background shadow-sm"
                onClick={handleReject}
                title="Tolak"
              >
                <X className={cn("size-4 text-destructive", "lg:mr-2")} />
                <span className="text-destructive font-semibold hidden lg:inline">
                  Tolak
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(PengumumanDetailClient, "admin-fakultas", [
  "admin_fakultas",
  "super_fakultas",
]);
