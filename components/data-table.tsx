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
import PaginationControls from "./pagination-control";

interface DataTableProps<TData> {
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

export function DataTable<TData>({
  columns,
  data,
  pagination,
  loading = false,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                    className={cn(
                      "truncate",
                      (header.id === "no" || header.id === "actions") && "text-center"
                    )}
                  >
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
              Array.from({ length: pagination?.limit || 0 }).map((_, index) => (
                <TableRow
                  key={index}
                  className={cn("h-12", index % 2 === 0 ? "bg-muted/50" : "")}
                >
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton
                        className={cn(
                          "h-4 rounded bg-muted",
                          column.id === "actions"
                            ? "w-12"
                            : column.id === "code"
                            ? "w-24"
                            : "w-48"
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
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                      className={cn(
                        "truncate",
                        (cell.column.id === "no" || cell.column.id === "actions") && "text-center"
                      )}
                    >
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <PaginationControls
          currentPage={pagination.currentPage}
          lastPage={pagination.lastPage}
          total={pagination.total}
          limit={pagination.limit}
        />
      )}
    </div>
  );
}