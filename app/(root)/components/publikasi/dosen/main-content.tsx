"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import PaginationControls from "@/components/pagination-control";
import { Calendar, Banknote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthorDetailSuperAdminServices } from "@/api/superadmin";
import { Publikasi } from "@/types/admin/publikasi-page/publikasi-ilmiah/publikasi-ilmiah";
import { Research } from "@/types/admin/publikasi-page/riset-ilmiah/riset-ilmiah";

// Global counter for unique keys
let globalKeyCounter = 0;
const getUniqueKey = (prefix: string) => {
  globalKeyCounter += 1;
  return `${prefix}-${globalKeyCounter}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
};

import EmptyStateDosen from "./empty-state-dosen";
import ErrorStateDosen from "./error-state-dosen";

// Research type based on API response

interface MainContentSectionProps {
  activeTab: string;
  dosenId: string;
}

const MainContentSection = ({
  activeTab,
  dosenId,
}: MainContentSectionProps) => {
  const searchParams = useSearchParams();
  const [currentTab, setCurrentTab] = useState(activeTab);

  // Reset pagination when tab changes
  const shouldResetPagination = currentTab !== activeTab;
  const currentPage = shouldResetPagination
    ? 1
    : Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [articles, setArticles] = useState<Publikasi[]>([]);
  const [researches, setResearches] = useState<Research[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [isLoadingResearches, setIsLoadingResearches] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);
  const [researchError, setResearchError] = useState<string | null>(null);
  const [totalArticles, setTotalArticles] = useState(0);
  const [totalResearches, setTotalResearches] = useState(0);

  const itemsPerPage = limit;

  // Update current tab when activeTab changes
  useEffect(() => {
    if (currentTab !== activeTab) {
      setCurrentTab(activeTab);
    }
  }, [activeTab, currentTab]);

  // Reset states when tab changes
  useEffect(() => {
    if (activeTab === "artikel") {
      setResearchError(null);
      setResearches([]);
      setTotalResearches(0);
    } else if (activeTab === "penelitian") {
      setArticlesError(null);
      setArticles([]);
      setTotalArticles(0);
    }
  }, [activeTab]);

  // Fetch author's articles data
  const fetchAuthorArticles = useCallback(async () => {
    try {
      setIsLoadingArticles(true);
      setArticlesError(null);

      // Use corrected page number
      const pageToUse = shouldResetPagination ? 1 : currentPage;

      const response = await AuthorDetailSuperAdminServices.getAuthorArticles({
        id: dosenId,
        page: pageToUse,
        limit: itemsPerPage,
      });

      if (response.success && response.data) {
        const articles = response.data.articles || [];
        setArticles(articles);

        // Handle total calculation: use API response if available, otherwise estimate
        let totalArticles = response.data.total_articles;

        if (!totalArticles) {
          if (articles.length === itemsPerPage) {
            // If we get exactly the requested amount, there might be more pages
            // Estimate conservatively: current pages plus potential next page
            totalArticles = pageToUse * itemsPerPage + 1;
          } else if (articles.length < itemsPerPage && pageToUse === 1) {
            // If less than full page on first page, this is the total
            totalArticles = articles.length;
          } else if (articles.length === 0 && pageToUse > 1) {
            // If no data on subsequent pages, calculate based on previous pages
            totalArticles = (pageToUse - 1) * itemsPerPage;
          } else {
            // If less than full page on subsequent pages, this is the last page
            totalArticles = (pageToUse - 1) * itemsPerPage + articles.length;
          }
        }

        setTotalArticles(totalArticles);
      } else {
        setArticlesError(response.message || "Failed to fetch articles");
        setArticles([]);
        // Only reset total count to 0 if this is the first page or a fresh load
        if (pageToUse === 1) {
          setTotalArticles(0);
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setArticlesError(errorMessage);
      setArticles([]);
      // Only reset total count to 0 if this is the first page or a fresh load
      const pageToUse = shouldResetPagination ? 1 : currentPage;
      if (pageToUse === 1) {
        setTotalArticles(0);
      }
    } finally {
      setIsLoadingArticles(false);
    }
  }, [dosenId, currentPage, itemsPerPage, shouldResetPagination]);

  useEffect(() => {
    if (activeTab === "artikel") {
      fetchAuthorArticles();
    }
  }, [activeTab, fetchAuthorArticles]);

  // Fetch author's research data
  const fetchAuthorResearches = useCallback(async () => {
    try {
      setIsLoadingResearches(true);
      setResearchError(null);

      // Use corrected page number
      const pageToUse = shouldResetPagination ? 1 : currentPage;

      const response = await AuthorDetailSuperAdminServices.getAuthorResearch({
        id: dosenId,
        page: pageToUse,
        limit: itemsPerPage,
      });

      if (response.success && response.data) {
        const researches = response.data.researches || [];
        setResearches(researches);

        // Handle total calculation: use API response if available, otherwise estimate
        let totalResearches = response.data.total_researches;

        if (!totalResearches) {
          if (researches.length === itemsPerPage) {
            // If we get exactly the requested amount, there might be more pages
            // Estimate conservatively: current pages plus potential next page
            totalResearches = pageToUse * itemsPerPage + 1;
          } else if (researches.length < itemsPerPage && pageToUse === 1) {
            // If less than full page on first page, this is the total
            totalResearches = researches.length;
          } else if (researches.length === 0 && pageToUse > 1) {
            // If no data on subsequent pages, calculate based on previous pages
            totalResearches = (pageToUse - 1) * itemsPerPage;
          } else {
            // If less than full page on subsequent pages, this is the last page
            totalResearches =
              (pageToUse - 1) * itemsPerPage + researches.length;
          }
        }

        setTotalResearches(totalResearches);
      } else {
        setResearchError(response.message || "Failed to fetch researches");
        setResearches([]);
        // Only reset total count to 0 if this is the first page or a fresh load
        if (pageToUse === 1) {
          setTotalResearches(0);
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setResearchError(errorMessage);
      setResearches([]);
      // Only reset total count to 0 if this is the first page or a fresh load
      const pageToUse = shouldResetPagination ? 1 : currentPage;
      if (pageToUse === 1) {
        setTotalResearches(0);
      }
    } finally {
      setIsLoadingResearches(false);
    }
  }, [dosenId, currentPage, itemsPerPage, shouldResetPagination]);

  useEffect(() => {
    if (activeTab === "penelitian") {
      fetchAuthorResearches();
    }
  }, [activeTab, fetchAuthorResearches]);

  const totalPages =
    activeTab === "artikel"
      ? Math.ceil(totalArticles / itemsPerPage)
      : Math.ceil(totalResearches / itemsPerPage);

  // Ensure currentPage doesn't exceed totalPages and handle tab reset
  const validCurrentPage = shouldResetPagination
    ? 1
    : Math.min(currentPage, Math.max(1, totalPages));

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
      {/* Tab Navigation */}
      {/* Tab content is managed by parent component */}

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
            <ErrorStateDosen
              error={articlesError}
              onRetry={fetchAuthorArticles}
            />
          ) : articles.length === 0 ? (
            <EmptyStateDosen
              title="Artikel Tidak Ditemukan"
              description="Tidak ada artikel ditemukan untuk dosen ini."
              onRefresh={fetchAuthorArticles}
            />
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
                    <h3 className="text-lg font-semibold text-primary-600 flex-1 hover:underline">
                      {pub.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">{pub.journal}</p>
                  {/* Displaying publication details */}
                  <div className="flex flex-wrap items-center text-xs text-gray-500 gap-3">
                    <div className="flex items-center">
                      <Badge variant={"primary"}>{pub.accred}</Badge>
                    </div>
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
                      pub.citation_count !== null &&
                      pub.citation_count > 0 && (
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
                    {pub.doi && pub.doi !== "nan" && (
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
                        variant={
                          pub.source?.includes("SCOPUS")
                            ? "primary"
                            : pub.source?.includes("SINTA")
                            ? "secondary"
                            : "default"
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
                                    window.location.href = `/publikasi/dosen/${author.author_id}`;
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
          {totalArticles > 0 && totalPages > 1 && (
            <div className="space-y-4 mt-8">
              <div className="flex justify-center">
                <PaginationControls
                  currentPage={validCurrentPage}
                  lastPage={totalPages}
                  total={totalArticles}
                />
              </div>
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
            <ErrorStateDosen
              error={
                "Terjadi kesalahan saat memuat data artikel. Silakan coba lagi atau hubungi administrator jika masalah berlanjut."
              }
              onRetry={fetchAuthorResearches}
            />
          ) : researches.length === 0 ? (
            <EmptyStateDosen
              title="Penelitian Tidak Ditemukan"
              description="Tidak ada penelitian ditemukan untuk dosen ini."
              onRefresh={fetchAuthorResearches}
            />
          ) : (
            researches.map((project, index) => (
              <Card
                key={
                  project.id
                    ? `research-${project.id}-${index}`
                    : getUniqueKey(
                        `research-card-${index}-${
                          project.author_id || "unknown"
                        }-${project.year}`
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
                            ? "primary"
                            : (project.status_penelitian || project.status) ===
                              "Completed"
                            ? "secondary"
                            : "outline"
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
                      <span className="font-medium">Leader:</span>{" "}
                      <span
                        className="hover:text-primary-600 hover:underline cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click event
                          if (project.author_id) {
                            window.location.href = `/publikasi/dosen/${project.author_id}`;
                          } else {
                            // Fallback to list page if no author_id
                            window.location.href = `/publikasi/dosen/list`;
                          }
                        }}
                      >
                        {project.leader_name || project.author_name}
                      </span>
                    </p>
                  </div>

                  <div className="pt-1">
                    <p className="text-sm">
                      <span className="font-medium">Personils:</span>{" "}
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

          {/* Pagination for Research */}
          {totalResearches > 0 && totalPages > 1 && (
            <div className="space-y-4 mt-8">
              <div className="flex justify-center">
                <PaginationControls
                  currentPage={validCurrentPage}
                  lastPage={totalPages}
                  total={totalResearches}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MainContentSection;
