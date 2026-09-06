import { Metadata } from "next";
import DashboardHeader from "@/components/dashboard-header";
import NilaiDetailClient from "../../_components/statistik-kelulusan/nilai-detail-client";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Nilai Detail Mahasiswa - EWS",
  description: "Detail nilai mahasiswa per angkatan - Early Warning System",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function NilaiDetailPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const prodiId = resolvedParams.prodi_id as string | undefined;

  const backToDetailUrl = prodiId 
    ? `/ews/statistik-kelulusan/detail?prodi_id=${prodiId}` 
    : `/ews/statistik-kelulusan/detail`;

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/ews" },
          { name: "Statistik Kelulusan", url: "/ews/statistik-kelulusan" },
          { name: "Detail Angkatan", url: backToDetailUrl },
          { name: "Nilai Detail", url: "#" },
        ]}
        titleItems={[
          {
            title: "Nilai Detail Mahasiswa",
            subtitle: "Rincian status nilai mata kuliah yang belum terpenuhi.",
          },
        ]}
      />
      <div className="mt-6">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">Loading...</div>}>
          <NilaiDetailClient />
        </Suspense>
      </div>
    </div>
  );
}