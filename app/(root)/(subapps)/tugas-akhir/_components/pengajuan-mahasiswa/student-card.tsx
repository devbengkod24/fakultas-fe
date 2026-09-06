/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  FileText,
  NotebookPen,
  User,
  GraduationCap,
  Lightbulb,
  SquareMousePointer,
  Calendar,
  XCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import dayjs from "dayjs";

interface StudentCardProps {
  student: any;
  isKoor?: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export function StudentCard({
  student,
  onAccept,
  onReject,
  isKoor,
}: StudentCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "accepted":
        return <Badge variant="success">Diterima</Badge>;
      case "rejected":
        return <Badge variant="destructiveOutline">Ditolak</Badge>;
      case "canceled":
        return <Badge variant="outline" className="bg-muted text-muted-foreground">Dibatalkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderStatusAlert = () => {
    if (student.pengajuan?.status === "accepted") {
      return (
        <Alert variant="success">
          <CheckCircle className="h-4 w-4 !text-green-600" />
          <AlertTitle>Pengajuan Diterima</AlertTitle>
          <AlertDescription>Pengajuan mahasiswa diterima.</AlertDescription>
        </Alert>
      );
    }

    if (student.pengajuan?.status === "rejected") {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Pengajuan Ditolak</AlertTitle>
          <AlertDescription className="break-all">
            {student.pengajuan?.alasan || "Pengajuan mahasiswa ini ditolak."}
          </AlertDescription>
        </Alert>
      );
    }

    if (student.pengajuan?.status === "canceled") {
      return (
        <Alert variant="default" className="bg-muted border-muted-foreground/20">
          <XCircle className="h-4 w-4 text-muted-foreground" />
          <AlertTitle className="text-muted-foreground">Pengajuan Dibatalkan</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Mahasiswa membatalkan pengajuan ini.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  return (
    <Card className="overflow-hidden shadow-none">
      <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr]">
        {/* Student Profile Section */}
        <div className="border-r">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Data Mahasiswa
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage className="object-cover" src={student.foto} />
                  <AvatarFallback className="text-xl">
                    {student.name
                      ?.split(" ")
                      .map((word: string) => word[0])
                      .join("") || "N/A"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <h3 className="text-lg font-semibold text-center capitalize">
                {student.name?.toLowerCase() || "N/A"}
              </h3>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="w-16 justify-center">
                    NIM
                  </Badge>
                  <span>{student.nim || "N/A"}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="w-16 justify-center">
                    Email
                  </Badge>
                  <span className="truncate">{student.email || "N/A"}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="w-16 justify-center">
                    No HP
                  </Badge>
                  <span>{student.no_telp || "N/A"}</span>
                </div>

                {isKoor && (
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="w-16 justify-center">
                      Dosen
                    </Badge>
                    <span className="truncate">
                      {student.dosen_name || "N/A"}
                    </span>
                  </div>
                )}

                {student.transkrip && (
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <a
                        href={student.transkrip}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Lihat Transkrip
                      </a>
                    </Button>
                  </div>
                )}
              </div>

              {/* Status display */}
              {student.pengajuan?.status !== "pending" ? (
                <div className="mt-4">{renderStatusAlert()}</div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button variant="successOutline" size="sm" onClick={onAccept}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Terima
                  </Button>
                  <Button
                    variant="destructiveOutline"
                    size="sm"
                    onClick={onReject}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Tolak
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </div>

        {/* Submission Data Section */}
        <div>
          <CardHeader className="bg-muted/50">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Data Pengajuan
              </CardTitle>
              <div className="flex gap-2">
                <Badge
                  variant={
                    student.pengajuan?.jalur === "Publikasi"
                      ? "default"
                      : "secondary-foreground"
                  }
                  className="capitalize"
                >
                  {student.pengajuan?.jalur || "N/A"}
                </Badge>
                {getStatusBadge(student.pengajuan?.status || "pending")}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <NotebookPen className="h-4 w-4" />
                  Judul Tugas Akhir
                </div>
                <p className="text-lg font-medium break-all">
                  {student.pengajuan?.judul || "N/A"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Lightbulb className="h-4 w-4" />
                    Topik
                  </div>
                  <p className="break-all">{student.pengajuan?.topik || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    Bidang Kajian
                  </div>
                  <p>
                    {{
                      SC: "Sistem Cerdas (SC)",
                      RPLD: "Rekayasa Perangkat Lunak dan Data (RPLD)",
                      SK3D: "Network Administrator (SK3D)",
                    }[
                      student.pengajuan?.bidang_kajian as "SC" | "RPLD" | "SK3D"
                    ] ||
                      student.pengajuan?.bidang_kajian ||
                      "N/A"}
                  </p>
                </div>
              </div>

              {student.pengajuan?.deskripsi && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    Deskripsi
                  </div>
                  <p className="text-sm break-all">{student.pengajuan.deskripsi}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.pengajuan?.minat && (
                  <div className="space-y-2 w-full">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <SquareMousePointer className="h-4 w-4" />
                      Minat
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(student.pengajuan.minat) ? (
                        student.pengajuan.minat.map(
                          (item: string, index: number) => (
                            <Badge key={index} variant="primary">
                              {item}
                            </Badge>
                          )
                        )
                      ) : (
                        <Badge variant="primary">
                          {student.pengajuan.minat}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                <div className="space-y-2 w-full">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Tanggal Pengajuan
                  </div>
                  <p>
                    {student.pengajuan?.tanggal
                      ? dayjs(student.pengajuan.tanggal).format(
                          "dddd, D MMMM YYYY"
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
