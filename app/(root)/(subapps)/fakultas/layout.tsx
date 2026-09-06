"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  Home,
  RefreshCw,
  Users,
  UserCheck,
  FileBarChart,
  DoorOpen,
  BookOpenText,
} from "lucide-react";
import withAuth from "../../hoc/withAuth";
import { SidebarMenuContent } from "@/components/sidebar-menu-content";
import PopupPengumuman from "@/components/shared-popup/popup-pengumuman";
import { useEffect, useState } from "react";
import { ManajemenProdiPublicService } from "@/api/public/manajemen-prodi";
import type { ProdiData } from "@/types/fakultas/manajemen-prodi/manajemen-prodi";

type ProdiCategoryResponse = {
  id: number;
  nama: string;
};

// Static sidebar items (without Laporan Eksekutif)
const getStaticSidebarItems = () => [
  { name: "Dashboard", url: "/fakultas", icon: Home },
  {
    name: "Sync Data",
    url: "/fakultas/sync-data",
    icon: RefreshCw,
    subItems: [
      { name: "Periode", url: "/fakultas/sync-data/periode" },
      { name: "Publikasi", url: "/fakultas/sync-data/publikasi" },
      { name: "Mata Kuliah", url: "/fakultas/sync-data/mata-kuliah" },
      { name: "KRS Mahasiswa", url: "/fakultas/sync-data/krs-mahasiswa" },
      { name: "Data Dosen", url: "/fakultas/sync-data/dosen" },
      { name: "Mahasiswa", url: "/fakultas/sync-data/mahasiswa" },

    ],
  },
  {
    name: "Manajemen Koordinator",
    url: "/fakultas/manajemen-koordinator",
    icon: Users,
  },
   {
    name: "Data Master Prodi",
    url: "/fakultas/data-master-prodi",
    icon: Users,
    subItems: [
      { name: "Manajemen Admin", url: "/fakultas/data-master-prodi/manajemen-admin" },
      { name: "Manajemen Prodi", url: "/fakultas/data-master-prodi/manajemen-prodi" },
    ],
  },
  {
    name: "Manajemen Dosen",
    url: "/fakultas/manajemen-dosen",
    icon: UserCheck,
  },
  {
    name: "Publikasi",
    url: "#",
    icon: BookOpenText,
    subItems: [
      {
        name: "Publikasi Ilmiah",
        url: "/fakultas/publikasi-page/publikasi-ilmiah",
      },
      {
        name: "Riset Ilmiah",
        url: "/fakultas/publikasi-page/riset-ilmiah",
      },
    ],
  },
  {
    name: "Ruangan Sidang",
    url: "/fakultas/ruangan-sidang",
    icon: DoorOpen,
  },
];

function Layout({ children }: { children: React.ReactNode }) {
  const [prodiList, setProdiList] = useState<ProdiData[]>([]);
  const [categoryList, setCategoryList] = useState<ProdiCategoryResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodiRes, categoryRes] = await Promise.all([
          ManajemenProdiPublicService.getAll({ limit: 100 }),
          ManajemenProdiPublicService.getCategories(),
        ]);

        const rawProdi = prodiRes?.data?.data ?? prodiRes?.data ?? prodiRes ?? [];
        setProdiList(Array.isArray(rawProdi) ? rawProdi : []);

        const rawCategories = categoryRes?.data?.data ?? categoryRes?.data ?? categoryRes ?? [];
        setCategoryList(Array.isArray(rawCategories) ? rawCategories : []);
      } catch (error) {
        console.error("Gagal mengambil data prodi untuk sidebar:", error);
      }
    };

    fetchData();
  }, []);

  // Build 3-level sidebar: Laporan Eksekutif → Categories → Prodi
  // API returns category as a string (e.g. "Sarjana (S1)"), match by name
  const categorySubItems = categoryList.map((cat) => {
    const prodiInCategory = prodiList.filter((p) => {
      const catName = typeof p.category === "object" && p.category
        ? (p.category as { nama: string }).nama
        : String(p.category || "");
      return catName === cat.nama;
    });
    return {
      name: cat.nama,
      url: `#laporan-${cat.id}`,
      subItems: prodiInCategory.map((prodi) => ({
        name: `${prodi.nama} (${prodi.gelar})`,
        url: `/fakultas/laporan-eksekutif/${prodi.kode_prodi.toLowerCase()}`,
      })),
    };
  });

  const staticItems = getStaticSidebarItems();
  const sidebarData = [
    ...staticItems,
    {
      name: "Laporan Eksekutif",
      url: "/fakultas/laporan-eksekutif",
      icon: FileBarChart,
      subItems: categorySubItems,
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar sidebarContent={<SidebarMenuContent items={sidebarData ?? []} />} />
      <main className="flex flex-col w-full p-4 my-4 ml-4 mr-4 bg-white border lg:ml-0 rounded-xl min-w-0">
        <div className="">{children}</div>
      </main>
      <PopupPengumuman />
    </SidebarProvider>
  );
}

export default withAuth(Layout, "fakultas", ["super_fakultas"]);