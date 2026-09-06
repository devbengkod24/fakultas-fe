"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  ClipboardCheck,
  ClipboardList,
  Clock,
  Home,
  Megaphone,
  Users,
  History,
  Award,
  UserPlus,
  Tags,
  Compass,
} from "lucide-react";
import { RoleBk } from "@/types/role";
import { useProfile } from "@/context/profileUseContext";
import withAuth from "../../hoc/withAuth";
import { SidebarMenuContent } from "@/components/sidebar-menu-content";
import PopupPengumuman from "@/components/shared-popup/popup-pengumuman";

// Menu untuk pengajar dan dosen (sama)
const pengajarDosenMenu = [
  { name: "Dashboard", url: "/bimbingan-karir", icon: Home },
  {
    name: "Daftar Mahasiswa",
    url: "/bimbingan-karir/daftar-mahasiswa",
    icon: Users,
  },
  {
    name: "Daftar Kegiatan",
    url: "/bimbingan-karir/daftar-kegiatan",
    icon: ClipboardList,
  },
];

const BkSidebarData = {
  koordinator: [
    { name: "Dashboard", url: "/bimbingan-karir", icon: Home },
    {
      name: "Pengumuman",
      url: "/bimbingan-karir/pengumuman",
      icon: Megaphone,
    },
    {
      name: "Periode Ajaran",
      url: "/bimbingan-karir/periode-ajaran",
      icon: Clock,
    },
    {
      name: "Daftar Mahasiswa",
      url: "/bimbingan-karir/daftar-mahasiswa",
      icon: Users,
    },
    {
      name: "Manajemen Kategori",
      url: "/bimbingan-karir/manajemen-kategori",
      icon: Tags,
    },
    {
      name: "Manajemen Minat",
      url: "/bimbingan-karir/manajemen-minat",
      icon: Compass,
    },
    {
      name: "Manajemen Pengajar",
      url: "/bimbingan-karir/manajemen-pengajar",
      icon: UserPlus,
    },
    {
      name: "Daftar Kegiatan",
      url: "/bimbingan-karir/daftar-kegiatan",
      icon: ClipboardList,
    },
    {
      name: "Sertifikat",
      url: "/bimbingan-karir/sertifikat",
      icon: Award,
    },
    {
      name: "Laporan",
      url: "#",
      icon: ClipboardCheck,
      subItems: [
        { name: "Rekap Nilai", url: "/bimbingan-karir/rekap-nilai" },
        { name: "Riwayat", url: "/bimbingan-karir/riwayat" },
        {
          name: "Analisis Kegiatan",
          url: "/bimbingan-karir/analisis-kegiatan",
        },
        { name: "Feedback Rating", url: "/bimbingan-karir/feedback-rating" },
      ],
    },
    {
      name: "Log Aktivitas",
      url: "/bimbingan-karir/log-aktivitas",
      icon: History,
    },
  ],
  mahasiswa: [
    { name: "Dashboard", url: "/bimbingan-karir", icon: Home },
    {
      name: "Daftar Kegiatan",
      url: "/bimbingan-karir/daftar-kegiatan",
      icon: ClipboardList,
    },
    {
      name: "Rekap Nilai",
      url: "/bimbingan-karir/rekap-nilai",
      icon: ClipboardCheck,
    },
    { name: "Pengumuman", url: "/bimbingan-karir/pengumuman", icon: Megaphone },
  ],
  pengajar: pengajarDosenMenu,
  dosen: pengajarDosenMenu,
};

function Layout({ children }: { children: React.ReactNode }) {
  const { profile, activeProdiId } = useProfile();
  const role: RoleBk = profile?.roles as RoleBk;
  const activeRole =
    role === "koordinator" ||
    role === "admin" ||
    role === "super_fakultas" ||
    role === "admin_fakultas"
      ? "koordinator"
      : role || "koordinator";
  const data = BkSidebarData[activeRole as keyof typeof BkSidebarData];

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

export default withAuth(Layout, "bimbingan-karir");
