"use client";

import { CustomTabs } from "@/components/custom-tabs";
import { Clock, FileText, Check, X, Ban, Inbox } from "lucide-react";

type Status = "pending" | "accepted" | "rejected" | "canceled";

interface StatusTabsProps {
  statusFilter: Status | "all";
  setStatusFilter: (status: Status | "all") => void;
  pendingCount: number;
  isKoor?: boolean;
}

export function StatusTabs({
  statusFilter,
  setStatusFilter,
  pendingCount,
  isKoor = true,
}: StatusTabsProps) {
  const tabs = isKoor
    ? [
        { status: "all", label: "Semua", icon: FileText },
        { status: "pending", label: "Pending", icon: Clock, count: pendingCount },
        { status: "accepted", label: "Diterima", icon: Check },
        { status: "rejected", label: "Ditolak", icon: X },
        { status: "canceled", label: "Dibatalkan", icon: Ban },
      ]
    : [
        {
          status: "all",
          label: "Baru",
          icon: Inbox,
          count: pendingCount > 0 ? pendingCount : undefined,
        },
        { status: "accepted", label: "Diterima", icon: Check },
        { status: "rejected", label: "Ditolak", icon: X },
        { status: "canceled", label: "Dibatalkan", icon: Ban },
      ];

  const handleTabChange = (status: string) => {
    setStatusFilter(status as Status | "all");
  };

  return (
    <CustomTabs
      tabs={tabs}
      activeTab={statusFilter}
      onTabChange={handleTabChange}
    />
  );
}
