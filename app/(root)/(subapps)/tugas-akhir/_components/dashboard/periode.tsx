import { DashboardService } from "@/api/tugas-akhir";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, AlertCircleIcon } from "lucide-react";
import React from "react";
import useSWR from "swr";

const Periode = () => {
  const {
    data: response,
    isLoading,
    error,
  } = useSWR("current-periode", () => DashboardService.getCurrentPeriode());

  const currentPeriode = response?.success ? response.data : null;

  if (error) {
    return (
      <Card className="overflow-hidden border-l-4 border-l-red-500 shadow-none">
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertCircleIcon className="size-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Periode Aktif</p>
              <p className="text-sm text-red-600">Gagal memuat data periode</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-none">
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <CalendarIcon className="size-4 text-blue-600" />
            </div>
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
    <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-none">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <CalendarIcon className="size-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Periode Aktif</p>
              <p className="text-lg font-semibold">
                {currentPeriode?.tahun_ajaran || "Tidak ada periode aktif"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Periode;
