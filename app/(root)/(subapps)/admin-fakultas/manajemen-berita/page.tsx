"use client";

import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataDaftarBerita } from "../_components/manajemen-berita/table";

export default function ManajemenBeritaPage() {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          {
            name: "Manajemen Berita",
            url: "/fakultas/manajemen-berita",
          },
        ]}
        titleItems={[
          {
            title: "Manajemen Berita",
            subtitle:
              "Kelola data berita yang tersedia di landing page fakultas.",
          },
        ]}
      />
      <DataDaftarBerita />
    </div>
  );
}
