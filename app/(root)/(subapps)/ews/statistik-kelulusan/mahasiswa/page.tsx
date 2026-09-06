import { Metadata } from "next";
import DashboardHeader from "@/components/dashboard-header";
import MahasiswaFilterListClient from "../../_components/statistik-kelulusan/mahasiswa-filter-list";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Daftar Mahasiswa Filter - EWS",
  description: "Daftar mahasiswa berdasarkan filter - Early Warning System",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function MahasiswaFilterPage({ searchParams }: PageProps) {
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
          { name: "Daftar Mahasiswa", url: "#" },
        ]}
        titleItems={[
          {
            title: "Daftar Mahasiswa",
            subtitle: "Daftar mahasiswa hasil penyaringan kriteria peringatan dini.",
          },
        ]}
      />
      <div className="mt-6">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">Loading...</div>}>
          <MahasiswaFilterListClient />
        </Suspense>
      </div>
    </div>
  );
}