"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import useSWR from "swr";
import { ColumnDef } from "@tanstack/react-table";
import {
  AlertCircle,
  Users,
  Mail,
  Phone,
} from "lucide-react";
import { MahasiswaService, PeriodeService } from "@/api/kerja-praktek";
import { DataTable } from "@/components/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmptyState from "@/components/empty-state";
import SearchControl from "@/components/search-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fetcher = (
  page: number,
  limit: number,
  search: string,
  periode_id?: string,
) =>
  MahasiswaService.getAllMahasiswaAll(page, limit, search, periode_id).then(
    (res) => res,
  );

const columns: ColumnDef<any>[] = [
  {
    id: "no",
    header: "No",
    size: 50,
    cell: ({ row }) => {
      return <div className="text-sm">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => {
      const name = row.original.nama || "";
      const nim = row.original.nim || "";
      const photo = row.original.foto;

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
    accessorKey: "dosen_pembimbing",
    header: "Dosen Pembimbing",
    cell: ({ row }) => {
      const dosen = row.original.dosen_pembimbing;
      if (!dosen) return <span className="text-sm text-muted-foreground">-</span>;

      const gelarDepan = dosen.gelar_depan ? `${dosen.gelar_depan} ` : "";
      const nama = dosen.nama ?? "";
      const gelarBelakang = dosen.gelar_belakang ? `, ${dosen.gelar_belakang}` : "";

      return (
        <span className="text-sm">{gelarDepan}{nama}{gelarBelakang}</span>
      );
    },
  },
  {
    accessorKey: "periode",
    header: "Periode",
    cell: ({ row }) => {
      const kodePeriode = row.original.kode_periode;
      const tahunAjaran = row.original.tahun_ajaran;

      if (!kodePeriode && !tahunAjaran) {
        return <span className="text-sm text-muted-foreground">-</span>;
      }

      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{kodePeriode ?? "-"}</span>
          {tahunAjaran && <span className="text-xs text-muted-foreground">{tahunAjaran}</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "tipe_kp",
    header: "Status",
    cell: ({ row }) => {
      const tipeKp = row.original.tipe_kp;

      if (tipeKp === 'konversi') {
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
            Konversi
          </span>
        );
      }

      if (tipeKp === 'reguler') {
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
            Reguler
          </span>
        );
      }

      return (
        <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-1 rounded">
          Belum Ada
        </span>
      );
    },
  },
];

export default function SemuaMahasiswaTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const periode_id = searchParams.get("periode_id") || "";

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
    ["periode-list-kp"],
    () => PeriodeService.getAllPeriode().then((res) => res),
    { dedupingInterval: 5000 }
  );
  const allPeriodes = periodeResponse?.data || [];

  const {
    data: response,
    error,
    isLoading,
  } = useSWR(
    ["semua-mahasiswa", page, limit, search, periode_id],
    () => fetcher(page, limit, search, periode_id || undefined),
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
        title="Gagal memuat data mahasiswa"
        subtitle="Terjadi kesalahan saat mengambil data. Silakan coba lagi."
      />
    );
  }

  const hasData = response?.data && response.data.length > 0;

  return (
    <>
      <div className="flex justify-between items-center mb-4 gap-2">
        <SearchControl placeholder="Cari mahasiswa..." className="w-1/4" />
        <div className="flex items-center gap-2">
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
