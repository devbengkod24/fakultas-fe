import { Skeleton } from "@/components/ui/skeleton";

export function ProfilDosenSkeleton() {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="group">
          <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col">
            <div className="aspect-[3/4] relative overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="p-3 sm:p-4 flex flex-col flex-grow">
              <div className="min-h-[3rem] sm:min-h-[3.5rem] mb-2">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-3 w-2/3 mt-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
