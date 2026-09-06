"use client";

import { Role } from "@/types/role";
import { useProfile } from "@/context/profileUseContext";
import SidangTa2Dosen from "./dosen";
import SidangTa2Koordinator from "./koordinator";
import SidangTa2Mahasiswa from "./mahasiswa";

const MahasiswaSidang2Client = () => {
  const { profile } = useProfile();
  const role: Role = profile?.roles as Role;

  return (
    <div className="flex flex-col justify-center">
      {role === "dosen" ? (
        <SidangTa2Dosen />
      ) : role === "koordinator" ||
        role === "admin" ||
        role === "super_fakultas" ? (
        <SidangTa2Koordinator />
      ) : (
        <SidangTa2Mahasiswa />
      )}
    </div>
  );
};

export default MahasiswaSidang2Client;
