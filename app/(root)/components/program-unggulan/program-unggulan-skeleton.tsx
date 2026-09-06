import { Skeleton } from "@/components/ui/skeleton";

export function ProgramUnggulanSkeleton() {
  return (
    <div className="py-6 md:py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section Skeleton */}
        <div className="text-center mb-8 md:mb-12">
          <div className="space-y-4">
            <Skeleton className="h-8 md:h-10 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 md:gap-8">
          {/* Left - Program Cards Skeleton */}
          <div className="lg:col-span-1 space-y-4">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
              >
                <Skeleton className="h-32 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Center - Program Details Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              {/* Banner Skeleton */}
              <Skeleton className="h-32 md:h-48 lg:h-64 w-full" />

              {/* Tabs Skeleton */}
              <div className="border-b">
                <div className="flex">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="flex-1 p-3">
                      <Skeleton className="h-4 w-20 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Skeleton */}
              <div className="p-4 md:p-6 space-y-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Skeleton className="h-6 w-32" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Sidebar Skeleton */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            {/* Program Stats Skeleton */}
            <div className="bg-primary-100/20 rounded-xl border p-4 md:p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="text-center">
                    <Skeleton className="h-6 md:h-8 w-12 mx-auto mb-1" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                  </div>
                ))}
              </div>
            </div>

            {/* Application Info Skeleton */}
            <div className="bg-gradient-to-r from-primary to-primary-500 rounded-xl shadow-md p-4 md:p-6">
              <Skeleton className="h-6 w-24 mb-2 bg-white/20" />
              <Skeleton className="h-4 w-32 mb-4 bg-white/20" />
              <Skeleton className="h-10 w-full bg-white/20" />
            </div>

            {/* Announcements Skeleton */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-3 md:p-4 bg-gradient-to-r from-primary to-primary-500">
                <Skeleton className="h-6 w-32 bg-white/20" />
              </div>
              <div className="p-6 md:p-8 text-center">
                <Skeleton className="w-12 h-12 md:w-16 md:h-16 rounded-full mx-auto mb-4" />
                <Skeleton className="h-5 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-48 mx-auto mb-4" />
                <Skeleton className="h-8 w-20 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
