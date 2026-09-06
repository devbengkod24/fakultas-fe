/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, AlertCircle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import CountData from "./count";
import { Label } from "@/components/ui/label";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR, { mutate } from "swr";
import { useProfile } from "@/context/profileUseContext";
import PaginationControls from "@/components/pagination-control";
import EmptyState from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { KuotaDosenService } from "@/api/tugas-akhir";
import SearchControl from "@/components/search-control";

export type Dosen = {
  dosen_id: number;
  user_id: number;
  dosen_periode_id: number | null;
  npp: string;
  name: string;
  gelar_depan: string | null;
  gelar_belakang: string;
  bidang_kajian: string | null;
  jumlah_lulusan: number;
  lulusan_percent: number;
  total_bimbingan: number;
  kuota: number | null;
  jumlah_ajuan: number;
  ajuan_diterima: number;
  sisa_kuota: number;
  total_mhs: number;
};

const fetcher = (page: number, limit: number, search: string) =>
  KuotaDosenService.getList(page, limit, search).then((res) => res);

const alokasiFetcher = () => KuotaDosenService.getAlokasi().then((res) => res);

const TableSkeleton = () => (
  <>
    {Array.from({ length: 10 }).map((_, index) => (
      <TableRow key={index}>
        {Array.from({ length: 11 }).map((_, cellIndex) => (
          <TableCell key={cellIndex}>
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

export function DosenDataTable() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const { activeProdiId } = useProfile();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [jumlahAlokasi, setJumlahAlokasi] = useState<string>("");

  // Fetch dosen list
  const {
    data: response,
    error,
    isLoading,
  } = useSWR(
    ["kuota-dosen-list", page, limit, search, activeProdiId],
    () => fetcher(page, limit, search),
    { dedupingInterval: 1000 }
  );

  // Fetch alokasi data
  const { data: alokasiData, isLoading: alokasiLoading } = useSWR(
    ["alokasi-kuota", activeProdiId],
    alokasiFetcher
  );

  const dosenList: Dosen[] = response?.data || [];
  const lastPages = response?.meta?.pagination.last_page ?? 1;
  const totalData = response?.meta?.pagination.total ?? 0;

  // Set initial alokasi value
  useEffect(() => {
    if (alokasiData?.data?.alokasi_kuota) {
      setJumlahAlokasi(alokasiData.data.alokasi_kuota.toString());
    }
  }, [alokasiData]);

  // Handle kuota edit
  const handleKuotaEdit = async (dosenId: number, newKuota: number) => {
    const promise = KuotaDosenService.updateKuota(dosenId, { kuota: newKuota });

    toast.promise(promise, {
      loading: "Memperbarui kuota...",
      success: () => {
        mutate(["kuota-dosen-list", page, limit, search, activeProdiId]);
        mutate(["kuota-dosen-overview", activeProdiId]);
        mutate(["alokasi-kuota", activeProdiId]);
        return "Kuota berhasil diperbarui";
      },
      error: (err) => {
        console.error("Error updating kuota:", err);
        return err?.message || "Gagal memperbarui kuota";
      },
    });
  };

  // Handle alokasi update
  const handleUpdateAlokasi = async () => {
    const promise = KuotaDosenService.updateAlokasi({
      kuota: Number(jumlahAlokasi),
    });

    toast.promise(promise, {
      loading: "Memperbarui alokasi...",
      success: () => {
        mutate(["alokasi-kuota", activeProdiId]);
        mutate(["kuota-dosen-overview", activeProdiId]);
        return "Alokasi berhasil diperbarui";
      },
      error: (err) => {
        console.error("Error updating alokasi:", err);
        return "Gagal memperbarui alokasi";
      },
    });
  };

  // Define editable cell for kuota
  const EditableKuotaCell = ({ getValue, row }: any) => {
    const initialValue = getValue() || 0;
    const [value, setValue] = useState(initialValue);
    const [isEditing, setIsEditing] = useState(false);
    const dosenId = row.original.dosen_id;

    const onBlur = () => {
      setIsEditing(false);
      if (value !== initialValue) {
        handleKuotaEdit(dosenId, Number(value));
      }
    };

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    if (isEditing) {
      return (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onBlur();
            }
          }}
          className="h-8 w-16 text-center"
          autoFocus
        />
      );
    }

    return (
      <div
        className="h-8 w-16 cursor-pointer rounded-md border bg-white p-1 text-center"
        onClick={() => setIsEditing(true)}
      >
        {value || 0}
      </div>
    );
  };

  // Define columns
  const columns: ColumnDef<Dosen>[] = [
    {
      accessorKey: "dosen_id",
      header: "No.",
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nama Dosen Pembimbing
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const dosen = row.original;
        const fullName = `${dosen.gelar_depan ? dosen.gelar_depan + " " : ""}${dosen.name}${dosen.gelar_belakang ? ", " + dosen.gelar_belakang : ""}`;
        return (
          <Link
            href={`/tugas-akhir/data-dosen/${dosen.dosen_id}`}
            className="flex flex-col hover:text-primary"
          >
            <span className="font-medium">{fullName}</span>
            <span className="text-sm text-muted-foreground">
              {dosen.npp}
              {dosen.bidang_kajian ? ` - ${dosen.bidang_kajian}` : ""}
            </span>
          </Link>
        );
      },
    },
    {
      accessorKey: "jumlah_lulusan",
      header: "Jumlah Lulusan",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("jumlah_lulusan")}</div>
      ),
    },
    {
      accessorKey: "lulusan_percent",
      header: "% Lulusan",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("lulusan_percent")}%</div>
      ),
    },
    {
      accessorKey: "total_bimbingan",
      header: "Jumlah Mhs TA Saat Ini",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("total_bimbingan")}</div>
      ),
    },
    {
      accessorKey: "kuota",
      header: "Kuota Mhs TA (Baru)",
      cell: EditableKuotaCell,
    },
    {
      accessorKey: "jumlah_ajuan",
      header: "Jumlah Ajuan",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("jumlah_ajuan")}</div>
      ),
    },
    {
      accessorKey: "ajuan_diterima",
      header: "Ajuan Diterima",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("ajuan_diterima")}</div>
      ),
    },
    {
      accessorKey: "sisa_kuota",
      header: "Sisa Kuota",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("sisa_kuota")}</div>
      ),
    },
    {
      accessorKey: "total_mhs",
      header: "Jumlah Mhs Bimb TA",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("total_mhs")}</div>
      ),
    },
  ];

  const table = useReactTable({
    data: dosenList,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    manualPagination: true,
  });

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Gagal memuat data"
        subtitle="Terjadi kesalahan saat mengambil data kuota dosen. Silakan coba lagi."
        button={<Button onClick={() => router.refresh()}>Coba Lagi</Button>}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <CountData sisa={alokasiData?.data?.sisa_alokasi_kuota || 0} />

      {/* Table Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <SearchControl
          placeholder="Search nama dosen.."
          className="w-full sm:w-1/4"
        />

        {/* Jumlah Alokasi Input with Label */}
        <div className="flex flex-row items-center gap-1">
          <Label htmlFor="jumlahAlokasi" className="text-xs">
            Jumlah Alokasi <br /> Mhs. periode ini
          </Label>
          <div className="flex gap-2">
            <Input
              id="jumlahAlokasi"
              type="number"
              value={jumlahAlokasi}
              onChange={(e) => setJumlahAlokasi(e.target.value)}
              className="w-[100px]"
              disabled={alokasiLoading}
            />
            <Button
              size={"sm"}
              onClick={handleUpdateAlokasi}
              disabled={alokasiLoading || !jumlahAlokasi}
            >
              Update
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : dosenList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-0">
                  <EmptyState
                    icon={FileText}
                    title="Tidak ada data dosen"
                    subtitle="Belum ada data kuota dosen yang dapat ditampilkan."
                  />
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={row.index % 2 === 0 ? "bg-muted/50" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {dosenList.length > 0 && !isLoading && (
        <PaginationControls
          currentPage={page}
          lastPage={lastPages}
          total={totalData}
        />
      )}
    </div>
  );
}
