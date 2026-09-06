"use client";

import ProfileUser from "@/app/(root)/components/profile-user";
import { SidebarProvider } from "@/components/ui/sidebar";
import withAuth from "@/app/(root)/hoc/withAuth";

function ProfilePage() {
  return (
    <SidebarProvider>
      <ProfileUser isBk={true} />
    </SidebarProvider>
  );
}

export default withAuth(ProfilePage, "bimbingan-karir", ["koordinator", "admin", "super_fakultas", "admin_fakultas", "mahasiswa", "pengajar", "dosen"]);
