"use client";

import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { useState } from "react";
import { Activity, AlertCircle, User, Users } from "lucide-react";
import DashboardHeader from "@/components/dashboard-header";
import { CustomSolidTabs } from "@/components/custom-solid-tabs";
import { LogAktivitasService } from "@/api/bimbingan-karir/index";
import PaginationControls from "@/components/pagination-control";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/empty-state";
import withAuth from "@/app/(root)/hoc/withAuth";

const fetcher = (page: number, limit: number, tab: string) => {
  return LogAktivitasService.getAll(page, limit, "", tab).then((res) => res);
};


interface TabItem {
  status: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export type Activity = {
  date: string;
  logs: ActivityLog[];
};

export type ActivityLog = {
  id: number;
  time: string;
  activity: string;
  user: string;
};

const KoordinatorLogAktivitas = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const [activeTab, setActiveTab] = useState("all");
  
  const {
    data: response,
    error,
    isLoading,
  } = useSWR(
    ["log-aktivitas", page, limit, activeTab],
    () => fetcher(page, limit, activeTab),
    { dedupingInterval: 1000 }
  );

  const pagination = response?.meta?.pagination;
  const totalData = pagination?.total || 0;
  const lastPages = pagination?.last_page || 1;
  const currentPage = pagination?.current_page || 1;

  const filteredActivities = response?.data || [];

  const tabs: TabItem[] = [
    { status: "all", label: "Semua", icon: Users },
    { status: "koordinator", label: "Koordinator", icon: User },
    { status: "mahasiswa", label: "Mahasiswa", icon: User },
  ];

  const handleTabChange = (status: string) => {
    setActiveTab(status);
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/bimbingan-karir" },
          { name: "Log Aktivitas", url: "/bimbingan-karir/log-aktivitas" },
        ]}
        titleItems={[
          {
            title: "Log Aktivitas",
            subtitle: "Aktivitas yang telah dilakukan oleh koordinator dan mahasiswa",
          },
        ]}
      />

      <div>
        <div className="flex justify-between items-center">
          <CustomSolidTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        <div className="my-8 flex flex-col justify-center divide-y divide-slate-200">
          <div className="w-full mt-2">
            <div className="-my-7">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index}>
                    <div className="px-4 py-2 ">
                      <Skeleton className="h-5 w-48 rounded" />
                    </div>

                    {Array.from({ length: 2 }).map((_, logIndex) => (
                      <div
                        key={logIndex}
                        className="relative pl-8 sm:pl-10 py-3 group"
                      >
                        <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:w-[1px] before:bg-slate-300 sm:before:ml-[1rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-muted-foreground/40 after:border-2 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[1rem] after:-translate-x-1/2 after:translate-y-1.5"></div>
                        <div className="text-sm">
                          <Skeleton className="inline-block h-4 w-32 rounded mr-2" />
                          <Skeleton className="inline-block h-4 w-48 rounded" />
                        </div>
                        <div className="text-xs mt-1">
                          <Skeleton className="h-3 w-16 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : error ? (
                // Error state
                <EmptyState
                  icon={AlertCircle}
                  title="Gagal memuat data"
                  subtitle="Terjadi kesalahan saat mengambil data log aktivitas."
                />
              ) : filteredActivities.length === 0 ? (
                // Empty state
                <EmptyState
                  icon={Activity}
                  title="Belum ada aktivitas"
                  subtitle="Belum ada log aktivitas yang tersedia saat ini."
                />
              ) : (
                // Data state
                filteredActivities.map((activity: Activity, index: number) => (
                  <div key={index}>
                    {/* Date Header */}
                    <div className="px-4 py-2 text-sm bg-blue-500/5 font-medium text-primary border-b border-gray-200">
                      {activity.date}
                    </div>
                    {/* Timeline Items */}
                    {activity.logs.map((log) => (
                      <div
                        key={log.id}
                        className="relative pl-8 sm:pl-10 py-3 group"
                      >
                        {/* Bullet + Line */}
                        <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:w-[1px] before:bg-slate-300 sm:before:ml-[1rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-primary after:border-2 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[1rem] after:-translate-x-1/2 after:translate-y-1.5"></div>
                        {/* Description */}
                        <div className="text-slate-500 text-sm">
                          <span className="text-black font-semibold">
                            {log.user || "Unknown"}
                          </span>{" "}
                          <span>{log.activity}</span>
                        </div>
                        {/* Time */}
                        <div className="text-slate-500 text-xs">{log.time}</div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {pagination && (
          <PaginationControls
            currentPage={currentPage}
            lastPage={lastPages}
            total={totalData}
          />
        )}
      </div>
    </>
  );
};

export default withAuth(KoordinatorLogAktivitas, "bimbingan-karir", ["koordinator","super_fakultas","admin"]);
