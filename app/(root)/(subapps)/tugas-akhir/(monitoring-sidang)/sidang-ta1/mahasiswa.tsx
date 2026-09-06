"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  AlertCircle,
  FileText,
  BookOpen,
  RefreshCw,
  Edit,
  Eye,
  Calendar,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/empty-state";
import { MonitoringSidang1Service } from "@/api/tugas-akhir";
import SidangTa1Draft from "../../_components/monitoring-sidang/sidang-ta1-draft";
import SidangTa1Form from "../../_components/monitoring-sidang/sidang-ta1-form";
import HasilSidangMahasiswaCard from "../../_components/monitoring-sidang/hasil-sidang-mahasiswa-card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

const SidangTa1Mahasiswa = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch status validation
  const {
    data: statusData,
    isLoading: statusLoading,
    error: statusError,
  } = useSWR([`sidang-ta1-status`, refreshKey], () =>
    MonitoringSidang1Service.checkStatusSidang(),
  );

  // Fetch jumlah bimbingan
  const { data: bimbinganData, isLoading: bimbinganLoading } = useSWR(
    "sidang-ta1-bimbingan",
    () => MonitoringSidang1Service.getJumlahBimbingan(),
  );

  // Fetch draft if validation is true
  const {
    data: draftData,
    isLoading: draftLoading,
    mutate: mutateDraft,
  } = useSWR(
    statusData?.success && statusData.data.validation
      ? "sidang-ta1-draft"
      : null,
    () => MonitoringSidang1Service.getDraftSidang(),
  );

  // Fetch gelombang aktif
  const { data: gelombangData, isLoading: gelombangLoading } = useSWR(
    "sidang-ta1-gelombang-aktif",
    () => MonitoringSidang1Service.getGelombangAktif("ta1"),
  );

  // Fetch hasil sidang (only if draft exists and status is accepted)
  const { data: hasilData, isLoading: hasilLoading } = useSWR(
    draftData?.success && draftData.data?.status === "accepted"
      ? "sidang-ta1-hasil"
      : null,
    () => MonitoringSidang1Service.getHasilSidang(),
  );

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    mutateDraft();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (statusLoading || bimbinganLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-40" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (statusError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Gagal Memuat Data"
        subtitle="Terjadi kesalahan saat mengambil data status sidang. Silakan coba lagi."
      />
    );
  }

  const statusInfo = statusData?.success ? statusData.data : null;
  const jumlahBimbingan = bimbinganData?.success ? bimbinganData.data : 0;
  const draftInfo = draftData?.success ? draftData.data : null;

  const gelombangInfo = gelombangData?.success
    ? Array.isArray(gelombangData.data)
      ? (gelombangData.data[0] ?? null)
      : (gelombangData.data ?? null)
    : null;
  const hasilInfo = hasilData?.success ? hasilData.data : null;

  return (
    <div className="space-y-4">
      {/* Compact Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Gelombang Aktif Compact */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium">
              Gelombang Sidang Aktif
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {gelombangLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : gelombangInfo ? (
              <div className="flex flex-col">
                <div className="text-lg font-semibold truncate">
                  {gelombangInfo.nama_gelombang}
                </div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(gelombangInfo.tgl_awal)} -{" "}
                  {formatDate(gelombangInfo.tgl_akhir)}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic">
                Tidak ada gelombang aktif
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium">
              Jumlah Bimbingan
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{jumlahBimbingan}</div>
            <p className="text-[10px] text-muted-foreground">
              Bimbingan yang telah diterima
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium">
              Status Persyaratan
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-semibold ${
                statusInfo?.validation ? "text-green-700" : "text-red-700"
              }`}
            >
              {statusInfo?.validation ? "Memenuhi" : "Belum Memenuhi"}
            </div>
            <p className="text-[10px] text-muted-foreground">
              Untuk mengajukan sidang TA1
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content & Results */}
      <div className="grid gap-6">
        {/* Results/Schedule Card - Priority display when available */}
        {(hasilInfo || draftInfo?.tgl_sidang || hasilLoading) && (
          <HasilSidangMahasiswaCard
            hasil={hasilInfo || (draftInfo?.tgl_sidang ? draftInfo : null)}
            tipe="ta1"
            isLoading={hasilLoading}
          />
        )}

        {!statusInfo?.validation ? (
          <EmptyState
            icon={AlertCircle}
            title="Belum Dapat Mengajukan Sidang TA1"
            subtitle={
              statusInfo?.message ||
              "Syarat belum terpenuhi untuk mengajukan sidang TA1"
            }
            className="h-[calc(100vh-350px)] flex items-center justify-center"
          />
        ) : (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex flex-col gap-1">
                  {draftInfo ? "Draft" : "Formulir"} Pengajuan Sidang TA1
                  <CardDescription className="font-normal text-xs text-muted-foreground">
                    {draftInfo
                      ? "Lihat atau edit draft pengajuan sidang TA1 Anda"
                      : "Isi formulir untuk mengajukan sidang TA1"}
                  </CardDescription>
                </div>
                {draftInfo && (
                  <div className="flex gap-2">
                    {(draftInfo.status === "revised" ||
                      draftInfo.status === "pending") && (
                      <Button variant="outline" size="sm" onClick={handleEdit}>
                        <Edit className="size-4 mr-2" />
                        Edit
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={handleRefresh}>
                      <RefreshCw className="size-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              {draftLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-40 w-full" />
                </div>
              ) : draftInfo ? (
                isEditing ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Edit Pengajuan Sidang TA1
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(false)}
                      >
                        <Eye className="size-4 mr-2" />
                        Lihat Draft
                      </Button>
                    </div>
                    <SidangTa1Form
                      existingData={draftInfo}
                      onSuccess={() => {
                        setIsEditing(false);
                        handleRefresh();
                      }}
                    />
                  </div>
                ) : (
                  <SidangTa1Draft data={draftInfo} onRefresh={handleRefresh} />
                )
              ) : !gelombangInfo ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                  <p className="font-medium text-sm">
                    Belum Ada Gelombang Sidang Aktif
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pengajuan sidang TA1 hanya dapat dilakukan saat gelombang
                    sidang sedang berlangsung.
                  </p>
                </div>
              ) : (
                <SidangTa1Form onSuccess={handleRefresh} />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SidangTa1Mahasiswa;
