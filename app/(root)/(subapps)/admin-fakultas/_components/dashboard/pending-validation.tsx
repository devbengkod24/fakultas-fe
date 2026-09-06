"use client";

import React from "react";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, ClipboardCheck, Megaphone } from "lucide-react";

export interface PendingAnnouncementItem {
  id: number;
  judul: string;
  user: string;
  prodi?: string;
  modul?: "TA" | "KP" | "BK";
  created_at: string;
}

const MOCK_PENDING: PendingAnnouncementItem[] = [
  {
    id: 102,
    judul: "Jadwal Pengisian KRS & Pendaftaran Sidang TA Semester Genap",
    user: "Koordinator TA",
    prodi: "Teknik Informatika",
    modul: "TA",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 103,
    judul: "Daftar Mitra Perusahaan untuk Pembekalan Kerja Praktek",
    user: "Koordinator KP",
    prodi: "Sistem Informasi",
    modul: "KP",
    created_at: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 104,
    judul: "Virtual Job Fair & Program Magang Merdeka Batch 8",
    user: "Koordinator BK",
    prodi: "Desain Komunikasi Visual",
    modul: "BK",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function formatRelativeTime(isoString: string): string {
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hr lalu`;
}

const MODUL_CONFIG: Record<
  string,
  { badge: string; dot: string; label: string }
> = {
  TA: {
    badge: "bg-orange-100 text-orange-700 border-orange-200",
    dot: "bg-orange-400",
    label: "TA",
  },
  KP: {
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-400",
    label: "KP",
  },
  BK: {
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-400",
    label: "BK",
  },
};

const PendingValidationSkeleton = () => (
  <div className="flex flex-col divide-y divide-gray-100">
    {[1, 2, 3].map((i) => (
      <div key={i} className="py-3 space-y-2">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    ))}
  </div>
);

interface PendingValidationSectionProps {
  data?: PendingAnnouncementItem[];
  isLoading?: boolean;
  totalPending?: number;
}

export const PendingValidationSection = ({
  data = MOCK_PENDING,
  isLoading = false,
  totalPending = MOCK_PENDING.length,
}: PendingValidationSectionProps) => {
  const isEmpty = !isLoading && data.length === 0;

  return (
    <Card className="shadow-none p-4">
      <div className="flex items-center justify-between mb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Megaphone className="size-4 text-orange-500 shrink-0" />
          Validasi Pengumuman
        </CardTitle>
        {totalPending > 0 && (
          <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700 border border-orange-200">
            {totalPending} Menunggu
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="py-2">
          <PendingValidationSkeleton />
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <ClipboardCheck className="size-8 text-muted-foreground/40 mb-2" />
          <p className="text-sm font-medium text-gray-700">
            Semua Sudah Divalidasi
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tidak ada pengumuman baru.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 max-h-[220px] overflow-y-auto">
          {data.map((item) => {
            const config = MODUL_CONFIG[item.modul ?? ""] ?? MODUL_CONFIG["TA"];
            return (
              <Link
                key={item.id}
                href={`/admin-fakultas/pengumuman/validasi/${item.id}`}
                className="py-2 group block"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Badge
                      className={`w-fit text-[10px] px-1.5 py-0 ${config.badge}`}
                    >
                      {config.label}
                    </Badge>
                    {item.prodi && (
                      <span className="text-[10px] text-muted-foreground truncate max-w-[110px]">
                        {item.prodi}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                    {formatRelativeTime(item.created_at)}
                  </span>
                </div>

                <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-1 group-hover:text-primary transition-colors">
                  {item.judul}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    {item.user}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-primary group-hover:underline underline-offset-2">
                    Review
                    <ChevronRight className="size-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {!isEmpty && !isLoading && (
        <Link href="/admin-fakultas/pengumuman/validasi">
          <div className="mt-4 rounded-lg bg-blue-500/5 hover:bg-blue-500/10 transition-colors cursor-pointer">
            <div className="px-4 py-2 flex justify-between items-center text-primary text-xs">
              <span>Lihat Semua Pengumuman Pending</span>
              <ChevronRight strokeWidth={1.5} className="size-4" />
            </div>
          </div>
        </Link>
      )}
    </Card>
  );
};
