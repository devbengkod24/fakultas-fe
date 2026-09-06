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
  ClockIcon,
  UserIcon,
  ChevronRight,
  Pencil,
  Trash2,
  Rss,
  BellRing,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FakultasPengumuman } from "@/data/fakultas/tambah-pengumuman";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PengumumanTambahCardsProps {
  data: FakultasPengumuman[];
  onEdit: (pengumuman: FakultasPengumuman) => void;
  onDelete: (pengumuman: FakultasPengumuman) => void;
  onToggleActive?: (pengumuman: FakultasPengumuman) => void;
  onTogglepopup?: (pengumuman: FakultasPengumuman) => void;
  isLoading?: boolean;
}

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

function PengumumanTambahCard({
  pengumuman,
  onEdit,
  onDelete,
  onToggleActive,
  onTogglepopup,
}: {
  pengumuman: FakultasPengumuman;
  onEdit: (p: FakultasPengumuman) => void;
  onDelete: (p: FakultasPengumuman) => void;
  onToggleActive?: (p: FakultasPengumuman) => void;
  onTogglepopup?: (p: FakultasPengumuman) => void;
}) {
  const stripHtml = (html: string) => {
    if (typeof window === "undefined") return html;
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const isFeatured = pengumuman.status === 'published' && pengumuman.is_popup;

  return (
    <Card className={cn(
      "rounded-xl border text-card-foreground shadow-none transition-all hover:shadow-sm",
      isFeatured && "border-primary"
    )}>
      <CardHeader className="p-4 sm:p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
            <CardTitle className="text-base font-semibold leading-none text-foreground flex items-center gap-1.5">
              <span className="truncate">{pengumuman.judul}</span>
            </CardTitle>
            <div className="flex items-center gap-2 flex-nowrap">
              {/* Status Badge */}
              {(() => {
                const statusVariant = pengumuman.status === 'published' ? 'success' : pengumuman.status === 'archived' ? 'secondary' : 'yellow';
                const statusLabel = pengumuman.status === 'published' ? 'Dipublikasi' : pengumuman.status === 'archived' ? 'Diarsipkan' : 'Konsep';
                return (
                  <Badge variant={statusVariant} className="shrink-0 text-xs font-semibold px-2.5 py-0.5 whitespace-nowrap flex items-center gap-1">
                    {statusLabel}
                  </Badge>
                );
              })()}
              {pengumuman.status === 'published' && pengumuman.is_popup && (
                <Badge variant="outline" className="shrink-0 text-xs font-semibold px-2.5 py-0.5 whitespace-nowrap bg-purple-500/10 text-purple-600 border-purple-500/20 flex items-center gap-1">
                  Pop-up
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(pengumuman)} className="cursor-pointer py-2.5">
                  <Pencil className="mr-3 size-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Edit</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onToggleActive?.(pengumuman)} className="cursor-pointer py-2.5">
                  <Rss className={cn("mr-3 size-4", pengumuman.status === "archived" ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-sm font-medium", pengumuman.status === "archived" ? "text-primary" : "text-foreground")}>
                    {pengumuman.status === "archived" ? "Aktifkan" : "Arsipkan"}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onTogglepopup?.(pengumuman)} 
                  className={cn("cursor-pointer py-2.5", pengumuman.status === "archived" && "opacity-50 pointer-events-none")}
                >
                  <BellRing className={cn("mr-3 size-4", pengumuman.is_popup ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-sm font-medium", pengumuman.is_popup ? "text-primary" : "text-foreground")}>
                    {pengumuman.is_popup ? "Pop-up Nonaktif" : "Pop-up Aktif"}
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(pengumuman)}
                  className="cursor-pointer py-2.5 text-destructive focus:text-destructive focus:bg-destructive/5"
                >
                  <Trash2 className="mr-3 size-4" />
                  <span className="text-sm font-medium">Hapus</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Separator />

        <CardDescription className="flex items-center flex-wrap gap-y-2 text-xs text-muted-foreground pt-3">
          <div className="flex items-center whitespace-nowrap">
            <UserIcon className="h-3.5 w-3.5 mr-1 text-primary/60" />
            <span className="text-foreground/80 font-medium">{pengumuman.user || "Admin Fakultas"}</span>
          </div>
          <Separator orientation="vertical" className="mx-3 h-3 hidden sm:block" />
          <div className="flex items-center whitespace-nowrap">
            <Calendar className="h-3.5 w-3.5 mr-1 text-primary/60" />
            <span>{dayjs(pengumuman.published_at || pengumuman.created_at).format("DD MMM YYYY")}</span>
          </div>
          <Separator orientation="vertical" className="mx-3 h-3 hidden sm:block" />
          <div className="flex items-center whitespace-nowrap">
            <ClockIcon className="h-3.5 w-3.5 mr-1 text-primary/60" />
            <span>{dayjs(pengumuman.published_at || pengumuman.created_at).format("HH:mm")} WIB</span>
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
          className="flex items-center text-sm text-primary font-semibold hover:underline group h-auto p-0"
          href={`/admin-fakultas/pengumuman/tambah/${pengumuman.id}`}
        >
          Lihat Detail
          <ChevronRight className="size-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function PengumumanTambahCards({
  data,
  onEdit,
  onDelete,
  onToggleActive,
  onTogglepopup,
  isLoading,
}: PengumumanTambahCardsProps) {
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
        <PengumumanTambahCard
          key={pengumuman.id}
          pengumuman={pengumuman}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
          onTogglepopup={onTogglepopup}
        />
      ))}
    </div>
  );
}
