import DashboardHeader from "@/components/dashboard-header";
import EditPenelitianPage from "@/app/(root)/components/edit-penelitian-page";

interface Props {
  params: Promise<{ dosenId: string; detailId: string }>;
}

export default async function PenelitianDetailPage({ params }: Props) {
  const { dosenId, detailId } = await params;

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin" },
          { name: "Manajemen Dosen", url: "/admin/manajemen-dosen" },
          { name: "Detail Dosen", url: `/admin/manajemen-dosen/detail/${dosenId}` },
          { name: "Detail Penelitian", url: "#" },
        ]}
        titleItems={[{ title: "Detail Penelitian" }]}
      />
      <div className="mt-4">
        <EditPenelitianPage
          penelitianId={Number(detailId)}
          backUrl={`/admin/manajemen-dosen/detail/${dosenId}`}
          hideDashboardHeader
        />
      </div>
    </div>
  );
}
