"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { X } from "lucide-react";
import useSWR from "swr";
import { HeroSection } from "@/app/(root)/components/hero-section";
import AllNewsList from "@/app/(root)/components/landingpage/berita-kegiatan/list/all-news-list";
import type { BeritaItem } from "@/app/(root)/components/landingpage/berita-kegiatan/berita-kegiatan-client";
import ErrorState from "@/app/(root)/components/error-state";
import PaginationControls from "@/components/pagination-control";
import { Skeleton } from "@/components/ui/skeleton";
import { BeritaService } from "@/api";
import { API_URL, IMAGE_URL } from "@/lib/constant";
import { BeritaFilter, type FilterState } from "@/app/(root)/components/landingpage/berita-kegiatan/berita-filter";
import BeritaSearchBar from "@/app/(root)/components/landingpage/berita-kegiatan/berita-search-bar";

type RawBeritaItem = {
  id: number | string;
  judul?: string;
  title?: string;
  konten?: string;
  content?: string;
  gambar?: string;
  image?: string;
  thumbnail?: string;
  type?: string;
  tipe?: string;
  user_name?: string;
  published_at?: string;
  created_at?: string;
};

const normalizeImageUrl = (value?: string): string | undefined => {
  if (!value) return undefined;
  const path = value.trim().replace(/\\/g, "/").replace(/^\/+/, "");
  if (!path || path === "null" || path === "undefined") return undefined;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const apiRoot = API_URL?.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "") || "";
  const imageRoot = IMAGE_URL?.replace(/\/+$/, "") || "";

  if (/^(berita_images|storage|foto-profil|mitra-logo)\//i.test(path)) {
    if (imageRoot) {
      return `${imageRoot}/${path}`;
    }
    if (apiRoot) {
      if (path.startsWith("storage/")) {
        return `${apiRoot}/${path}`;
      }
      return `${apiRoot}/storage/${path}`;
    }
  }

  if (apiRoot) {
    return `${apiRoot}/${path}`;
  }

  return `/${path}`;
};

const mapBeritaItem = (item: RawBeritaItem): BeritaItem => {
  const tipe = (item.tipe ?? item.type ?? "berita").toLowerCase();
  return {
    id: String(item.id),
    title: item.judul ?? item.title ?? "Tanpa Judul",
    date: item.published_at || item.created_at || "",
    category: tipe === "prestasi" ? "PRESTASI" : "KEGIATAN",
    excerpt: (item.konten ?? item.content ?? "").substring(0, 150),
    image: normalizeImageUrl(item.gambar ?? item.image ?? item.thumbnail),
    author: item.user_name || "Humas FIK",
  };
};

const fetcher = ([, page, limit, search, type]: [string, number, number, string, string]) =>
  BeritaService.getBeritaList(page, limit, search, type);

const BeritaListSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="rounded-2xl border border-slate-200 overflow-hidden">
        <Skeleton className="h-56 w-full rounded-none" />
        <div className="p-6 space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full mt-4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

const CATEGORY_LABELS: Record<string, string> = {
  berita: "Berita",
  kegiatan: "Kegiatan",
  prestasi: "Prestasi",
};

const normalizeType = (value?: string | null) => (value || "").trim().toLowerCase();

const ActiveFilterChips = ({
  selectedType,
  categories,
  onFilterChange,
}: {
  selectedType: string | null;
  categories: string[];
  onFilterChange: (filter: FilterState) => void;
}) => {
  if (!selectedType) return null;

  const typeLabel =
    CATEGORY_LABELS[selectedType] ??
    categories.find((item) => item === selectedType) ??
    selectedType;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <span className="text-xs text-gray-400 font-medium">Filter aktif:</span>
      <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/20">
        {typeLabel}
        <button
          onClick={() => onFilterChange({ type: null })}
          className="hover:text-primary/60 transition-colors"
          aria-label={`Hapus filter ${typeLabel}`}
        >
          <X className="w-3 h-3" />
        </button>
      </span>
    </div>
  );
};

function BeritaPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number.parseInt(searchParams.get("page") || "1", 10);
  const limit = Number.parseInt(searchParams.get("limit") || "9", 10);
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "all";

  const { data, error, isLoading } = useSWR(
    ["berita-list", page, limit, search, type],
    fetcher
  );

  const rawList = data?.data?.data ?? data?.data ?? [];
  const berita: BeritaItem[] = Array.isArray(rawList)
    ? rawList.map(mapBeritaItem)
    : [];

  const pagination = data?.data;
  const lastPage = pagination?.last_page ?? 1;
  const total = pagination?.total ?? berita.length;
  const availableCategories = useMemo(() => {
    const categories = new Set<string>(["berita", "kegiatan", "prestasi"]);

    for (const item of rawList as RawBeritaItem[]) {
      const normalizedType = normalizeType(item?.tipe ?? item?.type);
      if (normalizedType) {
        categories.add(normalizedType);
      }
    }

    if (type && type !== "all") {
      categories.add(type);
    }

    return Array.from(categories);
  }, [rawList, type]);

  const typeOptions = useMemo(
    () =>
      availableCategories.map((item) => ({
        id: item,
        label: CATEGORY_LABELS[item] ?? item,
      })),
    [availableCategories]
  );

  useEffect(() => {
    const currentType = normalizeType(type);
    if (currentType === "all" || !currentType) return;
    if (availableCategories.length === 0) return;

    const hasCurrentType = availableCategories.includes(currentType);
    if (hasCurrentType) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("type");
    params.set("page", "1");
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [availableCategories, router, searchParams, type]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleLimitChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(newLimit));
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = ({ type }: FilterState) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type) params.set("type", type);
    else params.delete("type");
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <HeroSection
        variant="badge"
        title="Berita & Kegiatan"
        subtitle="Informasi terkini mengenai kegiatan, prestasi, dan pengumuman di lingkungan FIK UDINUS."
        badgeText="Informasi Terupdate"
        badgeIcon="sparkles"
      />

      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100">
          <div className="mb-10 border-b border-slate-100 pb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              <span className="bg-[#114D91] bg-clip-text text-transparent">Semua</span> Berita
            </h2>

            <div className="mb-4 sm:mb-6">
              <div className="flex items-stretch gap-2 h-10">
                <BeritaFilter
                  categories={typeOptions}
                  selectedType={type === "all" ? null : type}
                  onFilterChange={handleFilterChange}
                />
                <div className="flex-1">
                  <Suspense fallback={<div className="animate-pulse h-full bg-gray-200 rounded-lg" />}>
                    <BeritaSearchBar />
                  </Suspense>
                </div>
              </div>

              <ActiveFilterChips
                selectedType={type === "all" ? null : type}
                categories={availableCategories}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {error ? (
            <ErrorState
              title="Gagal Memuat Berita"
              description="Terjadi kesalahan saat mengambil data dari server. Silakan coba beberapa saat lagi."
            />
          ) : isLoading ? (
            <BeritaListSkeleton />
          ) : (
            <>
              <AllNewsList berita={berita} />
              {berita.length > 0 ? (
                <div className="mt-10">
                  <PaginationControls
                    currentPage={page}
                    lastPage={lastPage}
                    total={total}
                    limit={limit}
                    defaultLimit={9}
                    limitOptions={[6, 9, 12, 24]}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                  />
                </div>
              ) : (
                <div className="text-center py-20">
                  <h3 className="text-xl font-semibold text-slate-900">Tidak ada berita ditemukan</h3>
                  <p className="text-slate-500 mt-2">Coba sesuaikan kata kunci pencarian atau filter Anda.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function BeritaPageClient() {
  return (
    <Suspense fallback={<Skeleton className="w-full h-screen" />}>
      <BeritaPageContent />
    </Suspense>
  );
}

