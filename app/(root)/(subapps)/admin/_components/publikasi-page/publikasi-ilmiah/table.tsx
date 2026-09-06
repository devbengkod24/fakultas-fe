"use client";

import { Publikasi } from "@/types/admin/publikasi-page/publikasi-ilmiah/publikasi-ilmiah";
import {
  PublikasiRisetFakultasService,
  PublikasiRisetSuperAdminService,
} from "@/api/superadmin";
import useSWR, { mutate } from "swr";
import { FilterPublikasi } from "./filter";
import { DataTable } from "@/components/data-table";
import { Columns } from "./column";
import { useSearchParams } from "next/navigation";
import EmptyState from "@/components/empty-state";
import { BookOpen } from "lucide-react";
import { useProfile } from "@/context/profileUseContext";
import { ImportExportButtons } from "../import-export-buttons";
import type { ExportArtikelParams } from "@/api/superadmin/publikasi-page/export";
import { getPublikasiProdiName } from "@/lib/publikasi-prodi";

interface PublikasiApiResponse {
  data: Publikasi[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export function DataPublikasiIlmiah() {
  const searchParams = useSearchParams();
  const { profile, activeProdiId } = useProfile();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search")?.trim() || "";
  const searchType = searchParams.get("searchType") || "title";
  const isAdminProdi = profile?.roles === "admin";
  const isSuperFakultas = profile?.roles === "super_fakultas";
  const activeAdminProdi =
    profile?.daftar_prodi?.find((item) => item.id === activeProdiId) ??
    profile?.prodi;
  const adminProdiId = activeAdminProdi?.id ?? activeProdiId ?? undefined;
  const adminProdiName = getPublikasiProdiName(activeAdminProdi);
  const hasAdminScope =
    !isAdminProdi || (adminProdiId != null && adminProdiName != null);
  const service = isSuperFakultas
    ? PublikasiRisetFakultasService
    : PublikasiRisetSuperAdminService;
  const prodiFromUrl = searchParams.get("prodi");
  const prodi = isAdminProdi ? adminProdiName : prodiFromUrl || undefined;

  const roleKey = profile?.roles || "unknown";
  const filterKey = [
    searchParams.get("min_year"),
    searchParams.get("max_year"),
    searchParams.get("source"),
  ]
    .filter(Boolean)
    .join("-");

  // Build SWR key based on search params and prodi filter
  const prodiFilter = prodi ? `-prodi-${prodi}` : "";
  const dataKey =
    search && search.trim()
      ? `publikasi-search-${roleKey}-${searchType}-${search.trim()}-${page}-${limit}${prodiFilter}-${filterKey}`
      : `publikasi-all-${roleKey}-${page}-${limit}${prodiFilter}-${filterKey}`;
  const swrKey = hasAdminScope ? dataKey : null;

  const { data, error, isLoading } = useSWR<PublikasiApiResponse>(
    swrKey,
    async () => {
      const page = Number(searchParams.get("page")) || 1;
      const limit = Number(searchParams.get("limit")) || 10;
      const search = searchParams.get("search")?.trim() || "";
      const searchType = searchParams.get("searchType") || "title";
      const prodiParam = isAdminProdi
        ? adminProdiName
        : searchParams.get("prodi") || undefined;
      const minYear = Number(searchParams.get("min_year")) || undefined;
      const maxYear = Number(searchParams.get("max_year")) || undefined;
      const source = searchParams.get("source") || undefined;
      const filters = {
        prodi: prodiParam,
        min_year: minYear,
        max_year: maxYear,
        source,
      };

      let response;
      if (search) {
        if (searchType === "author") {
          response = await service.searchArticlesByAuthor({
            name: search,
            page,
            limit,
            ...filters,
          });
        } else {
          response = await service.searchArticlesByTitle({
            title: search,
            page,
            limit,
            ...filters,
          });
        }
      } else {
        response = await service.getAllArticle({ page, limit, ...filters });
      }

      const responseData = response.data || response;
      if (Array.isArray(responseData)) {
        return { data: responseData, total: responseData.length, page, limit, total_pages: Math.ceil(responseData.length / limit) };
      } else if (responseData.articles && Array.isArray(responseData.articles)) {
        return { data: responseData.articles, total: responseData.total || responseData.articles.length, page: responseData.page || page, limit: responseData.limit || limit, total_pages: responseData.total_pages || Math.ceil((responseData.total || responseData.articles.length) / (responseData.limit || limit)) };
      } else if (responseData.data && Array.isArray(responseData.data)) {
        return { data: responseData.data, total: responseData.total || responseData.data.length, page: responseData.page || page, limit: responseData.limit || limit, total_pages: responseData.total_pages || Math.ceil((responseData.total || responseData.data.length) / limit) };
      }
      return { data: [], total: 0, page, limit, total_pages: 1 };
    },
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      dedupingInterval: 5000,
    }
  );

  const columns = Columns(page, limit);

  // Build export params (Section 12.6.1 BE: super_fak TIDAK auto-bind ke activeProdiId)
  const exportParams: ExportArtikelParams = (() => {
    const params: ExportArtikelParams = {};
    if (isAdminProdi && adminProdiId != null) {
      params.prodi_id = adminProdiId;
    } else {
      const prodiFromUrl = searchParams.get("prodi");
      const prodiIdFromUrl = searchParams.get("prodi_id");
      if (prodiFromUrl) params.prodi = prodiFromUrl;
      if (prodiIdFromUrl) params.prodi_id = Number(prodiIdFromUrl);
    }
    const minYear = searchParams.get("min_year");
    const maxYear = searchParams.get("max_year");
    if (minYear) params.year_from = Number(minYear);
    if (maxYear) params.year_to = Number(maxYear);
    const source = searchParams.get("source");
    if (source) params.source = source;
    return params;
  })();

  const handleImportSuccess = () => {
    if (swrKey) {
      mutate(swrKey);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-32 text-red-500">
        <div>Error loading data: {error.message}</div>
      </div>
    );
  }

  // Show empty state if no data
  if (!isLoading && !error && (!data?.data || data.data.length === 0)) {
    return (
      <div>
        <div className="w-full flex flex-col gap-3">
          <FilterPublikasi
            isLoading={isLoading}
            showProdiFilter={isSuperFakultas}
            rightSlot={
              <ImportExportButtons
                type="artikel"
                isSuperFakultas={isSuperFakultas}
                exportParams={exportParams}
                onImportSuccess={handleImportSuccess}
                isLoading={isLoading || !hasAdminScope}
              />
            }
          />
          <EmptyState
            icon={BookOpen}
            title="Tidak Ada Data Publikasi"
            subtitle={
              search
                ? `Tidak ditemukan publikasi dengan pencarian "${search}" berdasarkan ${
                    searchType === "author" ? "penulis" : "judul"
                  }.`
                : "Belum ada publikasi ilmiah yang tersedia."
            }
            className="h-[400px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full flex flex-col gap-3">
        <FilterPublikasi
          isLoading={isLoading}
          showProdiFilter={isSuperFakultas}
          rightSlot={
            <ImportExportButtons
              type="artikel"
              isSuperFakultas={isSuperFakultas}
              exportParams={exportParams}
              onImportSuccess={handleImportSuccess}
              isLoading={isLoading || !hasAdminScope}
            />
          }
        />

        <DataTable
          columns={columns}
          data={data?.data || []}
          loading={isLoading}
          pagination={{
            currentPage: page,
            lastPage: data?.total_pages || 1,
            limit,
            total: data?.total || 0,
          }}
        />
      </div>
    </div>
  );
}