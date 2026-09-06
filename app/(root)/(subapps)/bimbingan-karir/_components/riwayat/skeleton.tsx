// skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonRiwayat() {
  return (
    <div className="w-full flex flex-col gap-3">
      {/* Filter dan kontrol di bagian atas */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Skeleton className="h-10 w-3/4" /> {/* Search */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-48" /> {/* Dropdown Minat */}
          <Skeleton className="h-10 w-20" /> {/* Export */}
        </div>
      </div>

      {/* Header tabel */}
      <div className="grid grid-cols-4 gap-4 bg-muted p-4 rounded-md">
        <Skeleton className="h-4 w-full" /> {/* No */}
        <Skeleton className="h-4 w-full" /> {/* NIM */}
        <Skeleton className="h-4 w-full" /> {/* Nama */}
        <Skeleton className="h-4 w-full" /> {/* Minat */}
      </div>

      {/* Skeleton untuk baris data (misalnya 10 baris) */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-4 gap-4 items-center p-4 border-b"
        >
          <Skeleton className="h-4 w-full" /> {/* No */}
          <Skeleton className="h-4 w-full" /> {/* NIM */}
          <Skeleton className="h-4 w-full" /> {/* Nama */}
          <Skeleton className="h-4 w-full" /> {/* Minat */}
        </div>
      ))}
    </div>
  );
}
