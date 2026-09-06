"use client";

import { useState } from "react";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { PengumumanService } from "@/api";
import CardAnnouncement from "../_components/pengumuman/mahasiswa/card";
import DetailDialogAnnouncement from "../_components/pengumuman/mahasiswa/detail";
import { Button } from "@/components/ui/button";
import { Announcement } from "@/types/bimbingan-karir/koordinator/pengumuman/pengumuman";
import SearchControl from "@/components/search-control";
import PaginationControls from "@/components/pagination-control";
import { SkeletonPengumuman } from "../_components/pengumuman/skeleton";

// === Fetcher untuk SWR ===
const fetcher = (type: string, page: number, limit: number, search: string) =>
  PengumumanService.getPengumumanList(type, page, limit, search).then((res) => res);

export default function MahasiswaPengumumanBK() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const [selectedPengumuman, setSelectedPengumuman] = useState<Announcement | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);


  const { data, error, isLoading, mutate } = useSWR(
    ["pengumuman", "bk", page, limit, search],
    () => fetcher("bk", page, limit, search),
    { revalidateOnFocus: false }
  );

  const pengumumans = data?.data ?? [];
  const totalPages = data?.meta?.pagination.last_page ?? 1;
  const totalData = data?.meta?.pagination.total ?? 0;


  const openDetailDialog = (pengumuman: Announcement) => {
    setSelectedPengumuman(pengumuman);
    setIsDetailDialogOpen(true);
  };

  if (isLoading) return <SkeletonPengumuman/>;
  if (error) return <div>Gagal memuat data pengumuman</div>;

  return (
    <div className="space-y-4 relative">
      <div className="flex">
        <SearchControl placeholder="Cari pengumuman..." className="w-full md:w-80 xl:w-80" />
      </div>


      {error ? (
        <div className="text-center text-red-500">
          Error: Gagal mengambil data pengumuman
          <Button
            size="sm"
            onClick={() => mutate()}
            className="mt-2"
            variant="outline"
          >
            Coba Lagi
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {pengumumans.map((announcement: Announcement) => (
              <CardAnnouncement
                key={announcement.id}
                announcement={announcement}
                onViewDetail={openDetailDialog}
              />
            ))}
          </div>

          {/* Kalau datanya kosong */}
          {!isLoading && pengumumans.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <CalendarIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Belum ada pengumuman</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Pengumuman tidak tersedia. Silakan cek kembali nanti.
              </p>
            </div>
          )}

          {/* Kalau loading atau ada data, tampilkan Pagination */}
          {(isLoading || pengumumans.length > 0) && (
            <PaginationControls currentPage={page} lastPage={totalPages} total={totalData}/>
          )}
        </>
      )}

      {/* Dialog Detail */}
      {isDetailDialogOpen && (
        <DetailDialogAnnouncement
          isOpen={isDetailDialogOpen}
          setIsOpen={setIsDetailDialogOpen}
          announcement={selectedPengumuman || undefined}
        />
      )}
    </div>
  );
}
