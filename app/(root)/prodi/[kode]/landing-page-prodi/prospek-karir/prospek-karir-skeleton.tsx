import { Skeleton } from "@/components/ui/skeleton";

const ProspekKarirSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* Desktop Skeleton */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="h-12 bg-gray-100 mb-1" />
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 flex-1" />
              {i === 0 && <Skeleton className="h-64 w-64" />}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Skeleton */}
      <div className="lg:hidden space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProspekKarirSkeleton;
