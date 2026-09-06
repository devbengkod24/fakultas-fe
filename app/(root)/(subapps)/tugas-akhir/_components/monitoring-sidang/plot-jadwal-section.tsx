"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import PaginationControls from "@/components/pagination-control";
import useSWR, { mutate } from "swr";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarIcon,
  CalendarPlus,
  Check,
  ChevronsUpDown,
  Download,
  FileText,
  Pencil,
  RefreshCw,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { DosenService, SidangKoorService } from "@/api/tugas-akhir";
import { toast } from "sonner";
import { handleToastResponse } from "@/lib/toast-response";
import EmptyState from "@/components/empty-state";
import SearchControl from "@/components/search-control";
import { useSearchParams } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DosenOption {
  dosen_id: number;
  npp: string;
  name: string;
  gelar_depan: string | null;
  gelar_belakang: string | null;
}

interface DosenInfo {
  id: number;
  nama: string;
  gelar_depan: string | null;
  gelar_belakang: string | null;
}

interface Ruangan {
  id: number;
  nama_ruangan: string;
  gedung: string | null;
}

interface SidangItem {
  sidang_id: number;
  tipe: "ta1" | "ta2";
  judul: string;
  status: string;
  urutan: number | null;
  gelombang: { id: number; nama_gelombang: string } | null;
  mahasiswa: { id: number; nama: string; nim: string; kelas: string | null; jalur: string | null };
  pembimbing: DosenInfo | null;
  pendamping: DosenInfo | null;
  penguji: DosenInfo | null;
  penguji_2: DosenInfo | null;
  penguji_3: DosenInfo | null;
  sesi: {
    id: number;
    tgl_sidang: string;
    jam_mulai: string;
    ruangan: Ruangan | null;
  } | null;
  jadwal: {
    tgl_sidang: string | null;
    jam_sidang: string | null;
    lokasi: string | null;
  };
}

interface Gelombang {
  id: number;
  nama_gelombang: string;
  tipe: "ta1" | "ta2";
  status: number;
}

interface PreviewItem {
  sidang_id: number;
  tipe: "ta1" | "ta2";
  nama: string;
  nim: string;
  dospem_id: number | null;
  urutan: number;
  pendamping_id: number | null;
  penguji_id: number | null;
  penguji_2_id: number | null;
  penguji_3_id: number | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatJam(jam: string | null | undefined): string | null {
  if (!jam) return null;
  const match = jam.match(/(\d{2}):(\d{2})/);
  if (!match) return jam;
  return `${match[1]}.${match[2]} - Selesai`;
}

// Plot dosen secara diagonal rotation berdasarkan urutan dospem mahasiswa:
//   pendamping[i] = dospem[i] (dospem sendiri)
//   ketua    [i]  = dospem[i+1]
//   anggota1 [i]  = dospem[i+2]
//   anggota2 [i]  = dospem[i+3]   (mod n)
// Tiap dosen jadi ketua tepat 1x, tidak ada dosen dobel dalam satu sidang (asal n>=4).
function autoAssignDosen(selectedItems: SidangItem[]): PreviewItem[] {
  const dospemIds = selectedItems.map((s) => s.pembimbing?.id ?? null);
  const n = selectedItems.length;

  return selectedItems.map((item, idx) => {
    const myDospemId = item.pembimbing?.id ?? null;
    const used: number[] = [];
    // Ambil kandidat mulai dari offset diagonal, geser bila bentrok (skip dospem sendiri & yg sudah dipakai)
    const pick = (offset: number): number | null => {
      for (let step = 0; step < n; step++) {
        const cand = dospemIds[(idx + offset + step) % n];
        if (cand && cand !== myDospemId && !used.includes(cand)) {
          used.push(cand);
          return cand;
        }
      }
      return null;
    };
    return {
      sidang_id: item.sidang_id,
      tipe: item.tipe,
      nama: item.mahasiswa.nama,
      nim: item.mahasiswa.nim,
      dospem_id: myDospemId,
      urutan: idx + 1,
      pendamping_id: myDospemId,
      penguji_id: pick(1),
      penguji_2_id: pick(2),
      penguji_3_id: pick(3),
    };
  });
}

// ─── Dosen Combobox ───────────────────────────────────────────────────────────

function DosenCombobox({
  value,
  onChange,
  dosenList,
  placeholder = "Pilih dosen",
  excludeIds = [],
}: {
  value: number | null;
  onChange: (id: number | null) => void;
  dosenList: DosenOption[];
  placeholder?: string;
  excludeIds?: number[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = dosenList.filter((d) => {
    if (excludeIds.includes(d.dosen_id)) return false;
    const q = search.toLowerCase();
    return d.name.toLowerCase().includes(q) || d.npp?.toLowerCase().includes(q);
  });

  const selected = dosenList.find((d) => d.dosen_id === value);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          className="w-full justify-between text-xs h-8 font-normal"
        >
          <span className="truncate">
            {selected ? selected.name : placeholder}
          </span>
          <ChevronsUpDown className="ml-1 h-3 w-3 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari dosen..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Tidak ditemukan.</CommandEmpty>
            <CommandGroup className="max-h-[200px] overflow-y-auto">
              {value && (
                <CommandItem
                  value="__clear"
                  onSelect={() => {
                    onChange(null);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="text-muted-foreground italic text-xs"
                >
                  — Kosongkan
                </CommandItem>
              )}
              {filtered.map((d) => (
                <CommandItem
                  key={d.dosen_id}
                  value={String(d.dosen_id)}
                  onSelect={() => {
                    onChange(d.dosen_id);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-3 w-3",
                      value === d.dosen_id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs">{d.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {d.npp}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ─── RuanganCombobox ──────────────────────────────────────────────────────────

function RuanganCombobox({
  value,
  onChange,
  ruanganList,
}: {
  value: number | null;
  onChange: (id: number | null) => void;
  ruanganList: Ruangan[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = ruanganList.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.nama_ruangan.toLowerCase().includes(q) ||
      (r.gedung ?? "").toLowerCase().includes(q)
    );
  });

  const selected = ruanganList.find((r) => r.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between font-normal text-sm h-9"
        >
          <span className="truncate">
            {selected
              ? `${selected.nama_ruangan}${selected.gedung ? ` — ${selected.gedung}` : ""}`
              : "Pilih ruangan"}
          </span>
          <ChevronsUpDown className="ml-1 h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari ruangan..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Tidak ditemukan.</CommandEmpty>
            <CommandGroup className="max-h-[200px] overflow-y-auto">
              {value && (
                <CommandItem
                  value="__clear"
                  onSelect={() => { onChange(null); setOpen(false); setSearch(""); }}
                  className="text-muted-foreground italic text-xs"
                >
                  — Kosongkan
                </CommandItem>
              )}
              {filtered.map((r) => (
                <CommandItem
                  key={r.id}
                  value={String(r.id)}
                  onSelect={() => { onChange(r.id); setOpen(false); setSearch(""); }}
                >
                  <Check
                    className={cn("mr-2 h-3 w-3", value === r.id ? "opacity-100" : "opacity-0")}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm">{r.nama_ruangan}</span>
                    {r.gedung && (
                      <span className="text-[10px] text-muted-foreground">{r.gedung}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ─── DatePickerButton ─────────────────────────────────────────────────────────

function DatePickerButton({
  value,
  onChange,
  placeholder = "Pilih tanggal",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(value + "T00:00:00") : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start font-normal text-left h-9 text-sm"
        >
          <CalendarIcon className="mr-2 h-4 w-4 opacity-50 shrink-0" />
          {selected ? (
            selected.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          captionLayout="dropdown"
          onSelect={(d) => {
            if (!d) return;
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            onChange(`${y}-${m}-${day}`);
            setOpen(false);
          }}
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

// ─── BuatJadwalDialog ─────────────────────────────────────────────────────────

function BuatJadwalDialog({
  gelombangId,
  selectedItems,
  onClose,
  onSuccess,
}: {
  gelombangId: number;
  selectedItems: SidangItem[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [tglSidang, setTglSidang] = useState("");
  const [ruanganId, setRuanganId] = useState<number | null>(null);
  const [jamMulai, setJamMulai] = useState("");
  const [preview, setPreview] = useState<PreviewItem[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: dosenRes } = useSWR(
    "dosen-list-plot",
    () => DosenService.getAll(1, 1000, "", "", "").then((r) => r.data),
    { revalidateOnFocus: false },
  );
  const { data: ruanganRes } = useSWR(
    "ruangan-sidang",
    () => SidangKoorService.getRuangan().then((r) => r.data ?? r),
    { revalidateOnFocus: false },
  );

  const dosenList: DosenOption[] = dosenRes ?? [];
  const ruanganList: Ruangan[] = ruanganRes ?? [];

  const handleGenerate = useCallback(() => {
    setPreview(autoAssignDosen(selectedItems));
    setHasGenerated(true);
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

  const canSubmit = tglSidang && jamMulai && hasGenerated;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const res = await SidangKoorService.buatJadwal({
        gelombang_id: gelombangId,
        tgl_sidang: tglSidang,
        ruangan_id: ruanganId,
        jam_mulai: jamMulai,
        sidang_items: preview.map((p) => ({
          sidang_id: p.sidang_id,
          tipe: p.tipe,
          urutan: p.urutan,
          pendamping_id: p.pendamping_id,
          penguji_id: p.penguji_id,
          penguji_2_id: p.penguji_2_id,
          penguji_3_id: p.penguji_3_id,
        })),
      });
      handleToastResponse(res, () => {
        onSuccess();
        onClose();
      });
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
              <RuanganCombobox
                value={ruanganId}
                onChange={setRuanganId}
                ruanganList={ruanganList}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Jam Mulai</Label>
              <Input
                type="time"
                value={jamMulai}
                onChange={(e) => setJamMulai(e.target.value)}
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
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
                Dosen di-assign otomatis dari dospem mhs. Edit jika perlu.
              </span>
            )}
          </div>

          {hasGenerated && preview.length > 0 && (
            <div className="rounded-md border">
              <Table className="table-fixed w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Urutan</TableHead>
                    <TableHead className="w-40">Mahasiswa</TableHead>
                    <TableHead>Pendamping</TableHead>
                    <TableHead>Ketua Penguji</TableHead>
                    <TableHead>Anggota 1</TableHead>
                    <TableHead>Anggota 2</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.map((p) => {
                    const usedIds = [
                      p.pendamping_id,
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
                              {p.nama}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {p.nim}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DosenCombobox
                            value={p.pendamping_id}
                            onChange={(v) =>
                              updatePreviewItem(p.sidang_id, "pendamping_id", v)
                            }
                            dosenList={dosenList}
                            placeholder="Pendamping"
                            excludeIds={usedIds.filter(
                              (id) => id !== p.pendamping_id,
                            )}
                          />
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
          <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan Jadwal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── EditJadwalDialog ─────────────────────────────────────────────────────────

function EditJadwalDialog({
  sidang,
  onClose,
  onSuccess,
}: {
  sidang: SidangItem;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [pendampingId, setPendampingId] = useState<number | null>(
    sidang.pendamping?.id ?? sidang.pembimbing?.id ?? null,
  );
  const [ketuaId, setKetuaId] = useState<number | null>(
    sidang.penguji?.id ?? null,
  );
  const [anggota1Id, setAnggota1Id] = useState<number | null>(
    sidang.penguji_2?.id ?? null,
  );
  const [anggota2Id, setAnggota2Id] = useState<number | null>(
    sidang.penguji_3?.id ?? null,
  );
  const [urutan, setUrutan] = useState<number | null>(sidang.urutan ?? null);
  const [ruanganId, setRuanganId] = useState<number | null>(
    sidang.sesi?.ruangan?.id ?? null,
  );
  const [jamMulai, setJamMulai] = useState(sidang.sesi?.jam_mulai ?? "");
  const [tglSidang, setTglSidang] = useState(
    sidang.sesi?.tgl_sidang ?? sidang.jadwal.tgl_sidang ?? "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: dosenRes } = useSWR(
    "dosen-list-plot",
    () => DosenService.getAll(1, 1000, "", "", "").then((r) => r.data),
    { revalidateOnFocus: false },
  );
  const { data: ruanganRes } = useSWR(
    "ruangan-sidang",
    () => SidangKoorService.getRuangan().then((r) => r.data ?? r),
    { revalidateOnFocus: false },
  );

  const dosenList: DosenOption[] = dosenRes ?? [];
  const ruanganList: Ruangan[] = ruanganRes ?? [];
  const usedIds = [pendampingId, ketuaId, anggota1Id, anggota2Id].filter(
    Boolean,
  ) as number[];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await SidangKoorService.updateJadwal(sidang.sidang_id, {
        tipe: sidang.tipe,
        urutan,
        pendamping_id: pendampingId,
        penguji_id: ketuaId,
        penguji_2_id: anggota1Id,
        penguji_3_id: anggota2Id,
        tgl_sidang: tglSidang || null,
        ruangan_id: ruanganId,
        jam_mulai: jamMulai || null,
      });
      handleToastResponse(res, () => {
        onSuccess();
        onClose();
      });
    } catch {
      toast.error("Gagal memperbarui jadwal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Edit Jadwal Sidang</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {sidang.mahasiswa.nama} ({sidang.mahasiswa.nim}) ·{" "}
            {sidang.tipe.toUpperCase()}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Tanggal</Label>
              <DatePickerButton
                value={tglSidang}
                onChange={setTglSidang}
                placeholder="Pilih tanggal"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Ruangan</Label>
              <RuanganCombobox
                value={ruanganId}
                onChange={setRuanganId}
                ruanganList={ruanganList}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Jam Mulai</Label>
              <Input
                type="time"
                value={jamMulai}
                onChange={(e) => setJamMulai(e.target.value)}
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Urutan dalam Sesi</Label>
            <Input
              type="number"
              min={1}
              value={urutan ?? ""}
              onChange={(e) =>
                setUrutan(e.target.value ? Number(e.target.value) : null)
              }
              className="w-24"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Pendamping</Label>
              <DosenCombobox
                value={pendampingId}
                onChange={setPendampingId}
                dosenList={dosenList}
                placeholder="Pilih pendamping"
                excludeIds={usedIds.filter((id) => id !== pendampingId)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Ketua Penguji</Label>
              <DosenCombobox
                value={ketuaId}
                onChange={setKetuaId}
                dosenList={dosenList}
                placeholder="Pilih ketua"
                excludeIds={usedIds.filter((id) => id !== ketuaId)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Anggota 1</Label>
              <DosenCombobox
                value={anggota1Id}
                onChange={setAnggota1Id}
                dosenList={dosenList}
                placeholder="Pilih anggota 1"
                excludeIds={usedIds.filter((id) => id !== anggota1Id)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Anggota 2 (opsional)</Label>
              <DosenCombobox
                value={anggota2Id}
                onChange={setAnggota2Id}
                dosenList={dosenList}
                placeholder="Pilih anggota 2"
                excludeIds={usedIds.filter((id) => id !== anggota2Id)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── UndanganDialog ───────────────────────────────────────────────────────────

function UndanganDialog({
  gelombangId,
  tipe,
  onClose,
}: {
  gelombangId: number | null;
  tipe: "ta1" | "ta2";
  onClose: () => void;
}) {
  const [kodeUndangan, setKodeUndangan] = useState("");
  const [groupBy, setGroupBy] = useState<"jadwal" | "pembimbing">("jadwal");
  const [tglUndangan, setTglUndangan] = useState(() => {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, "0");
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const y = now.getFullYear();
    return `${d}-${m}-${y}`;
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const res = await SidangKoorService.generateUndangan({
        tipe,
        gelombang_id: gelombangId,
        kode_undangan: kodeUndangan || undefined,
        tgl_undangan: tglUndangan,
        group_by: groupBy,
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        toast.error(json?.message ?? "Gagal generate undangan");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const tipeSuffix = tipe === "ta2" ? "TA2" : "TA1";
      a.download = `Undangan_Sidang_${tipeSuffix}_${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Undangan berhasil diunduh");
      onClose();
    } catch {
      toast.error("Gagal generate undangan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Generate Undangan Sidang</DialogTitle>
          <p className="text-sm text-muted-foreground">
            PDF undangan per dosen dizip otomatis.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Nomor Surat (opsional)</Label>
            <Input
              placeholder="Contoh: 123/STI/TA/2026"
              value={kodeUndangan}
              onChange={(e) => setKodeUndangan(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Tanggal Surat</Label>
            <Input
              placeholder="dd-mm-yyyy"
              value={tglUndangan}
              onChange={(e) => setTglUndangan(e.target.value)}
              className="font-mono"
            />
            <p className="text-[10px] text-muted-foreground">Format: dd-mm-yyyy (contoh: 05-06-2026)</p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Urutkan Berdasarkan</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={groupBy === "jadwal" ? "default" : "outline"}
                className="h-9 text-xs"
                onClick={() => setGroupBy("jadwal")}
              >
                Jadwal Sidang
              </Button>
              <Button
                type="button"
                variant={groupBy === "pembimbing" ? "default" : "outline"}
                className="h-9 text-xs"
                onClick={() => setGroupBy("pembimbing")}
              >
                Dosen Pembimbing
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {groupBy === "jadwal"
                ? "Tabel dikelompokkan per sesi (tanggal/jam/ruangan)."
                : "Tabel dikelompokkan per dosen pembimbing."}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleDownload} disabled={isLoading} className="gap-2">
            <Download className="h-4 w-4" />
            {isLoading ? "Generating..." : "Download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type StatusFilter = "semua" | "belum" | "sudah";
type SortDir = "asc" | "desc" | null;

export function PlotJadwalSection({ tipe }: { tipe: "ta1" | "ta2" }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("semua");
  const [gelombangId, setGelombangId] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [buatTarget, setBuatTarget] = useState<SidangItem[] | null>(null);
  const [editTarget, setEditTarget] = useState<SidangItem | null>(null);
  const [showUndangan, setShowUndangan] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

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

  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current && gelombangList.length > 0) {
      initialized.current = true;
      const aktif = gelombangList.find((g) => g.status === 1);
      setGelombangId(aktif?.id ?? gelombangList[0]?.id ?? null);
    }
  }, [gelombangList]);

  useEffect(() => { setPage(1); }, [gelombangId, statusFilter, search]);

  const swrKey = ["plot-jadwal-v2", gelombangId, tipe, search, statusFilter];

  const { data: sidangRes, isLoading } = useSWR(
    swrKey,
    () =>
      SidangKoorService.getPlotJadwal(gelombangId, tipe, search, statusFilter),
    { revalidateOnFocus: false },
  );

  const sidangList: SidangItem[] = useMemo(
    () => sidangRes?.data ?? [],
    [sidangRes],
  );

  const displayList = useMemo(() => {
    if (!sortDir) return sidangList;
    return [...sidangList].sort((a, b) => {
      const da = `${a.sesi?.tgl_sidang ?? a.jadwal.tgl_sidang ?? ""} ${a.sesi?.jam_mulai ?? a.jadwal.jam_sidang ?? ""}`.trim();
      const db = `${b.sesi?.tgl_sidang ?? b.jadwal.tgl_sidang ?? ""} ${b.sesi?.jam_mulai ?? b.jadwal.jam_sidang ?? ""}`.trim();
      return sortDir === "asc" ? da.localeCompare(db) : db.localeCompare(da);
    });
  }, [sidangList, sortDir]);

  const paginatedList = useMemo(
    () => displayList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [displayList, page],
  );

  const isScheduled = (s: SidangItem) => !!s.sesi;

  const belumIds = useMemo(
    () => sidangList.filter((s) => !isScheduled(s)).map((s) => s.sidang_id),
    [sidangList],
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
    const items = sidangList.filter((s) => selectedIds.includes(s.sidang_id));
    setBuatTarget(items);
  };

  const handleSuccess = () => {
    setSelectedIds([]);
    mutate(swrKey);
  };

  const activeGelombangId =
    gelombangId ??
    gelombangList.find((g) => g.status === 1)?.id ??
    gelombangList[0]?.id ??
    null;

  return (
    <div className="space-y-4">
      {/* Controls — 1 baris */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="w-1/3">
          <SearchControl placeholder="Cari nama atau NIM..." />
        </div>

        <div className="flex gap-2 ml-auto">
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
                onClick={() => {
                  setGelombangId(null);
                  setSelectedIds([]);
                }}
                className={!gelombangId ? "bg-muted font-medium" : ""}
              >
                Semua Gelombang
              </DropdownMenuItem>
              {gelombangList.map((g) => (
                <DropdownMenuItem
                  key={g.id}
                  onClick={() => {
                    setGelombangId(g.id);
                    setSelectedIds([]);
                  }}
                  className={gelombangId === g.id ? "bg-muted font-medium" : ""}
                >
                  {g.nama_gelombang}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
                  className={
                    statusFilter === opt.value ? "bg-muted font-medium" : ""
                  }
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setShowUndangan(true)}
            className="h-10 gap-2 shrink-0"
          >
            <Download className="h-4 w-4" />
            Undangan
          </Button>

          <Button
            onClick={handleBuatJadwal}
            disabled={selectedIds.length === 0 || !activeGelombangId}
            className="h-10 gap-2 shrink-0"
          >
            <CalendarPlus className="h-4 w-4" />
            Buat Jadwal
            {selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm animate-pulse">
          Memuat data...
        </div>
      ) : sidangList.length === 0 ? (
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
                  {statusFilter !== "sudah" && (
                    <Checkbox
                      checked={allBelumSelected}
                      onCheckedChange={toggleSelectAll}
                    />
                  )}
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
                <TableHead>Dosen Pembimbing</TableHead>
                <TableHead>Pendamping</TableHead>
                <TableHead>Ketua Penguji</TableHead>
                <TableHead>Anggota 1</TableHead>
                <TableHead>Anggota 2</TableHead>
                <TableHead>Gelombang</TableHead>
                <TableHead className="text-center">Urutan</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedList.map((item, idx) => {
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
                        />
                      )}
                    </TableCell>
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

      {displayList.length > PAGE_SIZE && (
        <PaginationControls
          currentPage={page}
          lastPage={Math.ceil(displayList.length / PAGE_SIZE)}
          total={displayList.length}
          onPageChange={setPage}
        />
      )}

      {buatTarget && activeGelombangId && (
        <BuatJadwalDialog
          gelombangId={activeGelombangId}
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

      {showUndangan && (
        <UndanganDialog
          gelombangId={gelombangId}
          tipe={tipe}
          onClose={() => setShowUndangan(false)}
        />
      )}
    </div>
  );
}
