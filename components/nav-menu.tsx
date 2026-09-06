"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMenu({
  menu,
}: {
  menu: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {menu.map((item) => {
          const excludedPaths = [
            "/admin",
            "/admin-fakultas",
            "/superadmin",
            "/tugas-akhir",
            "/kerja-praktek",
            "/bimbingan-karir",
            "/fakultas",
          ];
          const isActive =
            pathname === item.url ||
            (pathname.startsWith(item.url + "/") &&
              !excludedPaths.includes(item.url));

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                className={`p-5 relative ${
                  isActive
                    ? "bg-primary-400/10 text-primary hover:bg-primary-400/10 hover:text-primary before:absolute before:top-2 before:bottom-2 before:left-0 before:w-1 before:bg-primary before:rounded-r-md"
                    : ""
                }`}
              >
                <Link href={item.url} className="flex items-center gap-2">
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
