"use client"

import dayjs from "dayjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, UserIcon, ClockIcon, Pencil, Trash2, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Pengumuman } from "@/types/kerja-praktek/pengumuman"

interface PengumumanCardsProps {
  pengumumans: Pengumuman[];
  onEdit: (pengumuman: Pengumuman) => void;
  onDelete: (pengumuman: Pengumuman) => void;
  isLoading?: boolean;
}

const PengumumanCardSkeleton = () => (
  <Card className="overflow-hidden shadow-none">
    <CardHeader className="pb-3">
      <div className="flex justify-between items-start gap-2">
        <Skeleton className="h-5 sm:h-6 w-3/4 flex-1" />
        <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-2">
        <div className="flex items-center gap-1">
          <Skeleton className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
        </div>
        <span className="hidden sm:inline text-gray-300">|</span>
        <div className="flex items-center gap-1">
          <Skeleton className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
        </div>
        <span className="hidden sm:inline text-gray-300">|</span>
        <div className="flex items-center gap-1">
          <Skeleton className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-3 sm:h-4 w-full mb-2" />
      <Skeleton className="h-3 sm:h-4 w-5/6" />
    </CardContent>
  </Card>
)

export function PengumumanCards({
  pengumumans,
  onEdit,
  onDelete,
  isLoading
}: PengumumanCardsProps) {
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent ?? "";
  };

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-1 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <PengumumanCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-1 gap-4">
      {pengumumans
        .filter((pengumuman): pengumuman is Pengumuman => {
          const isValid = !!pengumuman && !!pengumuman.judul && !!pengumuman.id;
          if (!isValid) {
            console.warn("Invalid pengumuman filtered:", pengumuman);
          }
          return isValid;
        })
        .map((pengumuman) => (
          <Card key={pengumuman.id} className="overflow-hidden shadow-none hover:shadow-sm transition-shadow">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-base sm:text-lg font-medium leading-tight flex-1">
                  {pengumuman.judul}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 flex-shrink-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[100px] z-50">
                    <DropdownMenuItem onClick={() => onEdit(pengumuman)}>
                      <Pencil className="size-4 text-primary mr-2" />
                      <span className="text-primary">Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDelete(pengumuman)}>
                      <Trash2 className="size-4 text-red-500 mr-2" />
                      <span className="text-red-500">Hapus</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Mobile: Stack vertically, Desktop: Inline with separators */}
              <CardDescription className="text-xs sm:text-sm mt-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-1">
                    <UserIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{pengumuman.user ?? "Koordinator KP"}</span>
                  </div>
                  <span className="hidden sm:inline text-gray-300">|</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground flex-shrink-0" />
                    <span>{dayjs(pengumuman.published_at).format("DD MMM YYYY")}</span>
                  </div>
                  <span className="hidden sm:inline text-gray-300">|</span>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground flex-shrink-0" />
                    <span>{dayjs(pengumuman.published_at).format("HH:mm")}</span>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="line-clamp-3 sm:line-clamp-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {stripHtml(pengumuman.isi)}
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
