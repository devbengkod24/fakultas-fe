"use client";

import * as React from "react";
import {
  Briefcase,
  GraduationCap,
  BookCheck,
  ShieldCheck,
  Landmark,
  Brush,
  AlertTriangle,
  ChevronsUpDown,
} from "lucide-react";
import { usePathname } from "next/navigation";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { useProfile } from "@/context/profileUseContext";
import { cn } from "@/lib/utils";
import { EWS_ALLOWED_ROLES } from "@/lib/constant";

interface Team {
  name: string;
  url: string;
  logo: React.ComponentType<{ className?: string }>;
  color: string;
  textcolor: string;
  permission?: string;
}

const getColorClasses = (color: string) => {
  const colorMap = {
    orange: { bg: "bg-orange-50", border: "border-orange-200", icon: "text-orange-500" },
    blue: { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-500" },
    yellow: { bg: "bg-yellow-50", border: "border-yellow-200", icon: "text-yellow-500" },
    green: { bg: "bg-green-50", border: "border-green-200", icon: "text-green-500" },
    purple: { bg: "bg-purple-50", border: "border-purple-200", icon: "text-purple-500" },
    red: { bg: "bg-red-50", border: "border-red-200", icon: "text-red-500" }
  };
  return colorMap[color as keyof typeof colorMap] || colorMap.blue;
};

const teamsData: Team[] = [
  {
    name: "Fakultas",
    url: "/fakultas",
    logo: Landmark,
    color: "orange",
    textcolor: "text-orange-500",
    permission: "fakultas",
  },
  {
    name: "Admin Fakultas",
    url: "/admin-fakultas",
    logo: Brush,
    color: "purple",
    textcolor: "text-purple-500",
    permission: "admin-fakultas",
  },
  {
    name: "Admin",
    url: "/admin",
    logo: ShieldCheck,
    color: "purple",
    textcolor: "text-purple-500",
    permission: "admin",
  },
  {
    name: "Tugas Akhir",
    url: "/tugas-akhir",
    logo: BookCheck,
    color: "orange",
    textcolor: "text-orange-500",
    permission: "tugas-akhir",
  },
  {
    name: "Kerja Praktek",
    url: "/kerja-praktek",
    logo: Briefcase,
    color: "blue",
    textcolor: "text-blue-500",
    permission: "kerja-praktek",
  },
  {
    name: "Bimbingan Karir",
    url: "/bimbingan-karir",
    logo: GraduationCap,
    color: "yellow",
    textcolor: "text-yellow-500",
    permission: "bimbingan-karir",
  },
  {
    name: "Early Warning System",
    url: "/ews",
    logo: AlertTriangle,
    color: "red",
    textcolor: "text-red-500",
    permission: "ews",
  },
];

export function AppSwitcher() {
  const { isMobile } = useSidebar();
  const { profile } = useProfile();
  const pathname = usePathname();
  const permission = profile?.permissions;

  const hasPermission = (team: Team) => {
    if (!team.permission) return true;

    if (team.permission === "ews") {
      return (EWS_ALLOWED_ROLES as readonly string[]).includes(
        profile?.roles || "",
      );
    }

    if (permission?.includes(team.permission)) {
      return true;
    }

    return false;
  };

  const visibleTeams = teamsData.filter((team) => {
    if (team.permission === "admin" && !permission?.includes("admin"))
      return false;
    return true;
  });

  const activeTeam =
    visibleTeams.find((team) => pathname.startsWith(team.url)) ||
    visibleTeams[0];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-gray-400/5 data-[state=open]:text-sidebar-accent-foreground border bg-white"
            >
              {activeTeam ? (
                <>
                  <div
                    className={`flex aspect-square size-8 items-center justify-center rounded-lg ${
                      activeTeam.color === "orange"
                        ? "bg-gradient-tertiary"
                        : activeTeam.color === "blue"
                        ? "bg-gradient-primary"
                        : activeTeam.color === "yellow"
                        ? "bg-gradient-secondary"
                        : activeTeam.color === "red"
                        ? "bg-gradient-to-r from-red-500 to-red-400"
                        : "bg-gradient-purple"
                    } text-sidebar-primary-foreground`}
                  >
                    <activeTeam.logo className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {activeTeam.name}
                    </span>
                    <span className="truncate text-xs capitalize">
                      {profile?.roles}
                    </span>
                  </div>
                </>
              ) : (
                <span>Pilih Layanan</span>
              )}
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg shadow-sm"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              Layanan Aplikasi
            </div>
            {visibleTeams.map((team) => {
              const isActive = pathname.startsWith(team.url);
              const colorClasses = getColorClasses(team.color);

              return (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => {
                    if (hasPermission(team)) {
                      window.location.href = team.url;
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 p-2 w-full rounded-md cursor-pointer",
                    isActive ? "font-semibold" : "hover:bg-gray-50",
                  )}
                  disabled={!hasPermission(team)}
                >
                  <div
                    className={`flex size-6 items-center justify-center rounded-sm border ${colorClasses.bg} ${colorClasses.border}`}
                  >
                    <team.logo
                      className={`size-4 shrink-0 ${colorClasses.icon}`}
                    />
                  </div>
                  <span className="flex-1">{team.name}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
