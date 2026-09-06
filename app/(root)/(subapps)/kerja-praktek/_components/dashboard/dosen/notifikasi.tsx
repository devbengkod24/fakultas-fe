"use client"

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Info, Calendar, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { PengumumanService } from "@/api"
import type { Pengumuman } from "@/types/kerja-praktek/pengumuman";
import { sanitizeHtml } from "@/lib/sanitize-html";

const fetcher = (type: string, page: number, limit: number, search: string) =>
  PengumumanService.getPengumumanList(type, page, limit, search).then(
    (res) => res
  );

const DashboardDosenNotifkasi = () => {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const limit = 5
    const search = searchParams.get("search") ?? "";

    const [selectedPengumuman, setSelectedPengumuman] = useState<Pengumuman | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading } = useSWR(
        ["pengumuman", "KP", page, limit, search],
        () => fetcher("KP", page, limit, search),
        { revalidateOnFocus: false }
    );

    const pengumumans: Pengumuman[] = data?.data ?? [];

    const handlePengumumanClick = (pengumuman: Pengumuman) => {
        setSelectedPengumuman(pengumuman);
        setIsModalOpen(true);
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "dd MMMM yyyy, HH:mm", { locale: id });
        } catch {
            return dateString;
        }
    };

    return (
        <>
            <Card className="shadow-none p-4 col-span-4 rounded-md">
                <CardTitle className="text-sm font-medium mb-2 flex items-center gap-2 justify-between">
                    <span>Notifikasi</span>
                    <Info className="size-4" />
                </CardTitle>
                <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto scrollbar-hidden">
                    {isLoading ? (
                        <div className="py-4 text-center">
                            <p className="text-sm text-gray-500">Memuat notifikasi...</p>
                        </div>
                    ) : pengumumans.length === 0 ? (
                        <div className="py-4 text-center">
                            <p className="text-sm text-gray-500">Tidak ada notifikasi</p>
                        </div>
                    ) : (
                        pengumumans.map((pengumuman) => (
                            <div
                                key={pengumuman.id}
                                className="py-3 cursor-pointer hover:bg-gray-50 transition-colors px-2 rounded"
                                onClick={() => handlePengumumanClick(pengumuman)}
                            >
                                <p className="text-sm font-medium line-clamp-1">
                                    {pengumuman.judul}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {formatDate(pengumuman.published_at)}
                                </p>
                                <button
                                    type="button"
                                    className="text-primary text-xs mt-1 hover:underline"
                                >
                                    Lihat Detail
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                            {selectedPengumuman?.judul}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto">
                        <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="h-4 w-4" />
                                <span>{selectedPengumuman?.user}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {selectedPengumuman?.published_at &&
                                        formatDate(selectedPengumuman.published_at)}
                                </span>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <div
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeHtml(selectedPengumuman?.isi || ""),
                                }}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DashboardDosenNotifkasi;