import DashboardHeader from "@/components/dashboard-header";
import { TableDosenAdmin } from "../_components/manajemen-dosen/table";  // fix path

const ManajemenDosenAdminPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin" },
          { name: "Manajemen Dosen", url: "/admin/manajemen-dosen" },
        ]}
        titleItems={[
          {
            title: "Manajemen Dosen",
            subtitle: "Kelola data dosen di program studi Anda.",
          },
        ]}
      />
      <div className="mt-4">
        <TableDosenAdmin />
      </div>
    </div>
  );
};

export default ManajemenDosenAdminPage;