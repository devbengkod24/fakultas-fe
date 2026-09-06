/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import {
  AlertCircle,
  RefreshCcw,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import EmptyState from "@/components/empty-state";
import { PengajuanMahasiswaService } from "@/api/tugas-akhir";
import { handleToastResponse } from "@/lib/toast-response";
import { StatusTabs } from "./status-tabs";
import { FilterBar } from "./filter-bar";
import { StudentCard } from "./student-card";
import { ConfirmationModal } from "@/components/confirmation-modal";
import PaginationControls from "@/components/pagination-control";
import { useState } from "react";
import { StudentCardSkeleton } from "./student-card-skeleton";
import dayjs from "dayjs";

type Status = "pending" | "accepted" | "rejected" | "canceled";

const fetcher = (
  isKoor: boolean,
  type: string,
  page: number,
  limit: number,
  search: string,
  status: string,
  jalur: string,
  bidang_kajian: string,
  sort_order: string,
) => {
  const apiMethod = isKoor
    ? PengajuanMahasiswaService.koorGetAll
    : PengajuanMahasiswaService.dosenGetAll;

  return apiMethod(
    type,
    page,
    limit,
    search,
    status,
    jalur,
    bidang_kajian,
    sort_order,
  ).then((res) => res);
};

type StudentSubmissionTableProps = {
  isKoor: boolean;
};

export function StudentSubmissionTable({
  isKoor,
}: StudentSubmissionTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL params - all filters are controlled by search params
  const type = searchParams.get("type") || "";
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const status = searchParams.get("status") ?? "";
  const jalur = searchParams.get("jalur") || "";
  const bidang_kajian = searchParams.get("bidang_kajian") || "";
  const sort_order = searchParams.get("sort_order") || "desc";

  // Convert URL params to component state format
  const statusFilter: Status | "all" = (status as Status) || "all";
  const pathFilter = jalur || "all";
  const fieldFilter = bidang_kajian || "all";
  const sortOrder = (sort_order as "asc" | "desc") || "desc";

  // Modal states
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  // Fetch data with all current filters
  const {
    data: response,
    error,
    isLoading,
  } = useSWR(
    [
      isKoor ? "pengajuan-mahasiswa-koor" : "pengajuan-mahasiswa-dosen",
      type,
      page,
      limit,
      search,
      status,
      jalur,
      bidang_kajian,
      sort_order,
    ],
    () =>
      fetcher(
        isKoor,
        type,
        page,
        limit,
        search,
        status,
        jalur,
        bidang_kajian,
        sort_order,
      ),
    { dedupingInterval: 1000 },
  );

  const students = response?.data || [];
  const lastPages = response?.meta?.pagination.last_page ?? 1;
  const totalData = response?.meta?.pagination.total ?? 0;

  // Get pending count from API response or calculate from all data
  const pendingCount =
    response?.meta?.pending_count ??
    students.filter((student: any) => student.pengajuan?.status === "pending")
      .length;

  // Update search params helper
  const updateSearchParams = (newParams: { [key: string]: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`?${params.toString()}`);
  };

  // Handle filters - all update search params directly
  const handleStatusFilterChange = (newStatus: Status | "all") => {
    updateSearchParams({
      status: newStatus === "all" ? "" : newStatus,
      page: "1",
    });
  };

  const handlePathFilterChange = (newPath: string) => {
    updateSearchParams({
      jalur: newPath === "all" ? "" : newPath,
      page: "1",
    });
  };

  const handleFieldFilterChange = (newField: string) => {
    updateSearchParams({
      bidang_kajian: newField === "all" ? "" : newField,
      page: "1",
    });
  };

  const handleSortOrderChange = (newOrder: "asc" | "desc") => {
    updateSearchParams({
      sort_order: newOrder,
    });
  };

  // Handle accept student
  const handleAccept = (studentId: number) => {
    setSelectedStudent(studentId);
    setConfirmModalOpen(true);
  };

  // Confirm accept
  const confirmAccept = async () => {
    if (selectedStudent) {
      try {
        const updateMethod = isKoor
          ? PengajuanMahasiswaService.koorUpdateStatus
          : PengajuanMahasiswaService.dosenUpdateStatus;

        const response = await updateMethod(selectedStudent, {
          status: "accepted",
        });
        handleToastResponse(response);

        // Mutate all related cache keys to refresh data
        const cacheKey = isKoor
          ? "pengajuan-mahasiswa-koor"
          : "pengajuan-mahasiswa-dosen";
        mutate((key) => Array.isArray(key) && key[0] === cacheKey);

        setConfirmModalOpen(false);
        setSelectedStudent(null);
      } catch (error: any) {
        console.error("Failed to accept student:", error);
        if (error.response?.data) {
          handleToastResponse(error.response.data);
        }
      }
    }
  };

  // Handle reject
  const handleReject = (studentId: number) => {
    setSelectedStudent(studentId);
    setRejectionReason("");
    setRejectModalOpen(true);
  };

  // Confirm reject with reason
  const confirmReject = async () => {
    if (selectedStudent && rejectionReason.trim()) {
      try {
        const updateMethod = isKoor
          ? PengajuanMahasiswaService.koorUpdateStatus
          : PengajuanMahasiswaService.dosenUpdateStatus;

        const response = await updateMethod(selectedStudent, {
          status: "rejected",
          alasan: rejectionReason.trim(),
        });
        handleToastResponse(response);

        // Mutate all related cache keys to refresh data
        const cacheKey = isKoor
          ? "pengajuan-mahasiswa-koor"
          : "pengajuan-mahasiswa-dosen";
        mutate((key) => Array.isArray(key) && key[0] === cacheKey);

        setRejectModalOpen(false);
        setSelectedStudent(null);
        setRejectionReason("");
      } catch (error: any) {
        console.error("Failed to reject student:", error);
        if (error.response?.data) {
          handleToastResponse(error.response.data);
        }
      }
    }
  };

  // Define table columns
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "mahasiswa.name",
      header: "Mahasiswa",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={student.foto || ""}
                alt={student.name}
                className="object-cover"
              />
              <AvatarFallback>
                {student.name
                  ?.split(" ")
                  .map((name: string) => name[0])
                  .join("")
                  .substring(0, 2) || "N/A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <span className="font-semibold capitalize truncate max-w-[200px]">
                {student.name?.toLowerCase() || "N/A"}
              </span>
              <span className="text-sm text-muted-foreground">
                {student.nim || "N/A"}
              </span>
              {student.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="truncate max-w-[180px]">
                    {student.email}
                  </span>
                </div>
              )}
              {student.no_telp && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span>{student.no_telp}</span>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "pengajuan.judul",
      header: "Judul Penelitian",
      cell: ({ row }) => {
        const judul = row.original.pengajuan?.judul;
        return (
          <div className="max-w-[300px]">
            <p className="font-medium truncate">{judul || "N/A"}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "pengajuan.jalur",
      header: "Jalur",
      cell: ({ row }) => {
        const jalur = row.original.pengajuan?.jalur;
        return (
          <Badge variant={jalur === "Publikasi" ? "primary" : "secondary"}>
            {jalur || "N/A"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "pengajuan.bidang_kajian",
      header: "Bidang Kajian",
      cell: ({ row }) => {
        const bidang = row.original.pengajuan?.bidang_kajian;
        const bidangMap = {
          SC: "Sistem Cerdas (SC)",
          RPLD: "Rekayasa Perangkat Lunak dan Data (RPLD)",
          SK3D: "Network Administrator (SK3D)",
        };
        return (
          <span className="text-sm">
            {bidangMap[bidang as keyof typeof bidangMap] || bidang || "N/A"}
          </span>
        );
      },
    },
    {
      accessorKey: "pengajuan.tanggal",
      header: "Tanggal Pengajuan",
      cell: ({ row }) => {
        const tanggal = row.original.pengajuan?.tanggal;
        return (
          <span className="text-sm">
            {tanggal ? dayjs(tanggal).format("DD/MM/YYYY") : "N/A"}
          </span>
        );
      },
    },
    ...(isKoor
      ? [
          {
            accessorKey: "dosen_name",
            header: "Dosen Pembimbing",
            cell: ({ row }: { row: any }) => {
              return (
                <span className="text-sm">
                  {row.original.dosen_name || "N/A"}
                </span>
              );
            },
          },
        ]
      : []),
    {
      accessorKey: "pengajuan.status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.pengajuan?.status;
        const getStatusBadge = () => {
          switch (status) {
            case "pending":
              return <Badge variant="yellow">Menunggu</Badge>;
            case "accepted":
              return <Badge variant="success">Diterima</Badge>;
            case "rejected":
              return <Badge variant="destructiveOutline">Ditolak</Badge>;
            case "canceled":
              return (
                <Badge
                  variant="outline"
                  className="bg-muted text-muted-foreground whitespace-nowrap"
                >
                  Dibatalkan Mhs
                </Badge>
              );
            default:
              return <Badge variant="outline">-</Badge>;
          }
        };
        return getStatusBadge();
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Aksi</div>,
      cell: ({ row }) => {
        const student = row.original;
        const status = student.pengajuan?.status;

        if (status === "pending") {
          return (
            <div className="flex gap-2 justify-center">
              <Button
                size="sm"
                variant="successOutline"
                className="h-8 px-3"
                onClick={() => handleAccept(student.tugas_akhir_id)}
              >
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-semibold">Diterima</span>
              </Button>
              <Button
                size="sm"
                variant="destructiveOutline"
                className="h-8 px-3"
                onClick={() => handleReject(student.tugas_akhir_id)}
              >
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-500 font-semibold">Ditolak</span>
              </Button>
            </div>
          );
        }

        return <span className="text-sm text-muted-foreground">-</span>;
      },
    },
  ];

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Gagal memuat data"
        subtitle="Terjadi kesalahan saat mengambil data pengajuan mahasiswa."
        button={
          <Button onClick={() => router.refresh()} variant="outline">
            <RefreshCcw className="size-4 mr-2" />
            Coba Lagi
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Tabs */}
      <StatusTabs
        statusFilter={statusFilter}
        setStatusFilter={handleStatusFilterChange}
        pendingCount={pendingCount}
        isKoor={isKoor}
      />

      {/* Search and Filters */}
      <FilterBar
        sortOrder={sortOrder}
        setSortOrder={handleSortOrderChange}
        pathFilter={pathFilter}
        setPathFilter={handlePathFilterChange}
        fieldFilter={fieldFilter}
        setFieldFilter={handleFieldFilterChange}
        setCurrentPage={(page) => updateSearchParams({ page: page.toString() })}
        statusFilter={statusFilter}
        setStatusFilter={handleStatusFilterChange}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Content */}
      {error ? (
        <EmptyState
          icon={AlertCircle}
          title="Gagal memuat data"
          subtitle="Terjadi kesalahan saat mengambil data pengajuan mahasiswa."
          button={
            <Button onClick={() => router.refresh()} variant="outline">
              <RefreshCcw className="size-4 mr-2" />
              Coba Lagi
            </Button>
          }
        />
      ) : !isLoading && students.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title="Tidak ada data pengajuan"
          subtitle="Tidak ada data pengajuan mahasiswa yang sesuai dengan filter telah yang dipilih"
        />
      ) : viewMode === "table" ? (
        <DataTable
          columns={columns}
          data={students}
          pagination={{
            currentPage: page,
            lastPage: lastPages,
            limit,
            total: totalData,
          }}
          loading={isLoading}
        />
      ) : (
        <>
          <div className="grid gap-6">
            {isLoading
              ? Array.from({ length: limit }).map((_, index) => (
                  <StudentCardSkeleton key={index} />
                ))
              : students.map((student: any) => (
                  <StudentCard
                    isKoor={isKoor}
                    key={student.tugas_akhir_id}
                    student={student}
                    onAccept={() => handleAccept(student.tugas_akhir_id)}
                    onReject={() => handleReject(student.tugas_akhir_id)}
                  />
                ))}
          </div>

          {/* Pagination - only show for card view */}
          <PaginationControls
            currentPage={page}
            lastPage={lastPages}
            total={totalData}
          />
        </>
      )}

      {/* Modals */}
      <ConfirmationModal
        open={rejectModalOpen}
        setOpen={setRejectModalOpen}
        onConfirm={confirmReject}
        type="reject"
        title="Alasan Penolakan"
        description={`Berikan alasan mengapa pengajuan mahasiswa ini ditolak.`}
        reason={rejectionReason}
        setReason={setRejectionReason}
        placeholder="Masukkan alasan penolakan..."
      />

      <ConfirmationModal
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
        onConfirm={confirmAccept}
        type="accept"
        title="Konfirmasi Penerimaan"
        description="Apakah Anda yakin ingin menerima pengajuan mahasiswa ini?"
      />
    </div>
  );
}
