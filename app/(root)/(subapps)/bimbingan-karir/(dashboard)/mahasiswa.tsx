import React from 'react'
import StudentInfo from '../_components/dashboard/mahasiswa/info'
import DaftarKegiatanDashboard from '../_components/dashboard/mahasiswa/kegiatan'
import BkPengumuman from '../_components/dashboard/mahasiswa/pengumuman'
import { DashboardMahasiswaService } from '@/api/bimbingan-karir';
import useSWR from 'swr'
import { DaftarKegiatanSkeleton, PengumumanSkeleton, StudentInfoSkeleton } from '../_components/dashboard/mahasiswa/skeleton'
import Tutorial from '../_components/dashboard/mahasiswa/tutorial';

const fetcher = () =>
  DashboardMahasiswaService.getAllDashboard().then((res) => res);

const MahasiswaDashboard = () => {

  const { data, isLoading } = useSWR(
    "dashboardMhsBK", fetcher,
    {revalidateOnFocus: false}
  );

  const daftarKegiatan = data?.data?.daftar_kegiatan;
  const pengumuman = data?.data?.pengumuman || [];
  const informasiMahasiswa = data?.data || null;

  if (isLoading) {
    return (
      <div className="bg-background">
        <div className="mx-auto space-y-6">
          {/* Student Information Skeleton */}
          <StudentInfoSkeleton />

          {/* Main Content Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-6">
            {/* Daftar Kegiatan Skeleton */}
            <div className="space-y-4 col-span-2">
              <DaftarKegiatanSkeleton />
            </div>

            {/* Pengumuman Skeleton */}
            <div className="space-y-4 col-span-1">
              <Tutorial />
              <PengumumanSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-background">
      <div className="mx-auto space-y-4">
        {/* Student Information */}
        <StudentInfo data={informasiMahasiswa} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-4">
          {/* Daftar Kegiatan */}
          <div className="space-y-4 lg:col-span-2 sm:col-span-1">
            <DaftarKegiatanDashboard data={daftarKegiatan} />
          </div>

          {/* Pengumuman & Tutorial - Stacked */}
          <div className="space-y-4 lg:col-span-1 sm:col-span-1">
            <Tutorial />
            <BkPengumuman data={pengumuman} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MahasiswaDashboard