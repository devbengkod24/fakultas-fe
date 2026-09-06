"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { PublikasiRisetSuperAdminService } from "@/api/superadmin";
import { Publikasi } from "@/types/admin/publikasi-page/publikasi-ilmiah/publikasi-ilmiah";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import ErrorStatePublikasiDetail from "./error-state-publikasi-detail";
import EmptyStatePublikasiDetail from "./empty-state-publikasi-detail";

const AuthorSection = () => {
  const searchParams = useSearchParams();
  const [articleDetail, setArticleDetail] = useState<Publikasi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthorDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
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
        setArticleDetail(response.data);
      } else {
        setError(response.message || "Failed to fetch author detail");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchAuthorDetail();
  }, [fetchAuthorDetail]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center">
            <Skeleton className="w-10 h-10 rounded-full mr-3" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorStatePublikasiDetail onRetry={fetchAuthorDetail} />;
  }

  if (
    !articleDetail ||
    !articleDetail.authors ||
    articleDetail.authors.length === 0
  ) {
    return (
      <EmptyStatePublikasiDetail
        title="Informasi Author Tidak Tersedia"
        description="Informasi author untuk publikasi ini tidak tersedia atau belum ditambahkan."
        onRefresh={fetchAuthorDetail}
      />
    );
  }

  // Sort authors by author_order
  const sortedAuthors = [...articleDetail.authors].sort(
    (a, b) => a.author_order - b.author_order
  );

  return (
    <>
      <div className="space-y-4">
        {sortedAuthors.map((author, index) => (
          <div
            key={index}
            className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            onClick={() => {
              if (author.dosen_id) {
                window.location.href = `/publikasi/dosen/${author.dosen_id}`;
              } else if (author.author_id) {
                window.location.href = `/publikasi/dosen/${author.author_id}`;
              } else {
                window.location.href = `/publikasi`;
              }
            }}
          >
            <div className="flex-shrink-0 mr-3">
              <Avatar className="h-16 w-16 mr-3">
                <AvatarImage src={author.avatar} alt={author.author_name} />
                <AvatarFallback>{author.author_name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h4 className="text-sm font-medium hover:text-primary-600">
                {author.author_name}
              </h4>
              <p className="text-xs text-gray-500">
                Researcher{" "}
                {author.author_order > 1
                  ? `(Author ${author.author_order})`
                  : "(Primary Author)"}
              </p>{" "}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AuthorSection;
