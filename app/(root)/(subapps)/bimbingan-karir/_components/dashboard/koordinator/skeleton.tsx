import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MenuSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
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

export function ChartSkeleton() {
    return (
        <Card className="shadow-none h-full flex flex-col">
            <CardHeader className="flex flex-col">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" /> {/* Title */}
                    <Skeleton className="h-4 w-64" /> {/* Description */}
                </div>
                <div className="h-8"></div>
            </CardHeader>
            <CardContent>
                <div className="h-64 w-full">
                    <Skeleton className="h-full w-full" />
                </div>
            </CardContent>
        </Card>
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

export function DaftarKegiatanSkeleton() {
    return (
        <Card className="pb-4 mt-2">
            {/* Header */}
            <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-56" />
            </CardHeader>

            {/* Kegiatan Items */}
            <CardContent className="space-y-3 max-h-[25vh] overflow-y-auto pr-2">
                {[1, 2].map((i) => (
                    <div key={i} className="p-4 bg-sidebar rounded-lg border">
                        <div className="grid lg:grid-cols-7 grid-cols-1 gap-4">
                            
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
                            <div className="flex items-center gap-2 lg:col-span-2 col-span-3">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-3 w-32" />
                            </div>

                            {/* Total Mahasiswa */}
                            <div className="flex items-center gap-2 lg:col-span-1 col-span-3">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-3 w-12" />
                            </div>

                            {/* Badge Status */}
                            <div className="flex items-center lg:justify-end lg:col-span-1 col-span-3">
                                <Skeleton className="h-6 w-28 rounded-full" />
                            </div>

                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export function ChartJmlMhsSkeleton() {
    return (
        <Card className="shadow-none h-full">
            <CardHeader className="mb-4">
                <CardTitle>
                    <Skeleton className="h-6 w-56" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-7">
                    {/* Skeleton untuk bar chart horizontal */}
                    {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-4 w-20" /> {/* Label */}
                        <Skeleton className="h-7 flex-1 max-w-40 rounded" /> {/* Bar */}
                    </div>
                    ))}
                </div>
            </CardContent>
        </Card>

    );
}