import useSWR from "swr";
import { DashboardService } from "@/api/tugas-akhir";
import { ClipboardList, User } from "lucide-react";
import { StatCardGroupView } from "@/components/shared-ta-kp/dashboard/stat-card-group-view";

const CoordinatorQuota = () => {
  const { data: response, isLoading, error } = useSWR("koor-quota", () =>
    DashboardService.getKoorKuotaCount(),
  );

  const items = [
    {
      title: "Total Alokasi",
      icon: ClipboardList,
      count: response?.success ? response.data.alokasi_kuota : 0,
      bg: "bg-blue-500/10",
      iconBg: "bg-blue-500/10 text-blue-500",
      titleColor: "text-blue-500",
    },
    {
      title: "Kuota Terpakai",
      icon: User,
      count: response?.success ? response.data.ajuan_diterima : 0,
      bg: "bg-orange-500/10",
      iconBg: "bg-orange-500/10 text-orange-500",
      titleColor: "text-orange-500",
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

export default CoordinatorQuota;
