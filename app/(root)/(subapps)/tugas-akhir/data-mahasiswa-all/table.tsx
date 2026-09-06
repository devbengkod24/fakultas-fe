/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Edit,
  FileText,
  MoreHorizontal,
  Trash,
  Users,
  Mail,
  Phone,
  Download,
  RefreshCcw,
  User,
} from "lucide-react";
import { MahasiswaService, MahasiswaServiceV2, PeriodeService } from "@/api/tugas-akhir";
import { DataTable } from "@/components/data-table";
import { Mahasiswa } from "@/types/tugas-akhir/mahasiswa";
import { MahasiswaForm } from "./add-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import EmptyState from "@/components/empty-state";
import { handleToastResponse } from "@/lib/toast-response";
import SearchControl from "@/components/search-control";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const fetcher = (
  page: number,
  limit: number,
  search: string,
  type: string,
  status?: string,
  periode_id?: string,
) =>
  MahasiswaServiceV2.getAll(page, limit, search, type, status, periode_id).then(
    (res) => res,
  );

const columns: ColumnDef<Mahasiswa>[] = [
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
            <span className="font-semibold truncate max-w-[200px]">
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
              <span className="truncate ">{email}</span>
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
  },
  {
    accessorKey: "kode_periode",
    header: "Periode",
    cell: ({ row }) => {
      const kode = row.original.kode_periode;
      const tahun = row.original.tahun_ajaran;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{kode || "-"}</span>
          <span className="text-xs text-muted-foreground">{tahun || ""}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status_ta",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status_ta as string;

      return status === "Aktif" ? (
        <Badge variant="primary">{status}</Badge>
      ) : status === "Mangkir" ? (
        <Badge variant="secondary">{status}</Badge>
      ) : (
        <Badge variant="success">{status}</Badge>
      );
    },
  },
  {
    accessorKey: "tgl_yudisium",
    header: "Tanggal Yudisium",
    cell: ({ row }) => (
      <div>
        {row.original.tgl_yudisium
          ? formatDate(row.original.tgl_yudisium)
          : "-"}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => <MahasiswaActions mahasiswa={row.original} />,
  },
];

export default function MahasiswaTableLulus() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const type = searchParams.get("type") || "all";
  const status = searchParams.get("status") || "";
  const periode_id = searchParams.get("periode_id") || "";

  const handleStatusChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "semua") {
      params.set("status", val);
    } else {
      params.delete("status");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePeriodeChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "semua") {
      params.set("periode_id", val);
    } else {
      params.delete("periode_id");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  // Fetch all periods for filter dropdown
  const { data: periodeResponse } = useSWR(
    ["periode-list"],
    () => PeriodeService.getAllPeriode().then((res) => res),
    { dedupingInterval: 5000 }
  );
  const allPeriodes = periodeResponse?.data || [];

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    // TODO: implement sync logic
    setIsSyncing(false);
  };

  const handleExport = async () => {
    const toastId = toast.loading("Sedang menyiapkan data mahasiswa...");
    try {
      const blob = await MahasiswaServiceV2.export(search, type);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `data_mahasiswa_all_${new Date().getTime()}.xlsx`;
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

  const {
    data: response,
    error,
    isLoading,
  } = useSWR(
    ["mahasiswa", page, limit, search, type, status, periode_id],
    () => fetcher(page, limit, search, type, status || undefined, periode_id || undefined),
    { dedupingInterval: 1000 },
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
      <div className="flex justify-between items-center mb-4 gap-2">
        <SearchControl placeholder="Cari mahasiswa..." className="w-1/4" />
        <div className="flex items-center gap-2">
          <Select value={status || "semua"} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Status</SelectItem>
              <SelectItem value="aktif">Aktif</SelectItem>
              <SelectItem value="lulus">Lulus</SelectItem>
              <SelectItem value="mangkir">Mangkir</SelectItem>
            </SelectContent>
          </Select>
          <Select value={periode_id || "semua"} onValueChange={handlePeriodeChange}>
            <SelectTrigger className="h-9 w-[200px]">
              <SelectValue placeholder="Semua Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Periode</SelectItem>
              {allPeriodes.map((p: any) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.kode_periode} - {p.tahun_ajaran}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleExport}
            variant="default"
            className="h-9 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={handleSync}
            variant="default"
            size="icon"
            className="h-9 w-9"
            title="Sync data mahasiswa"
          >
            <RefreshCcw
              className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {!isLoading && !hasData ? (
        <EmptyState
          icon={Users}
          title="Belum ada data mahasiswa"
          subtitle="Belum ada data mahasiswa yang dapat ditampilkan."
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
                `/tugas-akhir/data-mahasiswa/${mahasiswa.mahasiswa_id}`,
              )
            }
          >
            <User className="size-4" />
            Profil Mahasiswa
          </DropdownMenuItem>

          {/* Transkrip item: buka di tab baru jika tersedia, else disabled */}
          {mahasiswa.transkrip ? (
            <DropdownMenuItem
              onClick={() => window.open(mahasiswa.transkrip, "_blank")}
            >
              <FileText className="size-4" />
              Transkrip Nilai
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled>
              <FileText className="size-4" />
              Transkrip Nilai
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Edit className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="size-4" />
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
