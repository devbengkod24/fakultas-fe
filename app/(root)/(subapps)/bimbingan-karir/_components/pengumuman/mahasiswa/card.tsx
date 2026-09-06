"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, ClockIcon, Megaphone, MoreHorizontal } from "lucide-react";
import { Announcement } from "@/types/bimbingan-karir/koordinator/pengumuman/pengumuman";
import dayjs from "dayjs";

interface CardAnnouncementProps {
  announcement: Announcement;
  onViewDetail: (announcement: Announcement) => void;
}

const CardAnnouncement = ({ announcement, onViewDetail }: CardAnnouncementProps) => {
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };
  
  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="flex items-center mb-2">
            <Megaphone className="mr-2 h-5 w-5 text-primary" />
            {announcement.judul}
          </CardTitle>
          <CardDescription className="flex text-xs">
            <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            {dayjs(announcement.published_at).format("DD MMM YYYY")}
            <span className="mx-2 text-gray-300">|</span>
            <ClockIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            {dayjs(announcement.published_at).format("HH:mm")}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground line-clamp-2"> {stripHtml(announcement.isi)} </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="text-primary-500 hover:text-primary-500 hover:bg-primary-50 border-primary-400" onClick={() => onViewDetail(announcement)}>
          Lihat Detail
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardAnnouncement;
