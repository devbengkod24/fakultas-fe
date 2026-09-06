"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, ClockIcon, UserIcon, Megaphone } from "lucide-react";
import dayjs from "dayjs";
import type { Pengumuman } from "@/types/admin-fakultas/pengumuman/pengumuman";
import { Separator } from "@/components/ui/separator";
import { sanitizeHtml } from "@/lib/sanitize-html";

interface PengumumanDetailDialogProps {
  pengumuman: Pengumuman | null;
  onClose: () => void;
}

export default function PengumumanDetailDialog({
  pengumuman,
  onClose,
}: PengumumanDetailDialogProps) {
  if (!pengumuman) return null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Megaphone className="size-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold leading-tight">
              {pengumuman.judul}
            </DialogTitle>
          </div>
          <div className="flex flex-wrap items-center gap-y-2 text-xs text-muted-foreground mt-2">
            <div className="flex items-center">
              <UserIcon className="h-3.5 w-3.5 mr-1" />
              <span>{pengumuman.user || "Admin Fakultas"}</span>
            </div>
            <span className="mx-2 text-border">|</span>
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>
                {dayjs(pengumuman.published_at).format("DD MMMM YYYY")}
              </span>
            </div>
            <span className="mx-2 text-border">|</span>
            <div className="flex items-center">
              <ClockIcon className="h-3.5 w-3.5 mr-1" />
              <span>{dayjs(pengumuman.published_at).format("HH:mm")} WIB</span>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-2" />

        <div className="py-4">
          <div
            className="prose prose-slate dark:prose-invert max-w-none text-foreground font-normal leading-relaxed text-justify"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(pengumuman.isi) }}
          />
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="px-8">
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
