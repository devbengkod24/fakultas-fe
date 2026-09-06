import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const MenuSkeletonPengajar = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-4 rounded-full" />
    </CardHeader>
    <CardContent className="space-y-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-3 w-40" />
    </CardContent>
  </Card>
);

export const ListSkeletonPengajar = () => (
  <Card>
    <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
    <CardContent className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2 border-b pb-3 last:border-b-0">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </CardContent>
  </Card>
);

export const PengajarDashboardSkeleton = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MenuSkeletonPengajar />
      <MenuSkeletonPengajar />
      <MenuSkeletonPengajar />
      <MenuSkeletonPengajar />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ListSkeletonPengajar />
      <ListSkeletonPengajar />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ListSkeletonPengajar />
      <ListSkeletonPengajar />
    </div>
  </div>
);
