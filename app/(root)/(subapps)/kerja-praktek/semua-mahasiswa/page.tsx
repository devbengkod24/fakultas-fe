import DashboardHeader from "@/components/dashboard-header";
import SemuaMahasiswaTable from "./table";

const SemuaMahasiswaPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/kerja-praktek" },
          { name: "Mahasiswa", url: "/kerja-praktek/semua-mahasiswa" },
        ]}
        titleItems={[
          {
            title: "Data Seluruh Mahasiswa",
            subtitle: "Berikut adalah data seluruh mahasiswa KP yang terdaftar",
          },
        ]}
      />
      <SemuaMahasiswaTable />
    </div>
  );
};

export default SemuaMahasiswaPage;
