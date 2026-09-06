import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export function DosenDetailSkeleton() {
  return (
    <div>
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-2 w-fit">
          <ArrowLeft className="size-4 text-gray-300" />
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-7 w-64 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-none">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="grid gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="grid grid-cols-3 items-center">
                <Skeleton className="h-4 w-20" />
                <div className="col-span-2 flex items-center">
                  <Skeleton className="mr-2 h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[calc(100%-88px)]">
            <Skeleton className="h-[250px] w-[250px] rounded-lg" />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="shadow-none">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <div className="border-b bg-muted/50 px-4 py-3">
                  <div className="grid grid-cols-5 gap-4">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                
                {[1, 2, 3, 4, 5].map((row) => (
                  <div key={row} className="border-b px-4 py-3">
                    <div className="grid grid-cols-5 gap-4">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}