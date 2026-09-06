// file: percentage-skeleton.tsx
"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function PercentageDialogSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-5 w-24 mb-1" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
      <Skeleton className="h-6 w-32 mt-2" />
      <div className="flex justify-end">
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  )
}


export function SkeletonRekapNilai() {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Search dan filter */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Skeleton className="h-10 w-2/3" /> {/* Search */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-40" /> {/* Atur Persentase */}
          <Skeleton className="h-10 w-20" /> {/* Import */}
          <Skeleton className="h-10 w-20" /> {/* Export */}
        </div>
      </div>

      {/* Header tabel */}
      <div className="grid grid-cols-10 gap-4 bg-muted p-4 rounded-md">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>

      {/* Baris data skeleton */}
      {Array.from({ length: 9 }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-10 gap-4 items-center p-4 border-b"
        >
          {Array.from({ length: 9 }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 w-full" />
          ))}
          {/* Icon Action */}
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      ))}
    </div>
  );
}


export function EventDetailSkeleton() {
  return (
    <div className="grid grid-cols-[max-content_1fr] gap-x-2 gap-y-4">
      {[
        { label: "Nama Kegiatan", width: "w-48" },
        { label: "Deskripsi", width: "w-full" },
        { label: "Tanggal", width: "w-64" },
        { label: "Waktu", width: "w-40" },
        { label: "Lokasi", width: "w-32" },
        { label: "Mentor", width: "w-36" },
        { label: "Kategori", width: "w-24" }
      ].map((item, index) => (
        <div key={index} className="contents">
          <span className="font-medium">{item.label}</span>
          <div className="flex items-center">
            <span className="mr-2">:</span>
            <Skeleton className={`h-4 ${item.width} max-w-[280px]`} />
          </div>
        </div>
      ))}
    </div>
  );
}