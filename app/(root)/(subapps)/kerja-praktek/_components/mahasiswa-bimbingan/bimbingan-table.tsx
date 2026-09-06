"use client";

import { Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Row schema untuk tab "Mahasiswa Bimbingan" di dosen.
// Bentuk data sudah di-mapper dari response endpoint /kp/dosen/bimbingan
// (lihat dosen.tsx → bimbinganRows).
export interface BimbinganRow {
  nim: string;
  nama: string;
  email?: string;
  telepon?: string;
  foto?: string | null;
  status_kp?: string | null; // "konversi" | "reguler" | null
  judul_kp?: string | null;
  // ISO date "Y-m-d" dari BE (max(logbooks.tanggal)).
  // Null → tampil "Belum ada".
  tanggal_bimbingan_terakhir?: string | null;
}

interface BimbinganTableProps {
  rows: BimbinganRow[];
  // Page start index, mis. (page-1)*limit. Default 0 → auto-numbered 1..N.
  startIndex?: number;
}

// Inisial nama untuk fallback Avatar jika foto tidak tersedia.
// "Yusuf Farhan" → "YF"; single word → 2 huruf pertama.
function getInitials(nama: string): string {
  const parts = (nama ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Variant Badge sesuai mockup "Konversi" hijau, fallback outline.
// Tipe_kp enum: 'konversi' | 'reguler' (lihat kerja_praktek.tipe_kp).
function statusBadgeVariant(status?: string | null) {
  if (status === "konversi") return "success" as const;
  if (status === "reguler") return "secondary" as const;
  return "outline" as const;
}

function formatStatusKp(status?: string | null): string {
  if (!status) return "-";
  // Lower-case → Capitalized first char
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

// Format tanggal "YYYY-MM-DD" dari BE → "20 Juni 2026" dengan locale Indonesia.
// Return null/undefined input → "" (caller pakai "Belum ada" fallback).
function formatTanggalIndo(isoDate?: string | null): string {
  if (!isoDate) return "";
  try {
    return format(new Date(isoDate), "d MMMM yyyy", { locale: localeId });
  } catch {
    return "";
  }
}

export function BimbinganTable({ rows, startIndex = 0 }: BimbinganTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="text-center py-10 text-muted-foreground">
          <p>Belum ada mahasiswa bimbingan yang diterima.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Kontak</TableHead>
              <TableHead>Terakhir Bimbingan</TableHead>
              <TableHead>Status KP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={`${row.nim}-${idx}`}>
                {/* No */}
                <TableCell className="text-muted-foreground">
                  {startIndex + idx + 1}
                </TableCell>

                {/* Nama (stacked: Avatar + Nama di atas, NIM di bawah) */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {row.foto ? (
                        <AvatarImage src={row.foto} alt={row.nama} />
                      ) : null}
                      <AvatarFallback className="text-xs">
                        {getInitials(row.nama)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{row.nama || "-"}</div>
                      <div className="text-xs text-muted-foreground">
                        {row.nim || "-"}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Kontak (stacked: Email di atas, No HP di bawah) */}
                <TableCell>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{row.email || "-"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">
                        {row.telepon || "-"}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Terakhir Bimbingan — tanggal format Indonesia atau "Belum ada" */}
                <TableCell>
                  {(() => {
                    const formatted = formatTanggalIndo(row.tanggal_bimbingan_terakhir);
                    return formatted ? (
                      <span className="text-sm whitespace-nowrap">{formatted}</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">Belum ada</span>
                    );
                  })()}
                </TableCell>

                {/* Status KP */}
                <TableCell>
                  <Badge variant={statusBadgeVariant(row.status_kp)}>
                    {formatStatusKp(row.status_kp)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
