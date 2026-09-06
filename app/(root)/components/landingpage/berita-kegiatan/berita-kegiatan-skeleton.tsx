import { Skeleton } from "@/components/ui/skeleton";

export function BeritaKegiatanSkeleton() {
  return (
    <section className="py-10 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* Header Skeleton */}
        <div className="text-center space-y-4 mb-16">
          <Skeleton className="h-10 md:h-12 w-3/4 max-w-2xl mx-auto" />
          <Skeleton className="h-10 md:h-12 w-1/2 max-w-md mx-auto" />
          <Skeleton className="h-4 w-5/6 max-w-xl mx-auto mt-4" />
        </div>

        {/* Update Terbaru (Featured) Skeleton */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-px w-8" />
            <Skeleton className="h-4 w-32" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <Skeleton className="w-full aspect-[4/3] rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 md:h-10 w-full" />
              <Skeleton className="h-8 md:h-10 w-full" />
              <Skeleton className="h-8 md:h-10 w-3/4" />
              <Skeleton className="h-4 w-64 mt-2" />
              <div className="space-y-2 mt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <Skeleton className="h-10 w-48 rounded-full mt-6" />
            </div>
          </div>
        </div>

        {/* Prestasi & Kegiatan (Grid) Skeleton */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-px w-8" />
            <Skeleton className="h-4 w-40" />
          </div>

          {/* Filters Skeleton */}
          <div className="flex justify-between items-center mb-8">
            <div className="hidden md:flex gap-4 mx-auto">
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>
            <Skeleton className="h-10 w-36 rounded-full" />
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-32 mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}