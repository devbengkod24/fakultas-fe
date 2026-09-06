"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Eye, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import SidangTa1Form from "./sidang-ta1-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DraftData {
  id: number;
  jalur: "reguler" | "publikasi";
  judul: string;
  bidang_kajian: string;
  jumlah_bimbingan: number;
  jumlah_bab: number;
  link_dokumen: string;
  link_persetujuan: string;
  link_persetujuan_jurnal?: string;
  status_jurnal?: "draft" | "submit" | "publish";
  status: "pending" | "accepted" | "revised";
  alasan_revisi?: string;
  tanggal_pengajuan_sidang_ta1: string;
}

interface SidangTa1DraftProps {
  data: DraftData;
  onRefresh: () => void;
}

const SidangTa1Draft = ({ data, onRefresh }: SidangTa1DraftProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Menunggu Review</Badge>;
      case "accepted":
        return <Badge variant="success">Diterima</Badge>;
      case "revised":
        return <Badge variant="destructiveOutline">Perlu Revisi</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getJalurBadge = (jalur: string) => {
    return (
      <Badge variant="outline" className="capitalize">
        {jalur}
      </Badge>
    );
  };

  const getStatusJurnalBadge = (status?: string) => {
    if (!status) return null;

    const variants = {
      draft: "secondary",
      submit: "default",
      publish: "default",
    } as const;

    return (
      <Badge
        variant={variants[status as keyof typeof variants] || "secondary"}
        className="capitalize"
      >
        {status}
      </Badge>
    );
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Pengajuan Sidang TA1</h3>
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
          existingData={data}
          onSuccess={() => {
            setIsEditing(false);
            onRefresh();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-2">
        {/* Basic Information */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Informasi Umum</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Jalur
                </label>
                <div className="mt-1">{getJalurBadge(data.jalur)}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status Pengajuan
                </label>
                <div className="mt-1">{getStatusBadge(data.status)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Bidang Kajian
                </label>
                <p className="mt-1">{data.bidang_kajian}</p>
              </div>

              {data.jalur === "publikasi" && data.status_jurnal ? (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status Jurnal
                  </label>
                  <div className="mt-1">
                    {getStatusJurnalBadge(data.status_jurnal)}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tanggal Pengajuan
                  </label>
                  <p className="mt-1">
                    {formatDate(data.tanggal_pengajuan_sidang_ta1)}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {data.jalur === "publikasi" && data.status_jurnal && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tanggal Pengajuan
                  </label>
                  <p className="mt-1">
                    {formatDate(data.tanggal_pengajuan_sidang_ta1)}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Jumlah Bimbingan
                </label>
                <p className="mt-1 font-semibold">{data.jumlah_bimbingan}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Jumlah Bab
                </label>
                <p className="mt-1 font-semibold">{data.jumlah_bab}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Judul Tugas Akhir</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{data.judul}</p>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dokumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dokumen Tugas Akhir</p>
                  <p className="text-sm text-muted-foreground">
                    File utama tugas akhir
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={data.link_dokumen}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-4" />
                    Lihat
                  </a>
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Surat Persetujuan Pembimbing</p>
                  <p className="text-sm text-muted-foreground">
                    Dokumen persetujuan dari dosen pembimbing
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={data.link_persetujuan}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-4" />
                    Lihat
                  </a>
                </Button>
              </div>

              {data.jalur === "publikasi" && data.link_persetujuan_jurnal && (
                <>
                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Surat Persetujuan Jurnal</p>
                      <p className="text-sm text-muted-foreground">
                        Dokumen persetujuan submit jurnal dari dosen pembimbing
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={data.link_persetujuan_jurnal}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="size-4" />
                        Lihat
                      </a>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Revision Reason */}
          {data.status === "revised" && data.alasan_revisi && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Pengajuan Perlu Revisi</AlertTitle>
              <AlertDescription>{data.alasan_revisi}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidangTa1Draft;
