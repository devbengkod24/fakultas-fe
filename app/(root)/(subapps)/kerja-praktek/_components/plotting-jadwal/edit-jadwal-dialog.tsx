"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";

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

import { PlottingJadwalService } from "@/api/kerja-praktek";
import { DosenService } from "@/api/kerja-praktek";
import { handleToastResponse } from "@/lib/toast-response";
import { useProfile } from "@/context/profileUseContext";
import { cn } from "@/lib/utils";

import { RuanganCombobox } from "./ruangan-combobox";
import { DosenCombobox } from "./dosen-combobox";
import { DatePickerButton } from "./date-picker-button";

interface DosenOption {
  id: number;
  nama: string;
  gelar_depan?: string | null;
  gelar_belakang?: string | null;
}

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

function parseJamMulai(jam: string | null | undefined): string {
  if (!jam) return "";
  // Backend menyimpan "HH:MM - HH:MM"; ambil start
  const [start] = jam.split(" - ");
  return start ?? "";
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

interface EditJadwalDialogProps {
  sidang: PlotJadwalItem;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditJadwalDialog({
  sidang,
  onClose,
  onSuccess,
}: EditJadwalDialogProps) {
  const { activeProdiId } = useProfile();

  const initialDate = useMemo(() => {
    if (!sidang.jadwal.tanggal) return "";
    try {
      const d = new Date(sidang.jadwal.tanggal);
      const day = String(d.getDate()).padStart(2, "0");
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const y = d.getFullYear();
      return `${day}-${m}-${y}`;
    } catch {
      return "";
    }
  }, [sidang.jadwal.tanggal]);

  const initialJamMulai = useMemo(() => parseJamMulai(sidang.jadwal.jam), [sidang.jadwal.jam]);

  const [tglSidang, setTglSidang] = useState<string>(initialDate);
  const [jamMulai, setJamMulai] = useState<string>(initialJamMulai);
  const [ruanganId, setRuanganId] = useState<number | null>(sidang.ruangan?.id ?? null);
  const [pengujiId, setPengujiId] = useState<number | null>(sidang.penguji_1?.id ?? null);
  const [penguji2Id, setPenguji2Id] = useState<number | null>(sidang.penguji_2?.id ?? null);
  const [penguji3Id, setPenguji3Id] = useState<number | null>(sidang.penguji_3?.id ?? null);
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

  const handleSubmit = async () => {
    if (!tglSidang || !jamMulai) {
      toast.error("Silakan pilih tanggal dan jam mulai sidang");
      return;
    }
    if (!pengujiId) {
      toast.error("Silakan pilih ketua penguji");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await PlottingJadwalService.updateJadwal(
        sidang.pengajuan_sidang_id,
        tglSidang,
        jamMulai,
        ruanganId,
        pengujiId,
        penguji2Id,
        penguji3Id,
      );
      handleToastResponse(res);
      // Invalidate plotting-jadwal + semua slot-info-* keys supaya FE tidak
      // pakai cache stale (yang akan menampilkan sisa slot/used_jam lama).
      globalMutate((key) =>
        Array.isArray(key) &&
        (key[0] === "plotting-jadwal" ||
          (typeof key[0] === "string" && key[0].startsWith("slot-info-"))),
      );
      onSuccess();
      onClose();
    } catch {
      toast.error("Gagal memperbarui jadwal sidang");
    } finally {
      setIsSubmitting(false);
    }
  };

  const usedPengujiIds = [pengujiId, penguji2Id, penguji3Id].filter(Boolean) as number[];

  // Fetch info slot harian. Exclude sidang ini sendiri supaya current jam
  // selalu available (current dihitung sebagai slot yg sedang dipakai sidang ini,
  // bukan slot milik sidang lain).
  const { data: slotInfoRes, isLoading: isLoadingSlot } = useSWR(
    tglSidang ? ["slot-info-edit", tglSidang, sidang.sidang_id] : null,
    () => PlottingJadwalService.getSlotInfo(tglSidang, sidang.sidang_id),
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

  const existingOnDate = slotInfo?.total ?? 0;
  const sisaSlot = Math.max(0, MAX_SLOT_PER_HARI - existingOnDate);
  const noJamAvailable = sisaSlot === 0 && !usedJamSet.has(initialJamMulai);

  // Auto-select jam pertama yang available saat tglSidang / slotInfo berubah,
  // tapi JANGAN override initialJamMulai (jam saat ini dari DB).
  useEffect(() => {
    if (!tglSidang || !slotInfo) return;
    if (jamMulai === initialJamMulai && initialJamMulai) return; // keep current
    const stillAvailable = jamMulai && !usedJamSet.has(jamMulai);
    if (stillAvailable) return;
    const firstAvailable = JAM_MULAI_OPTIONS.find((j) => !usedJamSet.has(j));
    setJamMulai(firstAvailable ?? initialJamMulai ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tglSidang, slotInfo]);

  const jamSelesai = hitungJamSelesai(jamMulai);
  const sisaHint = !tglSidang
    ? "Pilih tanggal dulu"
    : isLoadingSlot
      ? "Memuat info slot…"
      : noJamAvailable
        ? `Penuh (${existingOnDate}/${MAX_SLOT_PER_HARI})`
        : `${sisaSlot}/${MAX_SLOT_PER_HARI} tersisa`;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Jadwal Sidang</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {sidang.mahasiswa.nama} ({sidang.mahasiswa.nim})
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-1.5">
            <Label className="text-xs">Tanggal Sidang</Label>
            <DatePickerButton value={tglSidang} onChange={setTglSidang} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Jam Mulai Sidang</Label>
            <Select
              value={jamMulai}
              onValueChange={setJamMulai}
              disabled={!tglSidang || isLoadingSlot}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue
                  placeholder={
                    !tglSidang
                      ? "Pilih tanggal dulu"
                      : isLoadingSlot
                        ? "Memuat…"
                        : "Pilih jam mulai"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {JAM_MULAI_OPTIONS.map((jam) => {
                  // Current jam selalu selectable (meskipun sidang lain pakai jam yang sama)
                  // karena kita sudah exclude sidang ini dari count BE.
                  const isUsedByOther = usedJamSet.has(jam);
                  const isCurrent = jam === initialJamMulai;
                  const isDisabled = isUsedByOther && !isCurrent;
                  const selesai = hitungJamSelesai(jam);
                  return (
                    <SelectItem
                      key={jam}
                      value={jam}
                      disabled={isDisabled}
                      className="text-xs"
                    >
                      <span className="flex items-center gap-2">
                        <span>
                          {jam} – {selesai}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] text-blue-600 font-medium">
                            (saat ini)
                          </span>
                        )}
                        {isUsedByOther && !isCurrent && (
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
            <p className="text-[10px] text-muted-foreground flex items-center justify-between gap-2 flex-wrap">
              <span>
                {jamMulai ? (
                  <>
                    Selesai: <span className="font-medium">{jamSelesai}</span> · Durasi 60 menit (1 jam)
                  </>
                ) : (
                  "Durasi 60 menit (1 jam) · max 4 slot/hari"
                )}
              </span>
              <span
                className={cn(
                  "font-medium",
                  noJamAvailable ? "text-red-600" : "text-muted-foreground",
                )}
              >
                {tglSidang ? `Sisa slot: ${sisaHint}` : sisaHint}
              </span>
            </p>
            {noJamAvailable && (
              <p className="text-[10px] text-red-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Semua slot di tanggal ini sudah dipakai. Pilih tanggal lain.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3 mt-2">
          <div className="space-y-1.5">
            <Label className="text-xs">
              Ketua Penguji <span className="text-red-500">*</span>
            </Label>
            <DosenCombobox
              value={pengujiId}
              onChange={setPengujiId}
              dosenList={dosenList}
              placeholder="Pilih ketua"
              excludeIds={usedPengujiIds.filter((id) => id !== pengujiId)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Anggota 1</Label>
            <DosenCombobox
              value={penguji2Id}
              onChange={setPenguji2Id}
              dosenList={dosenList}
              placeholder="Pilih anggota 1"
              excludeIds={usedPengujiIds.filter((id) => id !== penguji2Id)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Anggota 2 (opsional)</Label>
            <DosenCombobox
              value={penguji3Id}
              onChange={setPenguji3Id}
              dosenList={dosenList}
              placeholder="Pilih anggota 2"
              excludeIds={usedPengujiIds.filter((id) => id !== penguji3Id)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Ruangan (kosongkan untuk online)</Label>
            <RuanganCombobox value={ruanganId} onChange={setRuanganId} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!tglSidang || !jamMulai || !pengujiId || isSubmitting}
            className="gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
