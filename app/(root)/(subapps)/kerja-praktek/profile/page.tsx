"use client";

import ProfileUser from "@/app/(root)/components/profile-user";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ProfilePage() {
  return (
    <SidebarProvider>
      <ProfileUser />
    </SidebarProvider>
  );
}
