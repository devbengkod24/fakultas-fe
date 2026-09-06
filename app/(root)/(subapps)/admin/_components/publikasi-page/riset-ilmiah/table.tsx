"use client";

import { DataTable } from "@/components/data-table";
import { FilterRiset } from "./filter";
import { Columns } from "./column";
import { useSearchParams } from "next/navigation";
import { Research } from "@/types/admin/publikasi-page/riset-ilmiah/riset-ilmiah";
import useSWR, { mutate } from "swr";
import {
  RisetFakultasService,
  RisetSuperAdminService,
} from "@/api/superadmin";
import { useProfile } from "@/context/profileUseContext";
import EmptyState from "@/components/empty-state";
import { FlaskConical } from "lucide-react";
import { ImportExportButtons } from "../import-export-buttons";
import type { ExportPenelitianParams } from "@/api/superadmin/publikasi-page/export";
import { getPublikasiProdiName } from "@/lib/publikasi-prodi";

interface RisetApiResponse {
  data: Research[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}


export function DataRisetIlmiah() {
  const searchParams = useSearchParams();
  const { profile, activeProdiId } = useProfile();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search")?.trim() || "";
  const searchType = searchParams.get("searchType") || "title";
  const termahal = searchParams.get("termahal") === "true";
  const isAdminProdi = profile?.roles === "admin";
  const isSuperFakultas = profile?.roles === "super_fakultas";
  const activeAdminProdi =
    profile?.daftar_prodi?.find((item) => item.id === activeProdiId) ??
    profile?.prodi;
  const adminProdiId = activeAdminProdi?.id ?? activeProdiId ?? undefined;
  const adminProdiName = getPublikasiProdiName(activeAdminProdi);
  const hasAdminScope =
    !isAdminProdi || (adminProdiId != null && adminProdiName != null);
  const service = isSuperFakultas ? RisetFakultasService : RisetSuperAdminService;
  const prodiFromUrl = searchParams.get("prodi");
  const prodi = isAdminProdi ? adminProdiName : prodiFromUrl || undefined;

  const roleKey = profile?.roles || "unknown";
  const filterKey = [
    searchParams.get("min_year"),
    searchParams.get("max_year"),
    searchParams.get("fund_source"),
  ]
    .filter(Boolean)
    .join("-");

  // Build SWR key based on search params and prodi filter
  const prodiFilter = prodi ? `-prodi-${prodi}` : "";
  const dataKey =
    search && search.trim()
      ? `riset-search-${roleKey}-${searchType}-${search.trim()}-${page}-${limit}-${termahal}${prodiFilter}-${filterKey}`
      : `riset-all-${roleKey}-${page}-${limit}-${termahal}${prodiFilter}-${filterKey}`;
  const swrKey = hasAdminScope ? dataKey : null;

  const { data, error, isLoading } = useSWR<RisetApiResponse>(
    swrKey,
    async () => {
      const page = Number(searchParams.get("page")) || 1;
      const limit = Number(searchParams.get("limit")) || 10;
      const search = searchParams.get("search")?.trim() || "";
      const searchType = searchParams.get("searchType") || "title";
      const termahal = searchParams.get("termahal") === "true";
      const prodiParam = isAdminProdi
        ? adminProdiName
        : searchParams.get("prodi") || undefined;
      const minYear = Number(searchParams.get("min_year")) || undefined;
      const maxYear = Number(searchParams.get("max_year")) || undefined;
      const fundSource = searchParams.get("fund_source") || undefined;
      const filters = {
        prodi: prodiParam,
        min_year: minYear,
        max_year: maxYear,
        fund_source: fundSource,
      };

      let response;
      if (search) {
        if (searchType === "author") {
          response = await service.searchResearchByAuthor({
            name: search,
            page,
            limit,
            termahal,
            ...filters,
          });
        } else {
          response = await service.searchResearchByTitle({
            title: search,
            page,
            limit,
            termahal,
            ...filters,
          });
        }
      } else {
        response = await service.getAllResearch({
          page,
          limit,
          termahal,
          ...filters,
        });
      }

      const responseData = response.data || response;
      if (Array.isArray(responseData)) {
        return { data: responseData, total: responseData.length, page, limit, total_pages: Math.ceil(responseData.length / limit) };
      } else if (responseData.researches && Array.isArray(responseData.researches)) {
        return { data: responseData.researches, total: responseData.total || responseData.researches.length, page: responseData.page || page, limit: responseData.limit || limit, total_pages: responseData.total_pages || Math.ceil((responseData.total || responseData.researches.length) / (responseData.limit || limit)) };
      } else if (responseData.riset && Array.isArray(responseData.riset)) {
        return { data: responseData.riset, total: responseData.total || responseData.riset.length, page: responseData.page || page, limit: responseData.limit || limit, total_pages: responseData.total_pages || Math.ceil((responseData.total || responseData.riset.length) / limit) };
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

  const exportParams: ExportPenelitianParams = (() => {
    const params: ExportPenelitianParams = {};
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
    const fundSource = searchParams.get("fund_source");
    if (fundSource) params.fund_source = fundSource;
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
        <div>Terjadi kesalahan saat memuat data riset.</div>
      </div>
    );
  }

  // Show empty state if no data
  if (!isLoading && !error && (!data?.data || data.data.length === 0)) {
    return (
      <div>
        <div className="w-full flex flex-col gap-3">
          <FilterRiset
            isLoading={isLoading}
            showProdiFilter={isSuperFakultas}
            rightSlot={
              <ImportExportButtons
                type="penelitian"
                isSuperFakultas={isSuperFakultas}
                exportParams={exportParams}
                onImportSuccess={handleImportSuccess}
                isLoading={isLoading || !hasAdminScope}
              />
            }
          />
          <EmptyState
            icon={FlaskConical}
            title="Tidak Ada Data Riset"
            subtitle={
              search
                ? `Tidak ditemukan riset dengan pencarian "${search}" berdasarkan ${
                    searchType === "author" ? "penulis" : "judul"
                  }.`
                : "Belum ada riset ilmiah yang tersedia."
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
        <FilterRiset
          isLoading={isLoading}
          showProdiFilter={isSuperFakultas}
          rightSlot={
            <ImportExportButtons
              type="penelitian"
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