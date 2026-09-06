import useSWR from "swr";
import { DashboardService } from "@/api/tugas-akhir";
import { ClipboardList, User, FolderOpen, CheckCircle } from "lucide-react";
import { StatCardGroupView } from "@/components/shared-ta-kp/dashboard/stat-card-group-view";

const DashboardQuota = () => {
  const {
    data: response,
    isLoading,
    error,
  } = useSWR("dosen-quota", () => DashboardService.getDosenKuotaCount());

  const sisaKuota = response?.success ? response.data.sisa_kuota : 0;
  const isKelebihan = sisaKuota < 0;

  const items = [
    {
      title: "Total Kuota",
      icon: ClipboardList,
      count: response?.success ? response.data.total_kuota : 0,
      bg: "bg-blue-500/10",
      iconBg: "bg-blue-500/10 text-blue-500",
      titleColor: "text-blue-500",
    },
    {
      title: isKelebihan ? "Kelebihan Kuota" : "Sisa Kuota",
      icon: User,
      count: Math.abs(sisaKuota),
      bg: "bg-orange-500/10",
      iconBg: "bg-orange-500/10 text-orange-500",
      titleColor: "text-orange-500",
    },
    {
      title: "Total Pengajuan",
      icon: FolderOpen,
      count: response?.success ? response.data.total_pengajuan : 0,
      bg: "bg-yellow-500/10",
      iconBg: "bg-yellow-500/10 text-yellow-500",
      titleColor: "text-yellow-500",
    },
    {
      title: "Jumlah Diterima",
      icon: CheckCircle,
      count: response?.success ? response.data.ajuan_diterima : 0,
      bg: "bg-green-500/10",
      iconBg: "bg-green-500/10 text-green-500",
      titleColor: "text-green-500",
    },
  ];

  return (
    <StatCardGroupView
      title="Informasi Kuota Bimbingan"
      items={items}
      loading={isLoading}
      error={!!error}
    />
  );
};

export default DashboardQuota;
