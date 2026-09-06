import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

interface RekapSkeletonViewProps {
  rows?: number;
  cols?: number;
}

export function RekapSkeletonView({ rows = 10, cols = 12 }: RekapSkeletonViewProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index}>
          <TableCell className="text-center">
            <Skeleton className="h-4 w-8 mx-auto" />
          </TableCell>
          <TableCell>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-8 w-24 mx-auto" />
          </TableCell>
          {Array.from({ length: cols - 3 }).map((_, ci) => (
            <TableCell key={ci} className="text-center">
              <Skeleton className="h-4 w-8 mx-auto" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
