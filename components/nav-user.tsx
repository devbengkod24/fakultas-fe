"use client";

import { ChevronsUpDown, LogOut, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useProfile } from "@/context/profileUseContext";
import { deleteCookie } from "cookies-next";
import { SITE_COOKIES } from "@/lib/constant";
import { usePathname, useRouter } from "next/navigation";

export function NavUser() {
  const router = useRouter();
  const pathname = usePathname();

  const basePath = "/" + (pathname.split("/")[1] || "");

  const { isMobile } = useSidebar();
  const { profile } = useProfile();
  const showProdi = profile?.prodi && profile.roles !== "super_fakultas";
  const logoutHandler = () => {
    deleteCookie(SITE_COOKIES.TOKEN);
    router.replace("/login");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-white border"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={""} alt={profile?.name} />
                <AvatarFallback className="rounded-lg">
                  {profile?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{profile?.name}</span>
                {showProdi && (
                  <span className="truncate text-[10px] text-muted-foreground mt-0.5 font-medium bg-secondary/50 px-1 py-0.5 rounded-sm w-fit border border-border">
                    {profile!.prodi!.nama} ({profile!.prodi!.kode_prodi})
                  </span>
                )}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={""} alt={profile?.name} />
                  <AvatarFallback className="rounded-lg">
                    {profile?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {profile?.name}
                  </span>
                  {profile?.prodi && (
                    <span className="truncate text-[10px] text-muted-foreground mt-0.5 font-medium bg-secondary/50 px-1 py-0.5 rounded-sm w-fit border border-border">
                      {profile.prodi.nama} ({profile.prodi.kode_prodi})
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link
                  href={`${basePath}/profile`}
                  className="flex items-center gap-2 cursor-pointer w-full"
                >
                  <User size={16} />
                  Akun
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logoutHandler}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
