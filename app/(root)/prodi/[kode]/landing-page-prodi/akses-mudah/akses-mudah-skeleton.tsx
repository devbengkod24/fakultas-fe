import { Skeleton } from "@/components/ui/skeleton";

const AksesMudahSkeleton = () => {
  return (
    <div className="py-4">
      <div className="max-w-6xl mx-auto px-4">
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    </div>
  );
};

export default AksesMudahSkeleton;
