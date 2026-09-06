"use client";

import React from "react";
import Link from "next/link";
import useSWR from "swr";
import { Calendar, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MonitoringSidangService } from "@/api/kerja-praktek";

interface SidangItem {
  sidang_id: number;
  pengajuan_sidang_id: number;
  jadwal_sidang: {
    tanggal: string | null;
    jam: string | null;
  };
  mahasiswa: {
    mahasiswa_id: number;
    nama: string;
    nim: string;
  };
  pembimbing: { id: number; nama: string | null } | null;
  penguji_1: { id: number; nama: string | null } | null;
  penguji_2: { id: number; nama: string | null } | null;
  penguji_3: { id: number; nama: string | null } | null;
  peran_dosen?: string[];
}

/**
 * Jadwal Sidang Mendatang — card untuk dosen dashboard.
 *
 * Menampilkan sidang KP yang jadwalnya sudah di-set (tgl_sidang + jam_sidang
 * tidak null), diurutkan ascending by tanggal, hanya yang upcoming atau
 * hari ini. Limit 5 entry. Sumber: GET /kp/dosen/sidang (MonitoringSidangService).
 */
const DashboardDosenJadwalSidang = () => {
  const { data, isLoading } = useSWR(
    ["dosen-jadwal-sidang-mendatang"],
    () => MonitoringSidangService.getAllMonitoringSidangDosen(undefined, "", 1, 100),
    { revalidateOnFocus: false },
  );

  const items: SidangItem[] = (data?.data ?? []).filter(
    (s: SidangItem) => s.jadwal_sidang?.tanggal && s.jadwal_sidang?.jam,
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = items
    .filter((s) => {
      const tgl = s.jadwal_sidang.tanggal!;
      const [day, month, year] = tgl.split("-").map(Number);
      const d = new Date(year, (month ?? 1) - 1, day);
      return d.getTime() >= today.getTime();
    })
    .sort((a, b) => {
      const ta = a.jadwal_sidang.tanggal!;
      const tb = b.jadwal_sidang.tanggal!;
      return ta.localeCompare(tb);
    })
    .slice(0, 5);

  return (
    <Card className="shadow-none border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-5 w-5" />
          Jadwal Sidang Mendatang
        </CardTitle>
        <CardDescription>
          Sidang KP yang akan datang (peran dosen: pembimbing/penguji)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mb-2 opacity-50" />
            <p className="text-sm font-medium text-muted-foreground">
              Belum ada jadwal sidang
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Sidang yang sudah di-plot akan muncul di sini
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[210px] overflow-y-auto pr-1">
            {upcoming.map((s) => {
              const [day, month, year] = s.jadwal_sidang.tanggal!.split("-").map(Number);
              const date = new Date(year, (month ?? 1) - 1, day);
              const dateLabel = date.toLocaleDateString("id-ID", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              const isToday = date.getTime() === today.getTime();
              const peran = s.peran_dosen?.join(" + ") || "Dosen";

              return (
                <div
                  key={s.sidang_id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  {/* Date pill */}
                  <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 rounded-md px-3 py-2 min-w-[64px]">
                    <span className="text-[10px] uppercase font-semibold">
                      {date.toLocaleDateString("id-ID", { month: "short" })}
                    </span>
                    <span className="text-xl font-bold leading-none">
                      {day}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm truncate">
                        {s.mahasiswa.nama}
                      </p>
                      {isToday && (
                        <Badge variant="default" className="text-[10px]">
                          Hari ini
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      NIM {s.mahasiswa.nim}
                    </p>
                    <Badge variant="outline" className="text-[10px] mt-1">
                      {peran}
                    </Badge>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {s.jadwal_sidang.jam}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {dateLabel}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    href="/kerja-praktek/hasil-sidang"
                    className="shrink-0"
                  >
                    <Button variant="outline" size="sm">
                      Detail
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardDosenJadwalSidang;