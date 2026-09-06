"use client";

import EditPublikasiPage from "@/app/(root)/components/edit-publikasi-page";

interface Props {
  publikasi: any;
  dosenId: string;
  articleId: number;
  baseUrl?: string;
}

export function PublikasiDetailClient({ dosenId, articleId, baseUrl = "/fakultas/manajemen-dosen/detail" }: Props) {
  
  return (
    <EditPublikasiPage
      articleId={articleId}
      backUrl={`${baseUrl}/${dosenId}`}
      hideDashboardHeader  // ← tambah prop ini
    />
  );
}