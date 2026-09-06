import { Skeleton } from "@/components/ui/skeleton";

export function AlumniStoriesSkeleton() {
  return (
    <section className="py-8 md:py-20 overflow-hidden relative bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Header Skeleton */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <Skeleton className="h-10 md:h-12 w-3/4 md:w-1/2 mx-auto mb-4" />
          <Skeleton className="h-4 w-full mx-auto" />
          <Skeleton className="h-4 w-5/6 mx-auto mt-2" />
        </div>

        {/* Cards Skeleton Slider */}
        <div className="flex gap-6 overflow-hidden pb-8 ml-0">
          {[1, 2].map((i) => (
            <div 
              key={i} 
              className="pl-4 md:pl-6 basis-[80%] sm:basis-[70%] md:basis-[85%] lg:basis-[70%] xl:basis-[60%]"
            >
              <div className="bg-white rounded-2xl md:rounded-[1.5rem] shadow-xl overflow-hidden flex flex-col md:flex-row items-stretch min-w-full flex-shrink-0 h-auto">
                {/* Image Skeleton */}
                <div className="relative w-full md:w-1/3 h-[280px] md:h-auto shrink-0 bg-slate-200">
                  <Skeleton className="w-full h-full rounded-none bg-slate-300" />
                </div>

                {/* Text Skeleton */}
                <div className="p-4 md:p-6 lg:p-8 relative bg-white md:w-2/3">
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="order-2 md:order-1">
                      <Skeleton className="h-6 w-full mb-3" />
                      <Skeleton className="h-6 w-full mb-3" />
                      <Skeleton className="h-6 w-3/4 mb-10" />
                    </div>
                    
                    <div className="order-1 md:order-2 md:mt-auto mb-4 md:mb-0 border-t border-transparent md:border-slate-100 pt-0 md:pt-6 space-y-2">
                      <div className="flex gap-2 items-center">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-12 rounded-md" />
                      </div>
                      <Skeleton className="h-4 w-56" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}