import { useState } from "react";
import {
  CalendarClock,
  Loader2,
  FileText,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate, getInitials } from "@/lib/utils";
import type { SidangTA1, SidangTA2 } from "@/data/tugas-akhir/sidang";
import { SubmissionCard } from "./submission-card";
import { ConfirmationModal } from "@/components/confirmation-modal";
import {
  MonitoringSidang1Service,
  MonitoringSidang2Service,
} from "@/api/tugas-akhir";
import { toast } from "sonner";
import { mutate } from "swr";
import { useSearchParams, useRouter } from "next/navigation";
import { handleToastResponse } from "@/lib/toast-response";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SubmissionListProps {
  submissions: SidangTA1[] | SidangTA2[];
  isKoor?: boolean;
  role?: string;
  isLoading?: boolean;
  page: number;
  limit: number;
  type: string;
  isSidangTA2?: boolean;
  viewMode?: "card" | "table";
}

export function SubmissionList({
  submissions,
  isKoor = false,
  role = "dosen",
  isLoading = false,
  page,
  limit,
  type,
  isSidangTA2 = false,
  viewMode = "card",
}: SubmissionListProps) {
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [docSubmission, setDocSubmission] = useState<any>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const canUpdateStatus = role === "koordinator" || isKoor;

  const handleAccept = async () => {
    if (!selectedSubmission) return;

    try {
      const submissionId = isSidangTA2
        ? selectedSubmission.sidang_ta2_id
        : selectedSubmission.sidang_ta1_id;
      const service = isSidangTA2
        ? MonitoringSidang2Service
        : MonitoringSidang1Service;

      const response = await service.update(submissionId, {
        status: "accepted",
      });
      setIsAcceptModalOpen(false);
      setSelectedSubmission(null);
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
    } catch (error: any) {
      console.error("Failed to accept submission:", error);
      if (error.response?.data) {
        handleToastResponse(error.response.data);
      } else {
        toast.error("Gagal menerima pengajuan");
      }
    }
  };

  const handleReject = async () => {
    if (!selectedSubmission || !rejectionReason.trim()) {
      toast.error("Alasan revisi harus diisi");
      return;
    }

    try {
      const submissionId = isSidangTA2
        ? selectedSubmission.sidang_ta2_id
        : selectedSubmission.sidang_ta1_id;
      const service = isSidangTA2
        ? MonitoringSidang2Service
        : MonitoringSidang1Service;

      const response = await service.update(submissionId, {
        status: "revised",
        alasan: rejectionReason,
      });
      setIsRejectModalOpen(false);
      setSelectedSubmission(null);
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
    } catch (error: any) {
      console.error("Failed to reject submission:", error);
      if (error.response?.data) {
        handleToastResponse(error.response.data);
      } else {
        toast.error("Gagal menolak pengajuan");
      }
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      id: "nomor",
      header: "No",
      cell: ({ row }) => {
        return (
          <div className="font-medium text-center w-8">
            {(page - 1) * limit + row.index + 1}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Mahasiswa",
      cell: ({ row }) => {
        const submission = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage alt={submission.name} />
              <AvatarFallback>{getInitials(submission.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold capitalize truncate max-w-[150px]">
                  {submission.name.toLowerCase()}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {submission.nim}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "nama_dosen",
      header: "Pembimbing",
      cell: ({ row }) => {
        return (
          <span className="text-sm">
            {row.original.nama_dosen ?? (
              <span className="text-muted-foreground italic">-</span>
            )}
          </span>
        );
      },
    },
    {
      accessorKey: "judul",
      header: "Judul",
      cell: ({ row }) => {
        const judul = row.original.judul;
        return (
          <div className="max-w-[300px]">
            <p className="font-medium line-clamp-2">{judul}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "jalur",
      header: "Jalur",
      cell: ({ row }) => {
        const jalur = row.original.jalur;
        return (
          <Badge variant={jalur === "publikasi" ? "primary" : "secondary"}>
            {jalur}
          </Badge>
        );
      },
    },
    {
      accessorKey: "documents",
      header: "Dokumen",
      cell: ({ row }) => {
        const submission = row.original;
        return (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setDocSubmission(submission)}
          >
            <FileText className="h-3.5 w-3.5" />
            Lihat Dokumen
          </Button>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        switch (status) {
          case "pending":
            return <Badge variant="secondary">Pending</Badge>;
          case "accepted":
            return <Badge variant="success">Diterima</Badge>;
          case "revised":
            return <Badge variant="destructiveOutline">Revisi</Badge>;
          default:
            return <Badge variant="outline">{status}</Badge>;
        }
      },
    },
    {
      accessorKey: "gelombang",
      header: "Gelombang",
      cell: ({ row }) => {
        const gelombang = row.original.gelombang_nama;
        if (!gelombang) {
          return (
            <span className="text-sm text-muted-foreground italic">—</span>
          );
        }
        return <span className="text-sm">{gelombang}</span>;
      },
    },
    {
      accessorKey: "tanggal_pengajuan_sidang",
      header: "Tgl Pengajuan",
      cell: ({ row }) => {
        const tanggal = formatDate(row.original.tanggal_pengajuan_sidang);
        return <span className="text-sm">{tanggal}</span>;
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const submission = row.original;

        if (canUpdateStatus && submission.status === "pending") {
          return (
            <div className="flex gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="successOutline"
                      className="h-8 w-8"
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setIsAcceptModalOpen(true);
                      }}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Terima Pengajuan</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="destructiveOutline"
                      className="h-8 w-8"
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setIsRejectModalOpen(true);
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Revisi Pengajuan</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        }

        if (canUpdateStatus && submission.status === "accepted") {
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => {
                      const submissionId = isSidangTA2
                        ? submission.sidang_ta2_id
                        : submission.sidang_ta1_id;
                      router.push(
                        `?sub=plot-jadwal&gelombang_id=${submission.gelombang_id}&sidang_id=${submissionId}`,
                      );
                    }}
                  >
                    <CalendarClock className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Plot Jadwal</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }

        return <span className="text-sm text-muted-foreground">—</span>;
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 border rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-medium">Tidak ada data</h3>
          <p className="text-muted-foreground">
            Tidak ada pengajuan sidang yang sesuai dengan filter yang dipilih.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {viewMode === "table" ? (
        <DataTable columns={columns} data={submissions} loading={false} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {submissions.map((submission, index) => (
            <SubmissionCard
              key={index}
              submission={submission}
              isKoor={isKoor}
              role={role}
              page={page}
              limit={limit}
              type={type}
              isSidangTA2={isSidangTA2}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ConfirmationModal
        open={isAcceptModalOpen}
        setOpen={setIsAcceptModalOpen}
        onConfirm={handleAccept}
        type="accept"
        title="Konfirmasi Penerimaan"
        description={`Apakah Anda yakin ingin menerima pengajuan sidang dari ${selectedSubmission?.name}?`}
      />

      <ConfirmationModal
        open={isRejectModalOpen}
        setOpen={setIsRejectModalOpen}
        onConfirm={handleReject}
        type="reject"
        title="Alasan Penolakan"
        description={`Berikan alasan mengapa pengajuan sidang dari ${selectedSubmission?.name} direvisi.`}
        reason={rejectionReason}
        setReason={setRejectionReason}
        placeholder="Masukkan revisi pengajuan sidang..."
      />

      {/* Document Dialog */}
      <Dialog
        open={!!docSubmission}
        onOpenChange={(open) => !open && setDocSubmission(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dokumen Mahasiswa</DialogTitle>
          </DialogHeader>
          {docSubmission && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">
                {docSubmission.name} — {docSubmission.nim}
              </p>
              <div className="flex flex-col gap-2">
                {docSubmission.link_dokumen && (
                  <a
                    href={docSubmission.link_dokumen}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Dokumen TA</span>
                    <ExternalLink className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
                  </a>
                )}
                {docSubmission.link_persetujuan && (
                  <a
                    href={docSubmission.link_persetujuan}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {isSidangTA2 ? "Persetujuan TA 2" : "Persetujuan TA 1"}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
                  </a>
                )}
                {!isSidangTA2 && docSubmission.link_persetujuan_jurnal && (
                  <a
                    href={docSubmission.link_persetujuan_jurnal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      Persetujuan Jurnal
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
                  </a>
                )}
                {isSidangTA2 && docSubmission.link_bba && (
                  <a
                    href={docSubmission.link_bba}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">BBA</span>
                    <ExternalLink className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
                  </a>
                )}
                {isSidangTA2 && docSubmission.link_skbp && (
                  <a
                    href={docSubmission.link_skbp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">SKBP</span>
                    <ExternalLink className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
                  </a>
                )}
                {isSidangTA2 && docSubmission.link_turnitin && (
                  <a
                    href={docSubmission.link_turnitin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Turnitin</span>
                    <ExternalLink className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
                  </a>
                )}
                {isSidangTA2 && docSubmission.url_jurnal && (
                  <a
                    href={docSubmission.url_jurnal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Jurnal</span>
                    <ExternalLink className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
