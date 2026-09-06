"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import { Columns } from "./columns"
import { FilterAllPresensi } from "./filter-all-presensi"
import { PresensiService } from "@/api/bimbingan-karir"
import useSWR from "swr"
import { useSearchParams } from "next/navigation"
import { Student } from "@/types/bimbingan-karir/koordinator/daftar-kegiatan/student"
import { handleToastResponse } from "@/lib/toast-response"
import { toast } from "sonner"

interface AttendanceTableProps {
  activityId : number
  onSummaryUpdate: (total: number, hadir: number) => void
  category: string
}

const fetcher = (kegiatan_id:number, page: number, limit: number, search: string) =>
  PresensiService.getMahasiswaPresensi("detail", page, limit, search, kegiatan_id).then((res) => res);

export default function AttendanceTable({ activityId, onSummaryUpdate, category }: AttendanceTableProps) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const kegiatan_id = activityId;
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    ["presensi-daftar-mahasiswa", kegiatan_id, page, limit, search],
    () => fetcher(kegiatan_id, page, limit, search),
    {
      revalidateOnFocus: true,
      refreshInterval: 30000,
      onSuccess: (data) => {
        onSummaryUpdate(data.total_mahasiswa, data.total_hadir);
        setIsRefreshing(false);
      },
    }
  );
  
  const daftarMhsRaw = data?.mahasiswas?.data || [];  
  const daftarPresensi = data?.presensi || [];
  const totalPages = data?.mahasiswas?.meta?.pagination.last_page ?? 1;
  const totalData = data?.mahasiswas?.meta?.pagination.total ?? 0;
  const currentPage = data?.mahasiswas?.meta?.pagination.current_page ?? 1;
  const perPage = data?.mahasiswas?.meta?.pagination.per_page ?? limit;
  const totalHadir = data?.total_hadir ?? 0;

  const daftarMhs: Student[] = daftarMhsRaw.map((mhs: Student) => {
    const presensiData = daftarPresensi.find((p: { user_id: number; presensi: string }) => 
      p.user_id === mhs.user_id
    );
    
    const presensi = presensiData?.presensi || "tidak hadir";
    const isPresent = presensi === "hadir";
    
    return {
      ...mhs,
      presensi: presensi as "hadir" | "izin" | "tidak hadir",
      isPresent,
      hasAttended: isPresent,
    };
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    mutate();
  };

  const handleToggle = async (user_id: number) => {
    const mahasiswa = daftarMhs.find((mhs) => mhs.user_id === user_id);
    if (!mahasiswa) return;
   
    try {
      setSubmittingId(user_id);

      let response;
      if (mahasiswa.isPresent) {
        response = await PresensiService.createPresensiCancel(
          mahasiswa.user_id,
          kegiatan_id,
        );
      } else {
        response = await PresensiService.createPresensiUpdate(
          mahasiswa.user_id,
          kegiatan_id,
        );
      }
      handleToastResponse(response)
      mutate();
    } catch {
     toast.error("Gagal memperbarui presensi mahasiswa");
    } finally {
      setSubmittingId(null);
    }
  };
  
  if (error) return <div>Gagal memuat data</div>;

  return (
    <div className="w-full">
      <div className="flex justify-between flex-col gap-2">
        <FilterAllPresensi
          acaraId={kegiatan_id}
          category={category}
          totalHadir={totalHadir}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onImportSuccess={mutate}
        />

        <DataTable 
          columns={Columns(currentPage, perPage, handleToggle, submittingId)}
          data={daftarMhs}
          loading={isLoading}
          pagination={{
            currentPage: page,
            lastPage: totalPages,
            limit,
            total: totalData,
          }}
        />
      </div>
    </div>
  )
}