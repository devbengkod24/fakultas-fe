"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  User,
  FileText,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  History,
  Plus,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import EmptyState from "@/components/empty-state";
import { formatDateFull, formatDateTime, getInitials } from "@/lib/utils";
import { PengajuanMahasiswaService } from "@/api/tugas-akhir";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StatusData {
  tugas_akhir_id: number;
  jalur: string;
  topik: string;
  judul: string;
  bidang_kajian: string;
  minat: string[];
  deskripsi: string;
  status: string;
  nama_dosen: string;
  email: string;
  npp: string;
  tanggal_pengajuan: string;
}

interface HistoryItem {
  ta_id: number;
  name: string;
  email: string;
  npp: string;
  alasan: string | null;
  status: string;
  jalur: string | null;
  topik: string | null;
  judul: string | null;
  created_at: string;
  updated_at: string;
}

interface StatusPengajuanProps {
  statusData: StatusData | null;
  loading?: boolean;
  error?: string | null;
  onCreatePengajuan?: () => void;
  mutateStatus?: () => void;
}

const historyFetcher = () =>
  PengajuanMahasiswaService.getHistoryPengajuan().then((res) => res);

export default function StatusPengajuan({
  statusData,
  loading = false,
  error = null,
  onCreatePengajuan,
  mutateStatus,
}: StatusPengajuanProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const {
    data: historyResponse,
    error: historyError,
    isLoading: historyLoading,
    mutate: mutateHistory,
  } = useSWR("history-pengajuan", historyFetcher, {
    dedupingInterval: 1000,
    shouldRetryOnError: false,
    errorRetryCount: 0,
  });

  const historyData =
    historyResponse?.success && historyResponse.data
      ? historyResponse.data
      : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="whitespace-nowrap">
            <Clock className="size-3 mr-1" />
            Menunggu Review
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="success">
            <CheckCircle className="size-3 mr-1" />
            Diterima
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructiveOutline">
            <XCircle className="size-3 mr-1" />
            Ditolak
          </Badge>
        );
      case "canceled":
        return (
          <Badge variant="outline" className="whitespace-nowrap bg-muted text-muted-foreground">
            <XCircle className="size-3 mr-1" />
            Dibatalkan Mahasiswa
          </Badge>
        );
      default:
        return <Badge variant="outline" className="whitespace-nowrap">{status}</Badge>;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        mutateHistory(),
        mutateStatus ? mutateStatus() : Promise.resolve(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCancelPengajuan = async () => {
    if (!statusData?.tugas_akhir_id) return;
    
    setIsCanceling(true);
    try {
      const response = await PengajuanMahasiswaService.cancelPengajuan(statusData.tugas_akhir_id);
      if (response.success) {
        toast.success("Pengajuan berhasil dibatalkan");
        setIsCancelModalOpen(false);
        if (mutateStatus) mutateStatus();
        mutateHistory();
      } else {
        toast.error(response.message || "Gagal membatalkan pengajuan");
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal membatalkan pengajuan");
    } finally {
      setIsCanceling(false);
    }
  };

  const isPlotting = statusData
    ? statusData.status === "accepted" && !statusData.jalur
    : false;

  if (!statusData && !loading) {
    return (
      <div className="space-y-6">
        <EmptyState
          title="Tidak Ada Data Pengajuan"
          subtitle="Anda belum mengajukan tugas akhir, silahkan melakukan pengajuan terlebih dahulu."
          icon={FileText}
          button={
            <Button variant={"outline"} onClick={onCreatePengajuan} size={"sm"}>
              <Plus className="size-4" />
              Buat Pengajuan
            </Button>
          }
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Current Status Skeleton */}
        <Card className="shadow-none h-fit">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-6 mt-4">
            {/* Dosen Pembimbing Skeleton */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Card className="shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detail Tugas Akhir Skeleton */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-28" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History Section Skeleton */}
        <div>
          <CardHeader className="pb-0 px-0 pt-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>

          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border p-4">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-3/4 mb-2" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Gagal memuat data"
        subtitle="Terjadi kesalahan saat mengambil data pengajuan."
        button={
          <Button variant="outline" onClick={() => window.location.reload()}>
            Coba Lagi
          </Button>
        }
      />
    );
  }

  return (
    <div
      className={`grid grid-cols-1 ${
        !isPlotting ? "xl:grid-cols-2" : ""
      } gap-6`}
    >
      {/* Current Status */}
      <Card className="shadow-none h-fit">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-4" />
                {isPlotting
                  ? "Status Plotting Dosen"
                  : "Status Pengajuan Terakhir"}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                {isPlotting ? (
                  "Anda telah diplotting oleh koordinator"
                ) : (
                  <>
                    Diajukan pada:{" "}
                    {formatDateFull(statusData?.tanggal_pengajuan ?? "")}
                  </>
                )}
              </div>
            </div>
            {isPlotting ? (
              <Badge variant="success">
                <CheckCircle className="size-3 mr-1" />
                Diplotting
              </Badge>
            ) : (
              <div className="flex items-center gap-2 shrink-0 ml-4">
                {getStatusBadge(statusData?.status ?? "")}
              </div>
            )}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-6">
          {/* Alert for plotting */}
          {isPlotting && (
            <Alert variant={"success"} className="mt-4">
              <AlertTitle>Informasi Plotting Dosen</AlertTitle>
              <AlertDescription>
                Anda telah diplotting ke dosen pembimbing oleh koordinator.
                Silahkan lengkapi data tugas akhir Anda untuk melanjutkan proses
                bimbingan.
              </AlertDescription>
            </Alert>
          )}

          {/* Dosen Pembimbing */}
          <div className="mt-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Dosen Pembimbing
            </h3>
            <Card className="shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="border">
                      {getInitials(statusData?.nama_dosen || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{statusData?.nama_dosen}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {statusData?.email}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detail Tugas Akhir - Only show if not plotting or data exists */}
          {(!isPlotting || statusData?.jalur) && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Detail Tugas Akhir
              </h3>

              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Jalur
                  </label>
                  <div className="text-sm">{statusData?.jalur || "-"}</div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Judul
                  </label>
                  <p className="text-sm font-medium break-all">
                    {statusData?.judul || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    Topik
                  </label>
                  <p className="text-sm break-all">{statusData?.topik || "-"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Deskripsi
                  </label>
                  <p className="text-sm leading-relaxed break-all">
                    {statusData?.deskripsi || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    Bidang Kajian
                  </label>
                  <Badge variant="secondary">
                    {statusData?.bidang_kajian || "-"}
                  </Badge>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    Minat/Keahlian
                  </label>
                  <div className="mt-1">
                    {!statusData?.minat ||
                    statusData.minat.filter((minat) => minat.trim() !== "")
                      .length === 0 ? (
                      <span className="text-sm text-muted-foreground">
                        Tidak ada
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {statusData.minat
                          .filter((minat) => minat.trim() !== "")
                          .map((minat, index) => (
                            <Badge key={index} variant="primary">
                              {minat}
                            </Badge>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {statusData?.status === "pending" && !isPlotting && (
                  <div className="flex justify-end pt-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setIsCancelModalOpen(true)}
                    >
                      <XCircle className="size-4 mr-2" />
                      Batalkan Pengajuan
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Call to action for plotting */}
          {isPlotting && !statusData?.jalur && (
            <div className="pt-4 border-t">
              <Button onClick={onCreatePengajuan} className="w-full">
                <FileText className="size-4 mr-2" />
                Lengkapi Data Tugas Akhir
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan Pengajuan?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin membatalkan pengajuan ke dosen pembimbing ini?
              Anda dapat mengajukan lagi ke dosen pembimbing lain setelah ini dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCanceling}>Tidak, Kembali</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                handleCancelPengajuan();
              }}
              disabled={isCanceling}
            >
              {isCanceling ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Membatalkan...
                </>
              ) : (
                "Ya, Batalkan"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* History Section - Only show if not plotting */}
      {!isPlotting && (
        <div>
          <div className="flex items-center justify-between">
            <CardHeader className="pb-0 px-0 pt-2">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Riwayat Pengajuan
              </CardTitle>
              <CardDescription>
                Riwayat semua pengajuan tugas akhir yang pernah Anda buat
              </CardDescription>
            </CardHeader>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Merefresh.." : "Refresh"}
            </Button>
          </div>

          <div className="mt-4">
            {historyLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <div className="flex justify-between pt-2 border-t">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : historyError ? (
              <EmptyState
                icon={AlertCircle}
                title="Gagal Memuat Riwayat"
                subtitle={historyError?.message || "Terjadi kesalahan"}
              />
            ) : historyData.length === 0 ? (
              <EmptyState
                icon={History}
                title="Tidak Ada Riwayat Pengajuan"
                subtitle="Anda belum pernah mengajukan tugas akhir."
              />
            ) : (
              <div className="space-y-4">
                {historyData.map((item: HistoryItem) => (
                  <div key={item.ta_id} className="rounded-lg border p-4 w-full overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                      {/* Status badge */}
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}
                      </div>

                      {/* Optional: timestamp, ID, etc. */}
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(item.created_at)}
                      </span>
                    </div>

                    {/* Judul */}
                    {item.judul && (
                      <h3 className="text-base font-medium text-foreground mb-1 break-all">
                        {item.judul}
                      </h3>
                    )}

                    {/* Detail info */}
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <User className="size-4" />
                        <span>{item.name}</span>
                      </p>

                      {item.jalur && (
                        <p className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            Jalur:
                          </span>
                          {item.jalur}
                        </p>
                      )}

                      {item.topik && (
                        <p className="break-all">
                          <span className="font-medium text-foreground">
                            Topik:
                          </span>{" "}
                          {item.topik}
                        </p>
                      )}
                    </div>

                    {/* Alasan Penolakan */}
                    {item.alasan && (
                      <div className="mt-3">
                        <Alert
                          variant="destructive"
                          className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle className="text-sm">
                            Alasan Penolakan
                          </AlertTitle>
                          <AlertDescription className="text-sm break-all">
                            {item.alasan}
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
