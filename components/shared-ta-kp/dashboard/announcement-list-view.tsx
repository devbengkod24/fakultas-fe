"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/empty-state";
import dayjs from "dayjs";
import { Info, AlertCircle, InfoIcon } from "lucide-react";
import Link from "next/link";

export interface AnnouncementItem {
  id: number;
  judul: string;
  created_at: string;
}

interface AnnouncementListViewProps {
  announcements: AnnouncementItem[];
  loading: boolean;
  error: boolean;
  getDetailHref: (id: number) => string;
}

export function AnnouncementListView({
  announcements,
  loading,
  error,
  getDetailHref,
}: AnnouncementListViewProps) {
  return (
    <Card className="shadow-none p-4">
      <CardTitle className="text-sm font-medium mb-2 flex items-center gap-2 justify-between">
        <span>Pengumuman Penting</span>
        <Info className="size-4" />
      </CardTitle>
      <div className="divide-y divide-gray-200 max-h-36 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-2">
                <Skeleton className="h-4 w-3/4 mb-1.5" />
                <Skeleton className="h-3 w-1/4 mb-1.5" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </>
        ) : error ? (
          <EmptyState
            icon={AlertCircle}
            title="Gagal memuat data"
            subtitle="Pengumuman tidak dapat ditampilkan"
            variant="small"
          />
        ) : announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div key={announcement.id} className="py-2">
              <p className="text-sm font-medium line-clamp-1">
                {announcement.judul}
              </p>
              <p className="text-xs text-gray-500">
                {dayjs(announcement.created_at).format("DD MMM YYYY")}
              </p>
              <Link
                href={getDetailHref(announcement.id)}
                className="text-primary text-xs"
              >
                Lihat Detail
              </Link>
            </div>
          ))
        ) : (
          <EmptyState
            icon={InfoIcon}
            title="Tidak ada pengumuman"
            subtitle="Belum ada pengumuman yang ditambahkan"
            variant="small"
          />
        )}
      </div>
    </Card>
  );
}
