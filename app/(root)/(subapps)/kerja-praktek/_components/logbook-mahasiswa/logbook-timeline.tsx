"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Calendar, Check, ChevronDown, FileText, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { Role } from "@/types/role";

dayjs.locale("id");

interface LogbookEntry {
  id: number;
  bab: number;
  uraian: string;
  dokumen: string | null;
  status: "accepted" | "revised" | "pending";
  tanggal: string;
  created_at: string;
  updated_at: string;
}

interface LogbookChapter {
  bab: number;
  entries: LogbookEntry[];
}

interface LogbookTimelineProps {
  logbooksByBab: LogbookChapter[];
  onAccept?: (logbookId: number) => void;
  onEdit?: (logbookEntry: LogbookEntry) => void;
  userRole?: Role;
}

export function LogbookTimeline({
  logbooksByBab,
  onAccept,
  onEdit,
  userRole,
}: LogbookTimelineProps) {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);

  const openConfirmModal = (entryId: number) => {
    setSelectedEntryId(entryId);
    setConfirmModalOpen(true);
  };

  const handleAcceptConfirm = () => {
    if (selectedEntryId !== null && onAccept) {
      onAccept(selectedEntryId);
      setConfirmModalOpen(false);
    }
  };

  const handleEditClick = (entry: LogbookEntry) => {
    if (onEdit) {
      onEdit(entry);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return <Badge variant="success">Diterima</Badge>;
      case "rejected":
        return <Badge variant="destructiveOutline">Ditolak</Badge>;
      case "revised":
        return <Badge variant="destructiveOutline">Revisi</Badge>;
      case "pending":
        return <Badge variant="secondary">Menunggu</Badge>;
      default:
        return <Badge variant="secondary">{status || "Menunggu"}</Badge>;
    }
  };

  const sortedChapters = [...logbooksByBab].sort((a, b) => a.bab - b.bab);
  const canAccept = userRole !== "mahasiswa";
  const canEdit = userRole === "mahasiswa";

  return (
    <div className="space-y-8">
      {sortedChapters.map((chapter, chapterIndex) => {
        const entries = chapter.entries || [];

        const sortedEntries = [...entries].sort(
          (a, b) => dayjs(b.tanggal).valueOf() - dayjs(a.tanggal).valueOf()
        );

        const latestEntry = sortedEntries[0];

        if (!latestEntry) return null;

        return (
          <div key={chapter.bab} className="relative">
            {chapterIndex < sortedChapters.length - 1 && (
              <div className="absolute left-5 top-10 bottom-[-32px] w-[0.5px] bg-muted-foreground/20" />
            )}

            <Collapsible>
              <div className="flex gap-4">
                <div className="flex-shrink-0 size-10 rounded-full bg-primary-100 flex items-center justify-center z-10 border border-primary-200">
                  <span className="text-sm font-medium text-primary">
                    {chapter.bab}
                  </span>
                </div>

                <div className="flex-1 bg-card rounded-lg border">
                  <CollapsibleTrigger asChild>
                    <div className="p-4 cursor-pointer hover:bg-muted/50 rounded-t-lg flex justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">
                            Bimbingan Bab {chapter.bab}
                          </h3>
                          <span>{getStatusBadge(latestEntry.status)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                          Terakhir:{" "}
                          {dayjs(latestEntry.tanggal).format("D MMMM YYYY")}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                          {entries.length}x bimbingan
                        </p>
                      </div>
                      <ChevronDown className="h-5 w-5 transition-transform" />
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="border-t px-4 py-2 space-y-4">
                      {sortedEntries.map((entry, entryIndex) => (
                        <div
                          key={entry.id}
                          className={`${
                            entryIndex < sortedEntries.length - 1
                              ? "border-b pb-4"
                              : "pb-2"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2 border-r pr-3">
                              <Calendar className="size-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {dayjs(entry.tanggal).format("dddd, D MMM YYYY")}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-800 mb-4">{entry.uraian}</p>

                          <div className="flex gap-2">
                            {entry.dokumen && (
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={entry.dokumen}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  Lihat Dokumen
                                </a>
                              </Button>
                            )}

                            {canEdit &&
                              entry.status === "pending" &&
                              onEdit && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditClick(entry)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Button>
                              )}

                            {canAccept &&
                              (entry.status === "revised" ||
                                entry.status === "pending") &&
                              onAccept && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 hover:text-green-600 border-green-300 hover:border-green-400"
                                  onClick={() => openConfirmModal(entry.id)}
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  Terima
                                </Button>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </div>
              </div>
            </Collapsible>
          </div>
        );
      })}

      {logbooksByBab.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="mx-auto h-12 w-12 mb-4 opacity-20" />
          <p>Belum ada catatan bimbingan</p>
        </div>
      )}

      <ConfirmationModal
        open={confirmModalOpen}
        setOpen={setConfirmModalOpen}
        onConfirm={handleAcceptConfirm}
        title="Konfirmasi Penerimaan"
        description="Apakah Anda yakin ingin menerima bimbingan ini?"
        confirmText="Terima"
        cancelText="Batal"
      />
    </div>
  );
}