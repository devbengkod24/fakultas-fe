/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { EWSStatistikKelulusanService } from "@/api/ews";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Download, RefreshCcw, Users } from "lucide-react";
import { useProfile } from "@/context/profileUseContext";
import SearchControl from "@/components/search-control";
import { toast } from "sonner";
import EmptyState from "@/components/empty-state";

export default function StatistikKelulusanClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  
  const { profile } = useProfile();
  const role = profile?.roles;
  const isSuperFakultas = role === "super_fakultas";

  useEffect(() => {
    if (role && role !== "super_fakultas") {
      router.replace("/ews/statistik-kelulusan/detail");
    }
  }, [role, router]);

  const { data: response, error, isLoading, mutate } = useSWR(
    isSuperFakultas ? ["super-fakultas-statistik-kelulusan", search, currentPage, limit] : null,
    () => EWSStatistikKelulusanService.getSuperFakultasStatistikKelulusan({ search, page: currentPage, per_page: limit }).then((res: any) => res),
    { revalidateOnFocus: false }
  );

  const [isExporting, setIsExporting] = useState(false);

  // Deteksi info paginasi dari berbagai kemungkinan struktur response API yang lebih luas
  const paginatedInfo = response?.data?.paginated_data || 
                        (response?.data?.current_page ? response.data : null) ||
                        (response?.current_page ? response : null);
  
  const statistikList = paginatedInfo?.data || 
                        (Array.isArray(response?.data) ? response.data : 
                        (Array.isArray(response) ? response : []));

  const handleExport = () => {
    setIsExporting(true);
    const toastId = toast.loading("Sedang menyiapkan data statistik...");
    EWSStatistikKelulusanService.exportSuperFakultasStatistikKelulusan({ search })
      .then((blob: any) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ews-statistik-kelulusan-super-fakultas-${new Date().toISOString().split("T")[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Data statistik berhasil diekspor", { id: toastId });
      })
      .catch((error: any) => {
        toast.error("Export gagal: " + error.message, { id: toastId });
      })
      .finally(() => setIsExporting(false));
  };

  const columns: ColumnDef<any>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{(currentPage - 1) * limit + row.index + 1}</span>
      ),
    },
    {
      accessorKey: "prodi",
      header: "Prodi",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
            onClick={() => router.push(`/ews/statistik-kelulusan/detail?prodi_id=${item.prodi?.id}`)}
          >
            <span className="font-bold text-[#2D3E50]">{item.prodi?.kode_prodi}</span>
            <span className="text-gray-600">{item.prodi?.nama_prodi}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "jumlah_mahasiswa",
      header: () => <div className="text-center">Jml blm lulus</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium text-[#2D3E50]">
          {row.original.jumlah_mahasiswa}
        </div>
      ),
    },
    {
      id: "syarat_kelulusan",
      header: () => <div className="text-center">Syarat Kelulusan</div>,
      columns: [
        {
          accessorKey: "ipk_dibawah_2",
          header: () => <div className="text-center">IPK {'<'} 2</div>,
          cell: ({ row }) => <div className="text-center font-bold text-[#2D3E50]">{row.original.ipk_dibawah_2}</div>
        },
        {
          accessorKey: "sks_kurang_dari_144",
          header: () => <div className="text-center">SKS {'<'} 144</div>,
          cell: ({ row }) => <div className="text-center font-bold text-[#2D3E50]">{row.original.sks_kurang_dari_144}</div>
        },
        {
          accessorKey: "nilai_d_lebih_dari_5_persen",
          header: () => <div className="text-center">Nilai D {'>'} 5%</div>,
          cell: ({ row }) => <div className="text-center font-bold text-[#2D3E50]">{row.original.nilai_d_lebih_dari_5_persen}</div>
        },
        {
          accessorKey: "ada_nilai_e",
          header: () => <div className="text-center">Nilai E</div>,
          cell: ({ row }) => <div className="text-center font-bold text-[#2D3E50]">{row.original.ada_nilai_e}</div>
        },
      ]
    },
    {
      id: "belum_lulus",
      header: () => <div className="text-center">Belum Lulus</div>,
      columns: [
        {
          accessorKey: "jumlah_aktif",
          header: () => <div className="text-center">Aktif</div>,
          cell: ({ row }) => <div className="text-center font-bold text-[#2D3E50]">{row.original.jumlah_aktif}</div>
        },
        {
          accessorKey: "jumlah_mangkir",
          header: () => <div className="text-center">Mangkir</div>,
          cell: ({ row }) => <div className="text-center font-bold text-[#2D3E50]">{row.original.jumlah_mangkir}</div>
        },
      ]
    },
    {
      accessorKey: "eligible",
      header: () => <div className="text-center">Eligible</div>,
      cell: ({ row }) => <div className="text-center font-bold text-[#2D3E50]">{row.original.eligible}</div>
    },
    {
      accessorKey: "tidak_eligible",
      header: () => <div className="text-center">Tidak Eligible</div>,
      cell: ({ row }) => <div className="text-center font-bold text-[#2D3E50]">{row.original.tidak_eligible}</div>
    },
    {
      accessorKey: "ipk_rata_rata",
      header: () => <div className="text-center">IPK Rata-rata</div>,
      cell: ({ row }) => <div className="text-center text-[#2D3E50] font-bold">{Number(row.original.ipk_rata_rata || 0).toFixed(2)}</div>
    }
  ];

  if (role && !isSuperFakultas) return null;
  if (error) return <div className="text-center py-8 text-red-500">Gagal memuat data. Silakan coba lagi.</div>;

  const hasData = statistikList.length > 0;

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#2D3E50]">
            Tabel Statistik Kelulusan
          </h2>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            variant="default"
            className="h-9 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
        {!isLoading && !hasData ? (
          <EmptyState
            icon={Users}
            title="Belum ada data statistik"
            subtitle="Belum ada data statistik kelulusan yang tersedia."
            className="h-[400px]"
          />
        ) : (
          <DataTable
            columns={columns}
            data={statistikList}
            loading={isLoading}
            pagination={paginatedInfo ? {
              currentPage: paginatedInfo.current_page || 1,
              lastPage: paginatedInfo.last_page || 1,
              limit: paginatedInfo.per_page || limit,
              total: paginatedInfo.total || 0,
            } : undefined}
          />
        )}
      </div>
    </div>
  );
}
