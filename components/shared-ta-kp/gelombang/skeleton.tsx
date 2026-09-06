import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function GelombangToolbarSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 items-stretch sm:items-center mb-3">
      <div className="w-full sm:w-[200px] flex-shrink-0 h-10 bg-gray-200 animate-pulse rounded-md" />
      <div className="w-full sm:w-[160px] flex-shrink-0 h-10 bg-gray-200 animate-pulse rounded-md" />
      <div className="w-full sm:flex-1 h-10 bg-gray-200 animate-pulse rounded-md" />
      <div className="w-full sm:w-[160px] h-10 bg-gray-200 animate-pulse rounded-md" />
    </div>
  );
}

export function GelombangTableSkeleton() {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Nama Gelombang</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Periode</TableHead>
            <TableHead>Tgl Awal</TableHead>
            <TableHead>Tgl Akhir</TableHead>
            <TableHead>Pendaftar</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="h-5 bg-gray-200 animate-pulse rounded w-6" />
              </TableCell>
              <TableCell>
                <div className="h-5 bg-gray-200 animate-pulse rounded w-32" />
              </TableCell>
              <TableCell>
                <div className="h-6 bg-gray-200 animate-pulse rounded w-12" />
              </TableCell>
              <TableCell>
                <div className="h-5 bg-gray-200 animate-pulse rounded w-28" />
              </TableCell>
              <TableCell>
                <div className="h-5 bg-gray-200 animate-pulse rounded w-24" />
              </TableCell>
              <TableCell>
                <div className="h-5 bg-gray-200 animate-pulse rounded w-24" />
              </TableCell>
              <TableCell>
                <div className="h-5 bg-gray-200 animate-pulse rounded w-10" />
              </TableCell>
              <TableCell>
                <div className="h-6 bg-gray-200 animate-pulse rounded w-16" />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-md" />
                  <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-md" />
                  <div className="h-6 w-10 bg-gray-200 animate-pulse rounded-full" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
