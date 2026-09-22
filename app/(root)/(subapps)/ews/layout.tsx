"use client";

import { ReactNode } from "react";
import {
  Home,
  GraduationCap,
  BarChart3,
  RefreshCw,
  User,
} from "lucide-react";
import withAuth from "../../hoc/withAuth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarMenuContent } from "@/components/sidebar-menu-content";
import { useProfile } from "@/context/profileUseContext";
import PopupPengumuman from "@/components/shared-popup/popup-pengumuman";

const sidebarData = {
  super_fakultas: [
    {
      name: "Dashboard",
      url: "/ews",
      icon: Home,
    },
    {
      name: "Statistik Kelulusan",
      url: "/ews/statistik-kelulusan",
      icon: GraduationCap,
    },
    {
      name: "Capaian Mahasiswa",
      url: "/ews/capaian-mahasiswa",
      icon: BarChart3,
    },
    {
      name: "Recalculate EWS",
      url: "/ews/recalculate",
      icon: RefreshCw,
    },
  ],

  admin: [
    {
      name: "Dashboard",
      url: "/ews",
      icon: Home,
    },
    {
      name: "Statistik Kelulusan",
      url: "/ews/statistik-kelulusan",
      icon: GraduationCap,
    },
    {
      name: "Capaian Mahasiswa",
      url: "/ews/capaian-mahasiswa",
      icon: BarChart3,
    },
  ],

  mahasiswa: [
    {
      name: "Profil EWS",
      url: "/ews/profile",
      icon: User,
    },
  ],
};

function Layout({
  children,
}: {
  children: ReactNode;
}) {
  const { profile } = useProfile();

  const role =
    profile?.roles;

  const data =
    sidebarData[
      role as keyof typeof sidebarData
    ];

  return (
    <SidebarProvider>
      <AppSidebar
        sidebarContent={
          <SidebarMenuContent
            items={data ?? []} 
          />
        }
      />

      <main className="flex flex-col w-full p-4 my-4 ml-4 mr-4 bg-white border lg:ml-0 rounded-xl">
        <div className="">{children}</div>
      </main>
      <PopupPengumuman />
    </SidebarProvider>
  );
}

export default withAuth(
  Layout,
  "ews"
);