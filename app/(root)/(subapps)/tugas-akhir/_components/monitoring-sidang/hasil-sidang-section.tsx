"use client";

import { useState, useMemo, useEffect } from "react";
import PaginationControls from "@/components/pagination-control";
import { useSearchParams } from "next/navigation";
import useSWR, { mutate } from "swr";
import {
  FileText,
  ChevronsUpDown,
  Download,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  CheckCircle,
  Pencil,
  ListChecks,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { SidangKoorService } from "@/api/tugas-akhir";
import { toast } from "sonner";
import { handleToastResponse } from "@/lib/toast-response";
import EmptyState from "@/components/empty-state";
import SearchControl from "@/components/search-control";

interface Gelombang {
  id: number;
  nama_gelombang: string;
  tgl_awal: string;
  tgl_akhir: string;
  status: number;
  tipe: "ta1" | "ta2";
}

interface DosenInfo {
  id: number;
  nama: string;
  gelar_depan: string | null;
  gelar_belakang: string | null;
}

interface HasilSidangItem {
  sidang_id: number;
  tipe: "ta1" | "ta2";
  judul: string;
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
    ruangan: { id: number; nama_ruangan: string } | null;
  } | null;
  jadwal: {
    tgl_sidang: string | null;
    jam_sidang: string | null;
    lokasi: string | null;
  };
  nilai: {
    nilai_pembimbing: number;
    nilai_penguji_1: number;
    nilai_penguji_2: number | null;
    nilai_penguji_3: number | null;
    nilai_akhir: number;
    status: string;
    validasi_status: "diterima" | "ditolak" | null;
  } | null;
}

function formatJam(jam: string | null | undefined): string | null {
  if (!jam) return null;
  const match = jam.match(/(\d{2}):(\d{2})/);
  if (!match) return jam;
  return `${match[1]}.${match[2]} - Selesai`;
}

function formatTanggal(tgl: string | null | undefined): string | null {
  if (!tgl) return null;
  return new Date(tgl).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function triggerDownload(
  fetchPromise: Promise<Response>,
  fallbackName: string,
) {
  try {
    const res = await fetchPromise;
    if (!res.ok) {
      toast.error("Gagal mengunduh file");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const disposition = res.headers.get("content-disposition");
    const match = disposition?.match(/filename="?([^"]+)"?/);
    a.download = match?.[1] ?? fallbackName;
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    toast.error("Gagal mengunduh file");
  }
}

function InputNilaiDialog({
  sidang,
  onClose,
  onSuccess,
}: {
  sidang: HasilSidangItem;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [nilaiPembimbing, setNilaiPembimbing] = useState(
    sidang.nilai?.nilai_pembimbing?.toString() ?? "",
  );
  const [nilaiPenguji1, setNilaiPenguji1] = useState(
    sidang.nilai?.nilai_penguji_1?.toString() ?? "",
  );
  const [nilaiPenguji2, setNilaiPenguji2] = useState(
    sidang.nilai?.nilai_penguji_2?.toString() ?? "",
  );
  const [nilaiPenguji3, setNilaiPenguji3] = useState(
    sidang.nilai?.nilai_penguji_3?.toString() ?? "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!nilaiPembimbing || !nilaiPenguji1) return;
    setIsSubmitting(true);
    try {
      const res = await SidangKoorService.inputNilai(sidang.sidang_id, {
        tipe: sidang.tipe,
        nilai_pembimbing: Number(nilaiPembimbing),
        nilai_penguji_1: Number(nilaiPenguji1),
        ...(nilaiPenguji2 ? { nilai_penguji_2: Number(nilaiPenguji2) } : {}),
        ...(nilaiPenguji3 ? { nilai_penguji_3: Number(nilaiPenguji3) } : {}),
      });
      handleToastResponse(res, () => {
        onSuccess();
        onClose();
      });
    } catch {
      toast.error("Gagal menyimpan nilai sidang");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {sidang.nilai ? "Edit Nilai" : "Input Nilai"} Sidang
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {sidang.mahasiswa.nama} ({sidang.mahasiswa.nim}) ·{" "}
            {sidang.tipe.toUpperCase()}
          </p>
        </DialogHeader>

        <div className="rounded-md border divide-y text-sm">
          {[
            { label: "Pendamping", nama: sidang.pendamping?.nama },
            { label: "Ketua Penguji", nama: sidang.penguji?.nama },
            { label: "Anggota 1", nama: sidang.penguji_2?.nama },
            { label: "Anggota 2", nama: sidang.penguji_3?.nama },
          ].map((r) => (
            <div key={r.label} className="flex items-center px-3 py-2 gap-3">
              <span className="w-24 text-muted-foreground shrink-0">
                {r.label}
              </span>
              <span className="font-medium">{r.nama ?? "-"}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label>
              Nilai Pendamping{" "}
              <span className="text-muted-foreground font-normal">(0–100)</span>
            </Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={nilaiPembimbing}
              onChange={(e) => setNilaiPembimbing(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Nilai Ketua Penguji{" "}
              <span className="text-muted-foreground font-normal">(0–100)</span>
            </Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={nilaiPenguji1}
              onChange={(e) => setNilaiPenguji1(e.target.value)}
              placeholder="0"
            />
          </div>
          {sidang.penguji_2 && (
            <div className="space-y-1.5">
              <Label>
                Nilai Anggota 1{" "}
                <span className="text-muted-foreground font-normal">
                  (0–100)
                </span>
              </Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={nilaiPenguji2}
                onChange={(e) => setNilaiPenguji2(e.target.value)}
                placeholder="0"
              />
            </div>
          )}
          {sidang.penguji_3 && (
            <div className="space-y-1.5">
              <Label>
                Nilai Anggota 2{" "}
                <span className="text-muted-foreground font-normal">
                  (0–100)
                </span>
              </Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={nilaiPenguji3}
                onChange={(e) => setNilaiPenguji3(e.target.value)}
                placeholder="0"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!nilaiPembimbing || !nilaiPenguji1 || isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Nilai"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PilihBanyakModal({
  items,
  tipe,
  swrKey,
  onClose,
  onEditNilai,
}: {
  items: HasilSidangItem[];
  tipe: "ta1" | "ta2";
  swrKey: [string, number | null, string, string];
  onClose: () => void;
  onEditNilai: (item: HasilSidangItem) => void;
}) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkValidating, setBulkValidating] = useState(false);

  const allChecked =
    items.length > 0 && items.every((i) => selected.has(i.sidang_id));
  const someChecked = selected.size > 0 && !allChecked;

  function toggleAll() {
    if (allChecked) setSelected(new Set());
    else setSelected(new Set(items.map((i) => i.sidang_id)));
  }

  function toggleOne(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleBulkValidasi(status: "diterima" | "ditolak") {
    if (selected.size === 0) return;
    setBulkValidating(true);
    try {
      const ids = Array.from(selected);
      const res = await SidangKoorService.bulkValidasiNilai(ids, tipe, status);
      handleToastResponse(res, () => {
        mutate(swrKey);
        onClose();
      });
    } catch {
      toast.error("Gagal bulk validasi");
    } finally {
      setBulkValidating(false);
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[620px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Pilih Banyak — Validasi Nilai</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {items.length} mahasiswa sudah ada nilai. Pilih untuk validasi
            secara banyak.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto rounded-md border divide-y text-sm min-h-0">
          <div className="flex items-center px-3 py-2 gap-3 bg-muted/40 sticky top-0">
            <Checkbox
              checked={someChecked ? "indeterminate" : allChecked}
              onCheckedChange={toggleAll}
              aria-label="Pilih semua"
            />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Pilih Semua
            </span>
          </div>

          {items.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              Belum ada mahasiswa dengan nilai.
            </div>
          ) : (
            items.map((item) => {
              const lulus = item.nilai?.status === "lulus";
              const validasiStatus = item.nilai?.validasi_status ?? null;

              return (
                <div
                  key={item.sidang_id}
                  className="flex items-center px-3 py-2.5 gap-3"
                >
                  <Checkbox
                    checked={selected.has(item.sidang_id)}
                    onCheckedChange={() => toggleOne(item.sidang_id)}
                    aria-label={`Pilih ${item.mahasiswa.nama}`}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.mahasiswa.nama}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.mahasiswa.nim}
                    </p>
                    {(() => {
                      const tgl = item.sesi?.tgl_sidang ?? item.jadwal.tgl_sidang;
                      const jam = item.sesi?.jam_mulai ?? item.jadwal.jam_sidang;
                      if (!tgl) return null;
                      return (
                        <p className="text-xs text-foreground font-medium">
                          {formatTanggal(tgl)}{jam ? ` · ${formatJam(jam)}` : ""}
                        </p>
                      );
                    })()}
                  </div>

                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <span className="font-semibold text-sm">
                      {item.nilai?.nilai_akhir ?? "-"}
                    </span>
                    {validasiStatus === "diterima" && (
                      <Badge
                        variant="success"
                        className="text-xs px-1.5 py-0"
                      >
                        Diterima
                      </Badge>
                    )}
                    {validasiStatus === "ditolak" && (
                      <Badge
                        variant="destructive"
                        className="text-xs px-1.5 py-0"
                      >
                        Ditolak
                      </Badge>
                    )}
                    {!validasiStatus && (
                      <Badge
                        variant={lulus ? "success" : "destructive"}
                        className="text-xs px-1.5 py-0"
                      >
                        {lulus ? "Lulus" : "Tidak Lulus"}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      title="Edit Nilai"
                      onClick={() => onEditNilai(item)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
            disabled={selected.size === 0 || bulkValidating}
            onClick={() => handleBulkValidasi("diterima")}
          >
            <CheckCircle className="h-4 w-4" />
            Terima Semua
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type SortDir = "asc" | "desc" | null;

export function HasilSidangSection({ tipe }: { tipe: "ta1" | "ta2" }) {
  const [gelombangId, setGelombangId] = useState<number | null>(null);
  const [nilaiTarget, setNilaiTarget] = useState<HasilSidangItem | null>(null);
  const [pilihBanyakOpen, setPilihBanyakOpen] = useState(false);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadingBulk, setDownloadingBulk] = useState(false);
  const [validatingId, setValidatingId] = useState<number | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<{
    item: HasilSidangItem;
    action: "diterima" | "batal";
  } | null>(null);
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const { data: gelombangRes } = useSWR(
    "gelombang-sidang-ta",
    () => SidangKoorService.getGelombang(),
    { revalidateOnFocus: false },
  );

  const gelombangList: Gelombang[] = (
    gelombangRes?.data?.data ??
    gelombangRes?.data ??
    []
  ).filter((g: Gelombang) => g.tipe === tipe);

  useEffect(() => { setPage(1); }, [gelombangId, search]);

  const swrKey: [string, number | null, string, string] = [
    "hasil-sidang",
    gelombangId,
    tipe,
    search,
  ];

  const { data: hasilRes, isLoading: loadingHasil } = useSWR(
    swrKey,
    () => SidangKoorService.getHasilSidang(gelombangId, tipe, search),
    { revalidateOnFocus: false },
  );

  const hasilList: HasilSidangItem[] = hasilRes?.data ?? [];

  const displayList = useMemo(() => {
    if (!sortDir) return hasilList;
    return [...hasilList].sort((a, b) => {
      const da = a.sesi?.tgl_sidang ?? a.jadwal.tgl_sidang ?? "";
      const db = b.sesi?.tgl_sidang ?? b.jadwal.tgl_sidang ?? "";
      return sortDir === "asc" ? da.localeCompare(db) : db.localeCompare(da);
    });
  }, [hasilList, sortDir]);

  const paginatedList = useMemo(
    () => displayList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [displayList, page],
  );

  const itemsWithNilai = useMemo(
    () => hasilList.filter((i) => i.nilai !== null && i.nilai.validasi_status !== "diterima"),
    [hasilList],
  );

  async function handleValidasi(
    item: HasilSidangItem,
    status: "diterima" | "ditolak" | "batal",
  ) {
    setValidatingId(item.sidang_id);
    try {
      const res = await SidangKoorService.validasiNilai(
        item.sidang_id,
        item.tipe,
        status,
      );
      handleToastResponse(res, () => mutate(swrKey));
    } catch {
      toast.error("Gagal memvalidasi nilai");
    } finally {
      setValidatingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="w-1/3">
          <SearchControl placeholder="Cari nama atau NIM..." />
        </div>

        <div className="flex gap-2 ml-auto flex-wrap items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 gap-2 min-w-[160px] justify-between font-normal shrink-0"
              >
                <span>
                  {gelombangId
                    ? (gelombangList.find((g) => g.id === gelombangId)
                      ?.nama_gelombang ?? "Gelombang")
                    : "Semua Gelombang"}
                </span>
                <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[180px]">
              <DropdownMenuItem
                onClick={() => setGelombangId(null)}
                className={!gelombangId ? "bg-muted font-medium" : ""}
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

          <Button
            className="h-10 flex items-center gap-1.5 shrink-0"
            onClick={() => setPilihBanyakOpen(true)}
          >
            <ListChecks className="h-4 w-4" />
            Pilih Banyak
          </Button>

          <Button
            disabled={downloadingBulk}
            onClick={async () => {
              setDownloadingBulk(true);
              await triggerDownload(
                SidangKoorService.downloadAllBeritaAcara(gelombangId, tipe),
                `Berita_Acara_${tipe}_bulk.zip`,
              );
              setDownloadingBulk(false);
            }}
            className="h-10 flex items-center gap-1.5 shrink-0"
          >
            <Download className="h-4 w-4" />
            {downloadingBulk ? "Mengunduh..." : "Download Semua (ZIP)"}
          </Button>
        </div>
      </div>

      {loadingHasil ? (
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm animate-pulse">
          Memuat data...
        </div>
      ) : hasilList.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Tidak ada data hasil sidang"
          subtitle="Belum ada sidang dengan jadwal dalam gelombang ini."
        />
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10 text-center">No.</TableHead>
                <TableHead>Mahasiswa</TableHead>
                <TableHead>Dosen Pembimbing</TableHead>
                <TableHead>Gelombang</TableHead>
                <TableHead
                  className="cursor-pointer select-none whitespace-nowrap"
                  onClick={() =>
                    setSortDir((d) =>
                      d === null ? "asc" : d === "asc" ? "desc" : null,
                    )
                  }
                >
                  <span className="flex items-center gap-1">
                    Jadwal
                    {sortDir === "asc" ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : sortDir === "desc" ? (
                      <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-40" />
                    )}
                  </span>
                </TableHead>
                <TableHead className="text-center">Pendamping</TableHead>
                <TableHead className="text-center">Ketua Penguji</TableHead>
                <TableHead className="text-center">Anggota 1</TableHead>
                <TableHead className="text-center">Anggota 2</TableHead>
                <TableHead className="text-center w-28">Nilai Akhir</TableHead>
                <TableHead className="text-center w-28">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedList.map((item, idx) => {
                const globalIdx = (page - 1) * PAGE_SIZE + idx;
                const tglSidang =
                  item.sesi?.tgl_sidang ?? item.jadwal.tgl_sidang;
                const jam = item.sesi?.jam_mulai ?? item.jadwal.jam_sidang;
                const isValidating = validatingId === item.sidang_id;
                const validasiStatus = item.nilai?.validasi_status ?? null;

                return (
                  <TableRow
                    key={item.sidang_id}
                    className={idx % 2 === 0 ? "bg-muted/30" : ""}
                  >
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {globalIdx + 1}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-sm">
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

                    <TableCell className="text-sm text-muted-foreground">
                      {item.gelombang?.nama_gelombang ?? (
                        <span className="text-xs">-</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {tglSidang ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium">
                            {formatTanggal(tglSidang)}
                          </span>
                          {jam && (
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatJam(jam)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center text-sm">
                      {item.nilai?.nilai_pembimbing ?? (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {item.nilai?.nilai_penguji_1 ?? (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {item.nilai?.nilai_penguji_2 ?? (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {item.nilai?.nilai_penguji_3 ?? (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {item.nilai ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="font-semibold text-sm">
                            {item.nilai.nilai_akhir}
                          </span>
                          {validasiStatus === "diterima" && (
                            <Badge
                              variant="success"
                              className="text-xs px-1.5 py-0"
                            >
                              Diterima
                            </Badge>
                          )}
                          {validasiStatus === "ditolak" && (
                            <Badge
                              variant="destructive"
                              className="text-xs px-1.5 py-0"
                            >
                              Ditolak
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {validasiStatus === "diterima" ? (
                          <>
                            <Button
                              size="icon"
                              variant="primaryOutline"
                              className="h-8 w-8"
                              disabled={downloadingId === item.sidang_id}
                              title="Unduh Berita Acara"
                              onClick={async () => {
                                setDownloadingId(item.sidang_id);
                                await triggerDownload(
                                  SidangKoorService.downloadBeritaAcara(
                                    item.sidang_id,
                                    item.tipe,
                                  ),
                                  `Berita_Acara_${item.tipe}_${item.mahasiswa.nim}.pdf`,
                                );
                                setDownloadingId(null);
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructiveOutline"
                              className="h-8 w-8"
                              disabled={isValidating}
                              title="Batal Verifikasi"
                              onClick={() => setConfirmTarget({ item, action: "batal" })}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            {item.nilai && (
                              <Button
                                size="icon"
                                variant="successOutline"
                                className="h-8 w-8"
                                disabled={isValidating}
                                title="Terima"
                                onClick={() => setConfirmTarget({ item, action: "diterima" })}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              title={item.nilai ? "Edit Nilai" : "Input Nilai"}
                              onClick={() => setNilaiTarget(item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {displayList.length > PAGE_SIZE && (
        <PaginationControls
          currentPage={page}
          lastPage={Math.ceil(displayList.length / PAGE_SIZE)}
          total={displayList.length}
          onPageChange={setPage}
        />
      )}

      {pilihBanyakOpen && (
        <PilihBanyakModal
          items={itemsWithNilai}
          tipe={tipe}
          swrKey={swrKey}
          onClose={() => setPilihBanyakOpen(false)}
          onEditNilai={(item) => {
            setPilihBanyakOpen(false);
            setNilaiTarget(item);
          }}
        />
      )}

      {nilaiTarget && (
        <InputNilaiDialog
          sidang={nilaiTarget}
          onClose={() => setNilaiTarget(null)}
          onSuccess={() => mutate(swrKey)}
        />
      )}

      <AlertDialog
        open={!!confirmTarget}
        onOpenChange={(open) => { if (!open) setConfirmTarget(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmTarget?.action === "diterima" ? "Terima Nilai?" : "Batal Verifikasi?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmTarget?.action === "diterima"
                ? `Nilai sidang ${confirmTarget.item.mahasiswa.nama} (${confirmTarget.item.mahasiswa.nim}) akan diterima dan diverifikasi.`
                : `Verifikasi nilai sidang ${confirmTarget?.item.mahasiswa.nama} (${confirmTarget?.item.mahasiswa.nim}) akan dibatalkan.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmTarget(null)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className={
                confirmTarget?.action === "diterima"
                  ? ""
                  : "bg-destructive hover:bg-destructive/90 text-white"
              }
              onClick={() => {
                if (!confirmTarget) return;
                handleValidasi(confirmTarget.item, confirmTarget.action);
                setConfirmTarget(null);
              }}
            >
              {confirmTarget?.action === "diterima" ? "Ya, Terima" : "Ya, Batalkan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
