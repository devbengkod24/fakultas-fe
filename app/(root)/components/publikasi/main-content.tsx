"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, Banknote } from "lucide-react";
import PaginationControls from "@/components/pagination-control";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PublikasiRisetSuperAdminService,
  RisetSuperAdminService,
} from "@/api/superadmin";
import { Publikasi } from "@/types/admin/publikasi-page/publikasi-ilmiah/publikasi-ilmiah";
import { Research } from "@/types/admin/publikasi-page/riset-ilmiah/riset-ilmiah";
import ErrorStateMainContent from "./error-state-main-content";
import EmptyStateMainContent from "./empty-state-main-content";

// Global counter for unique keys
let globalKeyCounter = 0;
const getUniqueKey = (prefix: string) => {
  globalKeyCounter += 1;
  return `${prefix}-${globalKeyCounter}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
};

interface MainContentSectionProps {
  activeTab: string;
  searchQuery?: string;
  searchType?: "title" | "author";
  onSearchChange?: (query: string, type: "title" | "author") => void;
}

const MainContentSection = ({
  activeTab,
  searchQuery = "",
  searchType = "title",
}: MainContentSectionProps) => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 5;

  const [articles, setArticles] = useState<Publikasi[]>([]);
  const [researches, setResearches] = useState<Research[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [isLoadingResearches, setIsLoadingResearches] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);
  const [researchError, setResearchError] = useState<string | null>(null);
  const [totalArticles, setTotalArticles] = useState(0);
  const [totalResearches, setTotalResearches] = useState(0);

  // Handle search

  // Reset to page 1 when search changes (optional, for additional safety)
  useEffect(() => {
    // This effect can be used to handle any side effects when search changes
    // Currently, the page reset is handled in the search handlers above
  }, [searchQuery, searchType, activeTab]);

  // Fetch articles data
  const fetchArticles = useCallback(async () => {
    try {
      setIsLoadingArticles(true);
      setArticlesError(null);

      let response;

      // Build filter parameters from URL
      const filterParams = {
        page: currentPage,
        limit: limit,
        source: searchParams.get("source") || undefined,
        prodi: searchParams.get("prodi") || undefined,
        min_year: searchParams.get("min_year")
          ? Number(searchParams.get("min_year"))
          : undefined,
        max_year: searchParams.get("max_year")
          ? Number(searchParams.get("max_year"))
          : undefined,
        sort_by_citation:
          searchParams.get("sort_by_citation") === "true" ? true : undefined,
      };

      // Check if there's a search query
      if (searchQuery.trim()) {
        if (searchType === "author") {
          // Search by author
          response =
            await PublikasiRisetSuperAdminService.searchArticlesByAuthor({
              ...filterParams,
              name: searchQuery.trim(),
            });
        } else {
          // Search by title (default)
          response =
            await PublikasiRisetSuperAdminService.searchArticlesByTitle({
              ...filterParams,
              title: searchQuery.trim(),
            });
        }
      } else {
        // Get all articles when no search query
        response = await PublikasiRisetSuperAdminService.getAllArticle(
          filterParams
        );
      }

      if (response.success && response.data) {
        const responseData = response.data;

        if (responseData.articles && Array.isArray(responseData.articles)) {
          setArticles(responseData.articles);
          setTotalArticles(responseData.total || responseData.articles.length);
        } else if (Array.isArray(responseData)) {
          setArticles(responseData);
          setTotalArticles(responseData.length);
        } else {
          setArticles([]);
          setTotalArticles(0);
        }
      } else {
        setArticlesError(response.message || "Failed to fetch articles");
      }
    } catch (err) {
      setArticlesError(
        err instanceof Error ? err.message : "An error occurred"
      );
    } finally {
      setIsLoadingArticles(false);
    }
  }, [currentPage, searchQuery, searchType, limit, searchParams]);

  useEffect(() => {
    if (activeTab === "artikel") {
      fetchArticles();
    }
  }, [activeTab, fetchArticles]);

  // Fetch research data
  const fetchResearches = useCallback(async () => {
    try {
      setIsLoadingResearches(true);
      setResearchError(null);

      let response;

      // Build filter parameters from URL for research
      const filterParams = {
        page: currentPage,
        limit: limit,
        fund_source: searchParams.get("fund_source") || undefined,
        prodi: searchParams.get("prodi") || undefined,
        min_year: searchParams.get("min_year")
          ? Number(searchParams.get("min_year"))
          : undefined,
        max_year: searchParams.get("max_year")
          ? Number(searchParams.get("max_year"))
          : undefined,
        termahal: searchParams.get("termahal") === "true" ? true : false,
      };

      // Check if there's a search query
      if (searchQuery.trim()) {
        if (searchType === "author") {
          // Search research by author
          response = await RisetSuperAdminService.searchResearchByAuthor({
            ...filterParams,
            name: searchQuery.trim(),
          });
        } else {
          // Search research by title (default)
          response = await RisetSuperAdminService.searchResearchByTitle({
            ...filterParams,
            title: searchQuery.trim(),
          });
        }
      } else {
        // Get all research when no search query
        response = await RisetSuperAdminService.getAllResearch(filterParams);
      }

      if (response.success && response.data) {
        const responseData = response.data;

        if (responseData.researches && Array.isArray(responseData.researches)) {
          // Map API response to component interface
          const mappedResearches = responseData.researches.map(
            (
              research: {
                id?: string;
                title: string;
                leader_name?: string;
                jenis_penelitian?: string;
                personils?: string;
                year: string | number;
                dana_penelitian?: number;
                status_penelitian?: string;
                sumber_pendanaan?: string;
                author_name?: string;
                author_id?: number;
                dosen_id?: number | null;
              },
              index: number
            ) => ({
              id:
                research.id ||
                getUniqueKey(
                  `research-${research.author_id || "unknown"}-${
                    research.year
                  }-${index}`
                ),
              title: research.title,
              leader_name: research.leader_name || "Unknown",
              jenis_penelitian: research.jenis_penelitian,
              personils: research.personils,
              personnel: research.personils, // Map personils to personnel for backward compatibility
              year: research.year,
              dana_penelitian: research.dana_penelitian,
              budget: research.dana_penelitian
                ? new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(research.dana_penelitian)
                : "N/A",
              status_penelitian: research.status_penelitian,
              status: research.status_penelitian,
              sumber_pendanaan: research.sumber_pendanaan,
              sourceType: research.sumber_pendanaan,
              fund_source: research.sumber_pendanaan,
              author_name: research.author_name,
              author_id: research.author_id,
              dosen_id: research.dosen_id,
            })
          );

          setResearches(mappedResearches);
          setTotalResearches(
            responseData.total || responseData.researches.length
          );
        } else if (Array.isArray(responseData)) {
          setResearches(responseData);
          setTotalResearches(responseData.length);
        } else {
          setResearches([]);
          setTotalResearches(0);
        }
      } else {
        setResearchError(response.message || "Failed to fetch researches");
      }
    } catch (err) {
      setResearchError(
        err instanceof Error ? err.message : "An error occurred"
      );
    } finally {
      setIsLoadingResearches(false);
    }
  }, [currentPage, searchQuery, searchType, limit, searchParams]);

  useEffect(() => {
    if (activeTab === "penelitian") {
      fetchResearches();
    }
  }, [activeTab, fetchResearches]);

  const totalPages =
    activeTab === "artikel"
      ? Math.ceil(totalArticles / limit)
      : Math.ceil(totalResearches / limit);

  const formatFundingSource = (source: string) => {
    if (!source) return "Unknown";

    if (source.includes("INTERNAL_SOURCE")) {
      return "INTERNAL SOURCE";
    } else if (source.includes("BIMA_SOURCE")) {
      return "BIMA SOURCE";
    } else {
      // For other sources, replace underscores with spaces and capitalize
      return source.replace(/_/g, " ").toUpperCase();
    }
  };

  return (
    <>
      {/* Artikel Tab Content */}
      {activeTab === "artikel" && (
        <div className="space-y-6">
          {isLoadingArticles ? (
            <div className="space-y-6">
              {[...Array(5)].map((_, index) => (
                <Card
                  key={index}
                  className="p-5 border-l-4 border-l-primary-600"
                >
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex gap-3">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : articlesError ? (
            <ErrorStateMainContent
              error={articlesError}
              onRetry={fetchArticles}
              type="artikel"
            />
          ) : articles.length === 0 ? (
            <EmptyStateMainContent onRefresh={fetchArticles} type="artikel" />
          ) : (
            articles.map((pub, index) => (
              <Card
                key={
                  pub.id
                    ? `article-${pub.id}-${index}`
                    : getUniqueKey(`article-${index}`)
                }
                className="p-5 hover:shadow-md transition-shadow border-l-4 border-l-primary-600 cursor-pointer"
                onClick={() => {
                  window.location.href = `/publikasi/detail?id=${pub.id}&type=artikel`;
                }}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <h3
                      className="text-lg font-semibold text-primary-600 flex-1 hover:underline overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {pub.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">{pub.journal}</p>
                  {/* Displaying publication details */}
                  <div className="flex flex-wrap items-center text-xs text-gray-500 gap-3">
                    {pub.accred && pub.accred !== "Unknown" && (
                      <div className="flex items-center">
                        <Badge
                          variant="outline"
                          className="bg-[#e2eefc] text-[#0655a7] border-[#bfdbf8] hover:bg-[#e2eefc]"
                        >
                          {pub.accred}
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {pub.year}
                    </div>
                    {pub.citation_count !== undefined &&
                      pub.citation_count !== null && (
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          {pub.citation_count} Sitasi
                        </div>
                      )}
                    {pub.doi && (
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101"
                          />
                        </svg>
                        DOI: {pub.doi}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Badge
                        variant="default"
                        className={
                          pub.source?.includes("SCOPUS") ||
                          pub.source?.includes("GARUDA") ||
                          pub.source?.includes("GOOGLE_SCHOLAR")
                            ? "bg-[#0655a7] hover:bg-[#05488e] text-white"
                            : ""
                        }
                      >
                        {pub.source || "Unknown"}
                      </Badge>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm">
                      <span className="font-medium">Author:</span>{" "}
                      <span className="hover:text-primary-600 hover:underline cursor-pointer">
                        {pub.authors && pub.authors.length > 0 ? (
                          pub.authors
                            .sort((a, b) => a.author_order - b.author_order)
                            .map((author, index) => (
                              <span key={author.author_id}>
                                <span
                                  className="hover:text-primary-600 hover:underline cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = `/publikasi/dosen/${author.dosen_id ?? author.author_id}`;
                                  }}
                                >
                                  {author.author_name}
                                </span>
                                {index < pub.authors!.length - 1 && ", "}
                              </span>
                            ))
                        ) : (
                          <span className="hover:text-primary-600 hover:underline cursor-pointer">
                            Unknown Author
                          </span>
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}

          {/* Pagination for Articles */}
          {totalArticles > 0 && (
            <div className="flex justify-center mt-8">
              <PaginationControls
                currentPage={currentPage}
                lastPage={totalPages}
                total={totalArticles}
                limit={limit}
              />
            </div>
          )}
        </div>
      )}

      {/* Penelitian Tab Content */}
      {activeTab === "penelitian" && (
        <div className="space-y-6">
          {isLoadingResearches ? (
            <div className="space-y-6">
              {[...Array(5)].map((_, index) => (
                <Card
                  key={index}
                  className="p-5 border-l-4 border-l-primary-600"
                >
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex gap-3">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </Card>
              ))}
            </div>
          ) : researchError ? (
            <ErrorStateMainContent
              error={researchError}
              onRetry={fetchResearches}
              type="penelitian"
            />
          ) : researches.length === 0 ? (
            <EmptyStateMainContent
              onRefresh={fetchResearches}
              type="penelitian"
            />
          ) : (
            researches.map((project, index) => (
              <Card
                key={
                  project.id ||
                  getUniqueKey(
                    `research-card-${index}-${project.author_id || "unknown"}-${
                      project.year
                    }`
                  )
                }
                className="p-5 transition-shadow border-l-4 border-l-primary-600 hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-semibold text-primary-600 flex-1">
                      {project.title}
                    </h3>
                    {/* Note: Research detail page is not yet available */}
                  </div>

                  <div className="flex flex-wrap items-center text-xs text-gray-500 gap-3">
                    <div className="flex items-center">
                      <Badge
                        variant={
                          (project.status_penelitian || project.status) ===
                          "Approved"
                            ? "default"
                            : (project.status_penelitian || project.status) ===
                              "Completed"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          (project.status_penelitian || project.status) ===
                          "Approved"
                            ? "bg-[#e2eefc] text-[#0655a7] border-[#bfdbf8] hover:bg-[#e2eefc]"
                            : ""
                        }
                      >
                        {project.status_penelitian || project.status}
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {project.year}
                    </div>
                    <div className="flex items-center">
                      <Banknote className="w-4 h-4 mr-1" />
                      {project.budget ||
                        (project.dana_penelitian
                          ? new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(project.dana_penelitian)
                          : "N/A")}
                    </div>
                    <div className="flex items-center">
                      <Badge
                        variant={
                          (
                            project.sumber_pendanaan ||
                            project.fund_source ||
                            project.sourceType ||
                            ""
                          ).includes("INTERNAL_SOURCE")
                            ? "primary"
                            : (
                                project.sumber_pendanaan ||
                                project.fund_source ||
                                project.sourceType ||
                                ""
                              ).includes("BIMA_SOURCE")
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          (
                            project.sumber_pendanaan ||
                            project.fund_source ||
                            project.sourceType ||
                            ""
                          ).includes("INTERNAL_SOURCE")
                            ? "bg-[#1e7fd9] hover:bg-[#1063b9] text-white"
                            : (
                                project.sumber_pendanaan ||
                                project.fund_source ||
                                project.sourceType ||
                                ""
                              ).includes("BIMA_SOURCE")
                            ? "bg-[#00a651] hover:bg-[#008a44] text-white"
                            : (
                                project.sumber_pendanaan ||
                                project.fund_source ||
                                project.sourceType ||
                                ""
                              ).includes("SIMLITABMAS")
                            ? "bg-[#eb8b15] hover:bg-[#d0670f] text-white"
                            : ""
                        }
                      >
                        {formatFundingSource(
                          project.sumber_pendanaan ||
                            project.fund_source ||
                            project.sourceType ||
                            ""
                        )}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm">
                      <span className="font-medium">Ketua:</span>{" "}
                      <span
                        className="hover:text-primary-600 hover:underline cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click event
                          const targetId = project.dosen_id ?? project.author_id;
                          if (targetId) {
                            window.location.href = `/publikasi/dosen/${targetId}`;
                          } else {
                            // Fallback to list page if no dosen_id/author_id
                            window.location.href = `/publikasi/dosen/list`;
                          }
                        }}
                      >
                        {project.leader_name}
                      </span>
                    </p>
                  </div>

                  <div className="pt-1">
                    <p className="text-sm">
                      {/* research_services.py:27 mengecualikan ketua dari daftar
                          ini, jadi memang bukan daftar lengkap. */}
                      <span className="font-medium">Anggota lain:</span>{" "}
                      {project.personils ||
                        (Array.isArray(project.personnel)
                          ? project.personnel.join("; ")
                          : project.personnel)}
                    </p>
                  </div>

                  {project.jenis_penelitian && (
                    <div className="pt-1 text-sm text-primary-600">
                      {project.jenis_penelitian}
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
          {totalResearches > 0 && (
            <div className="flex justify-center mt-8">
              <PaginationControls
                currentPage={currentPage}
                lastPage={totalPages}
                total={totalResearches}
                limit={limit}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MainContentSection;