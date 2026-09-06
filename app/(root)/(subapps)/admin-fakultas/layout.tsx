"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useProfile } from "@/context/profileUseContext";
import { Role } from "@/types/role";
import {
  Home,
  MessageSquareQuote,
  Award,
  Images,
  Megaphone,
  Newspaper,
  Building,
  DoorOpen,
} from "lucide-react";
import withAuth from "../../hoc/withAuth";
import { SidebarMenuContent } from "@/components/sidebar-menu-content";
import PopupPengumuman from "@/components/shared-popup/popup-pengumuman";

const AdminFakultasSidebarData = {
  admin_fakultas: [
    { name: "Dashboard", url: "/admin-fakultas", icon: Home },
    { name: "Hero-Slider", url: "/admin-fakultas/hero-slider", icon: Images },
    {
      name: "Sambutan Dekan",
      url: "/admin-fakultas/sambutan-dekan",
      icon: MessageSquareQuote,
    },
    {
      name: "Profil",
      url: "#",
      icon: Award,
      subItems: [
        {
          name: "Pengenalan Fakultas",
          url: "/admin-fakultas/profile-page/pengenalan",
        },
        {
          name: "Visi Misi Fakultas",
          url: "/admin-fakultas/profile-page/visi-misi",
        },
        {
          name: "Struktur Organisasi Fakultas",
          url: "/admin-fakultas/profile-page/struktur-organisasi",
        },
      ],
    },
    { 
      name: "Pengumuman", 
      url: "#", 
      icon: Megaphone,
      subItems: [
        { 
          name: "Validasi Pengumuman", 
          url: "/admin-fakultas/pengumuman/validasi" 
        },
        { 
          name: "Kelola Pengumuman", 
          url: "/admin-fakultas/pengumuman/tambah" 
        },
      ],
    },
    {
      name: "Manajemen Berita",
      url: "/admin-fakultas/manajemen-berita",
      icon: Newspaper,
    },
    {
      name: "Fasilitas Fakultas",
      url: "/admin-fakultas/fasilitas",
      icon: Building,
    },
  ],
};

function Layout({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile();
  const role: Role = profile?.roles as Role;

  const data =
    AdminFakultasSidebarData[role as keyof typeof AdminFakultasSidebarData] ||
    AdminFakultasSidebarData["admin_fakultas"];

  return (
    <SidebarProvider>
      <AppSidebar sidebarContent={<SidebarMenuContent items={data ?? []} />} />
      <main className="flex flex-col w-full p-4 my-4 ml-4 mr-4 bg-white border lg:ml-0 rounded-xl">
        <div className="">{children}</div>
      </main>
      <PopupPengumuman />
    </SidebarProvider>
  );
}

export default withAuth(Layout, "admin-fakultas", ["admin_fakultas", "super_fakultas"]);
