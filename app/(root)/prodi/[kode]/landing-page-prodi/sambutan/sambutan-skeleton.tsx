import { Skeleton } from "@/components/ui/skeleton";

export function SambutanSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Photo Side Skeleton */}
        <div className="relative">
          <div className="relative h-[400px] md:h-[500px] max-w-sm mx-auto">
            <div className="relative h-full">
              <Skeleton className="w-full h-full rounded-3xl" />
              <div className="absolute bottom-0 left-0 right-0">
                <div className="bg-gradient-to-r from-primary via-primary-500 to-primary-400 text-white rounded-xl w-full">
                  <div className="px-4 py-3 relative overflow-hidden">
                    <div className="relative z-10 space-y-1">
                      <Skeleton className="h-4 w-32 mx-auto bg-white/20" />
                      <Skeleton className="h-3 w-24 mx-auto bg-white/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Side Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-px w-8" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 md:h-10 w-64" />
            <Skeleton className="h-8 md:h-10 w-48" />
          </div>
          <div className="space-y-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
