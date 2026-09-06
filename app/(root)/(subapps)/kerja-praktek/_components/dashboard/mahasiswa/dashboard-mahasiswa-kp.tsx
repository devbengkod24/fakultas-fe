"use client";

import useSWR from "swr";
import {
  BookOpen,
  CalendarClock,
  CalendarRange,
  CheckCircle2,
  Circle,
  GraduationCap,
} from "lucide-react";

import { DashboardService, LogbookService, PengajuanService, SidangService } from "@/api/kerja-praktek";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardAnnouncements from "../announcement";
import KerjaPraktekGroupLinks from "./kerja-praktek-group-links";

const formatDateId = (value?: string) => {
  if (!value || value === "N/A") return "Belum tersedia";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
};

const safeText = (value?: string | null) => {
  if (!value || value === "N/A") return "Belum tersedia";
  return value;
};

type LogbookBabEntry = {
  status?: string;
};

type LogbookBabGroup = {
  bab: number;
  entries: LogbookBabEntry[];
};

type DashboardStatCardProps = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  description: string;
  valueClassName?: string;
};

const DashboardStatCard = ({
  title,
  icon: Icon,
  value,
  description,
  valueClassName = "text-lg font-semibold mb-2",
}: DashboardStatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className={valueClassName}>{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const DashboardMahasiswaKP = () => {
  const { data: dashboardResponse, isLoading: dashboardLoading } = useSWR(
    "kp-dashboard-mahasiswa",
    () => DashboardService.getDashboardMahasiswa(),
    { revalidateOnFocus: false }
  );

  const dashboard = dashboardResponse?.data ?? {};
  const gelombangRaw = dashboard.gelombang;
  const hasGelombang = Boolean(gelombangRaw && String(gelombangRaw).trim() && String(gelombangRaw) !== "N/A");
  const gelombangText = hasGelombang ? String(gelombangRaw) : "Belum ada gelombang";
  const dosen = dashboard.dosen ?? {};
  const sidangFromDashboard = dashboard.sidang ?? {};

  const hasDosenPembimbing = Boolean(dosen.nama && dosen.nama !== "N/A");

  const { data: kpResponse, isLoading: kpLoading } = useSWR(
    hasDosenPembimbing ? "kp-dashboard-latest-kp" : null,
    () => LogbookService.getLatestKP(),
    { revalidateOnFocus: false }
  );

  const { data: pengajuanKpResponse, isLoading: pengajuanKpLoading } = useSWR(
    "kp-dashboard-pengajuan-kp",
    () => PengajuanService.showPengajuan(),
    { revalidateOnFocus: false }
  );

  const kerjaPraktek = kpResponse?.data ?? null;
  const kerjaPraktekId = kerjaPraktek?.id;

  const { data: logbookResponse, isLoading: logbookLoading } = useSWR(
    kerjaPraktekId ? ["kp-dashboard-logbook-detail", kerjaPraktekId] : null,
    () => LogbookService.getLogbookByIdKP(kerjaPraktekId as number),
    { revalidateOnFocus: false }
  );

  const { data: pengajuanSidangResponse, isLoading: sidangLoading } = useSWR(
    hasDosenPembimbing ? "kp-dashboard-pengajuan-sidang" : null,
    () => SidangService.getPengajuanSidang(),
    { revalidateOnFocus: false }
  );

  const logbookDetail = logbookResponse?.data ?? null;
  const pengajuanSidang = pengajuanSidangResponse?.data ?? null;
  const pengajuanKp = pengajuanKpResponse?.success ? pengajuanKpResponse.data : null;

  const logbookByBab: LogbookBabGroup[] = Array.isArray(logbookDetail?.logbooks_by_bab)
    ? logbookDetail.logbooks_by_bab
    : [];

  const acceptedBabs = [1, 2, 3, 4, 5].filter((bab) => {
    const entry = logbookByBab.find((item) => Number(item.bab) === bab);
    return Boolean(entry?.entries?.some((entryItem: LogbookBabEntry) => entryItem.status === "accepted"));
  });

  const acceptedBabMax = acceptedBabs.length > 0 ? Math.max(...acceptedBabs) : 0;

  const hasSidangSchedule = Boolean(sidangFromDashboard?.tanggal && sidangFromDashboard.tanggal !== "N/A");
  const sidangStatus = (sidangFromDashboard?.status ?? pengajuanSidang?.pengajuanSidang?.sidang?.status ?? "").toLowerCase();
  const isSidangDone = sidangStatus === "selesai";
  const isSidangScheduled = Boolean(hasSidangSchedule || pengajuanSidang?.pengajuanSidang?.sidang?.tgl_sidang);
  const pengajuanStatus = (pengajuanKp?.status ?? "").toLowerCase();
  const isPengajuanAccepted = pengajuanStatus === "accepted";
  const isPengajuanPending = pengajuanStatus === "pending";
  const isPengajuanRejected = pengajuanStatus === "rejected";
  const hasPengajuan = Boolean(pengajuanKp?.id || pengajuanStatus);

  const dosenFromPengajuan = pengajuanKp?.dosen;
  const dosenFromPengajuanLabel = dosenFromPengajuan
    ? `${dosenFromPengajuan.gelar_depan ? `${dosenFromPengajuan.gelar_depan} ` : ""}${safeText(dosenFromPengajuan.nama)}${dosenFromPengajuan.gelar_belakang ? `, ${dosenFromPengajuan.gelar_belakang}` : ""}`.trim()
    : null;

  const statusPengajuanValue = isPengajuanAccepted
    ? "Diterima"
    : isPengajuanPending
      ? "Diproses"
      : isPengajuanRejected
        ? "Ditolak"
        : "Belum";

  const statusPengajuanDescription = isPengajuanAccepted
    ? `Dospem: ${dosenFromPengajuanLabel ?? safeText(dosen.nama)}`
    : isPengajuanPending
      ? "Pengajuan dosen pembimbing sedang diproses."
      : isPengajuanRejected
        ? `Ditolak${pengajuanKp?.alasan ? `: ${pengajuanKp.alasan}` : "."}`
        : "Belum ada pengajuan dosen pembimbing.";

  const statusPengajuanClassName = isPengajuanAccepted
    ? "text-xl font-semibold mb-2 text-green-700"
    : isPengajuanPending
      ? "text-xl font-semibold mb-2 text-amber-600"
      : isPengajuanRejected
        ? "text-xl font-semibold mb-2 text-red-700"
        : "text-xl font-semibold mb-2 text-yellow-600";

  const isPengajuanKeDospemDone = hasPengajuan
    ? isPengajuanAccepted
    : hasDosenPembimbing || Boolean(kerjaPraktek?.id);

  const checklist = [
    {
      key: "pengajuan-dospem",
      label: "Pengajuan ke dosen pembimbing",
      done: isPengajuanKeDospemDone,
      note: isPengajuanAccepted
        ? `Pembimbing: ${dosenFromPengajuanLabel ?? safeText(dosen.nama)}`
        : isPengajuanPending
          ? "Pengajuan masih menunggu persetujuan."
          : isPengajuanRejected
            ? `Pengajuan ditolak${pengajuanKp?.alasan ? `: ${pengajuanKp.alasan}` : "."}`
            : "Belum ada pengajuan dosen pembimbing.",
    },
    {
      key: "bab-1-5",
      label: "Bab Sudah Diverifikasi",
      done: acceptedBabMax >= 5,
      note: `${acceptedBabMax}/5 bab sudah diverifikasi`,
    },
    {
      key: "jadwal-sidang",
      label: "Sudah mendapatkan jadwal sidang",
      done: isSidangScheduled,
      note: isSidangScheduled
        ? `Jadwal: ${formatDateId(pengajuanSidang?.pengajuanSidang?.sidang?.tgl_sidang ?? sidangFromDashboard?.tanggal)} ${pengajuanSidang?.pengajuanSidang?.sidang?.jam_sidang ?? sidangFromDashboard?.jam ? `• ${pengajuanSidang?.pengajuanSidang?.sidang?.jam_sidang ?? sidangFromDashboard?.jam}` : ""}`
        : "Menunggu penjadwalan sidang.",
    },
    {
      key: "sudah-sidang",
      label: "Sidang KP sudah dinilai",
      done: isSidangDone,
      note: isSidangDone
        ? "Sidang KP sudah dinilai dan berhasil."
        : "Sidang KP belum dinilai.",
    },
  ];

  const completedChecklist = checklist.filter((item) => item.done).length;
  const checklistProgress = Math.round((completedChecklist / checklist.length) * 100);

  const sidangDate =
    pengajuanSidang?.pengajuanSidang?.sidang?.tgl_sidang ?? sidangFromDashboard?.tanggal;
  const sidangTime =
    pengajuanSidang?.pengajuanSidang?.sidang?.jam_sidang ?? sidangFromDashboard?.jam;
  const jadwalSidangValue = isSidangScheduled ? formatDateId(sidangDate) : "Belum ada jadwal";
  const jadwalSidangDescription = isSidangScheduled
    ? sidangTime
      ? `Jam ${sidangTime}`
      : "Jam belum tersedia"
    : "Menunggu penjadwalan sidang";

  return (
    <main className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Status Pengajuan"
          icon={GraduationCap}
          value={statusPengajuanValue}
          description={statusPengajuanDescription}
          valueClassName={statusPengajuanClassName}
        />

        <DashboardStatCard
          title="Log Mahasiswa"
          icon={BookOpen}
          value={`${acceptedBabMax}/5`}
          description={
            logbookDetail?.logbook?.progress
              ? `Progress ${logbookDetail.logbook.progress}`
              : "Belum ada data logbook"
          }
          valueClassName="text-2xl font-semibold mb-2"
        />

        <DashboardStatCard
          title="Jadwal Sidang"
          icon={CalendarClock}
          value={jadwalSidangValue}
          description={jadwalSidangDescription}
        />

        <Card className="overflow-hidden shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Periode Aktif</CardTitle>
            <CalendarRange className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold mb-2">{dashboard.periode ?? "Tidak ada periode aktif"}</div>
            <div className="mt-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <p>Gelombang Aktif</p>
              </div>
              <p className="text-xs text-muted-foreground">{gelombangText}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-5 w-5" />
              Logbook Bimbingan
            </CardTitle>
            <CardDescription>
              Progress pengerjaan logbook dan checklist KP
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress checklist</span>
                <span className="font-medium">{checklistProgress}%</span>
              </div>
              <Progress value={checklistProgress} className="h-2" />
            </div>

            <div className="space-y-2.5">
              {checklist.map((item) => (
                <div key={item.key} className="flex items-start gap-3 rounded-2xl border p-3">
                  <div className={`mt-0.5 rounded-full p-1 ${item.done ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                    {item.done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{item.label}</p>
                      <Badge variant={item.done ? "default" : "secondary"} className="rounded-full">
                        {item.done ? "Selesai" : "Belum"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <KerjaPraktekGroupLinks />
          <DashboardAnnouncements />
        </div>
      </section>

      {(dashboardLoading || kpLoading || pengajuanKpLoading || logbookLoading || sidangLoading) && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-2xl" />
          ))}
        </div>
      )}
    </main>
  );
};

export default DashboardMahasiswaKP;