import { Skeleton } from "@/components/ui/skeleton";

export function PengumumanSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Tabs & Filter Section */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          {/* Prodi Filter Skeleton */}
          <Skeleton className="h-10 w-36 rounded-lg bg-gray-200" />

          {/* Tabs Skeleton */}
          <div className="flex-1 overflow-hidden">
            <div className="w-full flex items-center gap-2">
              <div className="min-w-max">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton
                      key={i}
                      className={`h-9 rounded-md ${i === 1 ? "w-20 bg-white" : "w-16 bg-gray-200"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Search Bar Skeleton */}
              <div className="flex-1 h-9">
                <Skeleton className="h-full w-full max-w-xs rounded-lg bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section - Card List Skeleton */}
      <div className="min-h-[400px] space-y-0 flex flex-col gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border-l-4 border-l-gray-200 animate-pulse"
          >
            <div className="p-4">
              <div className="space-y-3">
                {/* Title skeleton */}
                <Skeleton className="h-6 w-3/4 bg-gray-200 rounded" />

                {/* Category badge skeleton */}
                <Skeleton className="h-6 w-20 rounded-full bg-gray-200" />

                {/* Meta info skeleton */}
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-24 bg-gray-200 rounded" />
                  <Skeleton className="h-3 w-20 bg-gray-200 rounded" />
                </div>

                {/* Content skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full bg-gray-200 rounded" />
                  <Skeleton className="h-3 w-5/6 bg-gray-200 rounded" />
                  <Skeleton className="h-3 w-4/6 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="p-4 sm:p-6 flex justify-center">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md bg-gray-200" />
          <Skeleton className="h-9 w-12 rounded-md bg-gray-200" />
          <Skeleton className="h-9 w-9 rounded-md bg-gray-200" />
          <Skeleton className="h-9 w-12 rounded-md bg-gray-200" />
          <Skeleton className="h-9 w-9 rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default PengumumanSkeleton;