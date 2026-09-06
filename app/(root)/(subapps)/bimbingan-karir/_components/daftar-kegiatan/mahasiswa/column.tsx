"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Activity } from "@/types/bimbingan-karir/mahasiswa/activity";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquareText, MoreHorizontal, ScanQrCode, UserCheck, FilePen, ClockIcon, FileCheck, XCircle, FileSearch } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export const Columns = (
  currentPage: number,
  perPage: number,
  now: Date,
  onScanClick: (id: number) => void,
  onFeedbackClick: (id: number, name: string) => void,
  onIzinClick: (id: number) => void
): ColumnDef<Activity>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div>{number}</div>;
      },
    },
    {
      accessorKey: "nama_kegiatan",
      header: "Nama Kegiatan",
      cell: ({ row }) => {
        return <div className="font-medium">{row.original.nama_kegiatan}</div>;
      },
    },
    {
      accessorKey: "kategori",
      header: "Kategori",
      cell: ({ row }) => {
        return <div className="capitalize">{row.original.kategori}</div>;
      },
    },
    {
      id: "tanggal",
      header: "Tanggal",
      cell: ({ row }) => {
        const startDate = new Date(row.original.tanggal_mulai);
        const endDate = new Date(row.original.tanggal_selesai);
        const formatDate = (date: Date) =>
          new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(date);
        
        return (
          <div className="text-sm">
            {formatDate(startDate)} - {formatDate(endDate)}
          </div>
        );
      },
    },
    {
      accessorKey: "lokasi",
      header: "Lokasi",
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const today = new Date(now.toDateString());
        const startDate = new Date(row.original.tanggal_mulai.toDateString());
        const endDate = new Date(row.original.tanggal_selesai.toDateString());

        const isCompleted = endDate < today;
        const isOngoing = startDate <= today && endDate >= today;

        let status = "Akan Berlangsung";
        let badgeVariant: "primary" | "success" | "secondary" = "primary";
        if (isOngoing) {
          status = "Sedang Berlangsung";
          badgeVariant = "secondary";
        } else if (isCompleted) {
          status = "Selesai";
          badgeVariant = "success";
        }

        return <Badge variant={badgeVariant}>{status}</Badge>;
      },
    },
    {
      id: "presensi",
      header: "Presensi",
      cell: ({ row }) => {
        return (
          <Badge
            variant={row.original.is_presensi ? "success" : "destructiveOutline"}
          >
            {row.original.is_presensi ? "Sudah" : "Belum"}
          </Badge>
        );
      },
    },
    {
      id: "action",
      header: "Aksi",
      cell: ({ row }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const router = useRouter();
        const today = new Date(now.toDateString());
        const startDate = new Date(row.original.tanggal_mulai.toDateString());
        const endDate = new Date(row.original.tanggal_selesai.toDateString());
        const isOngoing = startDate <= today && endDate >= today;
        
        const statusIzin = row.original.status_izin;
        const isFeedbackDisabled = row.original.is_feedback === true || row.original.is_presensi === false || statusIzin === "menunggu" || statusIzin === "disetujui";
        const isScanDisabled = !isOngoing || row.original.is_presensi === true || statusIzin === "menunggu";
        const isIzinDisabled = statusIzin === "menunggu" || statusIzin === "disetujui" || statusIzin === "ditolak" || (row.original.batas_waktu_izin ? new Date(row.original.batas_waktu_izin) < today : false) || row.original.is_presensi === true;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/bimbingan-karir/daftar-kegiatan/${row.original.id}`)}
              >
                <FileSearch className="h-4 w-4 mr-2" />
                Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onIzinClick(row.original.id)}
                disabled={isIzinDisabled}
              >
                {statusIzin === "menunggu" ? (
                  <>
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Menunggu
                  </>
                ) : statusIzin === "disetujui" ? (
                  <>
                    <FileCheck className="h-4 w-4 mr-2" />
                    Disetujui
                  </>
                ) : statusIzin === "ditolak" ? (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Ditolak
                  </>
                ) : (
                  <>
                    <FilePen className="h-4 w-4 mr-2" />
                    Izin
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onFeedbackClick(row.original.id, row.original.nama_kegiatan)}
                disabled={isFeedbackDisabled}
              >
                <MessageSquareText className="h-4 w-4 mr-2" />
                Feedback
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onScanClick(row.original.id)}
                disabled={isScanDisabled}
              >
                {row.original.is_presensi ? (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Sudah Presensi
                  </>
                ) : (
                  <>
                    <ScanQrCode className="h-4 w-4 mr-2" />
                    Scan
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};