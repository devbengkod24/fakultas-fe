import { Skeleton } from "@/components/ui/skeleton";

export function AkreditasiSkeleton() {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="group">
          <div className="overflow-hidden rounded-xl shadow-md border bg-white p-3 sm:p-4">
            <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden rounded-lg">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="mt-3 sm:mt-4 p-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
