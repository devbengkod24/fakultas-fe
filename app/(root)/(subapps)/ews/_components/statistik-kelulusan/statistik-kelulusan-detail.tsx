/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { EWSStatistikKelulusanService } from "@/api/ews";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { useProfile } from "@/context/profileUseContext";
import EmptyState from "@/components/empty-state";
import { toast } from "sonner";

export default function StatistikKelulusanDetailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { profile } = useProfile();
  const prodiId = searchParams.get("prodi_id");
  const role = profile?.roles;
  const isSuperFakultas = role === "super_fakultas";

  const { data: response, error, isLoading, mutate } = useSWR(
    role ? (isSuperFakultas ? (prodiId ? ["super-fakultas-statistik-detail", prodiId] : null) : ["admin-statistik-detail"]) : null,
    () => isSuperFakultas 
      ? EWSStatistikKelulusanService.getSuperFakultasStatistikKelulusan({ prodi_id: prodiId || undefined }).then((res: any) => res)
      : EWSStatistikKelulusanService.getAdminStatistikKelulusan().then((res: any) => res),
    { revalidateOnFocus: false }
  );

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    const toastId = toast.loading("Sedang menyiapkan data statistik...");
    const exportTask = isSuperFakultas
      ? EWSStatistikKelulusanService.exportSuperFakultasStatistikKelulusan({ prodi_id: prodiId || undefined })
      : EWSStatistikKelulusanService.exportAdminStatistikKelulusan();

    exportTask
      .then((blob: any) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ews-statistik-kelulusan-${isSuperFakultas ? "super-fakultas" : "admin"}-${new Date().toISOString().split("T")[0]}.xlsx`;
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

  const handleFilterClick = (tahunMasuk: string, filterType: string, filterValue: string = "") => {
    const params = new URLSearchParams({ tahun_masuk: tahunMasuk, filter_type: filterType, filter_value: filterValue });
    if (isSuperFakultas && prodiId) params.append("prodi_id", prodiId);
    router.push(`/ews/statistik-kelulusan/mahasiswa?${params.toString()}`);
  };

  const columns: ColumnDef<any>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.index + 1}</span>
      ),
    },
    {
      accessorKey: "tahun_masuk",
      header: "Angkatan",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
            onClick={() => {
                const qs = new URLSearchParams({ tahun_masuk: item.tahun_masuk });
                if (isSuperFakultas && prodiId) qs.append("prodi_id", prodiId);
                router.push(`/ews/statistik-kelulusan/nilai-detail?${qs.toString()}`);
            }}
          >
            <span className="font-bold text-[#2D3E50]">{item.tahun_masuk}</span>
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
          cell: ({ row }) => (
            <div className="text-center">
              <span 
                onClick={() => handleFilterClick(row.original.tahun_masuk, "ipk_max", "2")}
                className="inline-flex cursor-pointer bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 min-w-[32px] px-2 py-1 text-xs font-bold rounded-lg justify-center"
              >
                {row.original.ipk_dibawah_2}
              </span>
            </div>
          )
        },
        {
          accessorKey: "sks_kurang_dari_144",
          header: () => <div className="text-center">SKS {'<'} 144</div>,
          cell: ({ row }) => (
            <div className="text-center">
              <span 
                onClick={() => handleFilterClick(row.original.tahun_masuk, "sks_max", "144")}
                className="inline-flex cursor-pointer bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 min-w-[32px] px-2 py-1 text-xs font-bold rounded-lg justify-center"
              >
                {row.original.sks_kurang_dari_144}
              </span>
            </div>
          )
        },
        {
          accessorKey: "nilai_d_lebih_dari_5_persen",
          header: () => <div className="text-center">Nilai D {'>'} 5%</div>,
          cell: ({ row }) => (
            <div className="text-center">
              <span 
                onClick={() => handleFilterClick(row.original.tahun_masuk, "has_nilai_d")}
                className="inline-flex cursor-pointer bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 min-w-[32px] px-2 py-1 text-xs font-bold rounded-lg justify-center"
              >
                {row.original.nilai_d_lebih_dari_5_persen}
              </span>
            </div>
          )
        },
        {
          accessorKey: "ada_nilai_e",
          header: () => <div className="text-center">Nilai E</div>,
          cell: ({ row }) => (
            <div className="text-center">
              <span 
                onClick={() => handleFilterClick(row.original.tahun_masuk, "has_nilai_e")}
                className="inline-flex cursor-pointer bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 min-w-[32px] px-2 py-1 text-xs font-bold rounded-lg justify-center"
              >
                {row.original.ada_nilai_e}
              </span>
            </div>
          )
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
          cell: ({ row }) => (
            <div className="text-center">
              <span 
                onClick={() => handleFilterClick(row.original.tahun_masuk, "status_mahasiswa", "Aktif")}
                className="inline-flex cursor-pointer bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 min-w-[32px] px-2 py-1 text-xs font-bold rounded-lg justify-center"
              >
                {row.original.jumlah_aktif}
              </span>
            </div>
          )
        },
        {
          accessorKey: "jumlah_mangkir",
          header: () => <div className="text-center">Mangkir</div>,
          cell: ({ row }) => (
            <div className="text-center">
              <span 
                onClick={() => handleFilterClick(row.original.tahun_masuk, "status_mahasiswa", "Mangkir")}
                className="inline-flex cursor-pointer bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100 min-w-[32px] px-2 py-1 text-xs font-bold rounded-lg justify-center"
              >
                {row.original.jumlah_mangkir}
              </span>
            </div>
          )
        },
      ]
    },
    {
      accessorKey: "eligible",
      header: () => <div className="text-center">Eligible</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <span 
            onClick={() => handleFilterClick(row.original.tahun_masuk, "eligible")}
            className="inline-flex cursor-pointer bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 min-w-[32px] px-2 py-1 text-xs font-bold rounded-lg justify-center"
          >
            {row.original.eligible}
          </span>
        </div>
      )
    },
    {
      accessorKey: "tidak_eligible",
      header: () => <div className="text-center">Tidak Eligible</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <span 
            onClick={() => handleFilterClick(row.original.tahun_masuk, "tidak_eligible")}
            className="inline-flex cursor-pointer bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 min-w-[32px] px-2 py-1 text-xs font-bold rounded-lg justify-center"
          >
            {row.original.tidak_eligible}
          </span>
        </div>
      )
    },
    {
      accessorKey: "ipk_rata_rata",
      header: () => <div className="text-center">IPK Rata-rata</div>,
      cell: ({ row }) => <div className="text-center text-[#2D3E50] font-bold">{Number(row.original.ipk_rata_rata || 0).toFixed(2)}</div>
    }
  ];

  if (error) return <div className="text-center py-8 text-red-500">Gagal memuat data. Silakan coba lagi.</div>;

  const data = response?.data;
  const prodi = isSuperFakultas ? data?.[0]?.prodi : response?.info_akses;
  const detailPerTahun = isSuperFakultas ? (data?.[0]?.detail_per_tahun || []) : (data?.detail_per_tahun || []);
  const hasData = detailPerTahun.length > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link
              href={isSuperFakultas ? "/ews/statistik-kelulusan" : "/ews"}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h2 className="text-lg font-bold text-[#2D3E50]">Tabel Detail per Angkatan</h2>
          </div>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
        {!isLoading && !hasData ? (
          <EmptyState
            icon={Users}
            title="Belum ada data statistik"
            subtitle="Belum ada data statistik kelulusan yang tersedia untuk prodi ini."
            className="h-[400px]"
          />
        ) : (
          <DataTable
            columns={columns}
            data={detailPerTahun}
            loading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
