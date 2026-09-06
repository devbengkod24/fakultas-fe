"use client";

import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronsUpDown,
  FileText,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MonitoringSidang1Service } from "@/api/tugas-akhir";
import EmptyState from "@/components/empty-state";
import SearchControl from "@/components/search-control";
import PaginationControls from "@/components/pagination-control";

interface Gelombang {
  id: number;
  nama_gelombang: string;
  tipe: "ta1" | "ta2";
}

interface DosenInfo {
  id: number;
  nama: string;
  gelar_depan: string | null;
  gelar_belakang: string | null;
}

interface SidangItem {
  sidang_id: number;
  tipe: "ta1" | "ta2";
  status: string;
  urutan: number | null;
  gelombang: { id: number; nama_gelombang: string } | null;
  mahasiswa: { id: number; nama: string; nim: string; kelas: string | null };
  pembimbing: DosenInfo | null;
  pendamping: DosenInfo | null;
  penguji: DosenInfo | null;
  penguji_2: DosenInfo | null;
  penguji_3: DosenInfo | null;
  sesi: {
    id: number;
    tgl_sidang: string;
    jam_mulai: string;
    ruangan: { id: number; nama_ruangan: string; gedung: string | null } | null;
  } | null;
  jadwal: {
    tgl_sidang: string | null;
    jam_sidang: string | null;
    lokasi: string | null;
  };
}

type SortDir = "asc" | "desc" | null;

function formatJam(jam: string | null | undefined): string | null {
  if (!jam) return null;
  const match = jam.match(/(\d{2}):(\d{2})/);
  if (!match) return jam;
  return `${match[1]}.${match[2]} - Selesai`;
}

export function PlotJadwalDosenSection({ tipe }: { tipe: "ta1" | "ta2" }) {
  const [gelombangId, setGelombangId] = useState<number | "semua">("semua");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const { data: gelombangRes } = useSWR(
    ["gelombang-dosen", tipe],
    () => MonitoringSidang1Service.getAllGelombangByDosen(tipe),
    { revalidateOnFocus: false },
  );

  const gelombangList: Gelombang[] = (gelombangRes?.data ?? []).filter(
    (g: Gelombang) => g.tipe === tipe,
  );

  const swrKey = ["jadwal-sidang-dosen", gelombangId, tipe, search];

  const { data: sidangRes, isLoading } = useSWR(
    swrKey,
    () =>
      MonitoringSidang1Service.getJadwalSidangByDosen(
        gelombangId === "semua" ? null : gelombangId,
        tipe,
        search,
      ),
    { revalidateOnFocus: false },
  );

  const sidangList: SidangItem[] = useMemo(
    () => sidangRes?.data ?? [],
    [sidangRes],
  );

  const displayList = useMemo(() => {
    return [...sidangList].sort((a, b) => {
      const aSched = !!a.sesi;
      const bSched = !!b.sesi;
      if (aSched !== bSched) return aSched ? -1 : 1;
      if (!sortDir) return 0;
      const da = `${a.sesi?.tgl_sidang ?? a.jadwal.tgl_sidang ?? ""} ${a.sesi?.jam_mulai ?? a.jadwal.jam_sidang ?? ""}`.trim();
      const db = `${b.sesi?.tgl_sidang ?? b.jadwal.tgl_sidang ?? ""} ${b.sesi?.jam_mulai ?? b.jadwal.jam_sidang ?? ""}`.trim();
      return sortDir === "asc" ? da.localeCompare(db) : db.localeCompare(da);
    });
  }, [sidangList, sortDir]);

  // Reset ke halaman 1 saat filter/urutan berubah.
  useEffect(() => {
    setPage(1);
  }, [gelombangId, search, sortDir, pageSize]);

  const lastPage = Math.max(1, Math.ceil(displayList.length / pageSize));
  const paginatedList = useMemo(
    () => displayList.slice((page - 1) * pageSize, page * pageSize),
    [displayList, page, pageSize],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="min-w-[200px] flex-1">
          <SearchControl placeholder="Cari nama atau NIM..." />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 gap-2 min-w-[160px] justify-between font-normal shrink-0"
            >
              <span>
                {gelombangId === "semua"
                  ? "Semua Gelombang"
                  : (gelombangList.find((g) => g.id === gelombangId)
                      ?.nama_gelombang ?? "Gelombang")}
              </span>
              <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[180px]">
            <DropdownMenuItem
              onClick={() => setGelombangId("semua")}
              className={gelombangId === "semua" ? "bg-muted font-medium" : ""}
            >
              Semua Gelombang
            </DropdownMenuItem>
            {gelombangList.map((g) => (
              <DropdownMenuItem
                key={g.id}
                onClick={() => setGelombangId(g.id)}
                className={gelombangId === g.id ? "bg-muted font-medium" : ""}
              >
                {g.nama_gelombang}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm animate-pulse">
          Memuat data...
        </div>
      ) : sidangList.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Tidak ada data jadwal"
          subtitle="Belum ada jadwal sidang untuk anak bimbing Anda di gelombang ini."
        />
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10 text-center">No.</TableHead>
                <TableHead
                  className="cursor-pointer select-none whitespace-nowrap"
                  onClick={() =>
                    setSortDir((d) =>
                      d === null ? "asc" : d === "asc" ? "desc" : null,
                    )
                  }
                >
                  <span className="flex items-center gap-1">
                    Tanggal
                    {sortDir === "asc" ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : sortDir === "desc" ? (
                      <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-40" />
                    )}
                  </span>
                </TableHead>
                <TableHead>Ruangan</TableHead>
                <TableHead>Mahasiswa</TableHead>
                <TableHead>Dosen Pembimbing</TableHead>
                <TableHead>Pendamping</TableHead>
                <TableHead>Ketua</TableHead>
                <TableHead>Anggota 1</TableHead>
                <TableHead>Anggota 2</TableHead>
                <TableHead>Gelombang</TableHead>
                <TableHead className="text-center">Urutan</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedList.map((item, idx) => {
                const scheduled = !!item.sesi;
                const rowNo = (page - 1) * pageSize + idx + 1;
                return (
                  <TableRow
                    key={item.sidang_id}
                    className={idx % 2 === 0 ? "bg-muted/30" : ""}
                  >
                    <TableCell className="text-center">{rowNo}</TableCell>
                    <TableCell>
                      {item.sesi?.tgl_sidang ? (
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {new Date(item.sesi.tgl_sidang).toLocaleDateString(
                              "id-ID",
                            )}
                          </span>
                          {item.jadwal.jam_sidang && (
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatJam(item.jadwal.jam_sidang)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.sesi?.ruangan?.nama_ruangan ?? (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {item.mahasiswa.nama}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.mahasiswa.nim}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.pembimbing?.nama ?? (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.pendamping?.nama ?? (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.penguji?.nama ?? (
                        <span className="text-muted-foreground text-xs italic">
                          Belum diplot
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.penguji_2?.nama ?? (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.penguji_3?.nama ?? (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.gelombang?.nama_gelombang ?? (
                        <span className="text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {item.urutan ?? (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={scheduled ? "success" : "secondary"}
                        className="text-xs"
                      >
                        {scheduled ? "Terjadwal" : "Belum"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {!isLoading && sidangList.length > 0 && (
        <PaginationControls
          currentPage={page}
          lastPage={lastPage}
          total={displayList.length}
          limit={pageSize}
          defaultLimit={pageSize}
          onPageChange={setPage}
          onLimitChange={setPageSize}
        />
      )}
    </div>
  );
}
