import DashboardHeader from "@/components/dashboard-header";
import LogbookDosenClientPage from "./client-page";

const LogbookDosenPage = async ({ params }: { params: Promise<{ dosenId: string }> }) => {
  const { dosenId } = await params;
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/kerja-praktek" },
          { name: "Logbook Mahasiswa", url: "/kerja-praktek",},
          { name: "Detail Logbook", url: "/kerja-praktek/logbook-mahasiswa" },
        ]}
        titleItems={[
          {
            title: "Logbook Mahasiswa Bimbingan",
            subtitle: "Berikut adalah daftar mahasiswa bimbingan dosbim ini.",
          },
        ]}
      />
      <LogbookDosenClientPage dosenId={dosenId} />
    </div>
  );
};

export default LogbookDosenPage;