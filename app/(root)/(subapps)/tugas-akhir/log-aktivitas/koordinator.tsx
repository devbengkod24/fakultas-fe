"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { useState } from "react";
import { Activity, AlertCircle, User, Users } from "lucide-react";
import DashboardHeader from "@/components/dashboard-header";
import { CustomSolidTabs } from "@/components/custom-solid-tabs";
import { LogAktivitasService } from "@/api/tugas-akhir";
import PaginationControls from "@/components/pagination-control";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/empty-state";

const fetcher = (tab: string, page: number, limit: number) => {
  if (tab === "dosen") {
    return LogAktivitasService.getAllDosen(page, limit).then((res) => res);
  } else if (tab === "mahasiswa") {
    return LogAktivitasService.getAllMahasiswa(page, limit).then((res) => res);
  }
  return LogAktivitasService.getAll(page, limit).then((res) => res);
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
  lecture: string;
  student: string;
};

const KoordinatorLogAktivitas = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const [activeTab, setActiveTab] = useState("all");

  const {
    data: response,
    error,
    isLoading,
  } = useSWR(
    ["log-aktivitas", activeTab, page, limit],
    () => fetcher(activeTab, page, limit),
    { dedupingInterval: 1000 }
  );

  const pagination = response?.meta?.pagination;
  const totalData = pagination?.total || 0;
  const lastPages = pagination?.last_page || 1;
  const currentPage = pagination?.current_page || 1;

  const filteredActivities = response?.data || [];

  const tabs: TabItem[] = [
    { status: "all", label: "Semua", icon: Users },
    { status: "dosen", label: "Dosen", icon: User },
    { status: "mahasiswa", label: "Mahasiswa", icon: User },
  ];

  return (
    <>
      <DashboardHeader
        breadcrumbItems={[{ name: "Dashboard", url: "tugas-akhir" }]}
        titleItems={[
          {
            title: "Log Aktivitas",
            subtitle: "Aktivitas yang telah dilakukan oleh dosen dan mahasiswa",
          },
        ]}
      />

      <div>
        <CustomSolidTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

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
                            {log.lecture || log.student || "Unknown"}
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

export default KoordinatorLogAktivitas;
