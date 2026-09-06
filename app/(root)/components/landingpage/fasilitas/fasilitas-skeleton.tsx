import { Skeleton } from "@/components/ui/skeleton";

export function FasilitasSkeleton() {
  return (
    <section className="py-8 md:py-20 overflow-hidden relative bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Header Skeleton */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <Skeleton className="h-10 md:h-12 w-3/4 max-w-md mx-auto mb-4 bg-slate-200" />
          <Skeleton className="h-4 md:h-5 w-5/6 max-w-xl mx-auto bg-slate-200" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[0, 1, 2, 3, 4].map((index) => {
            const isFirstAndOdd = index === 0;

            return (
              <div 
                key={index}
                className={`relative overflow-hidden rounded-2xl bg-slate-200 ${
                  isFirstAndOdd ? "md:col-span-2 aspect-video md:aspect-[21/9]" : "aspect-video"
                }`}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <Skeleton className={`bg-slate-300/50 mb-3 ${isFirstAndOdd ? "h-8 w-1/3" : "h-6 w-1/2"}`} />
                  <Skeleton className={`bg-slate-300/50 ${isFirstAndOdd ? "h-5 w-2/3" : "h-4 w-3/4"}`} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}