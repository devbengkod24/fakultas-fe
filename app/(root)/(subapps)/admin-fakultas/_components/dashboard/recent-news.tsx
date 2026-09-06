"use client";

import React from "react";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper, ChevronRight } from "lucide-react";

export interface RecentNewsItem {
  id: number;
  judul: string;
  tipe: "prestasi" | "kegiatan" | "berita";
  published_at: string;
}

const MOCK_NEWS: RecentNewsItem[] = [
  {
    id: 27,
    judul: "Mahasiswa FIK Raih Medali Emas Gemastik XIV 2026",
    tipe: "prestasi",
    published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 54,
    judul: "Workshop Kecerdasan Buatan untuk Dosen FIK",
    tipe: "kegiatan",
    published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 53,
    judul: "FIK UDINUS Raih Akreditasi Unggul dari BAN-PT",
    tipe: "berita",
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 55,
    judul: "Pengabdian Masyarakat FIK di Desa Mitra Kendal",
    tipe: "kegiatan",
    published_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 56,
    judul: "Penandatanganan MoA FIK dengan Industri Teknologi Nasional",
    tipe: "berita",
    published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const TIPE_CONFIG: Record<
  RecentNewsItem["tipe"],
  { label: string; className: string }
> = {
  prestasi: {
    label: "Prestasi",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  kegiatan: {
    label: "Kegiatan",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  berita: {
    label: "Berita",
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
};

interface RecentNewsListProps {
  data?: RecentNewsItem[];
  isLoading?: boolean;
}

export const RecentNewsList = ({
  data = MOCK_NEWS,
  isLoading = false,
}: RecentNewsListProps) => {
  return (
    <Card className="shadow-none p-4">
      <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
        <Newspaper className="size-4 text-blue-500" />
        Berita Terbaru
      </CardTitle>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5 p-2">
              <Skeleton className="h-3 w-14 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100 max-h-[220px] overflow-y-auto pr-1">
          {data.map((item) => {
            const config = TIPE_CONFIG[item.tipe];
            return (
              <Link
                key={item.id}
                href={`/berita/${item.id}`}
                className="py-2 group"
              >
                <div className="flex flex-col gap-1">
                  <Badge
                    className={`w-fit text-[10px] px-1.5 py-0 ${config.className}`}
                  >
                    {config.label}
                  </Badge>
                  <p className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {item.judul}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(item.published_at)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <Link href="/admin-fakultas/manajemen-berita">
        <div className="mt-4 rounded-lg bg-blue-500/5 hover:bg-blue-500/10 transition-colors cursor-pointer">
          <div className="px-4 py-2 flex justify-between items-center text-primary text-xs">
            <span>Kelola Berita</span>
            <ChevronRight strokeWidth={1.5} className="size-4" />
          </div>
        </div>
      </Link>
    </Card>
  );
};
