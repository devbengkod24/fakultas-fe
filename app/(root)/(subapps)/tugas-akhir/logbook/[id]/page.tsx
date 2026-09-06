"use client";

import { use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogbookService } from "@/api/tugas-akhir";
import { StudentHeader } from "../../_components/logbook/student-header";
import { LogbookTimeline } from "../../_components/logbook/logbook-timeline";
import DashboardHeader from "@/components/dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "@/components/empty-state";
import { handleToastResponse, handleToastPromise } from "@/lib/toast-response";
import useSWR from "swr";

const studentFetcher = (studentId: string, isKoor: boolean) =>
  isKoor
    ? LogbookService.getDetailMahasiswaKoor(Number(studentId)).then(
        (res) => res
      )
    : LogbookService.getDetailMahasiswaDosen(Number(studentId)).then(
        (res) => res
      );

const logbookFetcher = (studentId: string, isKoor: boolean) =>
  isKoor
    ? LogbookService.getLogbookMahasiswaByIdKoor(Number(studentId)).then(
        (res) => res
      )
    : LogbookService.getLogbookMahasiswaById(Number(studentId)).then(
        (res) => res
      );

export default function LogbookDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isKoor = searchParams.get("isKoor") === "true";

  const {
    data: studentResponse,
    isLoading: studentLoading,
    mutate: mutateStudent,
  } = useSWR(`student-detail-${params.id}-${isKoor ? "koor" : "dosen"}`, () =>
    studentFetcher(params.id, isKoor)
  );

  const {
    data: logbookResponse,
    error: logbookError,
    isLoading: logbookLoading,
    mutate: mutateLogbook,
  } = useSWR(`logbook-entries-${params.id}-${isKoor ? "koor" : "dosen"}`, () =>
    logbookFetcher(params.id, isKoor)
  );

  const student = studentResponse?.success ? studentResponse.data : null;
  const logbookEntries =
    logbookResponse?.success && logbookResponse.data
      ? logbookResponse.data
      : [];

  const handleStatusChange = async (
    logbookId: number,
    status: "pending" | "accepted" | "revised"
  ) => {
    try {
      const updatePromise = isKoor
        ? LogbookService.updateStatusLogbookKoor(logbookId, { status })
        : LogbookService.updateStatusLogbook(logbookId, { status });

      const statusText = status === "accepted" ? "menerima" : "merevisi";

      await handleToastPromise(
        updatePromise,
        {
          loading: `Sedang ${statusText} logbook...`,
          success: `Berhasil ${statusText} logbook`,
          error: `Gagal ${statusText} logbook`,
        },
        (response) => {
          if (response.success) {
            mutateLogbook();
            mutateStudent();
          }
        },
        (error) => {
          console.error("Error updating logbook status:", error);
        }
      );
    } catch (error) {
      console.error("Error updating logbook status:", error);
      handleToastResponse({
        success: false,
        message: "Gagal mengupdate status logbook. Silakan coba lagi.",
      });
    }
  };

  const handleBackNavigation = () => {
    router.back();
  };

  if (studentLoading || logbookLoading) {
    return (
      <div>
        <DashboardHeader
          breadcrumbItems={[
            { name: "Dashboard", url: "/tugas-akhir" },
            { name: "Logbook Mahasiswa", url: "/tugas-akhir/logbook" },
          ]}
        />

        <div className="container">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-10 w-48" />
          </div>

          {/* Student Header Skeleton */}
          <Card className="shadow-none">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-24" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Skeleton */}
          <div className="mt-8">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative">
                  <div className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-20 w-full rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div>
        <DashboardHeader
          breadcrumbItems={[
            { name: "Dashboard", url: "/tugas-akhir" },
            {
              name: isKoor ? "Logbook Koordinator" : "Logbook Mahasiswa",
              url: isKoor
                ? "/tugas-akhir/logbook/koordinator"
                : "/tugas-akhir/logbook",
            },
          ]}
        />

        <div className="container">
          <Button
            variant="ghost"
            className="pl-0 flex items-center gap-2 hover:bg-transparent hover:text-primary mb-4"
            onClick={handleBackNavigation}
          >
            <ArrowLeft className="h-4 w-4" />
            {isKoor
              ? "Kembali ke Logbook Koordinator"
              : "Kembali ke Daftar Mahasiswa"}
          </Button>

          <EmptyState
            icon={AlertCircle}
            title="Mahasiswa Tidak Ditemukan"
            subtitle="Data mahasiswa yang Anda cari tidak tersedia."
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/tugas-akhir" },
          {
            name: isKoor ? "Logbook Koordinator" : "Logbook Mahasiswa",
            url: isKoor
              ? "/tugas-akhir/logbook/koordinator"
              : "/tugas-akhir/logbook",
          },
        ]}
      />

      <div className="container">
        <Button
          variant="ghost"
          className="mb-4 pl-0 flex items-center gap-2 hover:bg-transparent hover:text-primary"
          onClick={handleBackNavigation}
        >
          <ArrowLeft className="h-4 w-4" />
          {isKoor ? "Kembali ke Daftar Logbook" : "Kembali ke Daftar Mahasiswa"}
        </Button>

        <StudentHeader data={student} role={isKoor ? "koordinator" : "dosen"} />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Riwayat Bimbingan</h2>
          </div>

          {logbookError ? (
            <EmptyState
              icon={AlertCircle}
              title="Gagal Memuat Data Logbook"
              subtitle="Terjadi kesalahan saat mengambil data logbook. Silakan coba lagi."
              button={
                <Button onClick={() => mutateLogbook()} variant="outline">
                  Coba Lagi
                </Button>
              }
            />
          ) : (
            <LogbookTimeline
              entries={logbookEntries}
              onStatusChange={handleStatusChange}
              onUpdate={() => {
                mutateLogbook();
                mutateStudent();
              }}
              role={isKoor ? "koordinator" : "dosen"}
            />
          )}
        </div>
      </div>
    </div>
  );
}
