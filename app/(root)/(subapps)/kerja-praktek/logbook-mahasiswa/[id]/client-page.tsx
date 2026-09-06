"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import useSWR from "swr";
import { useProfile } from "@/context/profileUseContext";
import { Role } from "@/types/role";
import { toast } from "sonner";
import { LogbookHeaderMhs } from "../../_components/logbook-mahasiswa/header-mhs";
import DashboardHeader from "@/components/dashboard-header";
import { LogbookService } from "@/api/kerja-praktek";
import { KPLogbookTimeline } from "@/components/shared-ta-kp/logbook/kp-logbook-timeline";
import { handleToastResponse } from "@/lib/toast-response";
import withAuth from "@/app/(root)/hoc/withAuth";

function LogbookDetailSkeleton() {
  return (
    <div className="container">
      <div className="mb-4">
        <Skeleton className="h-10 w-48" />
      </div>

      {/* Header skeleton */}
      <Card className="shadow-none">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-24 w-24 rounded-full" />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-32" />
                  <Skeleton className="h-9 w-28" />
                  <Skeleton className="h-9 w-36" />
                </div>
              </div>

              <Skeleton className="h-6 w-24" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline skeleton */}
      <div className="mt-8">
        <Skeleton className="h-7 w-48 mb-6" />
        <div className="space-y-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="relative">
              <div className="flex gap-4">
                <Skeleton className="size-10 rounded-full flex-shrink-0" />
                <Card className="flex-1">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const LogbookDetailClientPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { profile } = useProfile();
  const role: Role = profile?.roles as Role;

  // Pilih fetcher sesuai role
  const fetcher = (id: number) => {
    if (role === "dosen") {
      return LogbookService.getLogbookByIdDosen(Number(id)).then((res) => res);
    }
    // Default: koordinator
    return LogbookService.getLogbookByIdKoor(Number(id)).then((res) => res);
  };

  const { data, error, isLoading, mutate } = useSWR(
    [`logbook-${id}`, Number(id), role],
    () => fetcher(Number(id))
  );

  // Pilih handler sesuai role
  const handleAcceptLogbook = async (logbookId: number) => {
    try {
      let response;
      if (role === "dosen") {
        response = await LogbookService.acceptLogbookDosen(logbookId);
      } else {
        response = await LogbookService.acceptLogbookKoor(logbookId);
      }

      if (response.success) {
        handleToastResponse(response);
        mutate();
      } else {
        handleToastResponse(response);
        console.error("Gagal menerima logbook:", response.message);
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem", {
        description: "Tidak dapat menghubungi server. Silakan coba lagi.",
        duration: 4000,
      });
      console.error("Failed to accept logbook", err);
    }
  };

  if (isLoading) {
    return (
      <div>
        <DashboardHeader
          breadcrumbItems={[
            { name: "Dashboard", url: "/kerja-praktek" },
            {
              name: "Logbook Mahasiswa",
              url: "/kerja-praktek/logbook-mahasiswa",
            },
          ]}
        />
        <LogbookDetailSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Mahasiswa tidak ditemukan</p>
        </div>
      </div>
    );
  }

  const student = {
    mahasiswa_id: data.data.mahasiswa.id,
    name: data.data.mahasiswa.name,
    nim: data.data.mahasiswa.nim,
    dosen_name: data.data.dosen_pembimbing.name,
    totalLogbooks: data.data.logbook.total_bimbingan,
    bab_terakhir: data.data.logbook.bab_terakhir,
    progress: data.data.logbook.progress,
  };

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/kerja-praktek" },
          {
            name: "Logbook Mahasiswa",
            url: "/kerja-praktek/logbook-mahasiswa",
          },
        ]}
      />

      <div className="container">
        <Button
          variant="ghost"
          className="mb-4 pl-0 flex items-center gap-2 hover:bg-transparent hover:text-primary"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Mahasiswa
        </Button>

        <LogbookHeaderMhs data={student} />

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-6">Riwayat Bimbingan</h2>
          <KPLogbookTimeline
            logbooksByBab={data.data.logbooks_by_bab ?? []}
            onAccept={handleAcceptLogbook}
            userRole={role}
          />
        </div>
      </div>
    </div>
  );
}

export default withAuth(LogbookDetailClientPage, "kerja-praktek", ["koordinator", "dosen", "super_fakultas"]);