"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  CheckCircle2,
  ClipboardList,
  Award,
  Building2,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import useSWR from "swr";
import CardMasaTunggu from "./card-masa-tunggu";
import { PerbandinganBidangPekerjaan } from "./perbandingan-bidang-pekerjaan";

const ALUMNI_STATS_URL =
  "https://api-alumni.dieseltrack.site/api/v1/public/dashboard-stats";

export const LulusanAlumni = () => {
  const { data: responseData } = useSWR(
    ALUMNI_STATS_URL,
    (url: string) => fetch(url).then((res) => res.json()),
    { revalidateOnFocus: false, refreshInterval: 300000 }
  );

  const apiData = responseData?.success ? responseData.data : null;

  const tracerPersentase = apiData?.tracer_study_response?.persentase ?? 81.25;
  const tracerFilled = apiData?.tracer_study_response?.filled_tracer ?? 13;
  const tracerTotal = apiData?.tracer_study_response?.total_alumni ?? 16;

  const lowonganAktif = apiData?.active_lowongan_mitra?.active_lowongan ?? 1;
  const lowonganTotal = apiData?.active_lowongan_mitra?.total_lowongan ?? 8;

  const cv100 = apiData?.cv_terbit_100_percent?.cv_100_percent ?? 0;
  const cvTotal = apiData?.cv_terbit_100_percent?.total_alumni ?? 16;

  const totalMitra = apiData?.total_mitra?.total_mitra ?? 11;

  const stats = [
    {
      label: "Respon Tracer Study",
      val: `${Math.round(tracerPersentase)}%`,
      description: `${tracerFilled} dari ${tracerTotal} Alumni Mengisi`,
      icon: CheckCircle2,
      iconBg:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    },
    {
      label: "Lowongan Mitra",
      val: `${lowonganAktif}`,
      description: `${lowonganAktif} Aktif (${lowonganTotal} Total Lowongan)`,
      icon: ClipboardList,
      iconBg:
        "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    },
    {
      label: "Rekap CV Terbit",
      val: `${cv100}`,
      description: `${cv100} CV 100% dari ${cvTotal} Alumni`,
      icon: Award,
      iconBg:
        "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
    },
    {
      label: "Jumlah Mitra",
      val: `${totalMitra}`,
      description: `Mitra Perusahaan Terhubung`,
      icon: Building2,
      iconBg:
        "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <Card className="overflow-hidden border-l-4 border-l-primary shadow-none">
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Portal Alumni & Tracer Study
              </p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">
                Rerata Masa Tunggu Lulusan:{" "}
                <span className="font-bold text-primary">3.2 Bulan</span>
              </p>
            </div>
          </div>
          <Link
            href="https://alumni.dieseltrack.site"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/30 transition-colors shrink-0"
          >
            <span>Buka Portal Alumni</span>
            <ChevronRight className="size-4" />
          </Link>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CardMasaTunggu />
        <PerbandinganBidangPekerjaan />
      </div>
    </div>
  );
};


