"use client";

import { Award, Calendar, Clock, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";

interface HasilSidangData {
  sidang_id: number;
  tgl_sidang: string | null;
  jam_sidang: string | null;
  gelombang: {
    id: number;
    nama_gelombang: string;
    tgl_awal: string;
    tgl_akhir: string;
  } | null;
  penguji: { id: number; nama: string } | null;
  penguji_2: { id: number; nama: string } | null;
  penguji_3: { id: number; nama: string } | null;
  lokasi: string | null;
  nilai: {
    nilai_pembimbing: number;
    nilai_penguji_1: number;
    nilai_penguji_2: number | null;
    nilai_penguji_3: number | null;
    nilai_akhir: number;
    status: "lulus" | "tidak_lulus";
  } | null;
}

interface HasilSidangMahasiswaCardProps {
  hasil: HasilSidangData | null;
  tipe: "ta1" | "ta2";
  isLoading?: boolean;
}

const HasilSidangMahasiswaCard = ({
  hasil,
  tipe,
  isLoading,
}: HasilSidangMahasiswaCardProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">
              Hasil Sidang {tipe.toUpperCase()}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasil) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">
              Hasil Sidang {tipe.toUpperCase()}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Hasil sidang {tipe.toUpperCase()} belum tersedia. Pastikan pengajuan
            sidang Anda sudah diterima dan jadwal sidang sudah ditentukan.
          </p>
        </CardContent>
      </Card>
    );
  }

  // If no nilai yet, show that sidang is scheduled but not graded
  if (!hasil.nilai) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">
              Informasi Jadwal Sidang {tipe.toUpperCase()}
            </CardTitle>
          </div>
          <CardDescription>Sidang telah dijadwalkan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              {hasil.tgl_sidang && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {formatDate(hasil.tgl_sidang)}
                    {hasil.jam_sidang && ` pukul ${hasil.jam_sidang}`}
                  </span>
                </div>
              )}

              {hasil.lokasi && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Lokasi: <span className="font-semibold">{hasil.lokasi}</span></span>
                </div>
              )}

              {hasil.gelombang && (
                <div className="text-sm text-muted-foreground">
                  Gelombang: {hasil.gelombang.nama_gelombang}
                </div>
              )}
            </div>

            {(hasil.penguji || hasil.penguji_2 || hasil.penguji_3) && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Tim Penguji:</p>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  {hasil.penguji && (
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span>1. {hasil.penguji.nama} (Ketua)</span>
                    </div>
                  )}
                  {hasil.penguji_2 && (
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span>2. {hasil.penguji_2.nama}</span>
                    </div>
                  )}
                  {hasil.penguji_3 && (
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span>3. {hasil.penguji_3.nama}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <Badge variant="secondary" className="px-3 py-1">
              Menunggu
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">
              Hasil Sidang {tipe.toUpperCase()}
            </CardTitle>
          </div>
          <Badge
            variant={hasil.nilai.status === "lulus" ? "success" : "destructive"}
            className="px-4"
          >
            {hasil.nilai.status === "lulus" ? "Lulus" : "Tidak Lulus"}
          </Badge>
        </div>
        <CardDescription>
          Hasil penilaian sidang {tipe.toUpperCase()} Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Schedule info info */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          {hasil.tgl_sidang && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {formatDate(hasil.tgl_sidang)}
                {hasil.jam_sidang && ` pukul ${hasil.jam_sidang}`}
              </span>
            </div>
          )}
          {hasil.lokasi && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Lokasi: <span className="font-semibold">{hasil.lokasi}</span></span>
            </div>
          )}
        </div>

        <Separator />

        {/* Final grade */}
        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-primary">Nilai Akhir</span>
          </div>
          <span className="text-3xl font-bold text-primary">
            {hasil.nilai.nilai_akhir}
          </span>
        </div>

        {/* Penguji info */}
        {(hasil.penguji || hasil.penguji_2 || hasil.penguji_3) && (
          <>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm font-medium">Tim Penguji:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {hasil.penguji && (
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    <span>1. {hasil.penguji.nama} (Ketua)</span>
                  </div>
                )}
                {hasil.penguji_2 && (
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    <span>2. {hasil.penguji_2.nama}</span>
                  </div>
                )}
                {hasil.penguji_3 && (
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    <span>3. {hasil.penguji_3.nama}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HasilSidangMahasiswaCard;
