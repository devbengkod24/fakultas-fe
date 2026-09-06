"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import useSWR, { mutate } from "swr";
import {
  FileText,
  ChevronsUpDown,
  Download,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  MonitoringSidang1Service,
  MonitoringSidang2Service,
} from "@/api/tugas-akhir";
import { toast } from "sonner";
import { handleToastResponse } from "@/lib/toast-response";
import EmptyState from "@/components/empty-state";
import SearchControl from "@/components/search-control";

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

type PeranDosen =
  | "pembimbing"
  | "pendamping"
  | "ketua"
  | "anggota_1"
  | "anggota_2"
  | null;

interface HasilSidangItem {
  sidang_id: number;
  tipe: "ta1" | "ta2";
  gelombang: { id: number; nama_gelombang: string } | null;
  mahasiswa: { id: number; nama: string; nim: string; kelas: string | null };
  pembimbing: DosenInfo | null;
  pendamping: DosenInfo | null;
  penguji: DosenInfo | null;
  penguji_2: DosenInfo | null;
  penguji_3: DosenInfo | null;
  peran_dosen: PeranDosen;
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

const PERAN_LABEL: Record<NonNullable<PeranDosen>, string> = {
  pembimbing: "Pendamping",
  pendamping: "Pendamping",
  ketua: "Ketua",
  anggota_1: "Anggota 1",
  anggota_2: "Anggota 2",
};

const NILAI_FIELD_BY_PERAN: Record<
  NonNullable<PeranDosen>,
  keyof NonNullable<HasilSidangItem["nilai"]> | null
> = {
  pembimbing: "nilai_pembimbing",
  pendamping: "nilai_pembimbing",
  ketua: "nilai_penguji_1",
  anggota_1: "nilai_penguji_2",
  anggota_2: "nilai_penguji_3",
};

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

type SortDir = "asc" | "desc" | null;

export function HasilSidangDosenSection({ tipe }: { tipe: "ta1" | "ta2" }) {
  const [gelombangId, setGelombangId] = useState<number | "semua">("semua");
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [nilaiDraft, setNilaiDraft] = useState<Record<number, string>>({});
  const [savingNilai, setSavingNilai] = useState<number | null>(null);
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

  const swrKey = ["hasil-sidang-dosen", gelombangId, tipe, search];

  const { data: hasilRes, isLoading: loadingHasil } = useSWR(
    swrKey,
    () => {
      const service =
        tipe === "ta1" ? MonitoringSidang1Service : MonitoringSidang2Service;
      return service.getHasilSidangByDosen(
        gelombangId === "semua" ? null : gelombangId,
        tipe,
        search,
      );
    },
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

  async function handleSaveNilai(item: HasilSidangItem) {
    const draft = nilaiDraft[item.sidang_id];
    if (draft === undefined || draft === "" || !item.peran_dosen) return;
    const nilai = Number(draft);
    if (isNaN(nilai) || nilai < 0 || nilai > 100) {
      toast.error("Nilai harus antara 0–100");
      return;
    }
    const existing = getNilaiExisting(item);
    if (existing !== null && String(existing) === draft) return;

    setSavingNilai(item.sidang_id);
    try {
      const res = await MonitoringSidang1Service.inputNilaiDosen(
        item.sidang_id,
        item.tipe,
        item.peran_dosen,
        nilai,
      );
      handleToastResponse(res, () => {
        mutate(swrKey);
        setNilaiDraft((prev) => {
          const next = { ...prev };
          delete next[item.sidang_id];
          return next;
        });
      });
    } catch {
      toast.error("Gagal menyimpan nilai");
    } finally {
      setSavingNilai(null);
    }
  }

  function getNilaiExisting(item: HasilSidangItem): number | null {
    if (!item.nilai || !item.peran_dosen) return null;
    const field = NILAI_FIELD_BY_PERAN[item.peran_dosen];
    if (!field) return null;
    const val = item.nilai[field];
    return val !== null && val !== undefined ? Number(val) : null;
  }

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

      {loadingHasil ? (
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm animate-pulse">
          Memuat data...
        </div>
      ) : displayList.length === 0 ? (
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
                <TableHead>Peran</TableHead>
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
                <TableHead>Ruangan</TableHead>
                <TableHead className="text-center w-36">Input Nilai</TableHead>
                <TableHead className="text-center w-28">Nilai Akhir</TableHead>
                <TableHead className="text-center w-24">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayList.map((item, idx) => {
                const tglSidang =
                  item.sesi?.tgl_sidang ?? item.jadwal.tgl_sidang;
                const jam = item.sesi?.jam_mulai ?? item.jadwal.jam_sidang;
                const ruangan =
                  item.sesi?.ruangan?.nama_ruangan ?? item.jadwal.lokasi;
                const isSaving = savingNilai === item.sidang_id;
                const validasiStatus = item.nilai?.validasi_status ?? null;
                const existingNilai = getNilaiExisting(item);
                const draftVal = nilaiDraft[item.sidang_id];
                const canInputNilai = item.peran_dosen !== null;
                const isDisabled = validasiStatus !== null;

                return (
                  <TableRow
                    key={item.sidang_id}
                    className={idx % 2 === 0 ? "bg-muted/30" : ""}
                  >
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {idx + 1}
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

                    <TableCell>
                      {item.peran_dosen ? (
                        <Badge variant="outline" className="text-xs font-normal">
                          {PERAN_LABEL[item.peran_dosen]}
                        </Badge>
                      ) : (
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

                    <TableCell className="text-sm">
                      {ruangan ?? (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {canInputNilai ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="h-7 w-16 text-center text-sm px-1"
                            disabled={isDisabled || isSaving}
                            value={
                              draftVal ??
                              (existingNilai !== null
                                ? String(existingNilai)
                                : "")
                            }
                            onChange={(e) =>
                              setNilaiDraft((prev) => ({
                                ...prev,
                                [item.sidang_id]: e.target.value,
                              }))
                            }
                            onBlur={() => handleSaveNilai(item)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.currentTarget.blur();
                              }
                            }}
                          />
                        </div>
                      ) : (
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
                      {item.nilai && validasiStatus === "diterima" ? (
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          disabled={downloadingId === item.sidang_id}
                          title="Unduh Berita Acara"
                          onClick={async () => {
                            setDownloadingId(item.sidang_id);
                            const service =
                              tipe === "ta1"
                                ? MonitoringSidang1Service
                                : MonitoringSidang2Service;
                            await triggerDownload(
                              service.downloadBeritaAcara(
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
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
