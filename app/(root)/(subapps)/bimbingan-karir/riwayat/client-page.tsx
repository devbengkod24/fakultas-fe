"use client";

import DashboardHeader from "@/components/dashboard-header";
import { TablesRiwayat } from "../_components/riwayat/data-mhs-riwayat";
import withAuth from "@/app/(root)/hoc/withAuth";
import { useProfile } from "@/context/profileUseContext";


const RiwayatPage = () => {
  const { activeProdiId } = useProfile();

  return (
    <div>
        <DashboardHeader
          breadcrumbItems={[
            { name: "Dashboard", url: "/bimbingan-karir" },
            { name: "Riwayat", url: "/bimbingan-karir/riwayat" },
          ]}
          titleItems={[
            {
              title: "Riwayat",
              subtitle: "Berikut adalah daftar riwayat mahasiswa yang pernah mengikuti Bimbingan Karir!",
            },
          ]}
        />
        <TablesRiwayat key={activeProdiId}/>
    </div>
  );
}

export default withAuth(RiwayatPage, "bimbingan-karir", ["koordinator" , "super_fakultas","admin"]);
