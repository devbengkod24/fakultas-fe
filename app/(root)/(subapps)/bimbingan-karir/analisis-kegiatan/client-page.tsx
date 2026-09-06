"use client";

import DashboardHeader from '@/components/dashboard-header'
import React from 'react'
import ComparasionPage from '../_components/analisis-kegiatan/comparasion-page'
import withAuth from '@/app/(root)/hoc/withAuth'
import { useProfile } from "@/context/profileUseContext";

const AnalisisKegiatanPage = () => {
  const { activeProdiId } = useProfile();

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/apps/bimbingan-karir/koordinator" },
          { name: "Analisis Kegiatan", url: "/apps/bimbingan-karir/koordinator/analisis-kegiatan" },
        ]}
        titleItems={[
          {
            title: "Analisis Kegiatan",
            subtitle: "Berikut adalah data-data analisis kegiatan yang dapat Anda akses.",
          },
        ]}
      />
      <ComparasionPage key={activeProdiId}/>
    </div>
  )
}

export default withAuth(AnalisisKegiatanPage, "bimbingan-karir", ["koordinator","super_fakultas","admin"]);