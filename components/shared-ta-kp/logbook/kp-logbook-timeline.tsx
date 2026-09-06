"use client";

import { LogbookTimelineView, type LogbookEntry, type UpdateLogbookData } from "./logbook-timeline-view";
import { LogbookService } from "@/api/kerja-praktek";
import { toast } from "sonner";

interface KPLogbookChapter {
  bab: number;
  entries: KPLogbookEntry[];
}

interface KPLogbookEntry {
  id: number;
  bab: number;
  uraian: string;
  dokumen: string | null;
  status: "accepted" | "revised" | "pending";
  tanggal: string;
  created_at: string;
  updated_at: string;
}

interface KPLogbookTimelineProps {
  logbooksByBab: KPLogbookChapter[];
  onAccept?: (logbookId: number) => void;
  onEdit?: (logbookEntry: KPLogbookEntry) => void;
  userRole?: string;
  mahasiswaId?: number;
}

export function KPLogbookTimeline({
  logbooksByBab,
  onAccept,
  userRole,
}: KPLogbookTimelineProps) {
  // Transform grouped data to flat array for shared component
  const entries: LogbookEntry[] = logbooksByBab.flatMap((chapter) =>
    chapter.entries.map((entry) => ({
      id: entry.id,
      tanggal: entry.tanggal,
      uraian: entry.uraian,
      bab: entry.bab,
      status: entry.status,
      dokumen: entry.dokumen,
    }))
  );

  const handleUpdateLogbook = async (
    id: number,
    data: UpdateLogbookData
  ): Promise<unknown> => {
    return LogbookService.updateLogbook(id, {
      uraian: data.uraian,
      bab: data.bab,
      tanggal: data.tanggal,
      dokumen: data.dokumen ?? "",
    });
  };

  const handleStatusChange = async (
    logbookId: number,
    status: "pending" | "accepted" | "revised"
  ) => {
    const isKoor = userRole === "koordinator" || userRole === "super_fakultas";

    if (status === "accepted" && onAccept) {
      onAccept(logbookId);
    } else if (status === "revised") {
      try {
        const response = isKoor
          ? await LogbookService.updateStatusLogbookKoor(logbookId, "revised")
          : await LogbookService.updateStatusLogbook(logbookId, "revised");

        if (response.success) {
          toast.success("Berhasil", {
            description: "Logbook telah diminta untuk direvisi",
          });
        } else {
          toast.error("Gagal", {
            description: response.message ?? "Gagal meminta revisi",
          });
        }
      } catch (err) {
        toast.error("Terjadi kesalahan", {
          description: "Tidak dapat menghubungi server",
        });
      }
    }
  };

  return (
    <LogbookTimelineView
      entries={entries}
      onStatusChange={handleStatusChange}
      onUpdateLogbook={handleUpdateLogbook}
      role={userRole}
    />
  );
}