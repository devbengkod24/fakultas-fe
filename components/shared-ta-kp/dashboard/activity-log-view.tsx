"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { History, AlertCircle } from "lucide-react";
import EmptyState from "@/components/empty-state";

export interface ActivityLogItem {
  id: number;
  lecture: string;
  activity: string;
  time: string;
}

export interface ActivityLogDay {
  date: string;
  logs: ActivityLogItem[];
}

interface ActivityLogViewProps {
  activities: ActivityLogDay[];
  loading: boolean;
  error: boolean;
  maxHeightClassName?: string;
}

export function ActivityLogView({
  activities,
  loading,
  error,
  maxHeightClassName = "max-h-64",
}: ActivityLogViewProps) {
  return (
    <Card className="col-span-2 flex h-full flex-col p-4 shadow-none">
      <CardTitle className="mb-2 flex items-center gap-2 text-sm font-medium">
        <History className="size-4" />
        <span>Log Aktivitas Mahasiswa</span>
      </CardTitle>
      <div className="flex flex-col justify-center divide-y divide-slate-200 py-6">
        <div className="mt-2 w-full">
          <div
            className={`scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-thumb-rounded-full -my-7 overflow-y-scroll ${maxHeightClassName}`}
          >
            {loading ? (
              <>
                {[1, 2].map((dayIndex) => (
                  <div key={dayIndex}>
                    <Skeleton className="mb-2 h-6 w-32" />
                    {[1, 2, 3].map((logIndex) => (
                      <div
                        key={logIndex}
                        className="group relative py-2 pl-8 sm:pl-10"
                      >
                        <div className="mb-1 flex flex-col items-start before:absolute before:left-2 before:h-full before:w-[1px] before:-translate-x-1/2 before:translate-y-3 before:self-start before:bg-slate-300 after:absolute after:left-2 after:box-content after:h-2 after:w-2 after:-translate-x-1/2 after:translate-y-1.5 after:rounded-full after:border-2 after:border-slate-50 after:bg-slate-200 group-last:before:hidden sm:flex-row sm:before:left-0 sm:before:ml-[1rem] sm:after:left-0 sm:after:ml-[1rem]" />
                        <Skeleton className="mb-1 h-3 w-3/4" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    ))}
                  </div>
                ))}
              </>
            ) : error ? (
              <EmptyState
                icon={AlertCircle}
                title="Gagal memuat data"
                subtitle="Log aktivitas tidak dapat ditampilkan"
                variant="small"
                className="py-8"
              />
            ) : activities.length > 0 ? (
              activities.map((activityDay, index) => (
                <div key={index}>
                  <div className="border-b border-gray-200 bg-blue-500/5 px-2 py-1 text-xs font-medium text-primary">
                    {activityDay.date}
                  </div>
                  {activityDay.logs.map((log) => (
                    <div
                      key={log.id}
                      className="group relative py-2 pl-8 sm:pl-10"
                    >
                      <div className="mb-1 flex flex-col items-start before:absolute before:left-2 before:h-full before:w-[1px] before:-translate-x-1/2 before:translate-y-3 before:self-start before:bg-slate-300 after:absolute after:left-2 after:box-content after:h-2 after:w-2 after:-translate-x-1/2 after:translate-y-1.5 after:rounded-full after:border-2 after:border-slate-50 after:bg-primary group-last:before:hidden sm:flex-row sm:before:left-0 sm:before:ml-[1rem] sm:after:left-0 sm:after:ml-[1rem]" />
                      <div className="text-xs text-slate-500">
                        <span className="font-semibold text-black">
                          {log.lecture}
                        </span>{" "}
                        <span>{log.activity}</span>
                      </div>
                      <div className="text-xs text-slate-500">{log.time}</div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <EmptyState
                icon={History}
                title="Tidak ada aktivitas"
                subtitle="Belum ada log aktivitas yang tercatat"
                variant="small"
                className="py-8"
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
