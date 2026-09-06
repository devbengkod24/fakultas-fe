import { Skeleton } from "@/components/ui/skeleton";

export default function SambutanSkeleton() {
  return (
    <section className="py-5 md:py-4 overflow-hidden relative">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-4">        
        <div className="bg-[#F3F5F8] rounded-[2.5rem] p-8 md:p-12 lg:p-16 relative overflow-hidden">          
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
            <div className="flex flex-col items-center w-full max-w-sm mx-auto">              
              {/* Container Utama Foto Skeleton */}
              <div className="relative h-[400px] md:h-[500px] w-full mb-10">
                
                {/* Background Blob Skeleton */}
                <div className="absolute inset-0 bg-white shadow-sm rounded-full"></div>
                
                {/* Orang/Foto Skeleton Placeholder */}
                <div className="relative w-full h-full flex items-end justify-center pb-6">
                   <Skeleton className="w-[70%] h-[80%] rounded-t-[5rem] bg-slate-200/50" />
                </div>

                {/* Lencana Nama Skeleton */}
                <div className="absolute -bottom-6 left-0 right-0 z-20 mx-auto w-[95%]">
                  <Skeleton className="h-16 w-full rounded-xl bg-primary-200/50 shadow-lg" />
                </div>
              </div>

              {/* Kotak Kutipan Skeleton */}
              <div className="w-full">
                <Skeleton className="h-32 w-full rounded-xl bg-white/70 shadow-sm" />
              </div>
            </div>

            {/* Kolom Kanan Skeleton */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-px w-8" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="w-4 h-4" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-8 md:h-10 w-64" />
                <Skeleton className="h-8 md:h-10 w-48" />
              </div>

              <Skeleton className="h-8 md:h-10 w-full max-w-lg mt-2" />

              <div className="space-y-4 pt-2">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>

              <div className="pt-2">
                <Skeleton className="h-12 w-48 rounded-xl" />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}