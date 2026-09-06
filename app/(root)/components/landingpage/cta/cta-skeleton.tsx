import { Skeleton } from "@/components/ui/skeleton";

export function CTASkeleton() {
  return (
    <section className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-xl min-h-[400px] flex items-center justify-center bg-slate-900">
          
          <div className="relative z-10 px-6 py-16 md:py-24 flex flex-col items-center text-center w-full">
            {/* Badge Skeleton */}
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="h-[2px] w-6 bg-slate-700" />
              <Skeleton className="h-4 w-48 bg-slate-700" />
            </div>

            {/* Title Skeleton */}
            <Skeleton className="h-12 md:h-16 w-3/4 max-w-2xl mb-4 bg-slate-700" />
            <Skeleton className="h-12 md:h-16 w-1/2 max-w-xl mb-6 bg-slate-700" />

            {/* Subtitle Skeleton */}
            <Skeleton className="h-5 w-5/6 max-w-2xl mb-3 bg-slate-800" />
            <Skeleton className="h-5 w-2/3 max-w-xl mb-10 bg-slate-800" />

            {/* Button Skeleton */}
            <Skeleton className="h-14 w-48 rounded-full bg-slate-700" />
          </div>

        </div>
      </div>
    </section>
  );
}