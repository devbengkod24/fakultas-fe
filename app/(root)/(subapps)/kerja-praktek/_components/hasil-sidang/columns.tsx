"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  MonitoringSidang,
  PeranDosen,
} from "@/types/kerja-praktek/monitoring-sidang";

interface NilaiCellProps {
  value: number | undefined;
  disabled: boolean;
  onSave: (nilai: number) => void;
}

// Shared editable/read-only input cell for the 5 nilai columns.
// `disabled` is set by the parent column based on role (dosen => disabled)
// and whether the sidang has a jadwal yet.
const NilaiCell = ({ value, disabled, onSave }: NilaiCellProps) => {
  const [local, setLocal] = useState<string>(value?.toString() ?? "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === "" || (Number(v) >= 0 && Number(v) <= 100)) {
      setLocal(v);
    }
  };

  const handleBlur = () => {
    if (local) onSave(Number(local));
  };

  return (
    <Input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      min={0}
      max={100}
      value={local}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
      className="h-8 min-w-[4rem] w-24 px-2 text-center tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      placeholder="-"
    />
  );
};

const formatDosenName = (dosen?: {
  gelar_depan?: string;
  nama?: string;
  gelar_belakang?: string;
}): string => {
  if (!dosen?.nama) return "—";
  const parts = [dosen.gelar_depan, dosen.nama, dosen.gelar_belakang].filter(
    Boolean,
  );
  return parts.join(" ");
};

const isJadwalNull = (sidang: MonitoringSidang): boolean => {
  return (
    !sidang.jadwal_sidang ||
    !sidang.jadwal_sidang.tanggal ||
    !sidang.jadwal_sidang.jam
  );
};

const isPengujiSlotEmpty = (
  penguji: MonitoringSidang["penguji_2"],
): boolean => {
  return penguji == null;
};

// Wrapper untuk kolom nilai peran dosen (Pembimbing / Penguji 1/2/3).
// Untuk role dosen: cell hanya editable jika dosen memegang peran tsb di
// sidang ini (sesuai `row.peran_dosen`). Jika tidak → tampil "-".
// Untuk role koor/admin: cell selalu editable mengikuti handler yang di-pass.
interface NilaiPeranCellProps {
  row: MonitoringSidang;
  value: number | undefined;
  expectedPeran: PeranDosen;
  isDosen: boolean;
  disabled: boolean;
  onSave: (id: number, nilai: number) => void;
}

const NilaiPeranCell = ({
  row,
  value,
  expectedPeran,
  isDosen,
  disabled,
  onSave,
}: NilaiPeranCellProps) => {
  // Dosen yang tidak memegang peran ini → sembunyikan cell sebagai "-".
  const isDosenWithoutRole =
    isDosen && !(row.peran_dosen ?? []).includes(expectedPeran);
  if (isDosenWithoutRole) {
    return (
      <span className="text-muted-foreground text-xs">-</span>
    );
  }
  return (
    <NilaiCell
      value={value}
      disabled={disabled}
      onSave={(n) =>
        row.sidang_id != null && onSave(row.sidang_id, n)
      }
    />
  );
};

export const Columns = (
  currentPage: number,
  perPage: number,
  isDosen: boolean,
  onUpdateNilaiPenyelia: (id: number, nilai: number) => void,
  onUpdateNilaiPembimbing: (id: number, nilai: number) => void,
  onUpdateNilaiPenguji1: (id: number, nilai: number) => void,
  onUpdateNilaiPenguji2: (id: number, nilai: number) => void,
  onUpdateNilaiPenguji3: (id: number, nilai: number) => void,
): ColumnDef<MonitoringSidang>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div className="min-w-[50px]">{number}</div>;
      },
      size: 50,
    },
    {
      accessorKey: "mahasiswa.nama",
      header: "Mahasiswa",
      cell: ({ row }) => {
        const mahasiswa = row.original.mahasiswa;
        return (
          <div className="min-w-[200px] max-w-[260px]">
            <div className="font-medium truncate">{mahasiswa?.nama ?? "—"}</div>
            <div className="text-sm text-muted-foreground">
              {mahasiswa?.nim ?? "—"}
            </div>
          </div>
        );
      },
      size: 200,
    },
    {
      accessorKey: "pembimbing.nama",
      header: "Pembimbing",
      cell: ({ row }) => {
        return (
          <div className="min-w-[180px] max-w-[240px] text-sm">
            {formatDosenName(row.original.pembimbing)}
          </div>
        );
      },
      size: 180,
    },
    {
      accessorKey: "gelombang.nama_gelombang",
      header: "Gelombang",
      cell: ({ row }) => {
        return (
          <div className="min-w-[120px] text-sm">
            {row.original.gelombang?.nama_gelombang ?? "—"}
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: "nilai_penyelia",
      header: () => <div className="text-center">Nilai Penyelia</div>,
      cell: ({ row }) => (
        <div className="flex justify-center min-w-[90px]">
          <NilaiCell
            value={row.original.nilai_penyelia}
            disabled={isDosen || isJadwalNull(row.original)}
            onSave={(n) =>
              row.original.sidang_id != null &&
              onUpdateNilaiPenyelia(row.original.sidang_id, n)
            }
          />
        </div>
      ),
      size: 130,
    },
    {
      accessorKey: "nilai_pembimbing",
      header: () => <div className="text-center">Nilai Pembimbing</div>,
      cell: ({ row }) => (
        <div className="flex justify-center min-w-[90px]">
          <NilaiPeranCell
            row={row.original}
            value={row.original.nilai_pembimbing}
            expectedPeran="pembimbing"
            isDosen={isDosen}
            disabled={isJadwalNull(row.original)}
            onSave={onUpdateNilaiPembimbing}
          />
        </div>
      ),
      size: 130,
    },
    {
      accessorKey: "nilai_penguji_1",
      header: () => <div className="text-center">Nilai Penguji 1</div>,
      cell: ({ row }) => (
        <div className="flex justify-center min-w-[90px]">
          <NilaiPeranCell
            row={row.original}
            value={row.original.nilai_penguji_1}
            expectedPeran="penguji_1"
            isDosen={isDosen}
            disabled={isJadwalNull(row.original)}
            onSave={onUpdateNilaiPenguji1}
          />
        </div>
      ),
      size: 130,
    },
    {
      accessorKey: "nilai_penguji_2",
      header: () => <div className="text-center">Nilai Penguji 2</div>,
      cell: ({ row }) => {
        // Untuk koor: slot penguji yang belum di-plot → tampil input disabled
        // dengan tooltip "Penguji belum di-plotting".
        // Untuk dosen: NilaiPeranCell sudah handle dosen-without-role di atas.
        const slotEmpty = isPengujiSlotEmpty(row.original.penguji_2);
        const dosenHoldsPeran = (row.original.peran_dosen ?? []).includes(
          "penguji_2",
        );
        const showAsEmptySlot = slotEmpty && !dosenHoldsPeran;
        const inner = (
          <NilaiPeranCell
            row={row.original}
            value={row.original.nilai_penguji_2}
            expectedPeran="penguji_2"
            isDosen={isDosen}
            disabled={isJadwalNull(row.original) || (slotEmpty && !isDosen)}
            onSave={onUpdateNilaiPenguji2}
          />
        );
        return (
          <div className="flex justify-center min-w-[90px]">
            {showAsEmptySlot ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-muted-foreground text-xs">-</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Penguji belum di-plotting</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              inner
            )}
          </div>
        );
      },
      size: 130,
    },
    {
      accessorKey: "nilai_penguji_3",
      header: () => <div className="text-center">Nilai Penguji 3</div>,
      cell: ({ row }) => {
        const slotEmpty = isPengujiSlotEmpty(row.original.penguji_3);
        const dosenHoldsPeran = (row.original.peran_dosen ?? []).includes(
          "penguji_3",
        );
        const showAsEmptySlot = slotEmpty && !dosenHoldsPeran;
        const inner = (
          <NilaiPeranCell
            row={row.original}
            value={row.original.nilai_penguji_3}
            expectedPeran="penguji_3"
            isDosen={isDosen}
            disabled={isJadwalNull(row.original) || (slotEmpty && !isDosen)}
            onSave={onUpdateNilaiPenguji3}
          />
        );
        return (
          <div className="flex justify-center min-w-[90px]">
            {showAsEmptySlot ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-muted-foreground text-xs">-</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Penguji belum di-plotting</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              inner
            )}
          </div>
        );
      },
      size: 130,
    },
    {
      accessorKey: "nilai_akhir",
      header: () => <div className="text-center">Nilai Akhir</div>,
      cell: ({ row }) => {
        const nilaiAkhir = row.original.nilai_akhir;
        const formatted =
          nilaiAkhir !== null && nilaiAkhir !== undefined
            ? Number(nilaiAkhir).toFixed(2)
            : "-";
        return (
          <div className="text-center font-medium min-w-[90px]">
            {formatted}
          </div>
        );
      },
      size: 110,
    },
    {
      id: "status_sidang",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => {
        const data = row.original;
        const hasPenguji2 = data.penguji_2 != null;
        const hasPenguji3 = data.penguji_3 != null;

        const isComplete =
          data.nilai_penyelia != null &&
          data.nilai_pembimbing != null &&
          data.nilai_penguji_1 != null &&
          (!hasPenguji2 || data.nilai_penguji_2 != null) &&
          (!hasPenguji3 || data.nilai_penguji_3 != null);

        return (
          <div className="flex justify-center min-w-[120px]">
            <Badge
              variant={isComplete ? "success" : "secondary"}
              className="text-xs"
            >
              {isComplete ? "Selesai" : "Belum"}
            </Badge>
          </div>
        );
      },
      size: 140,
    },
  ];
};
