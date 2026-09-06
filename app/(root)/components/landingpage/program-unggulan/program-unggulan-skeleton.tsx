import { Skeleton } from "@/components/ui/skeleton";

export function ProgramUnggulanSkeleton() {
  return (
    <section className="py-4 md:py-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Header Skeleton */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((index) => (
            <div key={index} className="relative h-full">
              <div className="relative bg-white rounded-3xl p-6 overflow-hidden h-full flex flex-col shadow-sm border">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="w-28 h-18 rounded-2xl" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>

                {/* Content Skeleton */}
                <div className="flex-grow space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>

                {/* Stats Section Skeleton */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-3 h-3 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="w-10 h-10 rounded-full" />
                  </div>
                </div>

                {/* Bottom Visual Element Skeleton */}
                <div className="mt-4">
                  <Skeleton className="w-full h-20 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Skeleton */}
        <div className="text-center">
          <Skeleton className="h-12 w-48 mx-auto rounded-xl" />
        </div>
      </div>
    </section>
  );
}
