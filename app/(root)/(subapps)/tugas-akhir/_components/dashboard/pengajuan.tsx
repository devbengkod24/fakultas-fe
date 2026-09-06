import useSWR from "swr";
import { DashboardService } from "@/api/tugas-akhir";
import {
  PengajuanListView,
  type PengajuanListItem,
} from "@/components/shared-ta-kp/dashboard/pengajuan-list-view";

interface RawPengajuanItem {
  tugas_akhir_id: number;
  nim: string;
  nama_mhs: string;
  ipk_mhs: number;
  judul_ta: string;
}

const PengajuanDashboard = () => {
  const { data: response, error, isLoading } = useSWR("dosen-pengajuan", () =>
    DashboardService.getDosenPengajuan(),
  );

  const items: PengajuanListItem[] = response?.success
    ? response.data.map((item: RawPengajuanItem) => ({
        id: item.tugas_akhir_id,
        name: item.nama_mhs,
        studentId: item.nim,
        gpa: item.ipk_mhs,
        avatar: null,
        title: item.judul_ta,
      }))
    : [];

  return (
    <PengajuanListView
      items={items}
      loading={isLoading}
      error={!!error}
      emptyTitle="Belum ada pengajuan"
      emptySubtitle="Belum ada pengajuan tugas akhir terbaru"
    />
  );
};

export default PengajuanDashboard;
