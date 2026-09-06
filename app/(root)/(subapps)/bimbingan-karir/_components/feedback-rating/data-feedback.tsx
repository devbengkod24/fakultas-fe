"use client"

import { DataTable } from "@/components/data-table"
import { Columns } from "./column"
import { useSearchParams } from "next/navigation"
import useSWR from "swr"
import EmptyState from "@/components/empty-state"
import { AlertTriangle, FileX } from "lucide-react"
import { FilterAllFeedback } from "./filter-all-feedback"
import { FeedbackRatingService } from "@/api/bimbingan-karir"
import { useProfile } from "@/context/profileUseContext"
import { useEffect } from "react"

// Fetcher untuk data feedback dengan filter
const fetcherFeedbackRating = (activeProdiId: number | null, page: number, limit: number, kegiatan_id?: number, rating?: number) => {
  return FeedbackRatingService.getAllFeedback(activeProdiId, page, limit, kegiatan_id, rating).then(res => res);
}
// Fetcher untuk options kegiatan
const fetcherKegiatanOptions = (activeProdiId: number | null) => {
  return FeedbackRatingService.getAllOptions(activeProdiId).then((res) => res);
}

export function TablesFeedbackRating() {
  const { activeProdiId } = useProfile();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const kegiatanIdParam = searchParams.get("id");
  const kegiatanId = kegiatanIdParam === null || kegiatanIdParam === "" ? undefined : Number(kegiatanIdParam);

  const ratingRaw = Number(searchParams.get("rating")); // bisa null | "" | "1".."5"
  // Jika null => undefined (tidak kirim). Jika "" => kirim empty (rating=)
  const ratingParam = ratingRaw === null ? undefined : ratingRaw;

  const { data: feedbackData, error: feedbackError, isLoading: feedbackLoading, mutate } = useSWR(
    ["feedback-rating", activeProdiId, page, limit, kegiatanId, ratingParam],
    () => fetcherFeedbackRating(activeProdiId, page, limit, kegiatanId, ratingParam),
    { revalidateOnFocus: false, dedupingInterval: 0 }
  );

  useEffect(() => {
    if (mutate) {
      mutate();
    }
  }, [activeProdiId, mutate]);

  // SWR untuk options kegiatan
  const { data: kegiatanOptions, error: kegiatanError } = useSWR(
    ["kegiatan-options", activeProdiId],
    () => fetcherKegiatanOptions(activeProdiId),
    { revalidateOnFocus: false, dedupingInterval: 0 }
  );
  
  
  const dataFeedback = feedbackData?.data || [];

  // Data kegiatan dari getAllOptions
  const kegiatanList = kegiatanOptions?.data ?? [];

  const totalPages = feedbackData?.meta?.pagination?.last_page ?? 1;
  const totalData = feedbackData?.meta?.pagination?.total ?? 0;
  const currentPage = feedbackData?.meta?.pagination?.current_page ?? 1;
  const perPage = feedbackData?.meta?.pagination?.per_page ?? limit;
  
  if (feedbackError || kegiatanError) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Gagal Memuat Data"
        subtitle="Terjadi kesalahan saat memuat data feedback rating. Silahkan coba lagi."
        className="h-[400px]"
      />
    );
  }

  if (!feedbackLoading && dataFeedback.length === 0) {
    return (
      <div>
        <div className="w-full flex flex-col gap-2">
          <FilterAllFeedback kegiatanList={kegiatanList} />
          <EmptyState
            icon={FileX}
            title="Tidak Ada Data Feedback Rating"
            subtitle="Belum ada data feedback rating yang tersedia, silahkan coba lagi nanti."
            className="h-[400px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full flex flex-col gap-2">
        <FilterAllFeedback kegiatanList={kegiatanList} />
        <DataTable 
          columns={Columns(currentPage, perPage)}
          data={dataFeedback}
          loading={feedbackLoading}
          pagination={{
            currentPage: page,
            lastPage: totalPages,
            limit,
            total: totalData,
          }}
        />
      </div>
    </div>
  )
}
