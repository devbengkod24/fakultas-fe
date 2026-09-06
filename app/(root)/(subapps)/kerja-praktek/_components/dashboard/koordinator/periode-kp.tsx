"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Waves } from "lucide-react";
import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import { PeriodeService } from "@/api/kerja-praktek";

const PeriodeKP = () => {
  const { data: response, isLoading } = useSWR(
    "current-periode-kp",
    () => PeriodeService.getAllPeriode()
  );

  // Normalize response shapes. API may return { data: [...], meta: { success: true } }
  // or directly an array. Prefer `response.data` when present.
  const periodData = response?.data ?? (Array.isArray(response) ? response : []);
  const currentPeriode = Array.isArray(periodData)
    ? periodData.find((p: any) => Number(p.status) === 1) || null
    : null;

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-none">
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-none">
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Periode Aktif</p>
              <p className="text-lg font-semibold">
                {currentPeriode?.tahun_ajaran || "Tidak ada periode aktif"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PeriodeKP;
