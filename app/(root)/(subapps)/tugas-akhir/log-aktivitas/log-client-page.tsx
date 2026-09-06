"use client";

import { Role } from "@/types/role";

import { useProfile } from "@/context/profileUseContext";
import KoordinatorLogAktivitas from "./koordinator";
import DosenLogAktivitas from "./dosen";
import withAuth from "@/app/(root)/hoc/withAuth";

const LogActivityClient = () => {
  const { profile } = useProfile();
  const role: Role = profile?.roles as Role;

  return (
    <div className="flex flex-col justify-center">
      {role === "dosen" ? <DosenLogAktivitas /> : <KoordinatorLogAktivitas />}
    </div>
  );
};

export default withAuth(LogActivityClient, "tugas-akhir", [
  "koordinator",
  "dosen",
  "admin",
  "super_fakultas",
]);
