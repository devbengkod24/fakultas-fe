"use client";

import { JadwalMengajar } from "@/types/fakultas/penelitian/penelitian";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const BASE_DAYS = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];

function jamStartMinutes(jam: string): number {
  const [h, m] = (jam.split("-")[0] ?? "").trim().split(".").map((v) => parseInt(v, 10));
  return (h || 0) * 60 + (m || 0);
}

function titleCase(hari: string): string {
  return hari.charAt(0) + hari.slice(1).toLowerCase();
}

interface JadwalGroup {
  key: string;
  mata_kuliah: string;
  kelompok: string;
  ruang: string;
  items: JadwalMengajar[];
}

interface JadwalMengajarGridProps {
  jadwal: JadwalMengajar[];
  canManage: boolean;
  onEdit: (item: JadwalMengajar) => void;
}

export function JadwalMengajarGrid({ jadwal, canManage, onEdit }: JadwalMengajarGridProps) {
  if (!jadwal.length) {
    return <p className="text-sm text-muted-foreground text-center py-4">Belum ada jadwal mengajar</p>;
  }

  // Selalu tampilkan Senin-Sabtu penuh (biar bentuk mingguannya jelas walau dosen
  // cuma punya 1-2 hari ngajar) -- Minggu cuma muncul kalau beneran ada datanya.
  const days = jadwal.some((j) => (j.hari ?? "").toUpperCase() === "MINGGU")
    ? [...BASE_DAYS, "MINGGU"]
    : BASE_DAYS;
  const rows = Array.from(new Set(jadwal.map((j) => j.jam))).sort(
    (a, b) => jamStartMinutes(a) - jamStartMinutes(b)
  );

  // (hari, jam) -> daftar mata kuliah unik di slot itu. Data sync sering punya
  // baris duplikat persis (hari+jam+matkul+kelompok+ruang sama) -- dikelompokkan
  // jadi satu blok dengan penanda x2/x3, aksi edit/hapus tetap ke item pertama.
  const cells = new Map<string, JadwalGroup[]>();
  jadwal.forEach((item) => {
    const cellKey = `${(item.hari ?? "").toUpperCase()}|${item.jam}`;
    const groupKey = `${item.mata_kuliah}|${item.kelompok}|${item.ruang}`;
    const groups = cells.get(cellKey) ?? [];
    const existing = groups.find((g) => g.key === groupKey);
    if (existing) {
      existing.items.push(item);
    } else {
      groups.push({ key: groupKey, mata_kuliah: item.mata_kuliah, kelompok: item.kelompok, ruang: item.ruang, items: [item] });
      cells.set(cellKey, groups);
    }
  });

  return (
    <div className="overflow-x-auto">
      <div
        className="grid gap-2 min-w-[900px] pb-1"
        style={{ gridTemplateColumns: `96px repeat(${days.length}, minmax(160px, 1fr))` }}
      >
        <div style={{ gridColumn: 1, gridRow: 1 }} />
        {days.map((day, i) => (
          <div
            key={day}
            className="pb-2 text-center text-sm font-semibold text-muted-foreground border-b-2 border-border"
            style={{ gridColumn: i + 2, gridRow: 1 }}
          >
            {titleCase(day)}
          </div>
        ))}

        {rows.map((jam, r) => (
          <div
            key={jam}
            className="pr-2 self-center text-right text-xs leading-tight text-muted-foreground tabular-nums whitespace-nowrap"
            style={{ gridColumn: 1, gridRow: r + 2 }}
          >
            {jam}
          </div>
        ))}

        {days.map((day, colIdx) =>
          rows.map((jam, rowIdx) => {
            const groups = cells.get(`${day}|${jam}`);
            const style = { gridColumn: colIdx + 2, gridRow: rowIdx + 2 };
            if (!groups?.length) {
              return <div key={`${day}-${jam}`} className="rounded-md bg-muted/40 min-h-[76px]" style={style} />;
            }
            return (
              <div key={`${day}-${jam}`} className="flex flex-col gap-2" style={style}>
                {groups.map((g) => {
                  const primaryItem = g.items[0];
                  return (
                    <Card
                      key={g.key}
                      onClick={canManage ? () => onEdit(primaryItem) : undefined}
                      className={cn(
                        "flex-1 border-l-4 border-l-primary-600 bg-primary-600/5 px-3 py-2.5 shadow-none",
                        canManage && "cursor-pointer transition-shadow hover:shadow-md hover:bg-primary-600/10"
                      )}
                    >
                      <p className="text-sm font-semibold leading-snug tracking-tight text-foreground">
                        {g.mata_kuliah}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="rounded bg-primary-600/10 px-1.5 py-0.5 font-mono text-xs font-medium tracking-tight text-primary-600">
                          {g.kelompok}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {g.ruang}
                        </span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
