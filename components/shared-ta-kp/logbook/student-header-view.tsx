"use client";

import { useState, type ReactNode } from "react";
import { ExternalLink, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { handleToastResponse } from "@/lib/toast-response";

export interface StudentHeaderBaseData {
  name: string;
  nim: string;
  foto?: string | null;
  jml_bimbingan: number;
  progressPercent: number;
  progressLabel: string;
  statusBadgeLabel?: string;
  statusBadgeVariant?: "primary" | "secondary";
}

interface StudentHeaderViewProps {
  data?: StudentHeaderBaseData;
  folderLink?: string | null;
  folderLabel?: string;
  onSaveFolder?: (link: string) => Promise<unknown>;
  onFolderSaved?: () => void;
  isStudent?: boolean;
  detailContent?: ReactNode;
  detailTitle?: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export function StudentHeaderView({
  data,
  folderLink,
  folderLabel = "Folder",
  onSaveFolder,
  onFolderSaved,
  isStudent = false,
  detailContent,
  detailTitle = "Detail Mahasiswa",
}: StudentHeaderViewProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [folderInput, setFolderInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!data) {
    return (
      <Card className="shadow-none">
        <CardContent className="p-6 text-center text-gray-500">
          Data mahasiswa tidak tersedia.
        </CardContent>
      </Card>
    );
  }

  const handleFolderAction = () => {
    if (isStudent && onSaveFolder) {
      setFolderInput(folderLink ?? "");
      setFolderModalOpen(true);
    } else if (folderLink) {
      window.open(folderLink, "_blank");
    }
  };

  const handleSaveFolder = async () => {
    if (!onSaveFolder) return;
    setIsSaving(true);
    try {
      const response = await onSaveFolder(folderInput.trim());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handleToastResponse(response as any, () => {
        setFolderModalOpen(false);
        onFolderSaved?.();
      });
    } catch {
      toast.error("Terjadi kesalahan saat memperbarui folder.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="shadow-none">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-24 w-24 border">
              <AvatarImage
                src={data.foto || ""}
                alt={data.name}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl">
                {initials(data.name)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div className="flex justify-between">
              <div>
                <h1 className="text-xl font-semibold capitalize">
                  {data.name.toLowerCase()}
                </h1>
                <p className="text-gray-500 font-normal">{data.nim}</p>
              </div>

              <div className="flex gap-2">
                {/* Folder button */}
                <Button
                  size="sm"
                  variant="primaryOutline"
                  onClick={handleFolderAction}
                  disabled={!folderLink && !isStudent}
                >
                  <ExternalLink className="h-4 w-4" />
                  {folderLabel}
                </Button>

                {/* Folder edit modal — mahasiswa only */}
                {isStudent && onSaveFolder && (
                  <Dialog open={folderModalOpen} onOpenChange={setFolderModalOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{folderLabel}</DialogTitle>
                        <p className="text-sm text-gray-500">
                          Link folder untuk keperluan dokumen bimbingan.
                        </p>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Link Folder
                          </label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="https://drive.google.com/..."
                              value={folderInput}
                              onChange={(e) => setFolderInput(e.target.value)}
                              disabled={isSaving}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                if (folderInput) window.open(folderInput, "_blank");
                              }}
                              disabled={!folderInput}
                            >
                              <ExternalLink className="size-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setFolderModalOpen(false)}
                            disabled={isSaving}
                          >
                            Batal
                          </Button>
                          <Button
                            onClick={handleSaveFolder}
                            disabled={isSaving || !folderInput.trim()}
                          >
                            {isSaving ? "Menyimpan..." : "Simpan"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {/* Detail button */}
                {detailContent && (
                  <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="primaryOutline">
                        <Info className="h-4 w-4" />
                        {detailTitle}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{detailTitle}</DialogTitle>
                      </DialogHeader>
                      {detailContent}
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

            {/* Status badge */}
            {data.statusBadgeLabel && (
              <Badge variant={data.statusBadgeVariant ?? "primary"} className="h-fit">
                {data.statusBadgeLabel}
              </Badge>
            )}

            {/* Stats + progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span>
                    Total Bimbingan: <strong>{data.jml_bimbingan ?? 0}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>{data.progressLabel}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-800">
                  <span>Progress</span>
                  <span>{data.progressPercent.toFixed(0)}%</span>
                </div>
                <Progress value={data.progressPercent} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
