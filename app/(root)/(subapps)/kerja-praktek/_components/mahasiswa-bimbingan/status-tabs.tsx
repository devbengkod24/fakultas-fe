"use client";

import { CustomTabs } from "@/components/custom-tabs";
import { Clock, FileText, Check, X } from "lucide-react";

type Status = "pending" | "accepted" | "rejected";

interface StatusTabsProps {
  statusFilter: Status | "all";
  setStatusFilter: (status: Status | "all") => void;
  pendingCount: number;
  setCurrentPage: (page: number) => void;
}

export function StatusTabs({
  statusFilter,
  setStatusFilter,
  pendingCount,
  setCurrentPage,
}: StatusTabsProps) {
  const tabs = [
    { status: "all", label: "Semua", icon: FileText },
    { status: "pending", label: "Pending", icon: Clock, count: pendingCount },
    {
      status: "accepted",
      label: "Diterima",
      icon: Check,
    },
    { status: "rejected", label: "Ditolak", icon: X },
  ];

  const handleTabChange = (status: string) => {
    setStatusFilter(status as Status | "all");
    setCurrentPage(1);
  };

  return (
    <CustomTabs
      tabs={tabs}
      activeTab={statusFilter}
      onTabChange={handleTabChange}
    />
  );
}
