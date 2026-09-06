import DashboardHeader from "@/components/dashboard-header";
import { PublikasiDetailClient } from "./publikasi-dosen-client";

interface Props {
  params: Promise<{ dosenId: string; detailId: string }>;
}

async function getPublikasiData(detailId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_PUBLIKASI_URL}/articles/${detailId}`,
    { cache: "no-store" }
  );
  const json = await res.json();
  return json?.data ?? null;
}

export default async function PublikasiDetailPage({ params }: Props) {
  const { dosenId, detailId } = await params;
  const publikasi = await getPublikasiData(detailId);

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          { name: "Manajemen Dosen", url: "/fakultas/manajemen-dosen" },
          { name: "Detail Dosen", url: `/fakultas/manajemen-dosen/detail/${dosenId}` },
          { name: "Detail Publikasi", url: "#" },
        ]}
        titleItems={[{ title: "Detail Publikasi" }]}
      />
      <div className="mt-4">
        <PublikasiDetailClient publikasi={publikasi} dosenId={dosenId} articleId={parseInt(detailId)}/>
      </div>
    </div>
  );
}