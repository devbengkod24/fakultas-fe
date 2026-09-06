"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookCheck, Briefcase, GraduationCap, Clock, X } from "lucide-react"; // tambah X
import { Calendar, User, ChevronUp, ChevronRight } from "lucide-react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PengumumanService } from "@/api";
import { ManajemenProdiSuperAdminService } from "@/api/superadmin"; // tambah ini
import PaginationControls from "@/components/pagination-control";
import {
  AnnouncementFilter,
  LAYANAN_LIST,
  FAKULTAS_LIST,
  type FilterState,
} from "@/app/(root)/components/landingpage/pengumuman/pengumuman-filter";
import SearchBarAnnouncement from "@/app/(root)/components/landingpage/pengumuman/pengumuman-search-bar";
import type { Announcement } from "@/types/landing-page/pengumuman/announcement";
import { sanitizeHtml } from "@/lib/sanitize-html";
import {
  formatDate,
  formatTime,
  getBadgeVariant,
  getTabCategory,
  needsTruncation,
  truncateHtml,
} from "@/lib/landing-page/pengumuman/announcement-utils";

// ============ Active Filter Chips ============

interface ActiveFilterChipsProps {
  selectedProdi: string | null;
  selectedType: string | null;
  onFilterChange: (filter: FilterState) => void;
}

const ActiveFilterChips = ({
  selectedProdi,
  selectedType,
  onFilterChange,
}: ActiveFilterChipsProps) => {
  const { data: prodiData } = useSWR(
    "prodi-list",
    () => ManajemenProdiSuperAdminService.getAll(1, 50),
    { revalidateOnFocus: false }
  );

  const rawProdis = Array.isArray(prodiData)
    ? prodiData
    : Array.isArray(prodiData?.data)
    ? prodiData.data
    : Array.isArray((prodiData as any)?.data?.data)
    ? (prodiData as any).data.data
    : [];

  // Resolve nama prodi dari ID
  const prodiLabel = selectedProdi
    ? rawProdis.find((p: any) => p.id.toString() === selectedProdi)?.nama ||
      rawProdis.find((p: any) => p.id.toString() === selectedProdi)?.name ||
      null
    : null;

  // Resolve label type
  const typeLabel = selectedType
    ? ([...LAYANAN_LIST, ...FAKULTAS_LIST].find((i) => i.id === selectedType)?.label ?? null)
    : null;

  const hasChips = prodiLabel || typeLabel;
  if (!hasChips) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <span className="text-xs text-gray-400 font-medium">Filter aktif:</span>

      {prodiLabel && (
        <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/20">
          {prodiLabel}
          <button
            onClick={() => onFilterChange({ prodi: null, type: selectedType })}
            className="hover:text-primary/60 transition-colors"
            aria-label={`Hapus filter ${prodiLabel}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {typeLabel && (
        <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/20">
          {typeLabel}
          <button
            onClick={() => onFilterChange({ prodi: selectedProdi, type: null })}
            className="hover:text-primary/60 transition-colors"
            aria-label={`Hapus filter ${typeLabel}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}
    </div>
  );
};

// ============ State Components (inline) ============

const LoadingState = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="bg-white rounded-lg shadow-sm p-4 animate-pulse border-l-4 border-l-gray-200"
      >
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="h-5 bg-gray-200 rounded-full w-20 mb-3" />
        <div className="space-y-1 mb-3">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
          <div className="h-3 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
    ))}
  </div>
);

const ErrorState = () => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
    <div className="text-red-500 mb-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 mx-auto mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="text-lg font-medium">Gagal memuat data pengumuman</h3>
      <p className="mt-2 text-sm text-gray-600">
        Silakan coba lagi nanti atau hubungi administrator.
      </p>
    </div>
  </div>
);

interface EmptyStateProps {
  activeType: string;
  searchQuery?: string;
}

const EmptyState = ({ activeType, searchQuery }: EmptyStateProps) => {
  const getTabIcon = () => {
    switch (activeType) {
      case "ta":
        return <BookCheck className="w-8 h-8 text-primary-600" />;
      case "kp":
        return <Briefcase className="w-8 h-8 text-primary-600" />;
      case "bk":
        return <GraduationCap className="w-8 h-8 text-primary-600" />;
      default:
        return <BookCheck className="w-8 h-8 text-primary-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-12 sm:p-16 text-center border border-gray-100">
      <div className="w-20 h-20 mx-auto mb-8 bg-primary-50 rounded-full flex items-center justify-center">
        {getTabIcon()}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Tidak ada pengumuman
      </h3>
      <p className="text-base text-gray-500 leading-relaxed max-w-md mx-auto">
        {searchQuery
          ? `Tidak ada hasil untuk pencarian "${searchQuery}" pada kategori ${getTabCategory(activeType)}.`
          : `Belum ada pengumuman ${getTabCategory(activeType)} yang tersedia saat ini.`}
      </p>
    </div>
  );
};

// ============ Announcement Card Component ============

interface AnnouncementCardProps {
  announcement: Announcement;
  activeType: string;
  maxCharacters?: number;
}

const AnnouncementCard = ({
  announcement,
  activeType,
  maxCharacters = 100,
}: AnnouncementCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = needsTruncation(announcement.isi, maxCharacters);
  const categoryType = announcement.type || activeType;

  return (
    <div className="bg-white rounded-lg shadow-sm border-l-4 border-l-primary-600">
      <div className="p-4">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-primary-600 leading-tight">
            {announcement.judul}
          </h3>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-gray-500 font-medium">
            <Badge variant={getBadgeVariant(categoryType)}>
              {getTabCategory(categoryType)}
            </Badge>
            <div className="flex items-center ml-1">
              <User className="w-3 h-3 mr-1" />
              <span>{announcement.user}</span>
            </div>
            {announcement.prodi && (
              <>
                <span className="hidden sm:inline text-gray-300">|</span>
                <div className="flex items-center">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  <span>{announcement.prodi}</span>
                </div>
              </>
            )}
            <span className="hidden sm:inline text-gray-300">|</span>
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{formatDate(announcement.published_at, announcement.updated_at, announcement.created_at)}</span>
            </div>
            <span className="hidden sm:inline text-gray-300">|</span>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{formatTime(announcement.published_at, announcement.updated_at, announcement.created_at)}</span>
            </div>
          </div>

          <div className="text-gray-600 text-sm leading-relaxed">
            <div
              className={`break-words ${!isExpanded && shouldTruncate ? "line-clamp-1" : ""}`}
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(announcement.isi),
              }}
            />
            {shouldTruncate && (
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                variant="ghost"
                className="mt-2 p-0 h-auto text-sm font-medium group"
              >
                {isExpanded ? (
                  <>
                    <span>Lihat Lebih Sedikit</span>
                    <ChevronUp className="ml-1 w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Explore More</span>
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ Main Client Component ============

const PengumumanClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageFromUrl = Number.parseInt(searchParams.get("page") || "1", 10);
  const limitFromUrl = Number.parseInt(searchParams.get("limit") || "10", 10);
  const searchFromUrl = searchParams.get("search") || "";
  const prodiFromUrl = searchParams.get("prodi") || "";
  const typeFromUrl = searchParams.get("type") || "all";

  const { data, error, isLoading } = useSWR(
    ["public-pengumuman", typeFromUrl, searchFromUrl, pageFromUrl, limitFromUrl, prodiFromUrl],
    () =>
      PengumumanService.getPublicPengumumanList(
        typeFromUrl,
        "published",
        limitFromUrl,
        "desc",
        prodiFromUrl,
        searchFromUrl
      )
  );

  const handleFilterChange = ({ prodi, type }: FilterState) => {
    const params = new URLSearchParams(searchParams.toString());
    if (prodi) params.set("prodi", prodi);
    else params.delete("prodi");
    if (type) params.set("type", type);
    else params.delete("type");
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const page = pageFromUrl;
  const totalPages = data?.meta?.pagination.last_page ?? 1;
  const totalData = data?.meta?.pagination.total ?? 0;

  const renderContent = () => {
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState />;
    if (!data || !data.data || data.data.length === 0) {
      return <EmptyState activeType={typeFromUrl} searchQuery={searchFromUrl} />;
    }
    return (
      <div className="space-y-0 flex flex-col gap-3 sm:gap-4">
        {data.data.map((announcement: Announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            activeType={typeFromUrl}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header: Filter + Search + Active Chips */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-stretch gap-2 h-10">
          <AnnouncementFilter
            selectedProdi={prodiFromUrl || null}
            selectedType={typeFromUrl === "all" ? null : typeFromUrl}
            onFilterChange={handleFilterChange}
          />
          <div className="flex-1">
            <Suspense fallback={<div className="animate-pulse h-full bg-gray-200 rounded-lg" />}>
              <SearchBarAnnouncement />
            </Suspense>
          </div>
        </div>

        <ActiveFilterChips
          selectedProdi={prodiFromUrl || null}
          selectedType={typeFromUrl === "all" ? null : typeFromUrl}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Content */}
      <div className="min-h-[400px]">{renderContent()}</div>

      {/* Pagination */}
      {data?.meta?.pagination && data.meta.pagination.total > 0 && (
        <div className="p-4 sm:p-6">
          <PaginationControls
            currentPage={page}
            lastPage={totalPages}
            total={totalData}
          />
        </div>
      )}
    </div>
  );
};

export default PengumumanClient;