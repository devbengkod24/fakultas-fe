"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PublikasiRisetSuperAdminService } from "@/api/superadmin";
import { Publikasi } from "@/types/admin/publikasi-page/publikasi-ilmiah/publikasi-ilmiah";
import ErrorStatePublikasiDetail from "./error-state-publikasi-detail";
import EmptyStatePublikasiDetail from "./empty-state-publikasi-detail";

const LeftColumn = () => {
  const searchParams = useSearchParams();
  const [publicationDetail, setPublicationDetail] = useState<Publikasi | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicationDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Get article ID from URL parameters
      const articleId = searchParams.get("id");
      const type = searchParams.get("type") || "artikel";

      if (!articleId) {
        setError("No article ID provided");
        return;
      }

      // For now, only handle artikel type since there's no research detail endpoint
      if (type !== "artikel") {
        setError("Detail page currently only supports articles");
        return;
      }

      const response = await PublikasiRisetSuperAdminService.getArticleDetail(
        articleId
      );
      if (response.success && response.data) {
        setPublicationDetail(response.data);
      } else {
        setError(response.message || "Failed to fetch publication detail");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchPublicationDetail();
  }, [fetchPublicationDetail]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <div className="space-y-3">
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-14 mb-1" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div>
            <Skeleton className="h-4 w-10 mb-1" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorStatePublikasiDetail onRetry={fetchPublicationDetail} />;
  }

  if (!publicationDetail) {
    return <EmptyStatePublikasiDetail onRefresh={fetchPublicationDetail} />;
  }

  return (
    <>
      <div className="space-y-4">
        <div>
          <div>
            <p className="text-primary-600 text-xl">
              {publicationDetail.title}
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Sumber</h3>
          {publicationDetail.article_url ? (
            <a
              href={publicationDetail.article_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary-600 hover:underline"
            >
              {publicationDetail.source}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <p>{publicationDetail.source || "-"}</p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Tahun Publikasi</h3>
          <p>{publicationDetail.year || "-"}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Jurnal</h3>
          <p>{publicationDetail.journal || "-"}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Sitasi</h3>
          <p>{publicationDetail.citation_count ?? "-"}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Akreditasi</h3>
          <p>{publicationDetail.accred || "-"}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">DOI</h3>
          {publicationDetail.doi ? (
            <a
              href={`https://doi.org/${publicationDetail.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary-600 hover:underline"
            >
              {publicationDetail.doi}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <p>-</p>
          )}
        </div>
      </div>
    </>
  );
};

export default LeftColumn;
