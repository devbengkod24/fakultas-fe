"use client";

import { useMemo, useState } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { useSearchParams } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarPlus,
  ChevronsUpDown,
  FileText,
  Mail,
  Pencil,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { GelombangService, PlottingJadwalService } from "@/api/kerja-praktek";
import { Gelombang } from "@/types/kerja-praktek/gelombang";
import SearchControl from "@/components/search-control";
import EmptyState from "@/components/empty-state";
import { useProfile } from "@/context/profileUseContext";

import { BuatJadwalDialog } from "./buat-jadwal-dialog";
import { EditJadwalDialog } from "./edit-jadwal-dialog";
import { GelombangSelector } from "../gelombang-selector";
import { DownloadUndanganModal } from "../hasil-sidang/modal-undangan";

interface PlotJadwalItem {
  sidang_id: number;
  pengajuan_sidang_id: number;
  pembimbing: { id: number; nama: string } | null;
  mahasiswa: { id: number; nama: string; nim: string };
  jadwal: { tanggal: string | null; jam: string | null; status: string };
  ruangan: { id: number; nama: string } | null;
  penguji_1: { id: number; nama: string } | null;
  penguji_2: { id: number; nama: string } | null;
  penguji_3: { id: number; nama: string } | null;
  gelombang: { id: number; nama_gelombang: string; nama?: string } | null;
  // Field nilai sidang dari backend resource
  nilai_penyelia?: number | null;
  nilai_pembimbing?: number | null;
  nilai_penguji_1?: number | null;
  nilai_penguji_2?: number | null;
  nilai_penguji_3?: number | null;
  nilai_akhir?: number | null;
  sidang_status?: string | null;
}

type StatusFilter = "semua" | "belum" | "sudah";
type SortDir = "asc" | "desc" | null;

export default function PlottingJadwalKoordinator() {
  const searchParams = useSearchParams();
  const { activeProdiId } = useProfile();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("semua");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [buatTarget, setBuatTarget] = useState<PlotJadwalItem[] | null>(null);
  const [editTarget, setEditTarget] = useState<PlotJadwalItem | null>(null);
  const [isUndanganModalOpen, setIsUndanganModalOpen] = useState(false);

  const search = searchParams.get("search") ?? "";
  const gelombangQueryId = Number(searchParams.get("gelombang_id")) || undefined;
  const pembimbingQueryId = Number(searchParams.get("pembimbing_id")) || undefined;

  const activeGelombangId = gelombangQueryId ?? null;

  // Fetch gelombang list untuk deteksi gelombang aktif (status === 1)
  const { data: gelombangData } = useSWR(
    ["gelombang-list-plot", activeProdiId ?? "all"],
    () =>
      GelombangService.getAllGelombang(
        undefined,
        undefined,
        activeProdiId ?? undefined,
      ).then((res) => res.data ?? []),
    { revalidateOnFocus: false },
  );
  const activeGelombang = (gelombangData ?? []).find(
    (g: Gelombang) => g.status === 1,
  );
  const activeGelombangIdFromList = activeGelombang?.id ?? null;

  const { data, isLoading } = useSWR(
    ["plotting-jadwal", activeGelombangId ?? "all", activeProdiId ?? undefined, search],
    () =>
      PlottingJadwalService.getAllPlottingJadwal(
        1,
        1000,
        search,
        activeGelombangId ?? undefined,
        activeProdiId ?? undefined,
      ),
    { revalidateOnFocus: false },
  );

  const allRows: PlotJadwalItem[] = data?.data ?? [];

  const rowsFilteredByPembimbing = useMemo(() => {
    if (!pembimbingQueryId) return allRows;
    return allRows.filter((r) => r.pembimbing?.id === pembimbingQueryId);
  }, [allRows, pembimbingQueryId]);

  // Item yang sedang dicentang oleh user
  const selectedItems = useMemo(
    () => rowsFilteredByPembimbing.filter((s) => selectedIds.includes(s.sidang_id)),
    [rowsFilteredByPembimbing, selectedIds],
  );

  // Gelombang efektif untuk membuat jadwal:
  // 1) Pakai filter URL jika ada
  // 2) Kalau item yang dipilih seragam dari satu gelombang, pakai gelombang item
  // 3) Fallback ke gelombang aktif (status === 1) bila tidak ada filter
  const effectiveGelombangId = useMemo<number | null>(() => {
    if (activeGelombangId) return activeGelombangId;

    const gelombangIds = Array.from(
      new Set(selectedItems.map((s) => s.gelombang?.id).filter(Boolean)),
    ) as number[];

    if (gelombangIds.length === 1) return gelombangIds[0];
    return activeGelombangIdFromList;
  }, [activeGelombangId, selectedItems, activeGelombangIdFromList]);

  const displayRows = useMemo(() => {
    if (statusFilter === "semua") return rowsFilteredByPembimbing;
    return rowsFilteredByPembimbing.filter((r) => {
      const scheduled = !!r.jadwal.tanggal;
      return statusFilter === "sudah" ? scheduled : !scheduled;
    });
  }, [rowsFilteredByPembimbing, statusFilter]);

  const sortedRows = useMemo(() => {
    if (!sortDir) return displayRows;
    return [...displayRows].sort((a, b) => {
      const da = `${a.jadwal.tanggal ?? ""} ${a.jadwal.jam ?? ""}`.trim();
      const db = `${b.jadwal.tanggal ?? ""} ${b.jadwal.jam ?? ""}`.trim();
      return sortDir === "asc" ? da.localeCompare(db) : db.localeCompare(da);
    });
  }, [displayRows, sortDir]);

  const isScheduled = (s: PlotJadwalItem) => !!s.jadwal.tanggal;

  const belumIds = useMemo(
    () => displayRows.filter((s) => !isScheduled(s)).map((s) => s.sidang_id),
    [displayRows],
  );

  const allBelumSelected =
    belumIds.length > 0 && belumIds.every((id) => selectedIds.includes(id));

  const toggleSelectAll = () => {
    setSelectedIds(allBelumSelected ? [] : belumIds);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleBuatJadwal = () => {
    if (!effectiveGelombangId) {
      toast.error(
        "Tidak dapat menentukan gelombang. Pilih gelombang pada filter, atau pastikan ada gelombang aktif.",
      );
      return;
    }
    const items = displayRows.filter((s) => selectedIds.includes(s.sidang_id));
    setBuatTarget(items);
  };

  const handleSuccess = () => {
    setSelectedIds([]);
    // Invalidate plotting-jadwal + semua slot-info-* keys (cache SWR).
    // Tanpa ini, setelah save sukses FE bisa pakai cache `slot-info` lama → user
    // buka dialog lagi dengan tanggal yg sama tapi total/used_jam masih stale.
    globalMutate((key) =>
      Array.isArray(key) &&
      (key[0] === "plotting-jadwal" ||
        (typeof key[0] === "string" && key[0].startsWith("slot-info-"))),
    );
  };

  const handleOpenUndangan = () => {
    if (!activeGelombangId) {
      toast.error("Pilih gelombang terlebih dahulu");
      return;
    }
    setIsUndanganModalOpen(true);
  };

  return (
    <div className="container mx-auto space-y-4 px-3 sm:px-0">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="w-full sm:w-1/4 min-w-[200px]">
          <SearchControl placeholder="Cari nama atau NIM..." className="w-full" />
        </div>

        <div className="flex gap-2 ml-auto flex-wrap">
          <div className="w-[200px] flex-shrink-0">
            <GelombangSelector />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 gap-2 min-w-[160px] justify-between font-normal shrink-0"
              >
                <span>
                  {statusFilter === "semua"
                    ? "Semua Status"
                    : statusFilter === "belum"
                      ? "Belum Dijadwalkan"
                      : "Sudah Dijadwalkan"}
                </span>
                <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[180px]">
              {(
                [
                  { value: "semua", label: "Semua Status" },
                  { value: "belum", label: "Belum Dijadwalkan" },
                  { value: "sudah", label: "Sudah Dijadwalkan" },
                ] as { value: StatusFilter; label: string }[]
              ).map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => {
                    setStatusFilter(opt.value);
                    setSelectedIds([]);
                  }}
                  className={statusFilter === opt.value ? "bg-muted font-medium" : ""}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="default"
            className="h-9 gap-2 shrink-0"
            disabled={!activeGelombangId}
            onClick={handleOpenUndangan}
          >
            <Mail className="h-4 w-4" />
            Download Undangan
          </Button>

          <Button
            onClick={handleBuatJadwal}
            disabled={selectedIds.length === 0 || !effectiveGelombangId}
            className="h-10 gap-2 shrink-0"
          >
            <CalendarPlus className="h-4 w-4" />
            Buat Jadwal
            {selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}
          </Button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm animate-pulse">
          Memuat data...
        </div>
      ) : sortedRows.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Tidak ada data"
          subtitle="Belum ada sidang yang sesuai filter."
        />
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allBelumSelected}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Pilih semua"
                    disabled={belumIds.length === 0}
                  />
                </TableHead>
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
                <TableHead>Pembimbing</TableHead>
                <TableHead>Penguji 1</TableHead>
                <TableHead>Penguji 2</TableHead>
                <TableHead>Penguji 3</TableHead>
                <TableHead>Gelombang</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map((item, idx) => {
                const scheduled = isScheduled(item);
                const isSelected = selectedIds.includes(item.sidang_id);
                return (
                  <TableRow
                    key={item.sidang_id}
                    className={cn(
                      idx % 2 === 0 ? "bg-muted/30" : "",
                      isSelected ? "bg-primary/5" : "",
                    )}
                  >
                    <TableCell>
                      {!scheduled && (
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelect(item.sidang_id)}
                          aria-label={`Pilih ${item.mahasiswa.nama}`}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {item.jadwal.tanggal ? (
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {new Date(item.jadwal.tanggal).toLocaleDateString("id-ID")}
                          </span>
                          {item.jadwal.jam && (
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {item.jadwal.jam}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.ruangan?.nama ?? (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{item.mahasiswa.nama}</span>
                        <span className="text-xs text-muted-foreground">{item.mahasiswa.nim}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.pembimbing?.nama ?? (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.penguji_1?.nama ?? (
                        <span className="text-muted-foreground text-xs italic">Belum diplot</span>
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
                      {item.gelombang?.nama_gelombang ?? item.gelombang?.nama ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {(() => {
                        // Client-side completion check (sama dengan Hasil Sidang)
                        // dipakai supaya status langsung konsisten walaupun
                        // backend `sidang.status` belum sempat ter-update
                        // (mis. sidang lama yang sudah dinilai sebelum
                        // listener bug diperbaiki).
                        const hasPenguji2 = item.penguji_2 != null;
                        const hasPenguji3 = item.penguji_3 != null;
                        const isGraded =
                          item.nilai_penyelia != null &&
                          item.nilai_pembimbing != null &&
                          item.nilai_penguji_1 != null &&
                          (!hasPenguji2 || item.nilai_penguji_2 != null) &&
                          (!hasPenguji3 || item.nilai_penguji_3 != null);
                        const isSelesai = isGraded || item.sidang_status === "selesai";

                        return (
                          <Badge
                            variant={isSelesai ? "success" : "secondary"}
                            className="text-xs"
                          >
                            {isSelesai
                              ? "Selesai"
                              : scheduled
                                ? "Terjadwal"
                                : "Belum"}
                          </Badge>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="text-center">
                      {scheduled && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => setEditTarget(item)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {buatTarget && effectiveGelombangId && (
        <BuatJadwalDialog
          gelombangId={effectiveGelombangId}
          selectedItems={buatTarget}
          onClose={() => setBuatTarget(null)}
          onSuccess={handleSuccess}
        />
      )}

      {editTarget && (
        <EditJadwalDialog
          sidang={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={handleSuccess}
        />
      )}

      {/* Modal Download Undangan (Mode Personal / Pilih Penguji / Per-Sesi) */}
      <DownloadUndanganModal
        isOpen={isUndanganModalOpen}
        onClose={() => setIsUndanganModalOpen(false)}
        prodiId={activeProdiId ?? undefined}
      />
    </div>
  );
}
