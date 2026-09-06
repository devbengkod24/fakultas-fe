import React from 'react';
import Link from 'next/link';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { BookText, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Logbook } from '@/types/kerja-praktek/logbook';
import EmptyState from '@/components/empty-state';

interface LogbookTableMahasiswaProps {
  logbooks: Logbook[];
  isLoading?: boolean;
}

const LogbookTableMahasiswa = ({ logbooks, isLoading = false }: LogbookTableMahasiswaProps) => {
  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">No.</TableHead>
              <TableHead>Mahasiswa</TableHead>
              <TableHead className="text-center">NIM</TableHead>
              <TableHead className="text-center">Bab Terakhir</TableHead>
              <TableHead className="text-center">Total Bimbingan</TableHead>
              <TableHead className="text-center">Progress</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-8 mx-auto" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-24 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-16 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-2 flex-1" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-6 w-24 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-8 w-24 mx-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!logbooks || logbooks.length === 0) {
    return (
      <EmptyState
        icon={CalendarIcon}
        title="Tidak ada mahasiswa"
        subtitle="Belum ada mahasiswa bimbingan yang memiliki logbook"
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">No.</TableHead>
            <TableHead>Mahasiswa</TableHead>
            <TableHead className="text-center">NIM</TableHead>
            <TableHead className="text-center">Bab Terakhir</TableHead>
            <TableHead className="text-center">Total Bimbingan</TableHead>
            <TableHead className="text-center">Progress</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logbooks.map((student, index) => (
            <TableRow key={`${student.mahasiswa_id}-${student.kerja_praktek_id}`}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {getInitials(student.name ?? "")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium capitalize">{student.name?.toLowerCase()}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">{student.nim}</TableCell>
              <TableCell className="text-center">Bab {student.bab_terakhir || 0}</TableCell>
              <TableCell className="text-center">{student.total_bimbingan ?? 0}</TableCell>
              <TableCell className="w-[150px]">
                <div className="flex items-center gap-2">
                  <Progress
                    value={parseInt((student.progress ?? '0').toString().replace('%', '')) || 0}
                    className="h-2 flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-10">
                    {student.progress ?? '0%'}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={student.hasUnapprovedLogbook ? "yellow" : "secondary"}
                  className={
                    student.hasUnapprovedLogbook
                      ? "text-xs"
                      : "text-xs !bg-gray-100 !text-gray-700 !border-gray-200"
                  }
                >
                  {student.hasUnapprovedLogbook ? "Perlu di setujui" : "Belum"}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Link href={`/kerja-praktek/logbook-mahasiswa/${student.kerja_praktek_id}`}>
                  <Button size="sm" variant="primaryOutline">
                    <BookText className="size-4 mr-1" />
                    Logbook
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LogbookTableMahasiswa;
