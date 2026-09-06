import { Skeleton } from "@/components/ui/skeleton";

export default function VisiMisiSkeleton() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#114D91] to-primary-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header Section Skeleton */}
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Skeleton className="h-px w-8 md:w-12 bg-white/40" />
            <Skeleton className="h-4 w-32 bg-white/20" />
            <Skeleton className="h-px w-8 md:w-12 bg-white/40" />
          </div>
          <Skeleton className="h-10 md:h-12 w-64 md:w-80 bg-white/20" />
        </div>
        
        <div className="flex flex-col gap-6 lg:gap-8 items-stretch">  
          {/* Visi Card Skeleton */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-8 w-16 bg-slate-200" />
              </div>
              <Skeleton className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>
            {/* Paragraf Visi */}
            <div className="space-y-3 pt-2">
              <Skeleton className="h-4 w-full bg-slate-200" />
              <Skeleton className="h-4 w-[95%] bg-slate-200" />
              <Skeleton className="h-4 w-[85%] bg-slate-200" />
              <Skeleton className="h-4 w-full bg-slate-200" />
              <Skeleton className="h-4 w-[60%] bg-slate-200" />
            </div>
          </div>

          {/* Misi Card Skeleton */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-8 w-20 bg-slate-200" />
              </div>
              <Skeleton className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>
            {/* List Misi */}
            <div className="space-y-5 pt-2">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="flex gap-4">
                  <Skeleton className="h-2 w-2 rounded-full mt-1.5 flex-shrink-0 bg-slate-300" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-full bg-slate-200" />
                    {index % 2 === 0 && <Skeleton className="h-4 w-[85%] bg-slate-200" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}