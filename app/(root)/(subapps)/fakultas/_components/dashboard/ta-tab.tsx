"use client";

import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";
import { configureHeaders } from "@/api";
import { API_URL } from "@/lib/constant";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, BookOpen, Award } from "lucide-react";
import { RadialChartView } from "@/components/shared-ta-kp/dashboard/radial-chart-view";
import type { RadialSegment } from "@/components/shared-ta-kp/dashboard/radial-chart-view";

const TA1_COLOR = "#2463EB"; // Royal Blue
const TA2_COLOR = "#60A8FA"; // Sky Blue

const TaTab = ({ prodiId }: { prodiId?: number } = {}) => {
  // prodiId dikasih -> Laporan Eksekutif per-prodi (endpoint koordinator lama, dipaksa 1 prodi).
  // prodiId kosong -> dashboard utama /fakultas (endpoint agregat semua prodi).
  const { data: logbookRes, isLoading: loadingLogbook } = useSWR(
    prodiId ? `ta-admin-logbook-${prodiId}` : null,
    () =>
      fetch(`${API_URL}/ta/koor-ta/dashboard/logbook-mahasiswa`, {
        headers: configureHeaders({ prodiId }),
      }).then((r) => r.json()),
  );
  const { data: mahasiswaRes, isLoading: loadingMhs } = useSWR(
    prodiId ? `ta-admin-mahasiswa-${prodiId}` : null,
    () =>
      fetch(`${API_URL}/ta/koor-ta/dashboard/jumlah-mahasiswa`, {
        headers: configureHeaders({ prodiId }),
      }).then((r) => r.json()),
  );
  const { data: ringkasanRes, isLoading: loadingRingkasan } = useSWR(
    prodiId ? null : "fakultas-dashboard-ringkasan",
    () =>
      fetch(`${API_URL}/fakultas/dashboard-ringkasan`, {
        headers: configureHeaders(),
      }).then((r) => r.json()),
  );

  const isLoading = prodiId ? loadingLogbook || loadingMhs : loadingRingkasan;

  const ta = ringkasanRes?.data?.ta;
  const total = prodiId
    ? mahasiswaRes?.data?.total_mahasiswa ?? 0
    : ta?.total_mahasiswa ?? 0;
  const ta1 = prodiId ? logbookRes?.data?.ta1 ?? 0 : ta?.ta1_count ?? 0;
  const ta2 = prodiId ? logbookRes?.data?.ta2 ?? 0 : ta?.ta2_count ?? 0;
  const chapters: { bab: number; jumlah: number }[] = prodiId
    ? logbookRes?.data?.chapters ?? []
    : ta?.logbook_per_bab
      ? Object.entries(ta.logbook_per_bab).map(
          ([, v]: [string, any], i) => ({ bab: i + 1, jumlah: v.mahasiswa_acc ?? 0 }),
        )
      : [];

  const maxLog =
    chapters.length > 0 ? Math.max(...chapters.map((c) => c.jumlah)) : 1;
  const ta1pct = total > 0 ? Math.round((ta1 / total) * 100) : 0;
  const ta2pct = total > 0 ? Math.round((ta2 / total) * 100) : 0;

  const segments: RadialSegment[] = [
    { key: "ta1", label: "TA 1", color: TA1_COLOR, value: ta1 },
    { key: "ta2", label: "TA 2", color: TA2_COLOR, value: ta2 },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Mahasiswa TA",
      val: total,
      icon: GraduationCap,
      iconBg: "bg-indigo-50 text-indigo-600",
      description: "KRS TA aktif periode ini",
    },
    {
      label: "TA 1",
      val: ta1,
      icon: BookOpen,
      iconBg: "bg-blue-50 text-blue-600",
      description: `${ta1pct}% dari total mahasiswa`,
    },
    {
      label: "TA 2",
      val: ta2,
      icon: Award,
      iconBg: "bg-sky-50 text-sky-600",
      description: `${ta2pct}% dari total mahasiswa`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i} className="shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </CardTitle>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.iconBg}`}
                >
                  <Icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tracking-tight text-foreground">
                  {s.val}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {s.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">
              Statistik Logbook TA
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Jumlah mahasiswa yang mengisi Bab 1–5
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {chapters.map((c) => {
              const pct = maxLog > 0 ? Math.round((c.jumlah / maxLog) * 100) : 0;
              return (
                <div key={c.bab} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold tracking-wider text-muted-foreground">
                    <span>BAB {c.bab}</span>
                    <span>{c.jumlah} Mahasiswa</span>
                  </div>
                  <Progress value={pct} className="h-2 bg-muted" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <RadialChartView
          title="Distribusi KRS TA"
          description="Persentase mahasiswa TA 1 & TA 2"
          segments={segments}
          loading={isLoading}
          error={false}
          centerLabel="Mahasiswa TA"
        />
      </div>
    </div>
  );
};

export default TaTab;
