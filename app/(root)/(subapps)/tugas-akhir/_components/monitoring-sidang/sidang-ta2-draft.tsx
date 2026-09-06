"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Eye, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import SidangTa2Form from "./sidang-ta2-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DraftData {
  id: number;
  jalur: string;
  judul: string;
  bidang_kajian: string;
  jumlah_bimbingan: number;
  jumlah_bab: number;
  link_persetujuan: string;
  link_bba: string;
  link_skbp: string;
  link_saj?: string;
  link_dokumen?: string;
  link_file_jurnal?: string;
  url_jurnal?: string;
  link_loa?: string;
  link_bpk?: string;
  link_turnitin?: string;
  status: "pending" | "accepted" | "revised";
  alasan_revisi?: string;
  tanggal_pengajuan_sidang_ta2: string;
}

interface SidangTa2DraftProps {
  data: DraftData;
  onRefresh: () => void;
}

const SidangTa2Draft = ({ data, onRefresh }: SidangTa2DraftProps) => {
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

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Pengajuan Sidang TA2</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(false)}
          >
            <Eye className="size-4 mr-2" />
            Lihat Draft
          </Button>
        </div>
        <SidangTa2Form
          existingData={data}
          onSuccess={() => {
            setIsEditing(false);
            onRefresh();
          }}
        />
      </div>
    );
  }

  const documents = [
    { label: "Surat Persetujuan Pembimbing", link: data.link_persetujuan },
    { label: "Bukti Bebas Administrasi", link: data.link_bba },
    { label: "Surat Keterangan Bebas Pustaka (SKBP)", link: data.link_skbp },
    ...(data.jalur === "reguler"
      ? [
          { label: "Dokumen Tugas Akhir", link: data.link_dokumen },
          { label: "Laporan Turnitin", link: data.link_turnitin },
        ]
      : [
          { label: "Bukti Sertifikat Akreditasi Jurnal", link: data.link_saj },
          { label: "File Jurnal", link: data.link_file_jurnal },
          { label: "Letter of Acceptance (LOA)", link: data.link_loa },
          { label: "Bukti Penulis Korespondensi", link: data.link_bpk },
        ]),
  ].filter((doc) => doc.link);

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

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Tanggal Pengajuan
                </label>
                <p className="mt-1">
                  {formatDate(data.tanggal_pengajuan_sidang_ta2)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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

            {data.jalur === "publikasi" && data.url_jurnal && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  URL Jurnal
                </label>
                <div className="mt-1">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={data.url_jurnal}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="size-4 mr-2" />
                      Lihat Jurnal
                    </a>
                  </Button>
                </div>
              </div>
            )}
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
              {documents.map((doc, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{doc.label}</p>
                      <p className="text-sm text-muted-foreground">
                        Dokumen {doc.label.toLowerCase()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={doc.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="size-4" />
                        Lihat
                      </a>
                    </Button>
                  </div>
                  {index < documents.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
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

export default SidangTa2Draft;
