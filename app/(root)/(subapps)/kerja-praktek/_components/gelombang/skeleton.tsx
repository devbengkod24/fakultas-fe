import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function GelombangTableSkeleton({ rowCount = 5 }: { rowCount?: number }) {
  const columns = [
    { id: "nama", width: "w-40" },
    { id: "awal", width: "w-28" },
    { id: "akhir", width: "w-28" },
    { id: "periode", width: "w-40" },
    { id: "status", width: "w-24" },
    { id: "actions", width: "w-24" },
  ];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id}>
                {column.id !== "actions" && (
                  <Skeleton className={`h-5 ${column.width} bg-gray-200 rounded`} />
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, index) => (
            <TableRow
              key={index}
              className={index % 2 === 0 ? "bg-muted/50" : ""}
            >
              {columns.map((column) => (
                <TableCell key={`${index}-${column.id}`} className="py-4">
                  <Skeleton
                    className={`h-8 rounded bg-gray-200 ${
                      column.id === "actions"
                        ? "w-16"
                        : column.width
                    }`}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between space-x-2 py-4 px-4">
        <div className="flex-1 text-sm text-muted-foreground">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-24" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GelombangToolbarSkeleton() {
  return (
    <div className="flex gap-2 items-center mb-3">
      <div className="w-[200px] flex-shrink-0">
        <div className="h-10 w-full bg-gray-200 animate-pulse rounded-md"></div>
      </div>

      <div className="w-full h-10 bg-gray-200 animate-pulse rounded-md"></div>

      <div className="h-10 w-[150px] bg-gray-200 animate-pulse rounded-md"></div>
    </div>
  );
}

export function GelombangSkeleton() {
  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col space-y-4">
        <GelombangToolbarSkeleton />
        <GelombangTableSkeleton />
      </div>
    </div>
  );
}