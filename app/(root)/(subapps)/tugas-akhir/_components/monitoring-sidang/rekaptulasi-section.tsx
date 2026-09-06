"use client";

import useSWR from "swr";
import { useState, useMemo } from "react";
import Link from "next/link";
import { SidangKoorService } from "@/api/tugas-akhir";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GraduationCap, Download } from "lucide-react";
import PaginationControls from "@/components/pagination-control";
import { toast } from "sonner";
import SearchControl from "@/components/search-control";
import EmptyState from "@/components/empty-state";

interface DosenStat {
  id: number;
  nama: string;
  npp: string;
  gelar_depan: string;
  gelar_belakang: string;
  jumlah_ketua: number;
  jumlah_pendamping: number;
  jumlah_anggota_penguji: number;
}

interface Rekaptulasi {
  mahasiswa: unknown;
  dosen: DosenStat[];
}

const DOSEN_LIMIT = 10;

export function RekaptulasSection({ tipe }: { tipe: "ta1" | "ta2" }) {
  const [gelombangId, setGelombangId] = useState<number | null>(null);
  const [dosenPage, setDosenPage] = useState(1);
  const [dosenLimit, setDosenLimit] = useState(DOSEN_LIMIT);
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState("");

  const { data: gelombangRes } = useSWR("sidang-gelombang-all", () =>
    SidangKoorService.getGelombang(),
  );
  const allGelombang: { id: number; nama_gelombang: string; tipe: string }[] =
    gelombangRes?.data?.data ?? gelombangRes?.data ?? [];
  const gelombangList = allGelombang.filter((g) => g.tipe === tipe);

  const { data: response, isLoading } = useSWR(
    ["rekaptulasi-sidang", gelombangId, tipe],
    () => SidangKoorService.getRekaptulasi(gelombangId, tipe),
  );

  const rekap: Rekaptulasi | null = response?.data ?? null;
  const dosen = rekap?.dosen ?? [];

  const filteredDosen = useMemo(() => {
    if (!search.trim()) return dosen;
    const q = search.toLowerCase();
    return dosen.filter((d) => {
      const namaLengkap = [d.gelar_depan, d.nama, d.gelar_belakang]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return namaLengkap.includes(q) || (d.npp ?? "").toLowerCase().includes(q);
    });
  }, [dosen, search]);

  const handleGelombangChange = (v: string) => {
    setGelombangId(v === "all" ? null : Number(v));
    setDosenPage(1);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await SidangKoorService.exportRekaptulasi(gelombangId, tipe);
      if (!res.ok) {
        toast.error("Gagal mengekspor data");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = res.headers.get("content-disposition");
      const match = disposition?.match(/filename="?([^"]+)"?/);
      a.download = match?.[1] ?? `rekap_dosen_sidang_${tipe}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Gagal mengekspor data");
    } finally {
      setExporting(false);
    }
  };

  const startIdx = (dosenPage - 1) * dosenLimit;
  const dosenSliced = filteredDosen.slice(startIdx, startIdx + dosenLimit);
  const dosenLastPage = Math.max(1, Math.ceil(filteredDosen.length / dosenLimit));

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="w-1/3">
          <SearchControl
            placeholder="Cari nama dosen..."
            value={search}
            onChange={(v) => { setSearch(v); setDosenPage(1); }}
          />
        </div>
        <div className="flex gap-2 ml-auto items-center">
          <Select
            value={gelombangId ? String(gelombangId) : "all"}
            onValueChange={handleGelombangChange}
          >
            <SelectTrigger className="h-10 w-[200px]">
              <SelectValue placeholder="Semua Gelombang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Gelombang</SelectItem>
              {gelombangList.map((g) => (
                <SelectItem key={g.id} value={String(g.id)}>
                  {g.nama_gelombang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleExport}
            disabled={exporting || dosen.length === 0}
            className="h-10 gap-2"
          >
            <Download className="size-4" />
            {exporting ? "Mengekspor..." : "Export Excel"}
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-amber-500 inline-block" />
          Pendamping
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-blue-600 inline-block" />
          Ketua Penguji
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500 inline-block" />
          Anggota Penguji (Anggota 1 + 2 digabung)
        </span>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : filteredDosen.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="Tidak ada data dosen"
          subtitle={
            search
              ? "Tidak ada dosen yang cocok dengan pencarian."
              : "Belum ada data dosen sidang."
          }
          variant="small"
        />
      ) : (
        <>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 text-center">No.</TableHead>
                  <TableHead>Nama Dosen</TableHead>
                  <TableHead className="text-center">Pendamping</TableHead>
                  <TableHead className="text-center">Ketua Penguji</TableHead>
                  <TableHead className="text-center">Anggota Penguji</TableHead>
                  <TableHead className="text-center w-20">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dosenSliced.map((d, idx) => {
                  const namaLengkap = [d.gelar_depan, d.nama, d.gelar_belakang]
                    .filter(Boolean)
                    .join(" ");
                  const total =
                    d.jumlah_ketua + d.jumlah_pendamping + d.jumlah_anggota_penguji;

                  return (
                    <TableRow
                      key={d.id}
                      className={idx % 2 === 0 ? "bg-muted/30" : ""}
                    >
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {startIdx + idx + 1}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/tugas-akhir/data-dosen/${d.id}`}
                          className="block hover:text-primary"
                        >
                          <p className="font-medium leading-snug text-sm">{namaLengkap}</p>
                          {d.npp && (
                            <p className="text-xs text-muted-foreground mt-0.5">{d.npp}</p>
                          )}
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">
                        {d.jumlah_pendamping > 0 ? (
                          <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                            {d.jumlah_pendamping}x
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {d.jumlah_ketua > 0 ? (
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                            {d.jumlah_ketua}x
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {d.jumlah_anggota_penguji > 0 ? (
                          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            {d.jumlah_anggota_penguji}x
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-sm">
                        {total}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <PaginationControls
            currentPage={dosenPage}
            lastPage={dosenLastPage}
            total={filteredDosen.length}
            defaultLimit={dosenLimit}
            onPageChange={setDosenPage}
            onLimitChange={(l) => {
              setDosenLimit(l);
              setDosenPage(1);
            }}
          />
        </>
      )}
    </div>
  );
}
