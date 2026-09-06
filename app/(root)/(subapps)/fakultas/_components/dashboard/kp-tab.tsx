"use client";

import { Users, CheckCircle, Clock } from "lucide-react";
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

const KpTab = ({ prodiId }: { prodiId?: number } = {}) => {
  const { data: prodiRes, isLoading: loadingProdi } = useSWR(
    prodiId ? `kp-admin-dashboard-${prodiId}` : null,
    () =>
      fetch(`${API_URL}/kp/koor-kp/`, {
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

  const mhs = prodiId ? prodiRes?.data?.mahasiswa : undefined;
  const kp = prodiId ? undefined : ringkasanRes?.data?.kp;

  const total = prodiId ? mhs?.total_mahasiswa ?? 0 : kp?.total_mahasiswa ?? 0;
  const selesai = prodiId
    ? mhs?.sudah_selesai_sidang ?? 0
    : kp?.sudah_selesai ?? 0;
  const proses = prodiId ? mhs?.progress_bimbingan ?? 0 : kp?.masih_proses ?? 0;
  const progressSidang = prodiId
    ? parseInt(mhs?.progress_sidang ?? "0")
    : total > 0
      ? Math.round((selesai / total) * 100)
      : 0;

  const stats = [
    {
      label: "Total Mahasiswa KP",
      val: total,
      icon: Users,
      iconBg: "bg-blue-50 text-blue-600",
      description: "Mahasiswa terdaftar KP",
    },
    {
      label: "Sudah Selesai Sidang",
      val: selesai,
      icon: CheckCircle,
      iconBg: "bg-emerald-50 text-emerald-600",
      description: "Telah menyelesaikan sidang",
    },
    {
      label: "Masih Bimbingan",
      val: proses,
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-600",
      description: "Dalam proses bimbingan",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

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

      <Card className="shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">
            Progress Sidang KP
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {selesai} dari {total} mahasiswa sudah selesai sidang
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-bold tracking-wider text-muted-foreground">
              <span className="uppercase">PROGRESS KELULUSAN SIDANG</span>
              <span>{progressSidang}%</span>
            </div>
            <Progress value={progressSidang} className="h-2 bg-muted" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KpTab;
