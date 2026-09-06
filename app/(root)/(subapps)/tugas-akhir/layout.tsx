"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useProfile } from "@/context/profileUseContext";
import { Role } from "@/types/role";

import {
  BookOpen,
  BookText,
  CalendarClock,
  ClipboardList,
  FolderOpen,
  GraduationCap,
  History,
  Home,
  Megaphone,
  MonitorCheck,
  User,
  Users,
  Waves,
} from "lucide-react";
import withAuth from "../../hoc/withAuth";
import { SidebarMenuContent } from "@/components/sidebar-menu-content";
import PopupPengumuman from "@/components/shared-popup/popup-pengumuman";

const sidebarData = {
  dosen: [
    { name: "Dashboard", url: "/tugas-akhir", icon: Home },
    { name: "Pengumuman", url: "/tugas-akhir/pengumuman", icon: Megaphone },
    {
      name: "Pengajuan Mahasiswa",
      url: "/tugas-akhir/pengajuan-mahasiswa",
      icon: User,
    },
    {
      name: "Logbook Mahasiswa",
      url: "/tugas-akhir/logbook",
      icon: BookText,
    },
    {
      name: "Monitoring Sidang",
      url: "#",
      icon: MonitorCheck,
      subItems: [
        {
          name: "Tugas Akhir 1",
          url: "/tugas-akhir/sidang-ta1",
        },
        {
          name: "Tugas Akhir 2",
          url: "/tugas-akhir/sidang-ta2",
        },
      ],
    },
    {
      name: "Log Aktivitas",
      url: "/tugas-akhir/log-aktivitas",
      icon: History,
    },
  ],
  koordinator: [
    { name: "Dashboard", url: "/tugas-akhir", icon: Home },
    { name: "Pengumuman", url: "/tugas-akhir/pengumuman", icon: Megaphone },
    {
      name: "Dosen Pembimbing",
      url: "#",
      icon: GraduationCap,
      subItems: [
        { name: "Data Dosen", url: "/tugas-akhir/data-dosen" },
        { name: "Kuota Dosen", url: "/tugas-akhir/kuota-dosen" },
      ],
    },
    {
      name: "Mahasiswa",
      url: "#",
      icon: Users,
      subItems: [
        { name: "Data Mahasiswa", url: "/tugas-akhir/data-mahasiswa" },
        {
          name: "Data Semua Mahasiswa",
          url: "/tugas-akhir/data-mahasiswa-all",
        },
        {
          name: "Pengajuan Mahasiswa",
          url: "/tugas-akhir/pengajuan-mahasiswa",
        },
        {
          name: "Update Dospem",
          url: "/tugas-akhir/update-dospem",
        },
      ],
    },
    {
      name: "Rekap Logbook",
      url: "/tugas-akhir/logbook",
      icon: ClipboardList,
    },
    {
      name: "Gelombang Sidang",
      url: "/tugas-akhir/gelombang",
      icon: Waves,
    },
    {
      name: "Monitoring Sidang",
      url: "#",
      icon: MonitorCheck,
      subItems: [
        { name: "Tugas Akhir 1", url: "/tugas-akhir/sidang-ta1" },
        { name: "Tugas Akhir 2", url: "/tugas-akhir/sidang-ta2" },
      ],
    },
    {
      name: "Log Aktivitas",
      url: "/tugas-akhir/log-aktivitas",
      icon: History,
    },
  ],
  mahasiswa: [
    { name: "Dashboard", url: "/tugas-akhir", icon: Home },
    { name: "Pengumuman", url: "/tugas-akhir/pengumuman", icon: Megaphone },
    {
      name: "Pengajuan Tugas Akhir",
      url: "/tugas-akhir/pengajuan-mahasiswa",
      icon: BookOpen,
    },
    { name: "Logbook", url: "/tugas-akhir/logbook", icon: FolderOpen },
    {
      name: "Pengajuan Sidang",
      url: "#",
      icon: MonitorCheck,
      subItems: [
        { name: "Tugas Akhir 1", url: "/tugas-akhir/sidang-ta1" },
        { name: "Tugas Akhir 2", url: "/tugas-akhir/sidang-ta2" },
      ],
    },
  ],
};

function Layout({ children }: { children: React.ReactNode }) {
  const { profile, activeProdiId } = useProfile();
  const role: Role = profile?.roles as Role;
  const activeRole =
    role === "admin" || role === "super_fakultas" ? "koordinator" : role;
  const data = sidebarData[activeRole as keyof typeof sidebarData];

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

export default withAuth(Layout, "tugas-akhir");
