import { Skeleton } from "@/components/ui/skeleton";

export function ProgramStudiSkeleton() {
  return (
    <section className="py-5 md:py-20 overflow-hidden relative bg-gradient-to-br from-[#114D91] to-primary-500">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* Header Skeleton */}
        <div className="text-center max-w-4xl mx-auto mb-12 flex flex-col items-center">
          <Skeleton className="h-10 md:h-14 w-3/4 mb-4 bg-white/20" />
          <Skeleton className="h-4 w-full bg-white/10" />
          <Skeleton className="h-4 w-5/6 mt-2 bg-white/10" />
        </div>

        {/* Tabs Skeleton */}
        <div className="border-b border-white/20 mb-10 flex gap-4 md:gap-8 justify-center overflow-x-auto pb-4">
          <Skeleton className="h-6 w-20 bg-white/20" />
          <Skeleton className="h-6 w-24 bg-white/20" />
          <Skeleton className="h-6 w-28 bg-white/20" />
          <Skeleton className="h-6 w-24 bg-white/20" />
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-[320px]">
              <div className="p-6 flex-grow">
                {/* Badge Skeleton */}
                <Skeleton className="w-11 h-11 rounded-[0.6rem] mb-5 bg-slate-200" />
                
                {/* Title Skeleton */}
                <Skeleton className="h-6 w-3/4 mb-4 bg-slate-200" />
                
                {/* Paragraph Skeleton */}
                <div className="space-y-2.5">
                  <Skeleton className="h-3 w-full bg-slate-100" />
                  <Skeleton className="h-3 w-full bg-slate-100" />
                  <Skeleton className="h-3 w-4/5 bg-slate-100" />
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-5 border-t border-slate-100 flex justify-end">
                <Skeleton className="h-4 w-32 bg-slate-200" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}