import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <section className="relative overflow-hidden flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -right-40 w-96 h-96 bg-gradient-to-br from-primary-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 opacity-10">
          <div className="w-16 h-16 border-2 border-primary-300 rounded-full"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-12 md:py-16 lg:py-8 lg:pb-16">
          {/* Left Content Skeleton */}
          <div className="space-y-6 md:space-y-8">
            {/* Badge Skeleton */}
            <Skeleton className="h-10 w-72 rounded-full" />

            {/* Title Skeleton */}
            <div className="space-y-4">
              <div className="space-y-3">
                <Skeleton className="h-12 sm:h-16 md:h-20 lg:h-24 w-64 sm:w-80" />
                <Skeleton className="h-12 sm:h-16 md:h-20 lg:h-24 w-72 sm:w-96" />
              </div>

              {/* Underline Skeleton */}
              <div className="flex gap-2">
                <Skeleton className="w-20 h-1 rounded-full" />
                <Skeleton className="w-12 h-1 rounded-full" />
                <Skeleton className="w-8 h-1 rounded-full" />
              </div>
            </div>

            {/* Subtitle Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-full max-w-lg" />
              <Skeleton className="h-6 w-3/4 max-w-lg" />
              <Skeleton className="h-6 w-1/2 max-w-lg" />
            </div>

            {/* Button Skeleton */}
            <Skeleton className="h-12 w-64 rounded-xl" />

            {/* Stats Skeleton */}
            <div className="flex flex-wrap gap-6">
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Skeleton */}
          <div className="relative mt-8 lg:mt-0 order-first lg:order-last">
            <div className="relative rounded-3xl overflow-hidden shadow-sm">
              <div className="aspect-[4/3] sm:aspect-[16/9] md:aspect-[4/3] lg:aspect-[3/2] w-full relative">
                <Skeleton className="w-full h-full rounded-3xl" />

                {/* Info Badge Skeleton */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>

                {/* Progress Indicators Skeleton */}
                <div className="absolute bottom-6 right-6 flex gap-2">
                  {[1, 2, 3].map((index) => (
                    <Skeleton key={index} className="h-2 w-2 rounded-full" />
                  ))}
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary-200/60 to-purple-200/60 rounded-full opacity-60"></div>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-indigo-300/40 to-pink-300/40 rounded-full opacity-40"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
