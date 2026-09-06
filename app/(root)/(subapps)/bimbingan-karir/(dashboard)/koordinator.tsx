import React from "react";
import MenuDashboard from "../_components/dashboard/koordinator/info";
import { ChartKelulusan } from "../_components/dashboard/koordinator/chart-kelulusan";
import { ChartHasilUji } from "../_components/dashboard/koordinator/chart-distribusi-nilai";
import { ChartJmlMhs } from "../_components/dashboard/koordinator/chart-jml-mhs";
import BkPengumuman from "../_components/dashboard/koordinator/pengumuman";
import DaftarKegiatanDashboard from "../_components/dashboard/koordinator/daftar-kegiatan";
import { DashboardService } from "@/api/bimbingan-karir";
import useSWR from "swr";
import { ChartJmlMhsSkeleton, ChartSkeleton, DaftarKegiatanSkeleton, MenuSkeleton, PengumumanSkeleton } from "../_components/dashboard/koordinator/skeleton"
import Tutorial from "../_components/dashboard/koordinator/tutorial";


interface KoordinatorDashboardProps {
  prodiId?: number | null;
}

const fetcher = (prodiId: number | null | undefined) =>
  DashboardService.getAllDashboard(prodiId).then((res) => res);

const KoordinatorDashboard: React.FC<KoordinatorDashboardProps> = ({ prodiId }) => {
  const { data, isLoading } = useSWR(
    prodiId ? ["dashboardBK", prodiId] : null,
    () => fetcher(prodiId),
    { revalidateOnFocus: false }
  );

  const cards = data?.data?.cards ;
  const pengumuman = data?.data?.pengumuman;
  const jmlMinat = data?.data?.jumlah_peminat;
  const daftarKegiatan = data?.data?.daftar_kegiatan;
  const kelulusanKategori = data?.data?.kelulusan_per_kategori;
  const distibusiNilaiMinat = data?.data?.distribusi_nilai_per_minat;

    if (isLoading) {
    return (
      <div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-8">
            <MenuSkeleton />

            <div className="grid grid-cols-8 gap-2 mt-2">
              <div className="col-span-4">
                <ChartSkeleton />
              </div>
              <div className="col-span-4">
                <ChartSkeleton />
              </div>
            </div>
            
            <DaftarKegiatanSkeleton />
          </div>

          <div className="col-span-4">
            <div className="grid gap-2">
              <Tutorial />
              <PengumumanSkeleton />
              <ChartJmlMhsSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-8">
          <div className="grid grid-cols-3 gap-2">
            <MenuDashboard data={cards}/>
          </div>

          <div className="grid grid-cols-8 gap-2 mt-2">
            <div className="col-span-4">
              <ChartKelulusan data={kelulusanKategori}/>
            </div>
            <div className="col-span-4">
              <ChartHasilUji data={distibusiNilaiMinat}/>
            </div>
          </div>
          
          <DaftarKegiatanDashboard data={daftarKegiatan}/>
        </div>

        <div className="col-span-4">
          <div className="grid gap-2">
            <div className="">
              <Tutorial />
            </div>
            <div className="">
              <BkPengumuman data={pengumuman}/>
            </div>
            <div className="">
              <ChartJmlMhs data={jmlMinat}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KoordinatorDashboard;
