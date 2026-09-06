"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { PublikasiRisetSuperAdminService } from "@/api/superadmin";
import { Publikasi } from "@/types/admin/publikasi-page/publikasi-ilmiah/publikasi-ilmiah";
import ErrorStatePublikasiDetail from "./error-state-publikasi-detail";
import EmptyStatePublikasiDetail from "./empty-state-publikasi-detail";

const RightColumnSection = () => {
  const searchParams = useSearchParams();
  const [publicationDetail, setPublicationDetail] = useState<Publikasi | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to strip HTML tags from text
  const stripHtmlTags = (html: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

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
      <div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Abstract</h3>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorStatePublikasiDetail onRetry={fetchPublicationDetail} />;
  }

  if (!publicationDetail?.abstract) {
    return (
      <EmptyStatePublikasiDetail
        title="Abstract Tidak Tersedia"
        description="Abstract untuk publikasi ini tidak tersedia atau belum ditambahkan."
        onRefresh={fetchPublicationDetail}
      />
    );
  }

  return (
    <>
      <div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Abstract</h3>
          <p className="text-sm text-gray-700 leading-relaxed text-justify">
            {stripHtmlTags(publicationDetail.abstract)}
          </p>
        </div>
      </div>
    </>
  );
};

export default RightColumnSection;
