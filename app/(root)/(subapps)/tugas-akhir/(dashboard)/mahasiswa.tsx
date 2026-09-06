/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  BookOpen,
  Calendar,
  CheckCircle,
  FileText,
  MessageSquare,
  PresentationIcon as PresentationChart,
  TrendingUp,
  AlertCircle,
  Circle,
  ListCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import DashboardAnnouncements from "../_components/dashboard/announcement";
import { useProfile } from "@/context/profileUseContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import useSWR from "swr";
import { DashboardService } from "@/api/tugas-akhir";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import dayjs from "dayjs";
import "dayjs/locale/id";
import GlobalGroupLink from "../_components/dashboard/link-group";
import GelombangAktifMahasiswa from "../_components/dashboard/gelombang-aktif-mahasiswa";

export default function Dashboard() {
  const { profile } = useProfile();

  const { data: progressData, isLoading: progressLoading } = useSWR(
    "dashboard-progress",
    () => DashboardService.getProgress()
  );

  const { data: progressPercentageData, isLoading: progressPercentageLoading } =
    useSWR("dashboard-progress-percentage", () =>
      DashboardService.getProgressPercentage()
    );

  const { data: logbookCountData, isLoading: logbookCountLoading } = useSWR(
    "dashboard-logbook-count",
    () => DashboardService.getLogbookCount()
  );

  const { data: pengajuanData, isLoading: pengajuanLoading } = useSWR(
    "dashboard-pengajuan",
    () => DashboardService.getLastPengajuan()
  );

  const { data: ringkasanLogbookData, isLoading: ringkasanLoading } = useSWR(
    "dashboard-ringkasan-logbook",
    () => DashboardService.getRingkasanLogbook()
  );

  const { data: rangePeriodeData, isLoading: rangeLoading } = useSWR(
    "dashboard-range-periode",
    () => DashboardService.getRangePeriode()
  );

  const progressChecklist = progressData?.success ? progressData.data : null;
  const progressPercentage = progressPercentageData?.success
    ? progressPercentageData.data
    : null;
  const logbookCount = logbookCountData?.success ? logbookCountData.data : null;
  const pengajuan = pengajuanData?.success ? pengajuanData.data : null;
  const ringkasanLogbook = ringkasanLogbookData?.success
    ? ringkasanLogbookData.data
    : null;

  const completedTasks =
    progressChecklist && Array.isArray(progressChecklist)
      ? progressChecklist.filter((item: any) => item.status).length
      : 0;
  const totalTasks =
    progressChecklist && Array.isArray(progressChecklist)
      ? progressChecklist.length
      : 0;
  const calculatedPercentage = progressPercentage?.percentage || 0;

  const rangePeriode = rangePeriodeData?.success ? rangePeriodeData.data : null;

  return (
    <main className="flex flex-1 flex-col gap-4">
      {profile?.mahasiswa?.is_completed === false && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Profil Belum Lengkap</AlertTitle>
          <AlertDescription>
            Untuk membuat Pengajuan Tugas Akhir, silakan{" "}
            <Link href="/onboarding" className="font-medium underline">
              lengkapi profil Anda
            </Link>{" "}
            terlebih dahulu.
          </AlertDescription>
        </Alert>
      )}

      {/* Progress Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Progress Keseluruhan
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {progressPercentageLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            ) : (
              <>
                <div className="text-xl font-semibold">
                  {Math.round(calculatedPercentage)}%
                </div>
                <Progress value={calculatedPercentage} className="mt-2" />
                <p className="mt-2 text-xs text-muted-foreground">
                  {completedTasks} dari {totalTasks} tahap selesai
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Status Pengajuan
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {pengajuanLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <>
                <div
                  className={`mb-2 text-xl font-semibold ${
                    pengajuan?.status === "accepted"
                      ? "text-green-700"
                      : pengajuan?.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-700"
                  }`}
                >
                  {pengajuan?.status === "accepted"
                    ? "Diterima"
                    : pengajuan?.status === "rejected"
                      ? "Ditolak"
                      : pengajuan?.status === "pending"
                        ? "Menunggu"
                        : "Belum ada pengajuan"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {pengajuan?.dosen_pembimbing
                    ? `Dosen Pembimbing: ${pengajuan.dosen_pembimbing}`
                    : "Belum ada pengajuan"}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Logbook Bimbingan
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {logbookCountLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-3 w-24" />
              </div>
            ) : (
              <>
                <div className="mb-2 text-2xl font-semibold">
                  {logbookCount?.jumlah_bab || 0}/5
                </div>
                <p className="text-xs text-muted-foreground">
                  Bimbingan terselesaikan
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Periode Tugas Akhir
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {rangeLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            ) : (
              <>
                {rangePeriode?.tgl_awal_ta && rangePeriode?.tgl_akhir_ta ? (
                  <>
                    <div className="mb-2 text-lg font-semibold">
                      {`${dayjs(rangePeriode.tgl_awal_ta)
                        .locale("id")
                        .format("DD MMM YYYY")} - ${dayjs(
                        rangePeriode.tgl_akhir_ta
                      )
                        .locale("id")
                        .format("DD MMM YYYY")}`}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Batas awal pendaftaran - Batas akhir pengajuan
                    </p>
                  </>
                ) : (
                  <div className="text-2xl font-semibold">
                    {rangePeriode?.tahun_ajaran || "Belum ditentukan"}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-3">
        {/* Status Progress */}
        <div className="flex min-w-0 flex-col space-y-4 lg:col-span-2">
          <DashboardAnnouncements />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-1">
                <ListCheck className="size-5" />
                Checklist Tugas Akhir
              </CardTitle>
              <CardDescription>
                Pantau progres penyelesaian tugas akhir Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {progressLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {progressChecklist && Array.isArray(progressChecklist) ? (
                    progressChecklist.map((item: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        {item.status ? (
                          <CheckCircle className="h-4 w-4 text-primary-700" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <label
                          htmlFor={`task-${index}`}
                          className={`text-xs font-medium lg:text-sm ${
                            item.status
                              ? "text-muted-foreground text-primary"
                              : ""
                          }`}
                        >
                          {item.label}
                        </label>
                        {item.status && (
                          <Badge variant="primary" className="text-xs">
                            Selesai
                          </Badge>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground">
                      Tidak ada data checklist
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
          {/* Quick Actions */}
          <Card className="flex flex-1 flex-col">
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
              <CardDescription>
                Akses fitur yang sering digunakan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/tugas-akhir/pengajuan-mahasiswa">
                  <Button
                    variant="outline"
                    className="h-20 w-full flex-col gap-2"
                  >
                    <Calendar className="h-6 w-6" />
                    <span className="text-xs lg:text-sm">Ajukan Bimbingan</span>
                  </Button>
                </Link>
                <Link href="/tugas-akhir/logbook">
                  <Button
                    variant="outline"
                    className="h-20 w-full flex-col gap-2"
                  >
                    <BookOpen className="h-6 w-6" />
                    <span className="text-xs lg:text-sm">Isi Logbook</span>
                  </Button>
                </Link>
                <Link href="/tugas-akhir/sidang-ta1">
                  <Button
                    variant="outline"
                    className="h-20 w-full flex-col gap-2"
                  >
                    <PresentationChart className="h-6 w-6" />
                    <span className="text-xs lg:text-sm">
                      Ajukan Sidang TA1
                    </span>
                  </Button>
                </Link>
                <Link href="/tugas-akhir/sidang-ta2">
                  <Button
                    variant="outline"
                    className="h-20 w-full flex-col gap-2"
                  >
                    <FileText className="h-6 w-6" />
                    <span className="text-xs lg:text-sm">
                      Ajukan Sidang TA2
                    </span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Announcements */}
        <div className="flex min-w-0 flex-col space-y-3">
          <GelombangAktifMahasiswa />
          <GlobalGroupLink />

          {/* Logbook Summary */}
          <Card className="flex flex-1 flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Ringkasan Logbook
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ringkasanLoading ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-px w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Bimbingan:
                      </span>
                      <span className="font-medium">
                        {ringkasanLogbook?.jumlah_logbook || 0}x bimbingan
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Terakhir Bimbingan:
                      </span>
                      <span className="font-medium">
                        {ringkasanLogbook?.logbook_terbaru
                          ? formatDate(ringkasanLogbook.logbook_terbaru)
                          : "Belum ada"}
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Catatan Terakhir:</h4>
                    <p className="text-xs text-muted-foreground">
                      &rdquo;
                      {ringkasanLogbook?.catatan_terakhir ||
                        "Belum ada catatan"}
                      &rdquo;
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
