"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useSWR from "swr";
import { DosenService } from "@/api/tugas-akhir";

interface QuotaCardProps {
  dosenId: string;
}

export function KuotaCard({ dosenId }: QuotaCardProps) {
  const {
    data: response,
    error,
    isLoading,
  } = useSWR(`dosen-${dosenId}`, () => DosenService.getById(Number(dosenId)));

  const dosen = response?.success
    ? {
        quota: response.data.kuota,
        currentStudents: response.data.kuota - Number(response.data.sisa_kuota),
      }
    : null;

  if (error) {
    console.error("Error fetching dosen data:", error);
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Kuota Bimbingan</CardTitle>
        <CardDescription>Jumlah mahasiswa bimbingan saat ini</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-[calc(100%-88px)]">
        {isLoading ? (
          <>
            <div className="h-12 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-36 mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
          </>
        ) : dosen ? (
          <>
            <div className="text-5xl font-semibold mb-2">
              {dosen.currentStudents} / {dosen.quota}
            </div>
            <p className="text-muted-foreground mb-4">Mahasiswa Bimbingan</p>
            <Badge
              variant={
                dosen.currentStudents >= dosen.quota
                  ? "destructiveOutline"
                  : "success"
              }
              className="text-sm"
            >
              {dosen.currentStudents >= dosen.quota
                ? "Kuota Penuh"
                : `${dosen.quota - dosen.currentStudents} Kuota Tersisa`}
            </Badge>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
