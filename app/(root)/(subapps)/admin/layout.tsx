"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  Home,
  AppWindow,
  School,
  BookOpenText,
  Award,
  Trophy,
  Settings,
  Users,
} from "lucide-react";
import { Role } from "@/types/role";
import { useProfile } from "@/context/profileUseContext";
import withAuth from "../../hoc/withAuth";
import { SidebarMenuContent } from "@/components/sidebar-menu-content";
import PopupPengumuman from "@/components/shared-popup/popup-pengumuman";

const SuperAdminSidebarData = {
  admin: [
    {
      name: "Dashboard",
      url: "/admin",
      icon: Home,
    },
    {
      name: "Manajemen Dosen",
      url: "/admin/manajemen-dosen",
      icon: Users,
    },
    {
      name: "Landing",
      url: "#",
      icon: AppWindow,
      subItems: [
        { name: "Hero-Slider", url: "/admin/landing-page/hero-slider" },
        {
          name: "Sambutan Kepala Program Studi",
          url: "/admin/landing-page/sambutan-kaprodi",
        },
        {
          name: "Prospek Karir",
          url: "/admin/landing-page/prospek-karir",
        },
      ],
    },
    {
      name: "Profil",
      url: "#",
      icon: Award,
      subItems: [
        {
          name: "Pengertian Program Studi",
          url: "/admin/profile-page/pengertian",
        },
        {
          name: "Visi Misi Program Studi",
          url: "/admin/profile-page/visi-misi",
        },
        {
          name: "Akreditasi Program Studi",
          url: "/admin/profile-page/akreditasi",
        },
        {
          name: "Struktur Organisasi Program Studi",
          url: "/admin/profile-page/struktur-organisasi",
        },
      ],
    },
    {
      name: "Akademik",
      url: "#",
      icon: School,
      subItems: [
        {
          name: "Daftar Matakuliah",
          url: "/admin/akademik-page/daftar-mata-kuliah",
        },
        {
          name: "Mata Kuliah Peminatan",
          url: "/admin/akademik-page/mata-kuliah-peminatan",
        },
        {
          name: "Daftar Peminatan",
          url: "/admin/akademik-page/peminatan",
        },
      ],
    },
    {
      name: "Publikasi",
      url: "#",
      icon: BookOpenText,
      subItems: [
        {
          name: "Publikasi Ilmiah",
          url: "/admin/publikasi-page/publikasi-ilmiah",
        },
        {
          name: "Riset Ilmiah",
          url: "/admin/publikasi-page/riset-ilmiah",
        },
      ],
    },
    {
      name: "Program Unggulan",
      url: "#",
      icon: Trophy,
      subItems: [
        {
          name: "Program Unggulan",
          url: "/admin/program-unggulan/program-unggulan",
        },
        {
          name: "Pengumuman Program Unggulan",
          url: "/admin/program-unggulan/pengumuman-program",
        },
        {
          name: "Aktivitas Program Unggulan",
          url: "/admin/program-unggulan/aktivitas-program",
        },
      ],
    },
  ],
};

function Layout({ children }: { children: React.ReactNode }) {
  const { profile, activeProdiId } = useProfile();
  const role: Role = profile?.roles as Role;

  const data =
    SuperAdminSidebarData[role as keyof typeof SuperAdminSidebarData] ??
    SuperAdminSidebarData["admin"];

  return (
    <SidebarProvider>
      <AppSidebar sidebarContent={<SidebarMenuContent items={data ?? []} />} />
      <main
        key={activeProdiId ?? "default"}
        className="flex flex-col w-full p-4 my-4 ml-4 mr-4 bg-white border lg:ml-0 rounded-xl"
      >
        <div className="">{children}</div>
      </main>
      <PopupPengumuman />
    </SidebarProvider>
  );
}

export default withAuth(Layout, undefined, ["admin", "super_fakultas"]);
