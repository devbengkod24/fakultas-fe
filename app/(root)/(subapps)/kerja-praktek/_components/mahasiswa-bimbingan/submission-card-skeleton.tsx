import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SubmissionCardSkeleton() {
  return (
    <Card className="overflow-hidden shadow-none">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="flex-1">
              <div className="flex flex-col">
                <div className="h-6 w-40 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
          <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          <div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">

            </div>
            <div className="h-5 w-full bg-gray-200 animate-pulse rounded mb-3"></div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">

            </div>
            <div className="h-5 w-3/4 bg-gray-200 animate-pulse rounded mb-3"></div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">

            </div>
            <div className="h-5 w-2/3 bg-gray-200 animate-pulse rounded mb-3"></div>

            <div className="grid grid-cols-5 gap-4 mt-4">
              <div className="col-span-2"></div>
              <div className="col-span-3 flex justify-end space-x-2">
                <div className="h-9 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="h-9 w-full bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}