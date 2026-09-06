"use client";

import { Role } from "@/types/role";

import { useProfile } from "@/context/profileUseContext";
import DosenLogbook from "./dosen";
import KoordinatorLogbook from "./koordinator";
import MahasiswaLogbook from "./mahasiswa";

const LogbookClient = () => {
  const { profile } = useProfile();
  const role: Role = profile?.roles as Role;

  return (
    <div className="flex flex-col justify-center">
      {role === "dosen" ? (
        <DosenLogbook />
      ) : role === "mahasiswa" ? (
        <MahasiswaLogbook />
      ) : (
        <KoordinatorLogbook />
      )}
    </div>
  );
};

export default LogbookClient;
