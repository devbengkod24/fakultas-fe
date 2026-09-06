import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import DetailDosenFetcher from "./detail-dosen-fetcher";
import { headers } from "next/headers";

interface DetailDosenPageProps {
  params: Promise<{ dosenId: string }>;
}

const DetailDosenPage = async ({ params }: DetailDosenPageProps) => {
  const { dosenId } = await params;

  const headerList = await headers();
  const prodiId = headerList.get("x-prodi-id");

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          { name: "Manajemen Dosen", url: "/fakultas/manajemen-dosen" },
          { name: "Detail Dosen", url: `/fakultas/manajemen-dosen/detail/${dosenId}` },
        ]}
        titleItems={[{ title: "Detail Dosen" }]}
      />
      <div className="mt-4">
        <DetailDosenFetcher 
        dosenId={Number(dosenId)} 
        prodiId={prodiId || undefined}
        canAssignProdi={true}
        />
      </div>
    </div>
  );
};

export default DetailDosenPage;