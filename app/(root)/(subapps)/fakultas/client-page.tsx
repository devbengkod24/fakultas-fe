"use client";

import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard-header";
import { useProfile } from "@/context/profileUseContext";
import { LulusanAlumni } from "./_components/dashboard/lulusan-alumni";
import BkTab from "./_components/dashboard/bk-tab";
import KpTab from "./_components/dashboard/kp-tab";
import TaTab from "./_components/dashboard/ta-tab";
import { CustomTabs } from "@/components/custom-tabs";
import { Briefcase, HeartHandshake, GraduationCap, Users } from "lucide-react";

const DashboardAdminClient = () => {
  const { profile } = useProfile();
  const [activeTab, setActiveTab] = useState("ta");

  const tabs = [
    { status: "ta", label: "Tugas Akhir (TA)", icon: GraduationCap },
    { status: "kp", label: "Kerja Praktek (KP)", icon: Briefcase },
    { status: "bk", label: "Bimbingan Karir (BK)", icon: HeartHandshake },
    { status: "alumni", label: "Lulusan & Alumni", icon: Users },
  ];

  return (
    <>
      <DashboardHeader
        breadcrumbItems={[{ name: "Dashboard", url: "/fakultas" }]}
        titleItems={[
          {
            title: `Selamat Datang, ${profile?.name ?? "Super Fakultas"}`,
            subtitle: "Fakultas Ilmu Komputer — Executive Command Center Dashboard",
          },
        ]}
      />

      <div className="flex flex-col gap-4 mt-4 pb-6">
        <CustomTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="mt-2">
          {activeTab === "ta" && <TaTab />}
          {activeTab === "kp" && <KpTab />}
          {activeTab === "bk" && <BkTab />}
          {activeTab === "alumni" && <LulusanAlumni />}
        </div>
      </div>
    </>
  );
};

export default DashboardAdminClient;

