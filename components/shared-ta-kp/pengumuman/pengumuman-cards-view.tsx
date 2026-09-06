/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dayjs from "dayjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  UserIcon,
  ClockIcon,
  Pencil,
  Trash2,
  MoreVertical,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { PengumumanItem } from "./types";

interface PengumumanCardsViewProps {
  pengumumans: PengumumanItem[];
  onEdit: (pengumuman: PengumumanItem) => void;
  onDelete: (pengumuman: PengumumanItem) => void;
  isLoading?: boolean;
  profile?: any;
  detailBasePath: string;
}

const PengumumanCardSkeleton = () => (
  <Card className="overflow-hidden shadow-none">
    <CardHeader className="pb-3">
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="flex items-center gap-2 mt-1">
        <Skeleton className="h-3.5 w-3.5" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-3.5 w-3.5" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-3.5 w-3.5" />
        <Skeleton className="h-4 w-16" />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </CardContent>
    <CardFooter className="flex justify-end pt-2">
      <Skeleton className="h-4 w-20" />
    </CardFooter>
  </Card>
);

export default function PengumumanCardsView({
  pengumumans,
  onEdit,
  onDelete,
  isLoading,
  profile,
  detailBasePath,
}: PengumumanCardsViewProps) {
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <PengumumanCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-1 gap-4">
      {pengumumans
        .filter((pengumuman): pengumuman is PengumumanItem => {
          const isValid = !!pengumuman && !!pengumuman.judul && !!pengumuman.id;
          if (!isValid) {
            console.warn("Invalid pengumuman filtered:", pengumuman);
          }
          return isValid;
        })
        .map((pengumuman) => (
          <Card key={pengumuman.id} className="overflow-hidden shadow-none">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-medium">
                  {pengumuman.judul}
                </CardTitle>
                {profile?.roles === "koordinator" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="size-8">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[80px] z-50">
                      <DropdownMenuItem onClick={() => onEdit(pengumuman)}>
                        <Pencil className="size-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onDelete(pengumuman)}>
                        <Trash2 className="size-4 text-red-500" />
                        <span className="text-red-500">Hapus</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <CardDescription className="flex items-center text-sm mt-1">
                <UserIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                {pengumuman.user || "Koordinator"}
                <span className="mx-2 text-gray-300">|</span>
                <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                {dayjs(pengumuman.published_at).format("DD MMM YYYY")}
                <span className="mx-2 text-gray-300">|</span>
                <ClockIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                {dayjs(pengumuman.published_at).format("HH:mm")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="line-clamp-2 text-sm text-muted-foreground">
                {stripHtml(pengumuman.isi)}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-2">
              <div className="flex gap-2 group">
                <Link
                  className="flex items-center text-sm text-primary font-medium"
                  href={`${detailBasePath}/${pengumuman.id}`}
                >
                  Lihat Detail
                  <ChevronRight className="size-4 translate-animation" />
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
    </div>
  );
}
