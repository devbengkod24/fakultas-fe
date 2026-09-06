"use client";

import * as React from "react";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { AppSwitcher } from "./app-switcher";
import { ProdiSwitcher } from "./prodi-switcher";
import { useProfile } from "@/context/profileUseContext";
import { usePathname } from "next/navigation";

interface AppSidebarProps {
  sidebarContent: React.ReactNode;
  headerContent?: React.ReactNode;
}

const PRODI_SWITCHER_ROUTES = [
  "/tugas-akhir",
  "/kerja-praktek",
  "/bimbingan-karir",
  "/admin",
];

export const AppSidebar = React.memo(
  ({
    sidebarContent,
    headerContent,
    ...props
  }: AppSidebarProps & React.ComponentProps<typeof Sidebar>) => {
    const { profile } = useProfile();
    const pathname = usePathname();
    const isMultiProdiRole = [
      "super_fakultas",
      "dosen",
      "koordinator",
    ].includes(profile?.roles ?? "");
    const hasMultipleProdi = (profile?.daftar_prodi?.length ?? 0) > 1;
    const showProdiSwitcher =
      isMultiProdiRole &&
      hasMultipleProdi &&
      PRODI_SWITCHER_ROUTES.some(
        (p) => pathname === p || pathname.startsWith(p + "/"),
      );

    return (
      <Sidebar collapsible="icon" variant="inset" {...props}>
        <SidebarHeader>
          <div className="mb-4 flex items-center gap-2 px-2 group-data-[collapsible=icon]:hidden">
            <Image
              src="/assets/landingpage/logo/logo-dinus.png"
              alt="Logo Udinus"
              className="object-contain shrink-0"
              width={36}
              height={36}
            />
            <div className="flex flex-col leading-tight font-extrabold uppercase tracking-wide text-[#114D91]">
              <span className="text-xs">UNIVERSITAS</span>
              <span className="text-xs">DIAN NUSWANTORO</span>
            </div>
          </div>

          <div className="mb-4 hidden justify-center group-data-[collapsible=icon]:flex">
            <Image
              src="/assets/landingpage/logo/logo-dinus.png"
              alt="Logo Udinus"
              className="object-contain"
              width={32}
              height={32}
            />
          </div>
          <AppSwitcher />
          {headerContent && <div className="px-2 mt-2">{headerContent}</div>}
        </SidebarHeader>
        <SidebarContent>{sidebarContent}</SidebarContent>
        <SidebarFooter>
          {showProdiSwitcher && (
            <div className="px-2 pb-1 group-data-[collapsible=icon]:hidden">
              <ProdiSwitcher />
            </div>
          )}
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  },
);

AppSidebar.displayName = "AppSidebar";
