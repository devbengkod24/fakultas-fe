import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <section className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <main className="relative bg-[#F3F5F8] rounded-[2.5rem] p-8 md:p-12 lg:p-16 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center z-10 relative">
          
          {/* Left Content Skeleton */}
          <div className="flex flex-col items-start gap-6">
            <Skeleton className="h-10 w-64 rounded-full bg-slate-200" />

            <div className="space-y-3 w-full">
              <Skeleton className="h-14 sm:h-16 lg:h-20 w-3/4 rounded-xl bg-slate-200" />
              <Skeleton className="h-14 sm:h-16 lg:h-20 w-full rounded-xl bg-slate-200" />
            </div>

            <div className="flex gap-2 my-2">
              <Skeleton className="w-16 h-1.5 rounded-full bg-slate-300" />
              <Skeleton className="w-12 h-1.5 rounded-full bg-slate-200" />
              <Skeleton className="w-8 h-1.5 rounded-full bg-slate-200" />
            </div>

            <Skeleton className="h-8 w-full max-w-md rounded-lg bg-slate-200" />

            <div className="space-y-2 w-full">
              <Skeleton className="h-5 w-full max-w-md bg-slate-200" />
              <Skeleton className="h-5 w-5/6 max-w-md bg-slate-200" />
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Skeleton className="h-14 w-40 rounded-full bg-slate-200" />
              <Skeleton className="h-14 w-48 rounded-full bg-slate-200" />
            </div>
          </div>

          {/* Right Image Skeleton */}
          <div className="relative mt-8 lg:mt-0 order-first lg:order-last w-full">
            <Skeleton className="aspect-[4/3] sm:aspect-[16/9] md:aspect-[4/3] lg:aspect-[4/3] w-full rounded-[2rem] bg-slate-300" />
            
            {/* Info Badge Skeleton */}
            <div className="absolute bottom-6 left-6 bg-white/50 rounded-xl p-4 w-48">
              <Skeleton className="h-5 w-32 mb-2 bg-slate-300" />
              <Skeleton className="h-3 w-24 bg-slate-300" />
            </div>
          </div>
        </div>

        {/* Stats Section Bottom Skeleton */}
        <div className="mt-16 flex flex-wrap gap-12 lg:gap-24 border-t border-slate-200/60 pt-8">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex flex-col gap-2">
              <Skeleton className="h-12 w-24 bg-slate-200" />
              <Skeleton className="h-4 w-32 bg-slate-200" />
            </div>
          ))}
        </div>
      </main>
    </section>
  );
}