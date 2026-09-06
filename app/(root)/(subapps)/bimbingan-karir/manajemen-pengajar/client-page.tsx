"use client";

import DashboardHeader from "@/components/dashboard-header";
import withAuth from "@/app/(root)/hoc/withAuth";
import { TablesManajemenPengajar } from "@/app/(root)/(subapps)/bimbingan-karir/_components/manajemen-pengajar/table";
import { useProfile } from "@/context/profileUseContext";


const ManajemenPengajarPage = () => {
  const { activeProdiId } = useProfile();

  return (
    <div>
        <DashboardHeader
          breadcrumbItems={[
            { name: "Dashboard", url: "/bimbingan-karir" },
            { name: "Manajemen Dosen", url: "/bimbingan-karir/manajemen-dosen" },
          ]}
          titleItems={[
            {
              title: "Manajemen Pengajar",
              subtitle: "Anda dapat memanajemen pengajar yang terdaftar pada sistem bimbingan karir disini!",
            },
          ]}
        />
        <TablesManajemenPengajar key={activeProdiId}/>
    </div>
  );
}

export default withAuth(ManajemenPengajarPage, "bimbingan-karir", ["koordinator","super_fakultas","admin"]);