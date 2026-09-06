"use client";

import DashboardHeader from "@/components/dashboard-header";
import { KuotaDosenTable } from "./table";
import withAuth from "@/app/(root)/hoc/withAuth";

const KuotaDosenClient = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/kerja-praktek" },
          { name: "Dosen Pembimbing", url: "/kerja-praktek/data-dosen" },
          { name: "Kuota Dosen", url: "/kerja-praktek/kuota-dosen" },
        ]}
        titleItems={[
          {
            title: "Kuota Dosen Pembimbing",
            subtitle:
              "Atur kuota dosen pembimbing kerja practise",
          },
        ]}
      />

      <KuotaDosenTable />
    </div>
  );
};

export default withAuth(KuotaDosenClient, "kerja-praktek", ["koordinator", "super_fakultas"]);