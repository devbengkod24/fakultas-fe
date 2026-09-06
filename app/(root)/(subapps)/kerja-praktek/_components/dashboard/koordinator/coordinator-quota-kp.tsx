"use client";

import useSWR from "swr";
import { ClipboardList, User } from "lucide-react";
import { DashboardService } from "@/api/kerja-praktek";
import { useProfile } from "@/context/profileUseContext";
import { StatCardGroupView } from "@/components/shared-ta-kp/dashboard/stat-card-group-view";
import type { StatCardItem } from "@/components/shared-ta-kp/dashboard/stat-card-group-view";

const CoordinatorQuotaKP = () => {
  const { activeProdiId } = useProfile();

  const { data: response, isLoading, error } = useSWR(
    ["koor-quota-kp", activeProdiId ?? undefined],
    () => DashboardService.getKuotaSummary(undefined, activeProdiId ?? undefined)
  );

  const items: StatCardItem[] = [
    {
      title: "Total Alokasi",
      icon: ClipboardList,
      count: response?.success ? response.data?.total_kuota ?? 0 : 0,
      bg: "bg-blue-500/10",
      iconBg: "bg-blue-500/10 text-blue-500",
      titleColor: "text-blue-500",
    },
    {
      title: "Kuota Terpakai",
      icon: User,
      count: response?.success ? response.data?.terpakai ?? 0 : 0,
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

export default CoordinatorQuotaKP;