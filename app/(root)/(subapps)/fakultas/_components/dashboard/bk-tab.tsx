"use client";

import { Users, CalendarCheck, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";
import { configureHeaders } from "@/api";
import { API_URL } from "@/lib/constant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BkTab = ({ prodiId }: { prodiId?: number } = {}) => {
  const { data: prodiRes, isLoading: loadingProdi } = useSWR(
    prodiId ? `bk-admin-dashboard-${prodiId}` : null,
    () =>
      fetch(`${API_URL}/bk/dashboard`, {
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

  const isLoading = prodiId ? loadingProdi : loadingRingkasan;

  const cards = prodiId ? prodiRes?.data?.cards : undefined;
  const bk = prodiId ? undefined : ringkasanRes?.data?.bk;

  const totalMahasiswa = prodiId
    ? cards?.total_mahasiswa ?? 0
    : bk?.total_mahasiswa ?? 0;
  const totalKegiatan = prodiId
    ? cards?.total_kegiatan ?? 0
    : bk?.jumlah_kegiatan ?? 0;
  const periodeAjaran = prodiId
    ? cards?.periode_saat_ini?.tahun_ajaran ?? "-"
    : ringkasanRes?.data?.periode?.tahun_ajaran ?? "-";

  const stats = [
    {
      label: "Total Mahasiswa BK",
      val: totalMahasiswa,
      icon: Users,
      iconBg: "bg-emerald-50 text-emerald-600",
      description: "Mahasiswa terdaftar BK periode ini",
    },
    {
      label: "Jumlah Kegiatan",
      val: totalKegiatan,
      icon: CalendarCheck,
      iconBg: "bg-blue-50 text-blue-600",
      description: "Kegiatan bimbingan terlaksana",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-20 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                <p className="text-3xl font-bold tracking-tight text-foreground">
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

      <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-none">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Periode Aktif
            </p>
            <p className="mt-0.5 text-lg font-bold text-foreground">
              {periodeAjaran}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BkTab;
