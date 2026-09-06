"use client";

import {
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  FileText,
  AlertCircle,
  CalendarDays,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmptyState from "@/components/empty-state";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface MahasiswaProfileDetail {
  nim?: string;
  name?: string;
  email?: string;
  ipk?: number | string | null;
  telepon?: string | null;
  foto?: string | null;
  judul_ta?: string | null;
  jalur_ta?: string | null;
  bidang_kajian_ta?: string | null;
  dosen_name?: string | null;
  kode_periode?: string | number | null;
  jml_bimbingan?: number | null;
  bab_terakhir?: number | null;
  status_tugas_akhir?: string | null; // "1" | "2"
}

export interface LogbookEntry {
  id?: number;
  bab?: number | string;
  catatan?: string | null;
  deskripsi?: string | null;
  status?: string | null;
  tanggal?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface MahasiswaProfileViewProps {
  detail: MahasiswaProfileDetail | null;
  logbooks: LogbookEntry[];
  loading: boolean;
  error: boolean;
  // label progress: "TA" (default) atau "KP"
  context?: "ta" | "kp";
}

function statusBadge(status?: string | null) {
  switch (status) {
    case "accepted":
      return <Badge variant="success">Diterima</Badge>;
    case "pending":
      return <Badge variant="yellow">Menunggu</Badge>;
    case "rejected":
      return <Badge variant="destructiveOutline">Ditolak</Badge>;
    default:
      return null;
  }
}

export function MahasiswaProfileView({
  detail,
  logbooks,
  loading,
  error,
  context = "ta",
}: MahasiswaProfileViewProps) {
  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Gagal memuat profil"
        subtitle="Terjadi kesalahan saat mengambil data mahasiswa."
      />
    );
  }

  if (loading || !detail) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  const babTerakhir = Number(detail.bab_terakhir ?? 0);
  const progress = Math.min(100, (babTerakhir / 5) * 100);
  const tahap =
    detail.status_tugas_akhir === "2" ? `${context.toUpperCase()} 2` : `${context.toUpperCase()} 1`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-none">
        <CardContent className="flex items-center gap-4 py-5">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={detail.foto || ""}
              alt={detail.name}
              className="object-cover"
            />
            <AvatarFallback className="text-lg">
              {detail.name?.charAt(0).toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold capitalize">
              {detail.name?.toLowerCase() ?? "-"}
            </h2>
            <span className="text-sm text-muted-foreground">{detail.nim}</span>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
              {detail.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {detail.email}
                </span>
              )}
              {detail.telepon && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  {detail.telepon}
                </span>
              )}
            </div>
          </div>
          <div className="ml-auto">
            <Badge variant="primary">{tahap}</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Info TA */}
        <Card className="shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="size-4" />
              Informasi {context.toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-sm">
            <InfoRow label="Judul" value={detail.judul_ta || "-"} />
            <InfoRow
              label="Jalur"
              value={
                <span className="capitalize">{detail.jalur_ta || "-"}</span>
              }
            />
            <InfoRow label="Bidang Kajian" value={detail.bidang_kajian_ta || "-"} />
            <InfoRow
              label="Dosen Pembimbing"
              value={detail.dosen_name || "Belum Ada Dosen"}
            />
            <InfoRow label="IPK" value={detail.ipk ?? "-"} />
            <InfoRow label="Periode" value={detail.kode_periode ?? "-"} />
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="size-4" />
              Progress Bimbingan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-muted-foreground">
                  Bab Terakhir: {babTerakhir}/5
                </span>
                <span className="font-medium">{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <InfoRow
              label="Total Bimbingan"
              value={`${detail.jml_bimbingan ?? 0} kali`}
            />
          </CardContent>
        </Card>
      </div>

      {/* Logbook timeline */}
      <Card className="shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="size-4" />
            Riwayat Logbook
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logbooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm gap-2">
              <FileText className="size-7 opacity-40" />
              <span>Belum ada logbook</span>
            </div>
          ) : (
            <div className="space-y-3">
              {logbooks.map((lb, i) => (
                <div
                  key={lb.id ?? i}
                  className="flex gap-3 rounded-lg border p-3"
                >
                  <Badge variant="outline" className="h-fit shrink-0">
                    Bab {lb.bab ?? "-"}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      {lb.catatan || lb.deskripsi || "-"}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {lb.tanggal || lb.updated_at || lb.created_at || "-"}
                      </span>
                      {statusBadge(lb.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
