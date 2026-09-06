"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  BookCheck,
  Briefcase,
  GraduationCap,
  LayoutGrid,
  Calendar,
  User,
  Search,
  X,
  ChevronUp,
  ChevronRight,
} from "lucide-react";
import useSWR, { mutate } from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PengumumanService } from "@/api";
import type {
  Announcement,
  AnnouncementResponse,
} from "@/types/landing-page/pengumuman/announcement";
import {
  formatDate,
  getTabCategory,
  needsTruncation,
  truncateHtml,
} from "@/lib/landing-page/pengumuman/announcement-utils";
import PaginationControls from "@/components/pagination-control";
import {
  PengumumanTerbaruLoadingState,
  PengumumanTerbaruErrorState,
  PengumumanTerbaruEmptyState,
} from "./pengumuman-terbaru-empty-state";
import { sanitizeHtml } from "@/lib/sanitize-html";

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = [
  { key: "semua", label: "Semua", icon: LayoutGrid },
  { key: "ta", label: "Tugas Akhir", icon: BookCheck },
  { key: "kp", label: "Kerja Praktek", icon: Briefcase },
  { key: "bk", label: "Bimbingan Karir", icon: GraduationCap },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const CATEGORY_LABEL: Record<string, string> = {
  ta: "Tugas Akhir",
  kp: "Kerja Praktek",
  bk: "Bimbingan Karir",
};

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  announcement: Announcement & { category?: string };
  activeTab: string;
  maxCharacters?: number;
}

const PengumumanCard = ({
  announcement,
  activeTab,
  maxCharacters = 100,
}: CardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = needsTruncation(announcement.isi, maxCharacters);

  return (
    <div className="bg-white rounded-lg shadow-sm border-l-4 border-l-primary-600">
      <div className="p-4 sm:p-5">
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-semibold text-primary-600 leading-tight">
            {announcement.judul}
          </h3>

          <div className="inline-block">
            <Badge variant="primary">
              {announcement.category ?? getTabCategory(activeTab)}
            </Badge>
          </div>

          <div className="flex flex-col gap-1 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(announcement.published_at, announcement.updated_at, announcement.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{announcement.user}</span>
            </div>
          </div>

          <div className="text-gray-600 text-sm leading-relaxed">
            {shouldTruncate ? (
              <>
                <div
                  className="break-words"
                  dangerouslySetInnerHTML={{
                    __html: isExpanded
                      ? sanitizeHtml(announcement.isi)
                      : sanitizeHtml(truncateHtml(announcement.isi, maxCharacters)),
                  }}
                />
                <Button
                  onClick={() => setIsExpanded(!isExpanded)}
                  variant="ghost"
                  className="mt-1 p-0 h-auto text-sm font-medium group"
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
              </>
            ) : (
              <div
                className="break-words"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(announcement.isi) }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Client ──────────────────────────────────────────────────────────────

const PengumumanTerbaruClient = ({ prodiId }: { prodiId?: number }) => {
  const [activeTab, setActiveTab] = useState<TabKey>("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search — paginasi & total selalu sinkron dengan API
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const fetcher = ([, type, p, l, s, pid]: [string, string, number, number, string, number?]) =>
    PengumumanService.getPengumumanList(type, p, l, s, pid);

  // Tab "semua" fetch semua kategori sekaligus; tab spesifik hanya fetch yang relevan
  const { data: resTA, isLoading: isLoadingTA, error: errorTA } = useSWR(
    activeTab === "semua" || activeTab === "ta"
      ? ["pengumuman", "ta", page, limit, debouncedSearch, prodiId]
      : null,
    fetcher
  );
  const { data: resKP, isLoading: isLoadingKP, error: errorKP } = useSWR(
    activeTab === "semua" || activeTab === "kp"
      ? ["pengumuman", "kp", page, limit, debouncedSearch, prodiId]
      : null,
    fetcher
  );
  const { data: resBK, isLoading: isLoadingBK, error: errorBK } = useSWR(
    activeTab === "semua" || activeTab === "bk"
      ? ["pengumuman", "bk", page, limit, debouncedSearch, prodiId]
      : null,
    fetcher
  );

  const isLoading = useMemo(() => {
    if (activeTab === "semua") return isLoadingTA || isLoadingKP || isLoadingBK;
    if (activeTab === "ta") return isLoadingTA;
    if (activeTab === "kp") return isLoadingKP;
    if (activeTab === "bk") return isLoadingBK;
    return false;
  }, [activeTab, isLoadingTA, isLoadingKP, isLoadingBK]);

  const error = errorTA || errorKP || errorBK;

  // Retry / muat ulang — revalidate semua key SWR + show loading
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (activeTab === "semua") {
        await Promise.all([
          mutate(["pengumuman", "ta", page, limit, debouncedSearch, prodiId]),
          mutate(["pengumuman", "kp", page, limit, debouncedSearch, prodiId]),
          mutate(["pengumuman", "bk", page, limit, debouncedSearch, prodiId]),
        ]);
      } else {
        await mutate(["pengumuman", activeTab, page, limit, debouncedSearch, prodiId]);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Tag kategori sebelum merge untuk tab "semua"
  const tagged = useMemo(
    () => ({
      ta: resTA?.data?.map((item: Announcement) => ({ ...item, category: CATEGORY_LABEL.ta })) ?? [],
      kp: resKP?.data?.map((item: Announcement) => ({ ...item, category: CATEGORY_LABEL.kp })) ?? [],
      bk: resBK?.data?.map((item: Announcement) => ({ ...item, category: CATEGORY_LABEL.bk })) ?? [],
    }),
    [resTA, resKP, resBK]
  );

  const activeData = useMemo<AnnouncementResponse | undefined>(() => {
    if (activeTab !== "semua") {
      const map = { ta: resTA, kp: resKP, bk: resBK };
      const tagMap = { ta: tagged.ta, kp: tagged.kp, bk: tagged.bk };
      const res = map[activeTab as keyof typeof map];
      return res ? { ...res, data: tagMap[activeTab as keyof typeof tagMap] } : undefined;
    }

    const merged = [
      ...tagged.ta,
      ...tagged.kp,
      ...tagged.bk,
    ].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

    if (merged.length === 0 && !isLoading) return undefined;

    const total =
      (resTA?.meta?.pagination.total ?? 0) +
      (resKP?.meta?.pagination.total ?? 0) +
      (resBK?.meta?.pagination.total ?? 0);

    return {
      data: merged,
      meta: { pagination: { total, last_page: Math.ceil(total / limit) || 1 } },
    } as AnnouncementResponse;
  }, [activeTab, tagged, resTA, resKP, resBK, isLoading, limit]);

  const totalPages = (activeData as any)?.meta?.pagination.last_page ?? 1;
  const totalItems = (activeData as any)?.meta?.pagination.total ?? 0;

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    setPage(1);
    setSearchQuery("");
    setDebouncedSearch("");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const el = document.getElementById("pengumuman-terbaru");
    if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 py-4">
      {/* Tabs and Search Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
        {/* Search — full width di mobile, flex-1 di desktop tapi max 448px */}
        <div className="w-full lg:flex-1 lg:max-w-md lg:shrink-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <Input
              type="text"
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              placeholder="Cari pengumuman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setSearchQuery("")}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                aria-label="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tombol tabs — shrink ke ukuran konten, di kanan */}
        <div className="flex flex-nowrap gap-2 overflow-x-auto md:shrink-0 lg:flex-nowrap">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`
                inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md text-sm font-medium
                border transition-all duration-200 whitespace-nowrap
                ${
                  activeTab === key
                    ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-primary-400 hover:text-primary-600"
                }
              `}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {isLoading || isRefreshing ? (
          <PengumumanTerbaruLoadingState />
        ) : error ? (
          <PengumumanTerbaruErrorState onRetry={handleRefresh} />
        ) : !activeData?.data || activeData.data.length === 0 ? (
          <PengumumanTerbaruEmptyState
            activeTab={activeTab}
            searchQuery={debouncedSearch}
            onRefresh={handleRefresh}
          />
        ) : (
          <div className="flex flex-col gap-3 sm:gap-4">
            {activeData.data.map((announcement) => (
              <PengumumanCard
                key={announcement.id}
                announcement={announcement as any}
                activeTab={activeTab}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination — hanya tampil kalau ada data */}
      {activeData?.data && activeData.data.length > 0 && (
        <PaginationControls
          currentPage={page}
          lastPage={totalPages}
          total={totalItems}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          defaultLimit={limit}
        />
      )}
    </div>
  );
};

export default PengumumanTerbaruClient;
