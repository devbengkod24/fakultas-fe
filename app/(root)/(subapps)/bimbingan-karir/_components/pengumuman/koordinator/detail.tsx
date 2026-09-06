"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Announcement } from "@/types/bimbingan-karir/koordinator/pengumuman/pengumuman";
import { Calendar, ClockIcon, Megaphone } from "lucide-react";
import dayjs from "dayjs";
import DOMPurify from "isomorphic-dompurify";

interface DetailDialogAnnouncementProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  announcement?: Announcement;
}

const DetailDialogAnnouncement = ({ isOpen, setIsOpen, announcement }: DetailDialogAnnouncementProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
        <DialogTitle className="flex items-center mb-2">
            <Megaphone className="mr-2 h-5 w-5 text-primary" />
            {announcement?.judul}
          </DialogTitle>
          <DialogDescription className="flex text-xs">
            <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            {dayjs(announcement?.published_at).format("DD MMM YYYY")}
            <span className="mx-2 text-gray-300">|</span>
            <ClockIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            {dayjs(announcement?.published_at).format("HH:mm")}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(announcement?.isi || "") }}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Tutup</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailDialogAnnouncement;
