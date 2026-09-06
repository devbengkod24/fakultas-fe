"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { EWSStatistikKelulusanService } from "@/api/ews";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, GraduationCap, Check, X, Download, Users } from "lucide-react";
import Link from "next/link";
import { MahasiswaNilaiDetail, MataKuliah } from "@/types/ews/statistik-kelulusan/statistik-kelulusan";
import { useProfile } from "@/context/profileUseContext";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import EmptyState from "@/components/empty-state";

function NilaiModal({ jumlah, totalSks, items, color, title }: { jumlah: number; totalSks: number; items: MataKuliah[]; color: "orange" | "red"; title: string; }) {
  if (jumlah === 0) return <Check className="w-5 h-5 text-green-500 mx-auto" />;
  const c = color === "orange" 
    ? { badge: "bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-100", dot: "bg-orange-400" }
    : { badge: "bg-red-50 text-red-600 hover:bg-red-100 border-red-100", dot: "bg-red-400" };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={`inline-flex items-center justify-center min-w-[3rem] px-3 py-1 rounded-lg text-xs font-bold border transition-all ${c.badge}`}>
          {jumlah}/{totalSks} SKS
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-2">
          {items.map((mk, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50/50">
              <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
              <div className="leading-tight">
                <p className="font-mono text-sm font-semibold text-gray-700 mb-1">{mk.kode}</p>
                <p className="text-sm font-medium text-gray-800">{mk.nama}</p>
                <p className="text-xs text-gray-500 mt-1">{mk.sks} SKS {mk.nilai_akhir_huruf ? `· Nilai: ${mk.nilai_akhir_huruf}` : ""}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MkKurangModal({ value, items, title }: { value?: string; items?: MataKuliah[]; title: string; }) {
  if (value === "yes") return <Check className="w-5 h-5 text-emerald-500 mx-auto" />;
  if (!items || items.length === 0) return <X className="w-5 h-5 text-red-500 mx-auto" />;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center justify-center p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors group" title="Lihat Detail Mata Kuliah Kurang">
          <X className="w-4 h-4 group-hover:scale-110 transition-transform cursor-pointer" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-2">
          <p className="text-sm text-red-600 font-medium mb-2">Terdapat {items.length} mata kuliah yang belum diselesaikan:</p>
          {items.map((mk, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-red-100 bg-red-50/30">
              <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0 bg-red-400" />
              <div className="leading-tight">
                <p className="font-mono text-sm font-semibold text-gray-700 mb-1">{mk.kode}</p>
                <p className="text-sm font-medium text-gray-800">{mk.nama}</p>
                <p className="text-xs text-gray-500 mt-1">{mk.sks} SKS</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function NilaiDetailClient() {
  const searchParams = useSearchParams();
  const { profile } = useProfile();
  const prodiId = searchParams.get("prodi_id") || "";
  const tahunMasuk = searchParams.get("tahun_masuk") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [isExporting, setIsExporting] = useState(false);
  const role = profile?.roles;
  const isSuperFakultas = role === "super_fakultas";

  const { data: response, isLoading, error } = useSWR(
    (role && tahunMasuk) ? [isSuperFakultas ? "super-fakultas-nilai-detail" : "admin-nilai-detail", prodiId, tahunMasuk, currentPage, limit] : null,
    () => {
        if (isSuperFakultas) {
            return EWSStatistikKelulusanService.getSuperFakultasNilaiDetail({ prodi_id: prodiId, tahun_masuk: tahunMasuk, page: currentPage, per_page: limit });
        }
        return EWSStatistikKelulusanService.getAdminNilaiDetail({ tahun_masuk: tahunMasuk, page: currentPage, per_page: limit });
    },
    { revalidateOnFocus: false }
  );

  const paginatedInfo = response?.data?.paginated_data || 
                        response?.pagination || 
                        response?.data?.pagination || 
                        response?.meta?.pagination ||
                        (response?.data?.current_page ? response.data : null) ||
                        (response?.current_page ? response : null);

  const lastPage = paginatedInfo?.last_page || paginatedInfo?.total_pages || response?.data?.last_page || 1;
  const currentPageNum = paginatedInfo?.current_page || response?.data?.current_page || 1;
  const perPage = paginatedInfo?.per_page || response?.data?.per_page || 10;
  const totalItems = paginatedInfo?.total || response?.data?.total || 0;

  let mahasiswaList: MahasiswaNilaiDetail[] = [];
  if (response?.data) {
    if (response.data.paginated_data?.data && Array.isArray(response.data.paginated_data.data)) {
      mahasiswaList = response.data.paginated_data.data;
    } else {
      const dataArray = Array.isArray(response.data) ? response.data : 
                        (response.data.data && Array.isArray(response.data.data)) ? response.data.data : [];
      mahasiswaList = dataArray;
    }
  } else if (Array.isArray(response)) {
    mahasiswaList = response;
  }

  const pagination = {
    currentPage: currentPageNum,
    lastPage: lastPage,
    limit: perPage,
    total: totalItems || mahasiswaList.length,
  };

  const backUrl = isSuperFakultas && prodiId
    ? `/ews/statistik-kelulusan/detail?prodi_id=${prodiId}` 
    : `/ews/statistik-kelulusan/detail`;

  const handleExport = () => {
    setIsExporting(true);
    const exportTask = isSuperFakultas
      ? EWSStatistikKelulusanService.exportSuperFakultasNilaiDetail({ prodi_id: prodiId, tahun_masuk: tahunMasuk })
      : EWSStatistikKelulusanService.exportAdminNilaiDetail({ tahun_masuk: tahunMasuk });

    exportTask
      .then((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ews-nilai-detail-${isSuperFakultas ? "super-fakultas" : "admin"}-${new Date().toISOString().split("T")[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error: any) => alert("Export gagal: " + error.message))
      .finally(() => setIsExporting(false));
  };

  const columns: ColumnDef<MahasiswaNilaiDetail>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{(currentPageNum - 1) * perPage + row.index + 1}</span>
      ),
    },
    {
      accessorKey: "nama_lengkap",
      header: "Nama",
      cell: ({ row }) => (
        <div className="max-w-[180px]">
          <p className="font-semibold text-gray-800 truncate" title={row.original.nama_lengkap}>{row.original.nama_lengkap}</p>
          <p className="font-mono text-[11px] text-gray-400 mt-0.5">{row.original.nim}</p>
        </div>
      ),
    },
    {
      accessorKey: "sks_tempuh",
      header: () => <div className="text-center">SKS Total</div>,
      cell: ({ row }) => <div className="text-center text-gray-700 font-medium">{row.original.sks_tempuh}</div>,
    },
    {
      accessorKey: "sks_now",
      header: () => <div className="text-center">SKS Now</div>,
      cell: ({ row }) => <div className="text-center text-gray-700 font-medium">{row.original.sks_now ?? "-"}</div>,
    },
    {
      id: "syarat_kelulusan",
      header: () => <div className="text-center">Syarat Kelulusan</div>,
      columns: [
        {
          accessorKey: "sks_lulus",
          header: () => <div className="text-center">SKS Lulus</div>,
          cell: ({ row }) => <div className="text-center text-gray-700 font-medium">{row.original.sks_lulus}</div>,
        },
        {
          accessorKey: "ipk",
          header: () => <div className="text-center">IPK</div>,
          cell: ({ row }) => (
            <div className="text-center font-bold">
              <span className={Number(row.original.ipk || 0) < 2 ? "text-red-600" : "text-[#2D3E50]"}>
                {Number(row.original.ipk || 0).toFixed(2)}
              </span>
            </div>
          ),
        },
        {
          accessorKey: "jumlah_nilai_d",
          header: () => <div className="text-center text-orange-500">Nilai D/SKS</div>,
          cell: ({ row }) => (
            <div className="text-center">
              <NilaiModal 
                jumlah={row.original.jumlah_nilai_d} 
                totalSks={row.original.total_sks_nilai_d} 
                items={row.original.mata_kuliah_nilai_d} 
                color="orange" 
                title={`Detail Mata Kuliah Nilai D - ${row.original.nama_lengkap}`} 
              />
            </div>
          ),
        },
        {
          accessorKey: "jumlah_nilai_e",
          header: () => <div className="text-center text-red-500">Nilai E/SKS</div>,
          cell: ({ row }) => (
            <div className="text-center">
              <NilaiModal 
                jumlah={row.original.jumlah_nilai_e} 
                totalSks={row.original.total_sks_nilai_e} 
                items={row.original.mata_kuliah_nilai_e} 
                color="red" 
                title={`Detail Mata Kuliah Nilai E - ${row.original.nama_lengkap}`} 
              />
            </div>
          ),
        },
      ]
    },
    {
      id: "syarat_mata_kuliah",
      header: () => <div className="text-center">Syarat Mata Kuliah</div>,
      columns: [
        {
          accessorKey: "mk_nasional",
          header: () => <div className="text-center" title="Nasional">N</div>,
          cell: ({ row }) => (
            <div className="text-center">
              <MkKurangModal value={row.original.mk_nasional} items={row.original.mk_nasional_kurang} title={`Kekurangan MK Nasional - ${row.original.nama_lengkap}`} />
            </div>
          ),
        },
        {
          accessorKey: "mk_fakultas",
          header: () => <div className="text-center" title="Fakultas">F</div>,
          cell: ({ row }) => (
            <div className="text-center">
              <MkKurangModal value={row.original.mk_fakultas} items={row.original.mk_fakultas_kurang} title={`Kekurangan MK Fakultas - ${row.original.nama_lengkap}`} />
            </div>
          ),
        },
        {
          accessorKey: "mk_prodi",
          header: () => <div className="text-center" title="Prodi">P</div>,
          cell: ({ row }) => (
            <div className="text-center">
              <MkKurangModal value={row.original.mk_prodi} items={row.original.mk_prodi_kurang} title={`Kekurangan MK Prodi - ${row.original.nama_lengkap}`} />
            </div>
          ),
        },
      ]
    },
    {
      accessorKey: "status_kelulusan",
      header: () => <div className="text-center">Eligible/Tidak</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${row.original.status_kelulusan === "eligible" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {row.original.status_kelulusan === "eligible" ? "Eligible" : "Tidak"}
          </span>
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={backUrl}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h2 className="text-lg font-bold text-[#2D3E50]">
              Daftar Mahasiswa
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {!isLoading && mahasiswaList.length > 0 && (
              <span className="text-sm text-gray-400">{totalItems || mahasiswaList.length} mahasiswa</span>
            )}
            <Button
              onClick={handleExport}
              disabled={isExporting}
              variant="default"
              className="h-9 flex items-center gap-2"
            >
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        {error && <div className="flex items-center justify-center py-24 text-red-500 text-sm">Gagal memuat data. Silakan coba lagi.</div>}

        {!isLoading && !error && mahasiswaList.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="Tidak ada data mahasiswa"
            subtitle="Tidak ada data mahasiswa ditemukan untuk angkatan ini."
            className="h-[400px]"
          />
        ) : (
          <DataTable
            columns={columns}
            data={mahasiswaList}
            loading={isLoading}
            pagination={pagination}
          />
        )}
      </div>
    </div>
  );
}