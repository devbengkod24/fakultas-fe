import { Skeleton } from "@/components/ui/skeleton";

export function StudentInfoSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="border border-l-primary border-l-4 rounded-lg p-6">
          <div className="space-y-2">
            {/* Header with icon and title */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-4 w-5 rounded" />
            </div>
            
            {/* Main value */}
            <Skeleton className="h-5 w-24" />
            
            {/* Description */}
            <Skeleton className="h-2 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DaftarKegiatanSkeleton() {
    return (
        <div className="border rounded-lg">
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="h-4 w-64" />
            </div>

            {/* Kegiatan Items */}
            <div className="px-6 pb-4 space-y-3">
              {[1, 2, 3,4].map((i) => (
                <div key={i} className="p-4 bg-sidebar rounded-lg border">
                  <div className="grid lg:grid-cols-5 grid-cols-1 gap-4">
                    
                    {/* COL 1-3: Poster + Info */}
                    <div className="flex items-center gap-4 lg:col-span-3 col-span-5">
                      {/* Poster */}
                      <Skeleton className="h-16 w-16 rounded-md flex-shrink-0" />
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        {/* Title */}
                        <Skeleton className="h-4 w-48" />
                        {/* Location */}
                        <div className="flex items-center gap-1.5">
                          <Skeleton className="h-3 w-3" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    </div>

                    {/* Tanggal */}
                    <div className="flex items-center gap-2 lg:col-span-1 col-span-3">
                      <Skeleton className="h-3.5 w-3.5" />
                      <Skeleton className="h-3 w-40" />
                    </div>

                    {/* Badge Status */}
                    <div className="flex items-center lg:justify-end lg:col-span-1 col-span-3">
                      <Skeleton className="h-6 w-32 rounded-full" />
                    </div>

                  </div>
                </div>
              ))}
            </div>
        </div>
    );
}

export function PengumumanSkeleton() {
    return (
        <div className="border rounded-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-6">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-5 rounded" />
            </div>

            {/* Pengumuman Items */}
            <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-3">
                        <div className="space-y-2">
                            {/* Title */}
                            <Skeleton className="h-4 w-full" />
                            
                            {/* Meta Info */}
                            <Skeleton className="h-3 w-24" />
                            
                            {/* Link */}
                            <Skeleton className="h-3 w-20" />
                        </div>
                        
                        {/* Divider (except last item) */}
                        {i < 4 && <Skeleton className="h-px w-full" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

