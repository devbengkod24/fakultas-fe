"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Loader2, Copy, ExternalLink } from "lucide-react";
import { Publikasi } from "@/types/admin/publikasi-page/publikasi-ilmiah/publikasi-ilmiah";
import { PublikasiRisetSuperAdminService } from "@/api/superadmin";
import useSWR from "swr";

interface DetailDialogProps {
  publikasi: Publikasi;
  trigger?: React.ReactNode;
}

const fetchDetailPublikasi = async (articleId: string): Promise<Publikasi> => {
  const response = await PublikasiRisetSuperAdminService.getArticleDetail(
    articleId
  );
  return response.data || response;
};

const DetailDialog: React.FC<DetailDialogProps> = ({ publikasi, trigger }) => {
  const [open, setOpen] = React.useState(false);

  // Only fetch detailed data if we have an article ID and dialog is open
  const shouldFetchDetail = open && publikasi.id;

  // Fetch detailed data when dialog opens
  const {
    data: detailData,
    error,
    isLoading,
  } = useSWR<Publikasi>(
    shouldFetchDetail ? `detail-publikasi-${publikasi.id}` : null,
    shouldFetchDetail ? () => fetchDetailPublikasi(publikasi.id!) : null,
    {
      revalidateOnFocus: false,
      errorRetryCount: 2,
    }
  );

  // Use detailed data if available, otherwise use initial data
  const displayData = detailData || publikasi;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Detail Publikasi Ilmiah
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Memuat detail publikasi...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-32 text-red-500">
            <div>Gagal memuat detail publikasi. Menampilkan data dasar.</div>
          </div>
        ) : null}

        <div className="space-y-6 mt-4">
          {/* Judul Publikasi */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {displayData.title}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {displayData.accred}
            </Badge>
          </div>

          {/* Informasi Dasar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Jurnal
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {displayData.journal}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Penulis
                </label>
                <div className="text-sm text-gray-900 mt-1">
                  {displayData.authors && displayData.authors.length > 0 ? (
                    <div className="space-y-2">
                      {displayData.authors.map((author, index) => (
                        <div
                          key={author.author_id || index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div>
                            <span className="font-medium">
                              {author.author_name}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              (Urutan: {author.author_order})
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            ID: {author.author_id}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">-</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Tahun Publikasi
                </label>
                <p className="text-sm text-gray-900 mt-1">{displayData.year}</p>
              </div>

              {displayData.citation_count !== undefined && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Jumlah Sitasi
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {displayData.citation_count} sitasi
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {displayData.article_url && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    URL Artikel
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-blue-600 break-all flex-1">
                      <a
                        href={displayData.article_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        {displayData.article_url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(displayData.article_url)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {displayData.source && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Sumber
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        displayData.source?.includes("SCOPUS")
                          ? "primary"
                          : displayData.source?.includes("SINTA")
                          ? "purple"
                          : displayData.source?.includes("GOOGLE_SCHOLAR")
                          ? "blue"
                          : displayData.source?.includes("GARUDA")
                          ? "orange"
                          : "gray"
                      }
                    >
                      {displayData.source || "Unknown"}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DOI */}
          {displayData.doi && (
            <div>
              <label className="text-sm font-medium text-gray-700">DOI</label>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded flex-1">
                  {displayData.doi}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(displayData.doi!)}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Abstract */}
          {displayData.abstract && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Abstrak
              </label>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-900 leading-relaxed">
                  {displayData.abstract}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailDialog;
