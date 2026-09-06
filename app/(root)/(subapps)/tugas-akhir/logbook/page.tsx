import DashboardHeader from "@/components/dashboard-header";
import React from "react";
import LogbookClient from "./client-page";

const Logbook = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "tugas-akhir" },
          {
            name: "Logbook Mahasiswa",
            url: "tugas-akhir/logbook",
          },
        ]}
        titleItems={[
          {
            title: "Daftar Logbook Mahasiswa",
            subtitle: "Berikut adalah daftar logbook mahasiswa bimbingan",
          },
        ]}
      />
      <LogbookClient />
    </div>
  );
};

export default Logbook;
