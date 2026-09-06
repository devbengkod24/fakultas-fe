/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR, { mutate } from "swr";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Edit,
  FileText,
  MoreHorizontal,
  Trash,
  Users,
  Mail,
  Phone,
  CircleCheck,
  CircleX,
  Download,
  RefreshCcw,
  User,
} from "lucide-react";
import { MahasiswaServiceV2, MahasiswaService } from "@/api/tugas-akhir";
import { MahasiswaForm } from "./add-modal";
import { DataTable } from "@/components/data-table";
import { Mahasiswa } from "@/types/tugas-akhir/mahasiswa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import EmptyState from "@/components/empty-state";
import { handleToastResponse } from "@/lib/toast-response";
import SearchControl from "@/components/search-control";
import { formatDate } from "@/lib/utils";
import ImportMahasiswaButton from "./import";

const fetcher = (
  page: number,
  limit: number,
  search: string,
  type: string,
  sort_by?: string,
  sort_order?: "asc" | "desc"
) =>
  MahasiswaServiceV2.getAllV2(
    page,
    limit,
    search,
    type,
    sort_by,
    sort_order
  ).then((res) => res);

export default function MahasiswaTable() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const type = searchParams.get("type") || "ta";
  const sort_by = searchParams.get("sort_by") || undefined;
  const sort_order =
    (searchParams.get("sort_order") as "asc" | "desc") || undefined;

  const [showImportModal, setShowImportModal] = useState(false);

  const handleExport = async () => {
    const toastId = toast.loading("Sedang menyiapkan data mahasiswa...");
    try {
      const blob = await MahasiswaServiceV2.export(search, type);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `data_mahasiswa_ta_${new Date().getTime()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      toast.success("Data mahasiswa berhasil diekspor", { id: toastId });
    } catch (error: any) {
      toast.error("Gagal mengekspor data", {
        id: toastId,
        description: error.message,
      });
    }
  };

  const columns: ColumnDef<Mahasiswa>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {(page - 1) * limit + row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Nama",
      cell: ({ row }) => {
        const name = row.original.name || "";
        const nim = row.original.nim || "";
        const photo = row.original.photo;

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {photo ? (
                <AvatarImage
                  src={photo}
                  alt={name}
                  className="rounded-full object-cover"
                />
              ) : null}
              <AvatarFallback className="bg-muted text-muted-foreground">
                {name ? name.charAt(0).toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="max-w-[200px] truncate font-semibold">
                {name || "N/A"}
              </span>
              <span className="text-sm text-muted-foreground">
                {nim || "N/A"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "kontak",
      header: "Kontak",
      cell: ({ row }) => {
        const email = row.original.email;
        const telepon = row.original.telepon;

        return (
          <div className="flex flex-col gap-1">
            {email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{email}</span>
              </div>
            )}
            {telepon && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{telepon}</span>
              </div>
            )}
            {!email && !telepon && (
              <span className="text-sm text-muted-foreground">-</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "dosen_name",
      header: "Dosen Pembimbing",
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {row.original.dosen_name || "Belum Ada Dosen"}
          </div>
        );
      },
    },
    {
      accessorKey: "krs_ta1",
      header: () => <div className="w-full text-center">KRS TA-1</div>,
      cell: ({ row }) => {
        const ta1 = Number(row.original.krs_ta1) === 1;
        return (
          <div className="flex items-center justify-center">
            {ta1 ? (
              <CircleCheck className="h-4 w-4 text-green-600" />
            ) : (
              <CircleX className="h-4 w-4 text-red-600" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "krs_ta2",
      header: () => <div className="w-full text-center">KRS TA-2</div>,
      cell: ({ row }) => {
        const ta2 = Number(row.original.krs_ta2) === 1;
        return (
          <div className="flex items-center justify-center">
            {ta2 ? (
              <CircleCheck className="h-4 w-4 text-green-600" />
            ) : (
              <CircleX className="h-4 w-4 text-red-600" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "created_at_sta1",
      header: () => "Sidang TA-1",
      cell: ({ row }) => {
        return (
          <div>
            <div>
              {row.original.created_at_sta1
                ? formatDate(row.original.created_at_sta1)
                : "-"}
            </div>
            {row.original.jalur_sta1 && (
              <div className="text-xs capitalize text-muted-foreground">
                {row.original.jalur_sta1}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "created_at_sta2",
      header: () => "Sidang TA-2",
      cell: ({ row }) => {
        return (
          <div>
            <div>
              {row.original.created_at_sta2
                ? formatDate(row.original.created_at_sta2)
                : "-"}
            </div>
            {row.original.jalur_sta2 && (
              <div className="text-xs capitalize text-muted-foreground">
                {row.original.jalur_sta2}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => <MahasiswaActions mahasiswa={row.original} />,
    },
  ];

  const {
    data: response,
    error,
    isLoading,
  } = useSWR(
    ["mahasiswa", page, limit, search, type, sort_by, sort_order],
    () => fetcher(page, limit, search, type, sort_by, sort_order),
    { dedupingInterval: 1000 }
  );

  const pagination = response?.meta?.pagination
    ? {
        currentPage: response.meta.pagination.current_page,
        lastPage: response.meta.pagination.last_page,
        limit: response.meta.pagination.per_page,
        total: response.meta.pagination.total,
      }
    : undefined;

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Gagal memuat data pengajuan mahasiswa"
        subtitle="Terjadi kesalahan saat mengambil data. Silakan coba lagi."
        button={
          <Button
            onClick={() => mutate(["mahasiswa", page, limit, search, type])}
            variant="outline"
          >
            Coba Lagi
          </Button>
        }
      />
    );
  }

  const hasData = response?.data && response.data.length > 0;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-2">
        <SearchControl placeholder="Cari mahasiswa..." className="w-1/4" />
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowImportModal(true)}
            variant="outline"
            className="flex h-9 items-center gap-2"
          >
            Import Data
          </Button>
          <Button
            onClick={handleExport}
            variant="default"
            className="flex h-9 items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="default"
            size="icon"
            className="h-9 w-9"
            title="Sync data mahasiswa"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showImportModal && (
        <ImportMahasiswaButton
          openOverride={showImportModal}
          onOpenChangeOverride={setShowImportModal}
        />
      )}

      {!isLoading && !hasData ? (
        <EmptyState
          icon={Users}
          title="Belum ada data mahasiswa"
          subtitle="Belum ada mahasiswa TA yang terdaftar pada periode ini."
          className="h-[400px]"
        />
      ) : (
        <DataTable
          columns={columns}
          data={response?.data || []}
          pagination={pagination}
          loading={isLoading}
        />
      )}
    </>
  );
}

type MahasiswaActionsProps = {
  mahasiswa: any;
};

function MahasiswaActions({ mahasiswa }: MahasiswaActionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const type = searchParams.get("type") || "ta";

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEdit = async (formData: {
    name: string;
    email: string;
    nim: string;
    ipk?: number;
    transkrip?: string;
    telepon?: string;
    type: string;
  }) => {
    const response = await MahasiswaService.update(mahasiswa.mahasiswa_id!, {
      name: formData.name,
      email: formData.email,
      nim: formData.nim,
      ipk: formData.ipk,
      transkrip: formData.transkrip,
      telepon: formData.telepon,
      type: formData.type,
    });
    mutate(["mahasiswa", page, limit, search, type]);
    return response;
  };

  const handleDelete = async () => {
    try {
      const response = await MahasiswaService.delete(mahasiswa.mahasiswa_id!);
      mutate(["mahasiswa", page, limit, search, type]);
      setIsDeleteOpen(false);
      handleToastResponse(response);
    } catch {
      toast.error("Gagal menghapus mahasiswa", {
        description: "Silakan coba lagi.",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/tugas-akhir/data-mahasiswa/${mahasiswa.mahasiswa_id}`
              )
            }
          >
            <User className="mr-2 size-4" />
            Profil Mahasiswa
          </DropdownMenuItem>

          {/* Transkrip item: buka di tab baru jika tersedia, else disabled */}
          {mahasiswa.transkrip ? (
            <DropdownMenuItem
              onClick={() => window.open(mahasiswa.transkrip, "_blank")}
            >
              <FileText className="mr-2 size-4" />
              Transkrip Nilai
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled>
              <FileText className="mr-2 size-4" />
              Transkrip Nilai
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Edit className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isEditOpen && (
        <MahasiswaForm
          onClose={() => setIsEditOpen(false)}
          onSave={handleEdit}
          mahasiswa={mahasiswa}
          editMode={true}
        />
      )}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Mahasiswa</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data mahasiswa{" "}
              <span className="font-semibold">{mahasiswa.name}</span>? Tindakan
              ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
