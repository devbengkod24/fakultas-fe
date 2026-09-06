import { Metadata } from "next";
import DashboardHeader from "@/components/dashboard-header";
import StatistikKelulusanDetailClient from "../../_components/statistik-kelulusan/statistik-kelulusan-detail";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Detail Statistik Kelulusan EWS",
  description: "Detail Statistik Kelulusan per Angkatan - Early Warning System",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function StatistikKelulusanDetailPage({
  searchParams,
}: PageProps) {
  const resolvedParams = await searchParams;
  const prodiId = resolvedParams.prodi_id as string | undefined;

  // Jika ada prodi_id, berarti dari super fakultas (kembali ke list prodi)
  // Jika tidak ada, berarti admin prodi (kembali ke dashboard ews)
  const backUrl = prodiId ? "/ews/statistik-kelulusan" : "/ews";

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/ews" },
          { name: "Statistik Kelulusan", url: backUrl },
          { name: "Detail Angkatan", url: "#" },
        ]}
        titleItems={[
          {
            title: "Detail Angkatan",
            subtitle: "Rincian statistik kelulusan berdasarkan tahun angkatan.",
          },
        ]}
      />
      <div className="mt-6">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">Loading...</div>}>
          <StatistikKelulusanDetailClient />
        </Suspense>
      </div>
    </div>
  );
}
