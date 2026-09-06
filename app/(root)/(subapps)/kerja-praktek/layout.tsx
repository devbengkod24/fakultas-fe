"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarMenuContent } from "@/components/sidebar-menu-content";
import { Role } from "@/types/role";
import {
  ClipboardList,
  Clock,
  Home,
  ListChecks,
  MonitorCheck,
  UserSquare,
  BookText,
  CalendarCheck,
  ScrollText,
  GraduationCap,
  Megaphone,
  SquarePen,
  Waves,
  Users2,
  Users,
} from "lucide-react";
import { useProfile } from "@/context/profileUseContext";
import withAuth from "../../hoc/withAuth";

const sidebarData = {
  dosen: [
    { name: "Dashboard", url: "/kerja-praktek", icon: Home },
    {
      name: "Mahasiswa Bimbingan",
      url: "/kerja-praktek/mahasiswa-bimbingan",
      icon: Users2,
    },
    {
      name: "Logbook Mahasiswa",
      url: "/kerja-praktek/logbook-mahasiswa",
      icon: BookText,
    },
    {
      name: "Sidang",
      url: "/kerja-praktek/hasil-sidang",
      icon: CalendarCheck,
    },
    {
      name: "Log Aktivitas",
      url: "/kerja-praktek/log-aktivitas",
      icon: ScrollText,
    },
  ],
  mahasiswa: [
    { name: "Dashboard", url: "/kerja-praktek", icon: Home },
    {
      name: "Pengajuan KP",
      url: "/kerja-praktek/pengajuan-kp",
      icon: SquarePen,
    },
    {
      name: "Logbook Bimbingan",
      url: "/kerja-praktek/logbook-bimbingan",
      icon: BookText,
    },
    {
      name: "Pengajuan Sidang",
      url: "/kerja-praktek/pengajuan-sidang",
      icon: CalendarCheck,
    },
  ],
  koordinator: [
    { name: "Dashboard", url: "/kerja-praktek", icon: Home },
    { name: "Pengumuman", url: "/kerja-praktek/pengumuman", icon: Megaphone },
    {
      name: "Dosen Pembimbing",
      url: "#",
      icon: GraduationCap,
      subItems: [
        { name: "Data Dosen", url: "/kerja-praktek/data-dosen" },
        { name: "Kuota Dosen", url: "/kerja-praktek/kuota-dosen" },
      ],
    },
    {
      name: "Mahasiswa",
      url: "#",
      icon: Users,
      subItems: [
        { name: "Semua Mahasiswa", url: "/kerja-praktek/semua-mahasiswa" },
        { name: "Data Mahasiswa", url: "/kerja-praktek/data-mahasiswa" },
        { name: "Daftar Pengajuan", url: "/kerja-praktek/mahasiswa-bimbingan" },
        { name: "Update Dospem", url: "/kerja-praktek/update-dosbim" },
      ],
    },
    {
      name: "Logbook Mahasiswa",
      url: "/kerja-praktek/logbook-mahasiswa",
      icon: ClipboardList,
    },
    { name: "Gelombang Sidang", url: "/kerja-praktek/gelombang", icon: Waves },
    {
      name: "Sidang KP",
      url: "#",
      icon: MonitorCheck,
      subItems: [
        { name: "Data Pengajuan", url: "/kerja-praktek/data-pengajuan" },
        { name: "Plotting Jadwal", url: "/kerja-praktek/plotting-jadwal" },
        { name: "Hasil Sidang", url: "/kerja-praktek/hasil-sidang" },
      ],
    },
    {
      name: "Log Aktivitas",
      url: "/kerja-praktek/log-aktivitas",
      icon: UserSquare,
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
        className="lg:flex flex-col w-full p-4 my-4 ml-4 mr-4 bg-white border lg:ml-0 rounded-xl"
      >
        <div className="">{children}</div>
      </main>
    </SidebarProvider>
  );
}

export default withAuth(Layout, "kerja-praktek");
