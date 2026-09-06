"use client";

import type React from "react";
import dayjs from "dayjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  UserIcon,
  ClockIcon,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Pengumuman } from "@/types/admin-fakultas/pengumuman/pengumuman";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PengumumanCardsProps {
  data: Pengumuman[];
  onApprove: (pengumuman: Pengumuman) => void;
  onReject: (pengumuman: Pengumuman) => void;
  isLoading?: boolean;
  profile?: { roles?: string } | null;
}

export const TYPE_BADGE: Record<string, { label: string; variant: string }> = {
  ta: { label: "TA", variant: "orange" },
  kp: { label: "KP", variant: "primary" },
  bk: { label: "BK", variant: "yellow" },
};

function PengumumanCardSkeleton() {
  return (
    <Card className="overflow-hidden shadow-none border-border">
      <CardHeader className="p-4 sm:p-5 pb-0">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
        <Skeleton className="h-px w-full" />
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}

function PengumumanCard({
  pengumuman,
  isAdminFakultas,
  onApprove,
  onReject,
}: {
  pengumuman: Pengumuman;
  isAdminFakultas: boolean;
  onApprove: (p: Pengumuman) => void;
  onReject: (p: Pengumuman) => void;
}) {
  const stripHtml = (html: string) => {
    if (typeof window === "undefined") return html;
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const typeLower = pengumuman.type?.toLowerCase() ?? "";
  const badge = TYPE_BADGE[typeLower];

  const isApproved =
    (pengumuman.status as any) === "approved" ||
    (pengumuman.status as any) === "approve" ||
    (pengumuman as any).status_verified === "approved" ||
    (pengumuman as any).status_verified === "approve";
  const isRejected =
    (pengumuman.status as any) === "rejected" ||
    (pengumuman.status as any) === "reject" ||
    (pengumuman as any).status_verified === "rejected" ||
    (pengumuman as any).status_verified === "reject";
  const isPending = !isApproved && !isRejected;

  return (
    <Card
      className={cn(
        "rounded-xl border text-card-foreground shadow-none transition-all hover:shadow-sm",
        isPending && "border-primary/50 border",
      )}
    >
      <CardHeader className="p-4 sm:p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
            <CardTitle className="text-base font-semibold leading-none text-foreground">
              {pengumuman.judul}
            </CardTitle>
            <div className="flex items-center gap-2 flex-nowrap">
              {pengumuman.prodi && (
                <Badge
                  variant="secondary"
                  className="shrink-0 text-xs font-semibold px-2.5 py-0.5 whitespace-nowrap bg-blue-500/10 text-blue-600 border-blue-500/20"
                >
                  {typeof pengumuman.prodi === 'string' ? pengumuman.prodi : pengumuman.prodi.nama}
                </Badge>
              )}
              {badge && (
                <Badge
                  variant={badge.variant as any}
                  className="shrink-0 text-xs font-semibold px-2.5 py-0.5 whitespace-nowrap"
                >
                  {badge.label}
                </Badge>
              )}
              {isApproved ? (
                <Badge
                  variant="success"
                  className="shrink-0 text-xs font-semibold px-2.5 py-0.5 whitespace-nowrap"
                >
                  Diterima
                </Badge>
              ) : isRejected ? (
                <Badge
                  variant="destructiveOutline"
                  className="shrink-0 text-xs font-semibold px-2.5 py-0.5 whitespace-nowrap"
                >
                  Ditolak
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="shrink-0 text-xs font-semibold px-2.5 py-0.5 bg-yellow-500/10 text-yellow-600 border-yellow-500/20 whitespace-nowrap"
                >
                  Menunggu
                </Badge>
              )}
            </div>
          </div>

          {isAdminFakultas && isPending && (
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <Button
                size="sm"
                className="flex-1 sm:flex-none h-9 bg-primary hover:bg-primary/90 text-white"
                onClick={() => onApprove(pengumuman)}
              >
                <Check className="size-3.5 mr-1.5 text-white" />
                <span className="text-white font-semibold">Terima</span>
              </Button>
              <Button
                size="sm"
                variant="destructiveOutline"
                className="flex-1 sm:flex-none h-9 bg-background"
                onClick={() => onReject(pengumuman)}
              >
                <X className="size-3.5 mr-1.5 text-destructive" />
                <span className="text-destructive font-semibold">Tolak</span>
              </Button>
            </div>
          )}
        </div>

        <Separator />

        <CardDescription className="flex items-center flex-wrap gap-y-2 text-xs text-muted-foreground pt-3">
          <div className="flex items-center whitespace-nowrap">
            <UserIcon className="h-3.5 w-3.5 mr-1 text-primary/60" />
            <span className="text-foreground/80">
              {pengumuman.user || "Admin Fakultas"}
            </span>
          </div>
          <Separator
            orientation="vertical"
            className="mx-3 h-3 hidden sm:block"
          />
          <div className="flex items-center whitespace-nowrap">
            <Calendar className="h-3.5 w-3.5 mr-1 text-primary/60" />
            <span>
              {dayjs(pengumuman.published_at || pengumuman.created_at).format(
                "DD MMM YYYY",
              )}
            </span>
          </div>
          <Separator
            orientation="vertical"
            className="mx-3 h-3 hidden sm:block"
          />
          <div className="flex items-center whitespace-nowrap">
            <ClockIcon className="h-3.5 w-3.5 mr-1 text-primary/60" />
            <span>
              {dayjs(pengumuman.published_at || pengumuman.created_at).format(
                "HH:mm",
              )}{" "}
              WIB
            </span>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 sm:px-5 pb-3">
        <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
          {stripHtml(pengumuman.isi)}
        </p>
      </CardContent>

      <div className="px-4 sm:px-5">
        <Separator />
      </div>

      <CardFooter className="px-4 sm:px-5 pb-4 pt-4 flex justify-end items-center">
        <Link
          className="flex items-center text-sm text-primary font-semibold hover:underline group"
          href={`/admin-fakultas/pengumuman/validasi/${pengumuman.id}`}
        >
          Lihat Detail
          <ChevronRight className="size-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function PengumumanCards({
  data,
  onApprove,
  onReject,
  isLoading,
  profile,
}: PengumumanCardsProps) {
  const isAdminFakultas =
    profile?.roles === "admin_fakultas" || profile?.roles === "super_fakultas";

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <PengumumanCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (data.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((pengumuman) => (
        <PengumumanCard
          key={pengumuman.id}
          pengumuman={pengumuman}
          isAdminFakultas={isAdminFakultas}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </div>
  );
}
