import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import DetailDosenFetcher from "@/app/(root)/(subapps)/fakultas/manajemen-dosen/detail/[dosenId]/detail-dosen-fetcher";

interface DetailDosenPageProps {
  params: Promise<{ dosenId: string }>;
}

const DetailDosenPage = async ({ params }: DetailDosenPageProps) => {
  const { dosenId } = await params;

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin" },
          { name: "Manajemen Dosen", url: "/admin/manajemen-dosen" },
          { name: "Detail Dosen", url: `/admin/manajemen-dosen/detail/${dosenId}` },
        ]}
        titleItems={[{ title: "Detail Dosen" }]}
      />
      <div className="mt-4">
        <DetailDosenFetcher
          dosenId={Number(dosenId)}
          baseUrl="/admin/manajemen-dosen/detail"
        />
      </div>
    </div>
  );
};

export default DetailDosenPage;
