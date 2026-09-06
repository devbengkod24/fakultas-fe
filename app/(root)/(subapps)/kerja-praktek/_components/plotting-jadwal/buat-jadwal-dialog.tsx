"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { RefreshCw, CalendarPlus, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { PlottingJadwalService } from "@/api/kerja-praktek";
import { DosenService } from "@/api/kerja-praktek";
import { handleToastResponse } from "@/lib/toast-response";
import { useProfile } from "@/context/profileUseContext";

import { DatePickerButton } from "./date-picker-button";
import { RuanganCombobox } from "./ruangan-combobox";
import { DosenCombobox } from "./dosen-combobox";

interface DosenOption {
  id: number;
  nama: string;
  gelar_depan?: string | null;
  gelar_belakang?: string | null;
}

interface PlotJadwalItem {
  sidang_id: number;
  pengajuan_sidang_id: number;
  mahasiswa: { id: number; nama: string; nim: string };
  pembimbing: { id: number; nama: string } | null;
  jadwal: { tanggal: string | null; jam: string | null; status: string };
  ruangan: { id: number; nama: string } | null;
  penguji_1: { id: number; nama: string } | null;
  penguji_2: { id: number; nama: string } | null;
  penguji_3: { id: number; nama: string } | null;
  gelombang: { id: number; nama_gelombang: string; nama?: string } | null;
}

interface PreviewItem {
  sidang_id: number;
  urutan: number;
  penguji_id: number | null;
  penguji_2_id: number | null;
  penguji_3_id: number | null;
}

const DURASI_SIDANG_MENIT = 60;
const MAX_SLOT_PER_HARI = 4;
const JAM_MULAI_OPTIONS = ["09:00", "10:00", "11:00", "12:00"] as const;

interface SlotInfo {
  date: string;
  total: number;
  max: number;
  used_jam: string[];
}

function hitungJamSelesai(jamMulai: string): string {
  if (!jamMulai) return "";
  const [h, m] = jamMulai.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return "";
  const total = h * 60 + m + DURASI_SIDANG_MENIT;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function autoAssignDosen(selectedItems: PlotJadwalItem[]): PreviewItem[] {
  // Kumpulkan ID unik semua dospem dari item yang dipilih
  const allDospem = Array.from(
    new Set(
      selectedItems
        .map((s) => s.pembimbing?.id)
        .filter((x): x is number => Boolean(x)),
    ),
  );

  // Longgarkan aturan dospem ≠ penguji saat hanya ada 1 mahasiswa
  const relaxDospemRule = selectedItems.length === 1;

  return selectedItems.map((item, idx) => {
    const myDospemId = item.pembimbing?.id ?? null;

    // Kandidat penguji:
    // - Normal (≥2 mhs): exclude dospem sendiri
    // - Khusus 1 mhs: dospem sendiri BOLEH masuk (longgarkan aturan)
    const candidates =
      relaxDospemRule && myDospemId != null
        ? [myDospemId, ...allDospem.filter((id) => id !== myDospemId)]
        : allDospem.filter((id) => id !== myDospemId);

    // Round-robin: geser indeks awal berdasarkan urutan item
    // Contoh: 5 mhs, dospem A/B/C
    //   idx 0 -> [B, C, A]
    //   idx 1 -> [C, A, B]
    //   idx 2 -> [A, B, C]
    //   idx 3 -> [B, C, A]
    //   idx 4 -> [C, A, B]
    // => A/B/C masing-masing jadi Ketua ~seimbang.
    const offset = candidates.length > 0 ? idx % candidates.length : 0;
    const rotated = [
      ...candidates.slice(offset),
      ...candidates.slice(0, offset),
    ];

    return {
      sidang_id: item.sidang_id,
      urutan: idx + 1,
      penguji_id: rotated[0] ?? null,
      penguji_2_id: rotated[1] ?? null,
      penguji_3_id: rotated[2] ?? null,
    };
  });
}

interface BuatJadwalDialogProps {
  gelombangId: number;
  selectedItems: PlotJadwalItem[];
  onClose: () => void;
  onSuccess: () => void;
}

export function BuatJadwalDialog({
  gelombangId,
  selectedItems,
  onClose,
  onSuccess,
}: BuatJadwalDialogProps) {
  const { activeProdiId } = useProfile();

  const [tglSidang, setTglSidang] = useState("");
  const [ruanganId, setRuanganId] = useState<number | null>(null);
  const [jamMulai, setJamMulai] = useState<string>("");
  const [preview, setPreview] = useState<PreviewItem[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: dosenRes } = useSWR(
    ["dosen-list-plot-kp", activeProdiId],
    () => DosenService.getDosenByPeriode(1, 1000, "", activeProdiId ?? undefined).then((r) => r.data ?? []),
    { revalidateOnFocus: false },
  );
  const dosenList: DosenOption[] = useMemo(() => {
    return ((dosenRes as any[]) ?? []).map((d) => ({
      id: d.id,
      nama: d.gelar_depan
        ? `${d.gelar_depan} ${d.user?.name || d.nama}${d.gelar_belakang ? `, ${d.gelar_belakang}` : ""}`
        : (d.user?.name || d.nama),
      gelar_depan: d.gelar_depan,
      gelar_belakang: d.gelar_belakang,
    }));
  }, [dosenRes]);

  const handleGenerate = useCallback(() => {
    const newPreview = autoAssignDosen(selectedItems);
    setPreview(newPreview);
    setHasGenerated(true);

    const namaById = new Map(
      selectedItems.map((s) => [s.sidang_id, s.mahasiswa.nama]),
    );
    const namaList = (items: PreviewItem[]) =>
      items
        .map((p) => namaById.get(p.sidang_id))
        .filter(Boolean)
        .join(", ");

    // 1) Ketua kosong = error kritis, user harus pilih manual
    const noKetua = newPreview.filter((p) => p.penguji_id == null);
    if (noKetua.length > 0) {
      toast.error(
        `Ketua sidang belum tersedia untuk: ${namaList(noKetua)}. Pilih dosen secara manual.`,
      );
      return;
    }

    // 2) Info khusus 1 mahasiswa (longgarkan aturan)
    if (selectedItems.length === 1) {
      toast.info(
        "Hanya 1 mahasiswa dijadwalkan: dospem otomatis menjadi Ketua sidang.",
      );
      return;
    }

    // 3) Anggota 1 kosong = warning, masih bisa dilanjut manual
    const noAnggota = newPreview.filter((p) => p.penguji_2_id == null);
    if (noAnggota.length > 0) {
      toast.warning(
        `Anggota 1 masih kosong untuk: ${namaList(noAnggota)}. Lengkapi manual jika perlu.`,
      );
      return;
    }

    toast.success("Dosen penguji berhasil di-generate.");
  }, [selectedItems]);

  const updatePreviewItem = (
    sidangId: number,
    field: keyof PreviewItem,
    value: number | null,
  ) => {
    setPreview((prev) =>
      prev.map((p) =>
        p.sidang_id === sidangId ? { ...p, [field]: value } : p,
      ),
    );
  };

  const allKetuaFilled =
    preview.length > 0 && preview.every((p) => p.penguji_id != null);

  // Fetch info slot harian dari BE: total existing + used_jam pada tglSidang.
  // Cache per-date via SWR; auto-revalidate saat tglSidang berubah.
  const { data: slotInfoRes, isLoading: isLoadingSlot } = useSWR(
    tglSidang ? ["slot-info-buat", tglSidang] : null,
    () => PlottingJadwalService.getSlotInfo(tglSidang),
    { revalidateOnFocus: false },
  );
  const slotInfo: SlotInfo | null = useMemo(() => {
    const d = slotInfoRes?.data;
    if (!d) return null;
    return { date: d.date, total: d.total, max: d.max, used_jam: d.used_jam ?? [] };
  }, [slotInfoRes]);
  const usedJamSet = useMemo(
    () => new Set((slotInfo?.used_jam ?? []).filter(Boolean)),
    [slotInfo],
  );

  // Sisa slot setelah dikurangi preview (jumlah item yang akan dijadwalkan).
  // - existing = sidangs on date ini (excluding items yg sudah di-pick? Tidak —
  //   items yg di-pick belum ada di DB, jadi existing = total dari BE).
  // - sisa = max - existing - preview.length
  const existingOnDate = slotInfo?.total ?? 0;
  const sisaSlot = Math.max(0, MAX_SLOT_PER_HARI - existingOnDate);
  const overCapacity = preview.length > sisaSlot;
  const noJamAvailable = sisaSlot === 0;

  // Auto-select jam pertama yang available saat tglSidang / slotInfo berubah.
  // Pertahankan pilihan user selama masih di list available.
  useEffect(() => {
    if (!tglSidang || !slotInfo) return;
    const stillAvailable =
      jamMulai && (jamMulai === "" || !usedJamSet.has(jamMulai));
    if (stillAvailable) return;
    const firstAvailable = JAM_MULAI_OPTIONS.find((j) => !usedJamSet.has(j));
    setJamMulai(firstAvailable ?? "");
    // Intentionally exclude `jamMulai` & `usedJamSet` from deps — re-run hanya saat
    // tglSidang / slotInfo berubah, bukan setiap render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tglSidang, slotInfo]);

  const canSubmit = Boolean(
    tglSidang &&
      jamMulai &&
      hasGenerated &&
      gelombangId &&
      allKetuaFilled &&
      !overCapacity &&
      !noJamAvailable,
  );
  const jamSelesai = hitungJamSelesai(jamMulai);
  const sisaHint =
    !tglSidang
      ? "Pilih tanggal dulu"
      : isLoadingSlot
        ? "Memuat info slot…"
        : overCapacity
          ? `Kapasitas terlampaui (${existingOnDate} existing + ${preview.length} baru > ${MAX_SLOT_PER_HARI})`
          : noJamAvailable
            ? `Penuh (${existingOnDate}/${MAX_SLOT_PER_HARI})`
            : `${sisaSlot}/${MAX_SLOT_PER_HARI} tersisa`;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const res = await PlottingJadwalService.buatJadwalBulk({
        gelombang_id: gelombangId,
        tgl_sidang: tglSidang,
        jam_mulai: jamMulai,
        ruangan_id: ruanganId,
        sidang_items: preview.map((p) => ({
          sidang_id: p.sidang_id,
          urutan: p.urutan,
          penguji_id: p.penguji_id,
          penguji_2_id: p.penguji_2_id,
          penguji_3_id: p.penguji_3_id,
        })),
      });
      // Tampilkan toast sukses dengan ringkasan jam stagger (jika backend
      // mengembalikan data detail per slot). Backend auto-stagger kelipatan
      // 60 menit dari jam_mulai basis.
      if (res?.success && Array.isArray(res?.data) && res.data.length > 0) {
        const slots = res.data.map((s: any) => s.jam_sidang).join(", ");
        toast.success(res.message || "Berhasil membuat jadwal sidang", {
          description: `${res.data.length} slot terjadwal: ${slots}`,
        });
        onSuccess();
        onClose();
      } else {
        handleToastResponse(res, () => {
          onSuccess();
          onClose();
        });
      }
    } catch {
      toast.error("Gagal membuat jadwal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buat Jadwal Sidang</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {selectedItems.length} mahasiswa dipilih
          </p>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Tanggal Sidang</Label>
              <DatePickerButton
                value={tglSidang}
                onChange={setTglSidang}
                placeholder="Pilih tanggal"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Ruangan</Label>
              <RuanganCombobox value={ruanganId} onChange={setRuanganId} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Jam Mulai</Label>
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    overCapacity || noJamAvailable
                      ? "text-red-600"
                      : "text-muted-foreground",
                  )}
                >
                  {tglSidang ? `Sisa slot: ${sisaHint}` : sisaHint}
                </span>
              </div>
              <Select
                value={jamMulai}
                onValueChange={setJamMulai}
                disabled={!tglSidang || isLoadingSlot || noJamAvailable}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue
                    placeholder={
                      !tglSidang
                        ? "Pilih tanggal dulu"
                        : isLoadingSlot
                          ? "Memuat…"
                          : noJamAvailable
                            ? "Semua slot penuh"
                            : "Pilih jam mulai"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {JAM_MULAI_OPTIONS.map((jam) => {
                    const isUsed = usedJamSet.has(jam);
                    const selesai = hitungJamSelesai(jam);
                    return (
                      <SelectItem
                        key={jam}
                        value={jam}
                        disabled={isUsed}
                        className="text-xs"
                      >
                        <span className="flex items-center gap-2">
                          <span>
                            {jam} – {selesai}
                          </span>
                          {isUsed && (
                            <span className="text-[10px] text-muted-foreground italic">
                              (sudah dipakai)
                            </span>
                          )}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground">
                {jamMulai ? (
                  <>
                    Selesai: <span className="font-medium">{jamSelesai}</span> ·{" "}
                    {preview.length} item akan di-stagger dari jam ini
                  </>
                ) : (
                  "Durasi 60 menit (1 jam) · max 4 slot/hari"
                )}
              </p>
              {(overCapacity || noJamAvailable) && (
                <p className="text-[10px] text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {overCapacity
                    ? `Preview ${preview.length} > sisa ${sisaSlot}. Pilih tanggal lain atau kurangi item.`
                    : `Tanggal ini sudah ${existingOnDate}/${MAX_SLOT_PER_HARI}. Pilih tanggal lain.`}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              className="gap-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {hasGenerated ? "Generate Ulang" : "Generate Auto-Assign Dosen"}
            </Button>
            {hasGenerated && (
              <span className="text-xs text-muted-foreground">
                Dosen di-assign otomatis dari dospem. Edit jika perlu.
              </span>
            )}
          </div>

          {hasGenerated && preview.length > 0 && (
            <div className="rounded-md border overflow-x-auto">
              <Table className="table-fixed w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Urutan</TableHead>
                    <TableHead className="w-40">Mahasiswa</TableHead>
                    <TableHead>Ketua</TableHead>
                    <TableHead>Anggota 1</TableHead>
                    <TableHead>Anggota 2</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.map((p) => {
                    const usedIds = [
                      p.penguji_id,
                      p.penguji_2_id,
                      p.penguji_3_id,
                    ].filter(Boolean) as number[];

                    return (
                      <TableRow key={p.sidang_id}>
                        <TableCell>
                          <Select
                            value={String(p.urutan)}
                            onValueChange={(v) =>
                              updatePreviewItem(
                                p.sidang_id,
                                "urutan",
                                Number(v),
                              )
                            }
                          >
                            <SelectTrigger className="h-7 w-14 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {preview.map((_, i) => (
                                <SelectItem key={i + 1} value={String(i + 1)}>
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {selectedItems.find((s) => s.sidang_id === p.sidang_id)?.mahasiswa.nama}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {selectedItems.find((s) => s.sidang_id === p.sidang_id)?.mahasiswa.nim}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DosenCombobox
                            value={p.penguji_id}
                            onChange={(v) =>
                              updatePreviewItem(p.sidang_id, "penguji_id", v)
                            }
                            dosenList={dosenList}
                            placeholder="Ketua"
                            excludeIds={usedIds.filter(
                              (id) => id !== p.penguji_id,
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <DosenCombobox
                            value={p.penguji_2_id}
                            onChange={(v) =>
                              updatePreviewItem(p.sidang_id, "penguji_2_id", v)
                            }
                            dosenList={dosenList}
                            placeholder="Anggota 1"
                            excludeIds={usedIds.filter(
                              (id) => id !== p.penguji_2_id,
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <DosenCombobox
                            value={p.penguji_3_id}
                            onChange={(v) =>
                              updatePreviewItem(p.sidang_id, "penguji_3_id", v)
                            }
                            dosenList={dosenList}
                            placeholder="Opsional"
                            excludeIds={usedIds.filter(
                              (id) => id !== p.penguji_3_id,
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CalendarPlus className="h-4 w-4" />
            )}
            {isSubmitting ? "Menyimpan..." : "Simpan Jadwal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
