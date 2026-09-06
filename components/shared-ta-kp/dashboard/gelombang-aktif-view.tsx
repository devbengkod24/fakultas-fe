"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Waves, AlertCircle, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface GelombangAktifItem {
  id: number;
  tipe: string;
  nama_gelombang: string;
  tgl_awal: string;
  tgl_akhir: string;
  prodi?: { nama: string } | null;
}

interface GelombangAktifViewProps {
  gelombangAktif: GelombangAktifItem[];
  loading: boolean;
  error: boolean;
  showProdi?: boolean;
  emptyBehavior?: "hide" | "show";
}

function getColorScheme(tipe: string | undefined | null) {
  const isPrimary = !tipe || tipe === "ta1" || tipe === "kp";
  return {
    border: isPrimary ? "border-l-blue-500" : "border-l-orange-500",
    bg: isPrimary ? "bg-blue-100" : "bg-orange-100",
    text: isPrimary ? "text-blue-600" : "text-orange-600",
    badge: isPrimary
      ? "bg-blue-50 text-blue-700"
      : "bg-orange-50 text-orange-700",
  };
}

export function GelombangAktifView({
  gelombangAktif,
  loading,
  error,
  showProdi = false,
  emptyBehavior = "show",
}: GelombangAktifViewProps) {
  if (error) {
    return (
      <Card className="overflow-hidden border-l-4 border-l-red-500 shadow-none">
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="size-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Gelombang Aktif
              </p>
              <p className="text-xs text-red-600">Gagal memuat data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-none">
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Waves className="size-4 text-blue-600" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!gelombangAktif || gelombangAktif.length === 0) {
    if (emptyBehavior === "hide") return null;
    return (
      <Card className="overflow-hidden border-l-4 border-l-gray-400 shadow-none">
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Waves className="size-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Gelombang Aktif
              </p>
              <p className="text-sm italic text-gray-500">
                Tidak ada gelombang aktif
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-none">
      <CardContent className="p-3">
        <CardTitle className="mb-2 text-sm font-medium">
          Gelombang Aktif
        </CardTitle>
        <div className="divide-y">
          {gelombangAktif.map((gel, index) => {
            const colors = getColorScheme(gel.tipe);
            return (
              <div
                key={gel.id}
                className={`flex items-center space-x-3 border-l-4 pl-3 ${colors.border} ${
                  index > 0 ? "mt-2 pt-2" : ""
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colors.bg}`}
                >
                  <Waves className={`size-4 ${colors.text}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      {showProdi && gel.prodi?.nama
                        ? `[${gel.prodi.nama}] — `
                        : ""}
                      {gel.nama_gelombang}
                    </p>
                    <span
                      className={`text-[10px] ${colors.badge} rounded-full px-1.5 py-0.5 font-bold`}
                    >
                      {gel.tipe?.toUpperCase() || "KP"}
                    </span>
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Calendar className="size-3" />
                    {formatDate(gel.tgl_awal)} - {formatDate(gel.tgl_akhir)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
