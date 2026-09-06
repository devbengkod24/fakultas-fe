"use client";

import { Calendar, Clock, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface GelombangData {
  id: number;
  nama_gelombang: string;
  tipe: "ta1" | "ta2";
  tgl_awal: string;
  tgl_akhir: string;
  status: number;
  periode?: {
    id: number;
    kode_periode?: number;
    tahun_ajaran?: string;
  } | null;
}

interface GelombangAktifCardProps {
  gelombang: GelombangData | null;
  tipe: "ta1" | "ta2";
  isLoading?: boolean;
}

const GelombangAktifCard = ({
  gelombang,
  tipe,
  isLoading,
}: GelombangAktifCardProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">
              Gelombang Sidang Aktif
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-5 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!gelombang) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">
              Gelombang Sidang Aktif
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Tidak ada gelombang sidang {tipe.toUpperCase()} yang aktif saat ini.
          </p>
        </CardContent>
      </Card>
    );
  }

  const isWithinPeriod = () => {
    const now = new Date();
    const start = new Date(gelombang.tgl_awal);
    const end = new Date(gelombang.tgl_akhir);
    return now >= start && now <= end;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">
              Gelombang Sidang Aktif
            </CardTitle>
          </div>
          {isWithinPeriod() && (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Sedang Berlangsung
            </Badge>
          )}
        </div>
        <CardDescription>
          Informasi gelombang pendaftaran sidang {tipe.toUpperCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">{gelombang.nama_gelombang}</p>
            {gelombang.periode?.tahun_ajaran && (
              <p className="text-sm text-muted-foreground">
                {gelombang.periode.tahun_ajaran}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatDate(gelombang.tgl_awal)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatDate(gelombang.tgl_akhir)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GelombangAktifCard;
