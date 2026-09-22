"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { LogbookService } from "@/api/kerja-praktek";
import { useProfile } from "@/context/profileUseContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BookText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EmptyState from "@/components/empty-state";
import PaginationControls from "@/components/pagination-control";
import SearchControl from "@/components/search-control";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import withAuth from "@/app/(root)/hoc/withAuth";

const fetcher = (dosenId: number, page: number, limit: number, periode_id?: number, prodi_id?: number) =>
  LogbookService.getMahasiswaByDosen(dosenId, page, limit, periode_id, prodi_id).then((res) => res);

function LogbookDosenClientPage({ dosenId }: { dosenId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { activeProdiId } = useProfile();
  const searchTerm = searchParams.get("search") ?? "";

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const periode_id = Number(searchParams.get("periode_id")) || undefined;

  const {
    data,
    error,
    isLoading,
  } = useSWR(
    ["logbook-dosen-mahasiswa", Number(dosenId), page, limit, periode_id, activeProdiId],
    () => fetcher(Number(dosenId), page, limit, periode_id, activeProdiId ?? undefined),
    { dedupingInterval: 1000 }
  );

  const daftarMahasiswa = data?.data ?? [];
  const totalPages = data?.meta?.pagination?.last_page ?? 1;
  const totalData = data?.meta?.pagination?.total ?? 0;
  const currentPage = data?.meta?.pagination?.current_page ?? 1;

  if (isLoading) {
    return <div className="text-center py-12">Memuat...</div>;
  }

  if (error) {
    return (
      <EmptyState
        icon={BookText}
        title="Gagal memuat data"
        subtitle="Terjadi kesalahan saat mengambil data mahasiswa"
      />
    );
  }

  if (daftarMahasiswa.length === 0) {
    return (
      <EmptyState
        icon={BookText}
        title="Tidak ada mahasiswa"
        subtitle="Belum ada mahasiswa bimbingan untuk dosbim ini"
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/kerja-praktek/logbook-mahasiswa")}
          className="gap-1"
        >
          <ArrowLeft className="size-4" />
          Kembali
        </Button>
      </div>

      <div className="mb-4">
        <SearchControl placeholder="Cari mahasiswa" className="w-1/4" />
      </div>

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
            {daftarMahasiswa.map((mhs: any, index: number) => (
              <TableRow key={mhs.kerja_praktek_id}>
                <TableCell className="text-center">
                  {(currentPage - 1) * limit + index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={mhs.foto || ""} alt={mhs.nama_mahasiswa} className="object-cover" />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {getInitials(mhs.nama_mahasiswa)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{mhs.nama_mahasiswa}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{mhs.nim}</TableCell>
                <TableCell className="text-center">Bab {mhs.bab_terakhir || 0}</TableCell>
                <TableCell className="text-center">{mhs.total_bimbingan ?? 0}</TableCell>
                <TableCell className="w-[150px]">
                  <div className="flex items-center gap-2">
                    <Progress value={mhs.progress || 0} className="h-2 flex-1" />
                    <span className="text-xs text-muted-foreground w-10">
                      {mhs.progress || 0}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={mhs.hasUnapprovedLogbook ? "yellow" : "secondary"}
                    className={
                      mhs.hasUnapprovedLogbook
                        ? "text-xs"
                        : "text-xs !bg-gray-100 !text-gray-700 !border-gray-200"
                    }
                  >
                    {mhs.hasUnapprovedLogbook ? "Perlu di setujui" : "Belum"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Link href={`/kerja-praktek/logbook-mahasiswa/${mhs.kerja_praktek_id}`}>
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

      {daftarMahasiswa.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          lastPage={totalPages}
          total={totalData}
        />
      )}
    </div>
  );
}

export default withAuth(LogbookDosenClientPage, "kerja-praktek", ["koordinator", "super_fakultas"]);