"use client";

import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { EWSStatistikKelulusanService } from "@/api/ews";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useProfile } from "@/context/profileUseContext";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import EmptyState from "@/components/empty-state";

export default function MahasiswaFilterListClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { profile } = useProfile();

  const prodiId = searchParams.get("prodi_id") || "";
  const tahunMasuk = searchParams.get("tahun_masuk") || "";
  const filterType = searchParams.get("filter_type") || "";
  const filterValue = searchParams.get("filter_value") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  
  const role = profile?.roles;
  const isSuperFakultas = role === "super_fakultas";

  const [isExporting, setIsExporting] = useState(false);

  const buildQueryParams = (forExport = false) => {
    const params: any = { tahun_masuk: tahunMasuk };
    if (isSuperFakultas && prodiId) params.prodi_id = prodiId;
    if (!forExport) {
      params.page = page;
      params.per_page = limit;
    }

    switch (filterType) {
      case "ipk_max": params.ipk_max = parseInt(filterValue); break;
      case "sks_max": params.sks_max = parseInt(filterValue); break;
      case "has_nilai_d": params.has_nilai_d = true; break;
      case "has_nilai_e": params.has_nilai_e = true; break;
      case "eligible": 
        params.status_kelulusan = "eligible"; 
        if (isSuperFakultas) params.criteria = "eligible";
        break;
      case "tidak_eligible": 
        params.status_kelulusan = "tidak_eligible"; 
        if (isSuperFakultas) params.criteria = "tidak_eligible";
        break;
      case "status_mahasiswa":
        if (isSuperFakultas) {
          let criteria = filterValue.toLowerCase();
          if (criteria === "tidak aktif") criteria = "tidak_aktif";
          params.criteria = criteria;
        } else {
          // Admin uses criteria param for status_mahasiswa filtering
          let criteria = filterValue.toLowerCase();
          if (criteria === "cuti") criteria = "cuti_2x";
          params.criteria = criteria;
        }
        break;
      case "ews_status": 
        params.ews_status = filterValue.toLowerCase(); 
        if (isSuperFakultas) params.criteria = filterValue.toLowerCase();
        break;
    }
    return params;
  };

  const { data: response, error, isLoading } = useSWR(
    (role && tahunMasuk) ? [isSuperFakultas ? "super-fakultas-mhs" : "admin-mhs", prodiId, tahunMasuk, filterType, filterValue, page, limit] : null,
    () => {
        const params = buildQueryParams();
        if (filterType === "status_mahasiswa" || filterType === "ews_status" || filterType === "eligible" || filterType === "tidak_eligible") {
            return isSuperFakultas
              ? EWSStatistikKelulusanService.getSuperFakultasMahasiswaByStatus(params).then((res: any) => res)
              : EWSStatistikKelulusanService.getAdminMahasiswaByStatus(params).then((res: any) => res);
        }
        return isSuperFakultas
            ? EWSStatistikKelulusanService.getSuperFakultasMahasiswaList(params).then((res: any) => res)
            : EWSStatistikKelulusanService.getAdminMahasiswaList(params).then((res: any) => res);
    },
    { revalidateOnFocus: false }
  );

  const handleExport = () => {
    setIsExporting(true);
    const params = buildQueryParams(true);
    let exportTask;

    if (isSuperFakultas) {
        exportTask = EWSStatistikKelulusanService.exportSuperFakultasMahasiswaList(params);
    } else {
        exportTask = (filterType === "status_mahasiswa" || filterType === "ews_status")
          ? EWSStatistikKelulusanService.exportAdminMahasiswaByStatus(params)
          : EWSStatistikKelulusanService.exportAdminMahasiswaList(params);
    }

    exportTask
      .then((blob: any) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ews-mahasiswa-filter-${isSuperFakultas ? "super-fakultas" : "admin"}-${new Date().toISOString().split("T")[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((err: any) => alert("Export gagal: " + err.message))
      .finally(() => setIsExporting(false));
  };

  let mahasiswaList: any[] = [];
  if (response?.data) {
    if (response.data.paginated_data?.data && Array.isArray(response.data.paginated_data.data)) {
      mahasiswaList = response.data.paginated_data.data;
    }
    else if (response.data.mahasiswa && Array.isArray(response.data.mahasiswa)) {
      mahasiswaList = response.data.mahasiswa;
    }
    else {
      const dataArray = Array.isArray(response.data) ? response.data : 
                        (response.data.data && Array.isArray(response.data.data)) ? response.data.data : [];
      
      const firstItem = dataArray[0];

      if (firstItem && Array.isArray(firstItem.mahasiswa)) {
        const filteredData = tahunMasuk 
          ? dataArray.filter((item: any) => String(item.tahun_masuk) === String(tahunMasuk))
          : dataArray;

        mahasiswaList = filteredData.flatMap((item: any) => item.mahasiswa || []);
      }
      else {
        mahasiswaList = dataArray;
      }
    }
  }

  const columns: ColumnDef<any>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{(page - 1) * limit + row.index + 1}</span>
      ),
    },
    {
      accessorKey: "nim",
      header: "NIM",
      cell: ({ row }) => <span className="text-[#2D3E50] font-medium">{row.original.nim}</span>,
    },
    {
      accessorKey: "nama_mahasiswa",
      header: "Nama",
      cell: ({ row }) => <span className="text-[#2D3E50]">{row.original.nama_mahasiswa}</span>,
    },
    {
      accessorKey: "ipk",
      header: () => <div className="text-center">IPK</div>,
      cell: ({ row }) => <div className="text-center text-[#2D3E50]">{Number(row.original.ipk || 0).toFixed(2)}</div>,
    },
    {
      accessorKey: "sks_total",
      header: () => <div className="text-center">SKS</div>,
      cell: ({ row }) => <div className="text-center text-[#2D3E50]">{row.original.sks_total}</div>,
    },
    {
      accessorKey: "status_mahasiswa",
      header: () => <div className="text-center">Status MHS</div>,
      cell: ({ row }) => {
        const status = row.original.status_mahasiswa;
        const style = status === "aktif" ? "bg-emerald-100 text-emerald-700" : status === "mangkir" ? "bg-orange-100 text-orange-700" : status === "do" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700";
        const label = status === "aktif" ? "Aktif" : status === "mangkir" ? "Mangkir" : status === "do" ? "DO" : status === "tidak_aktif" ? "Tidak Aktif" : status;
        return (
          <div className="text-center">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${style}`}>
              {label}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "ews_status",
      header: () => <div className="text-center">EWS</div>,
      cell: ({ row }) => {
        const status = row.original.ews_status;
        const style = status === "tepat_waktu" ? "bg-green-100 text-green-700" : status === "normal" ? "bg-blue-100 text-blue-700" : status === "perhatian" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700";
        const label = status === "tepat_waktu" ? "Tepat Waktu" : status === "normal" ? "Normal" : status === "perhatian" ? "Perhatian" : status === "kritis" ? "Kritis" : status;
        return (
          <div className="text-center">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${style}`}>
              {label}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status_kelulusan",
      header: () => <div className="text-center">Kelulusan</div>,
      cell: ({ row }) => {
        const item = row.original;
        const statusKelulusan = item.status_kelulusan || item.eligible || item.status_eligible;
        const isEligible = statusKelulusan === "eligible";
        const isNonEligible = statusKelulusan === "noneligible" || statusKelulusan === "tidak_eligible" || statusKelulusan === "non_eligible";
        const style = isEligible ? "bg-green-100 text-green-700" : isNonEligible ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700";
        return (
          <div className="text-center">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${style}`}>
              {isEligible ? "Eligible" : isNonEligible ? "Tidak Eligible" : statusKelulusan || "—"}
            </span>
          </div>
        );
      },
    }
  ];

  const backUrl = isSuperFakultas && prodiId
    ? `/ews/statistik-kelulusan/detail?prodi_id=${prodiId}` 
    : `/ews/statistik-kelulusan/detail`;

  const getTitle = () => {
    switch (filterType) {
      case "ipk_max": return `Mahasiswa dengan IPK < ${filterValue}`;
      case "sks_max": return `Mahasiswa dengan SKS < ${filterValue}`;
      case "has_nilai_d": return "Mahasiswa dengan Nilai D > 5%";
      case "has_nilai_e": return "Mahasiswa dengan Nilai E";
      case "eligible": return "Mahasiswa Eligible";
      case "tidak_eligible": return "Mahasiswa Tidak Eligible";
      case "status_mahasiswa": return `Mahasiswa dengan Status ${filterValue}`;
      case "ews_status": return `Mahasiswa dengan Status EWS ${filterValue}`;
      default: return "Daftar Mahasiswa";
    }
  };

  const paginatedInfo = response?.data?.paginated_data || 
                        response?.pagination || 
                        response?.data?.pagination || 
                        response?.meta?.pagination ||
                        (response?.data?.current_page !== undefined ? response.data : null) ||
                        (response?.current_page !== undefined ? response : null);

  const lastPage = Number(paginatedInfo?.last_page || paginatedInfo?.total_pages || response?.data?.last_page || 1);
  const currentPageNum = Number(paginatedInfo?.current_page || response?.data?.current_page || page || 1);
  const perPage = Number(paginatedInfo?.per_page || paginatedInfo?.limit || response?.data?.per_page || limit || 10);
  const totalItems = Number(paginatedInfo?.total || paginatedInfo?.total_data || response?.data?.total || response?.total || mahasiswaList.length);

  const pagination = {
    currentPage: currentPageNum,
    lastPage: lastPage,
    limit: perPage,
    total: totalItems,
  };

  const totalMahasiswa = totalItems;

  if (error) return <div className="text-center py-8 text-red-500">Gagal memuat data. Silakan coba lagi.</div>;

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
            <h2 className="text-lg font-bold text-[#2D3E50]">{getTitle()}</h2>
          </div>
          <div className="flex items-center gap-4">
            {!isLoading && totalMahasiswa > 0 && (
              <span className="text-sm text-gray-400">{totalMahasiswa} mahasiswa</span>
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

        {!isLoading && mahasiswaList.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Tidak ada data mahasiswa"
            subtitle="Tidak ada data mahasiswa ditemukan untuk filter ini."
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