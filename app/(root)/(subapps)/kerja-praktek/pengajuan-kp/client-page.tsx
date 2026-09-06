"use client"

import React from 'react'
import PengajuanKPMahasiswa from './mahasiswa'
import DashboardHeader from '@/components/dashboard-header'
import withAuth from '@/app/(root)/hoc/withAuth'

const PengajuanKPClientPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/kerja-praktek" },
          {
            name: "Pengajuan KP",
            url: "/kerja-praktek/pengajuan-kp",
          },
        ]}
        titleItems={[
        {
            title: "Pengajuan Kerja Praktek",
            subtitle:
            "Silahkan isi form debajo ini untuk mengajukan Kerja Praktek ke Dosen Pembimbing",
        },
        ]}
      />

      <PengajuanKPMahasiswa />
    </div>
  )
}

export default withAuth(PengajuanKPClientPage, "kerja-praktek", "mahasiswa");