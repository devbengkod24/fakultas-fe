"use client";

import { Role } from "@/types/role";
import SidangTa1Dosen from "./dosen";
import SidangTa1Koordinator from "./koordinator";
import SidangTa1Mahasiswa from "./mahasiswa";
import { useProfile } from "@/context/profileUseContext";

const MahasiswaSidang1Client = () => {
  const { profile } = useProfile();
  const role: Role = profile?.roles as Role;

  return (
    <div className="flex flex-col justify-center">
      {role === "dosen" ? (
        <SidangTa1Dosen />
      ) : role === "koordinator" ||
        role === "admin" ||
        role === "super_fakultas" ? (
        <SidangTa1Koordinator />
      ) : (
        <SidangTa1Mahasiswa />
      )}
    </div>
  );
};

export default MahasiswaSidang1Client;
