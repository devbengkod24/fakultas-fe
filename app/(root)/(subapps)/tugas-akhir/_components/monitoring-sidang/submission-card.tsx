/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { FileText, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidangTA1, SidangTA2 } from "@/data/tugas-akhir/sidang";
import { formatDate, getInitials } from "@/lib/utils";
import { ConfirmationModal } from "@/components/confirmation-modal";
import {
  MonitoringSidang1Service,
  MonitoringSidang2Service,
} from "@/api/tugas-akhir";
import { toast } from "sonner";
import { mutate } from "swr";
import { useSearchParams, useRouter } from "next/navigation";
import { handleToastResponse } from "@/lib/toast-response";
import { CalendarClock } from "lucide-react";

interface SubmissionCardProps {
  submission: SidangTA1 | SidangTA2;
  isKoor?: boolean;
  role?: string;
  page: number;
  limit: number;
  type: string;
  isSidangTA2?: boolean;
}

export function SubmissionCard({
  submission,
  isKoor = false,
  role = "dosen",
  page,
  limit,
  type,
  isSidangTA2 = false,
}: SubmissionCardProps) {
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant={"secondary"}>Pending</Badge>;
      case "accepted":
        return <Badge variant={"success"}>Diterima</Badge>;
      case "revised":
        return <Badge variant={"destructiveOutline"}>Revisi</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getJournalStatusBadge = (status_jurnal: string) => {
    switch (status_jurnal) {
      case "draft":
        return <Badge variant={"secondary"}>Draft</Badge>;
      case "submit":
        return <Badge variant={"primary"}>Submit</Badge>;
      case "publish":
        return <Badge variant={"success"}>Publish</Badge>;
      default:
        return null;
    }
  };

  const canUpdateStatus = role === "koordinator" || isKoor;

  const handleAccept = async () => {
    try {
      const submissionId = isSidangTA2
        ? (submission as SidangTA2).sidang_ta2_id
        : (submission as SidangTA1).sidang_ta1_id;
      const service = isSidangTA2
        ? MonitoringSidang2Service
        : MonitoringSidang1Service;

      const response = await service.update(submissionId, {
        status: "accepted",
      });
      setIsAcceptModalOpen(false);
      handleToastResponse(response);

      const cacheKey = isSidangTA2 ? "sidang-ta2" : "sidang-ta1";
      const cacheKeySuffix = role === "dosen" ? "-dosen" : "";

      mutate([
        `${cacheKey}${cacheKeySuffix}`,
        type,
        page,
        limit,
        search,
        status,
      ]);
      mutate([`${cacheKey}${cacheKeySuffix}`, "", page, limit, search, status]);
      mutate([`${cacheKey}${cacheKeySuffix}`, type, 1, limit, search, status]);
      mutate([`${cacheKey}${cacheKeySuffix}`, "", 1, limit, search, status]);
    } catch (error: any) {
      console.error("Failed to accept submission:", error);
      if (error.response?.data) {
        handleToastResponse(error.response.data);
      } else {
        toast.error("Gagal menerima pengajuan", {
          description: "Silakan coba lagi.",
        });
      }
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Alasan revisi harus diisi");
      return;
    }
    try {
      const submissionId = isSidangTA2
        ? (submission as SidangTA2).sidang_ta2_id
        : (submission as SidangTA1).sidang_ta1_id;
      const service = isSidangTA2
        ? MonitoringSidang2Service
        : MonitoringSidang1Service;

      const response = await service.update(submissionId, {
        status: "revised",
        alasan: rejectionReason,
      });
      setIsRejectModalOpen(false);
      setRejectionReason("");
      handleToastResponse(response);

      const cacheKey = isSidangTA2 ? "sidang-ta2" : "sidang-ta1";
      const cacheKeySuffix = role === "dosen" ? "-dosen" : "";

      mutate([
        `${cacheKey}${cacheKeySuffix}`,
        type,
        page,
        limit,
        search,
        status,
      ]);
      mutate([`${cacheKey}${cacheKeySuffix}`, "", page, limit, search, status]);
      mutate([`${cacheKey}${cacheKeySuffix}`, type, 1, limit, search, status]);
      mutate([`${cacheKey}${cacheKeySuffix}`, "", 1, limit, search, status]);
    } catch (error: any) {
      console.error("Failed to reject submission:", error);
      if (error.response?.data) {
        handleToastResponse(error.response.data);
      } else {
        toast.error("Gagal menolak pengajuan", {
          description: "Silakan coba lagi.",
        });
      }
    }
  };

  // Document links for TA2
  const renderTA2Documents = () => {
    if (!isSidangTA2) return null;

    const ta2Submission = submission as SidangTA2;
    const documents = [
      { link: ta2Submission.link_bba, label: "BBA" },
      { link: ta2Submission.link_skbp, label: "SKBP" },
      { link: ta2Submission.link_turnitin, label: "Turnitin" },
      { link: ta2Submission.link_saj, label: "SAJ" },
      { link: ta2Submission.url_jurnal, label: "Jurnal" },
      { link: ta2Submission.link_loa, label: "LOA" },
      { link: ta2Submission.link_bpk, label: "BPK" },
      { link: ta2Submission.link_pakta, label: "Pakta" },
    ];

    return documents
      .filter((doc) => doc.link) // Only show documents that have links
      .map((doc, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1" asChild>
                <a
                  href={doc.link || "/"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span className="text-xs">{doc.label}</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Lihat {doc.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ));
  };

  return (
    <>
      <Card className="overflow-hidden shadow-none">
        <CardHeader className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarImage alt={submission.name} />
                <AvatarFallback>{getInitials(submission.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold capitalize line-clamp-1">
                    {submission.name.toLowerCase()}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-muted-foreground">
                      {submission.nim}
                    </p>
                    <span className="text-[10px] text-muted-foreground opacity-30">
                      |
                    </span>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      Pembimbing: {submission.nama_dosen}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {getStatusBadge(submission.status)}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            <div>
              <div className="flex gap-1 items-center mb-2">
                {submission.jalur === "publikasi" ? (
                  <Badge variant={"default"} className="capitalize w-fit">
                    {submission.jalur}
                  </Badge>
                ) : (
                  <Badge
                    variant={"secondary-foreground"}
                    className="capitalize w-fit"
                  >
                    {submission.jalur}
                  </Badge>
                )}
                {!isSidangTA2 &&
                  submission.jalur === "publikasi" &&
                  (submission as SidangTA1).status_jurnal && (
                    <>
                      {getJournalStatusBadge(
                        (submission as SidangTA1).status_jurnal || "",
                      )}
                    </>
                  )}
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                Judul Tugas Akhir
              </div>
              <p className="text-base line-clamp-2">{submission.judul}</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(submission.tanggal_pengajuan_sidang)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1"
                      asChild
                    >
                      <a
                        href={submission.link_dokumen}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span className="text-xs">Dokumen TA</span>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Lihat dokumen tugas akhir</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1"
                      asChild
                    >
                      <a
                        href={submission.link_persetujuan}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span className="text-xs">
                          {isSidangTA2
                            ? "Persetujuan TA 2"
                            : "Persetujuan TA 1"}
                        </span>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Lihat lembar persetujuan sidang</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Render TA2 specific documents */}
              {renderTA2Documents()}

              {/* TA1 specific documents */}
              {!isSidangTA2 &&
                submission.jalur === "publikasi" &&
                (submission as SidangTA1).link_persetujuan_jurnal && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1"
                          asChild
                        >
                          <a
                            href={
                              (submission as SidangTA1).link_persetujuan_jurnal!
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span className="text-xs">Persetujuan Jurnal</span>
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Lihat lembar persetujuan submit jurnal</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
            </div>

            {submission.status === "revised" && submission.alasan_revisi && (
              <div className="flex gap-2 p-2 bg-red-50 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-red-700">
                    Alasan Revisi:
                  </span>
                  <span className="text-xs text-red-600 whitespace-pre-line">
                    {submission.alasan_revisi}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        {canUpdateStatus && submission.status === "pending" && (
          <CardFooter className="p-4 pt-0 flex justify-end gap-2">
            <Button
              variant="destructiveOutline"
              size="sm"
              className="gap-1"
              onClick={() => setIsRejectModalOpen(true)}
            >
              <XCircle className="h-4 w-4" />
              Revisi
            </Button>
            <Button
              variant="successOutline"
              size="sm"
              className="gap-1"
              onClick={() => setIsAcceptModalOpen(true)}
            >
              <CheckCircle className="h-4 w-4" />
              Terima
            </Button>
          </CardFooter>
        )}

        {canUpdateStatus && submission.status === "accepted" && (
          <CardFooter className="p-4 pt-0 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                const submissionId = isSidangTA2
                  ? (submission as SidangTA2).sidang_ta2_id
                  : (submission as SidangTA1).sidang_ta1_id;
                router.push(
                  `?sub=plot-jadwal&gelombang_id=${submission.gelombang_id}&sidang_id=${submissionId}`,
                );
              }}
            >
              <CalendarClock className="h-4 w-4" />
              Plot Jadwal
            </Button>
          </CardFooter>
        )}

        {!canUpdateStatus &&
          role === "dosen" &&
          submission.status === "accepted" && (
            <CardFooter className="p-4 pt-0 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => router.push(`?sub=plot-jadwal`)}
              >
                <CalendarClock className="h-4 w-4" />
                Lihat Jadwal Sidang
              </Button>
            </CardFooter>
          )}
      </Card>

      <ConfirmationModal
        open={isAcceptModalOpen}
        setOpen={setIsAcceptModalOpen}
        onConfirm={handleAccept}
        type="accept"
        title="Konfirmasi Penerimaan"
        description={`Apakah Anda yakin ingin menerima pengajuan sidang dari ${submission.name}?`}
      />

      <ConfirmationModal
        open={isRejectModalOpen}
        setOpen={setIsRejectModalOpen}
        onConfirm={handleReject}
        type="reject"
        title="Alasan Penolakan"
        description={`Berikan alasan mengapa pengajuan sidang dari ${submission.name} direvisi.`}
        reason={rejectionReason}
        setReason={setRejectionReason}
        placeholder="Masukkan revisi pengajuan sidang..."
      />
    </>
  );
}
