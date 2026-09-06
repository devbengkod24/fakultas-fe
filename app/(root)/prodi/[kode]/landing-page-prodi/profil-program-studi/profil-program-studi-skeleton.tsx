import { Skeleton } from "@/components/ui/skeleton";

const ProfilProgramStudiSkeleton = () => {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto py-4">
      {/* Deskripsi Skeleton */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-start gap-6">
          <Skeleton className="hidden sm:block shrink-0 w-14 h-14 rounded-2xl" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-64" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>

      {/* Visi Misi Skeleton */}
      <div className="bg-white rounded-2xl shadow-md border overflow-hidden">
        {/* ── Visi Skeleton ── */}
        <div>
          <div className="bg-gradient-to-r from-primary to-primary-500 py-4 sm:py-6 px-4 sm:px-6 md:px-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white">VISI</h3>
          </div>
          <div className="p-4 sm:p-6 md:p-8 border-b border-gray-100 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* ── Misi Skeleton ── */}
        <div>
          <div className="bg-gradient-to-r from-primary to-primary-500 py-4 sm:py-6 px-4 sm:px-6 md:px-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white">MISI</h3>
          </div>
          <div className="p-4 sm:p-6 md:p-8 space-y-4 pl-4 sm:pl-6">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="flex gap-3">
                <Skeleton className="h-4 w-4 rounded-full mt-1 flex-shrink-0" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilProgramStudiSkeleton;
