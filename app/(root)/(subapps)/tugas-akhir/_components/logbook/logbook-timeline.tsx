"use client";

import { useSearchParams } from "next/navigation";
import { LogbookService } from "@/api/tugas-akhir";
import {
  LogbookTimelineView,
  type LogbookEntry,
  type UpdateLogbookData,
} from "@/components/shared-ta-kp/logbook/logbook-timeline-view";

interface LogbookTimelineProps {
  entries: LogbookEntry[];
  onStatusChange?: (
    logbookId: number,
    status: "pending" | "accepted" | "revised",
    reason?: string
  ) => void;
  onUpdate?: () => void;
  role?: string;
}

export function LogbookTimeline({
  entries,
  onStatusChange,
  onUpdate,
  role,
}: LogbookTimelineProps) {
  const searchParams = useSearchParams();
  const isKoor = searchParams.get("isKoor") === "true";

  const effectiveRole = isKoor && role !== "mahasiswa" ? "koordinator" : role;

  const handleUpdateLogbook = async (
    id: number,
    data: UpdateLogbookData
  ): Promise<unknown> => {
    return LogbookService.updateLogbook(data, id);
  };

  return (
    <LogbookTimelineView
      entries={entries}
      onStatusChange={onStatusChange}
      onUpdate={onUpdate}
      onUpdateLogbook={handleUpdateLogbook}
      role={effectiveRole}
    />
  );
}
