"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationControls from "@/components/pagination-control";

interface DataTableMhsBkProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  pagination?: {
    currentPage: number;
    lastPage: number;
    limit: number;
    total: number;
  };
  loading?: boolean;
}

export function DataTableMhsBk<TData>({
  columns,
  data,
  pagination,
  loading = false,
}: DataTableMhsBkProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="w-full overflow-x-auto">
        <div className="rounded-md border min-w-[600px] sm:min-w-full">
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap px-2 sm:px-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: pagination?.limit || 5 }).map((_, index) => (
                  <TableRow
                    key={index}
                    className={cn("h-12", index % 2 === 0 ? "bg-muted/50" : "")}
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex} className="px-2 sm:px-4">
                        <Skeleton
                          className={cn(
                            "h-4 rounded bg-muted",
                            column.id === "actions"
                              ? "w-12"
                              : column.id === "code"
                              ? "w-24"
                              : "w-32 sm:w-48"
                          )}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn("h-12", index % 2 === 0 ? "bg-muted/50" : "")}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap px-2 sm:px-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center px-2 sm:px-4"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {pagination && (
        <PaginationControls
          currentPage={pagination.currentPage}
          lastPage={pagination.lastPage}
          total={pagination.total}
        />
      )}
    </div>
  );
}
