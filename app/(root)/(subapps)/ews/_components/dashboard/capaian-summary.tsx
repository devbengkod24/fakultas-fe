/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EWSCapaianMahasiswaService } from "@/api/ews";
import { useProfile } from "@/context/profileUseContext";
import {
  isGeneralProdiFilter,
  useProdiFilter,
} from "@/context/prodiFilterContext";

const CapaianSummaryCard = () => {
  const { profile } = useProfile();
  const role = profile?.roles;
  const { selectedProdiIds } = useProdiFilter();
  const isGeneral = isGeneralProdiFilter(selectedProdiIds);

  const { data: responseGagal, error, isLoading } = useSWR(
    role ? [`ews-capaian-summary-${role}`] : null,
    () =>
      role === "super_fakultas"
        ? EWSCapaianMahasiswaService.getSuperFakultasTopMatakuliahGagal()
        : EWSCapaianMahasiswaService.getAdminTopMatakuliahGagal(),
    { revalidateOnFocus: false }
  );

  const stats = useMemo(() => {
    if (!responseGagal?.data?.data_per_prodi) {
      return { totalGagal: 0, topMatakuliah: [] };
    }

    const dataPerProdi = responseGagal.data.data_per_prodi;

    // Super Fakultas role and filter is active
    if (role === "super_fakultas" && !isGeneral) {
      const filtered = dataPerProdi.filter((item: any) =>
        selectedProdiIds.includes(String(item.prodi?.id))
      );

      let totalGagal = 0;
      const mkMap: Record<string, any> = {};

      filtered.forEach((prodiData: any) => {
        totalGagal += Number(prodiData.total_mahasiswa_gagal || 0);
        (prodiData.top_matakuliah_gagal || []).forEach((mk: any) => {
          const key = mk.kode_matakuliah;
          if (!mkMap[key]) {
            mkMap[key] = { ...mk };
          } else {
            mkMap[key].jumlah_mahasiswa_gagal += mk.jumlah_mahasiswa_gagal;
          }
        });
      });

      const topMatakuliah = Object.values(mkMap).sort(
        (a: any, b: any) => b.jumlah_mahasiswa_gagal - a.jumlah_mahasiswa_gagal
      );

      return { totalGagal, topMatakuliah };
    }

    // Admin role
    if (role === "admin") {
      const prodiData = dataPerProdi[0] || {};
      return {
        totalGagal: Number(prodiData.total_mahasiswa_gagal || 0),
        topMatakuliah: prodiData.top_matakuliah_gagal || [],
      };
    }

    // General (Super Fakultas / default)
    let totalGagal = 0;
    const mkMap: Record<string, any> = {};

    dataPerProdi.forEach((prodiData: any) => {
      totalGagal += Number(prodiData.total_mahasiswa_gagal || 0);
      (prodiData.top_matakuliah_gagal || []).forEach((mk: any) => {
        const key = mk.kode_matakuliah;
        if (!mkMap[key]) {
          mkMap[key] = { ...mk };
        } else {
          mkMap[key].jumlah_mahasiswa_gagal += mk.jumlah_mahasiswa_gagal;
        }
      });
    });

    const topMatakuliah = Object.values(mkMap).sort(
      (a: any, b: any) => b.jumlah_mahasiswa_gagal - a.jumlah_mahasiswa_gagal
    );

    return { totalGagal, topMatakuliah };
  }, [responseGagal, role, selectedProdiIds, isGeneral]);

  if (error) {
    return (
      <Card className="shadow-none border-none p-0 h-full flex flex-col justify-between">
        <CardHeader className="pt-6 pb-2">
          <CardTitle className="text-base font-bold text-[#2D3E50]">
            Capaian Mahasiswa
          </CardTitle>
          <CardDescription className="text-xs">
            Kelulusan mata kuliah mahasiswa
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center p-4">
          <div className="text-center text-xs text-red-500">
            Gagal memuat data capaian
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate max failures for relative progress bar widths
  const maxFailureCount = stats.topMatakuliah[0]?.jumlah_mahasiswa_gagal || 1;
  const displayedCourses = stats.topMatakuliah.slice(0, 3);

  return (
    <Card className="shadow-none border-none p-0 h-full flex flex-col justify-between">
      <div className="flex-grow">
        <CardHeader className="pt-6 pb-3">
          <CardTitle className="text-base font-bold text-[#2D3E50]">
            Capaian Mahasiswa
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Ringkasan tingkat kelulusan & mata kuliah kritis
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 pb-2 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-8 w-full rounded-md" />
              </div>
            </div>
          ) : (
            <>
              {/* Highlight Counter Card */}
              <div className={`p-3 rounded-xl border transition-all ${
                stats.totalGagal > 0 
                  ? "bg-red-50 border-red-100 text-red-700" 
                  : "bg-emerald-50 border-emerald-100 text-emerald-700"
              }`}>
                <div className="text-2xl font-extrabold leading-none">
                  {stats.totalGagal}
                </div>
                <div className="text-xs font-medium text-muted-foreground mt-1.5">
                  {stats.totalGagal > 0 
                    ? "Mahasiswa terdeteksi gagal mata kuliah" 
                    : "Semua mahasiswa lulus mata kuliah"}
                </div>
              </div>

              {/* Top Critical Courses */}
              <div className="space-y-2.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Mata Kuliah Terkritis
                </p>
                {displayedCourses.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground italic">
                    Tidak ada data kegagalan kelas
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {displayedCourses.map((mk: any) => {
                      const percentage = (mk.jumlah_mahasiswa_gagal / maxFailureCount) * 100;
                      return (
                        <div key={mk.kode_matakuliah} className="space-y-1">
                          <div className="flex justify-between items-start text-xs">
                            <span 
                              className="font-medium text-gray-700 truncate max-w-[170px]" 
                              title={mk.nama_matakuliah}
                            >
                              {mk.nama_matakuliah}
                            </span>
                            <span className="font-bold text-red-600 flex-shrink-0">
                              {mk.jumlah_mahasiswa_gagal} mhs
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-500 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </div>

      <div className="p-4 pt-2 border-t border-gray-100 flex justify-end">
        <Link 
          href="/ews/capaian-mahasiswa" 
          className="group flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Lihat Analisis Lengkap →
        </Link>
      </div>
    </Card>
  );
};

export default CapaianSummaryCard;
