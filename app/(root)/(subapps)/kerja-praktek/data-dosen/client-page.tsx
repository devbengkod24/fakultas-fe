"use client"

import React from 'react'
import DashboardHeader from "@/components/dashboard-header";
import DaftarDosenKoordinator from '../_components/data-dosen/koordinator';
import withAuth from '@/app/(root)/hoc/withAuth';

const DataDosenClientPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/kerja-praktek" },
          { name: "Dosen Pembimbing", url: "/kerja-praktek" },
          { name: "Data Dosen", url: "/kerja-praktek/data-dosen"}
        ]}
        titleItems={[
          {
            title: "Data Dosen Pembimbing",
            subtitle: "Berikut adalah data dosen pembimbing kerja practise.",
          },
        ]}
      />

      <DaftarDosenKoordinator />
    </div>
  )
}

export default withAuth(DataDosenClientPage, "kerja-praktek", ["koordinator", "super_fakultas"]);