"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getCookie } from "cookies-next";
import { AuthService } from "@/api";
import { EWSMahasiswaService } from "@/api/ews";
import { SITE_COOKIES } from "@/lib/constant";
import { DosenDetailExtra } from "@/types/dosen-shared";

interface DosenProfile extends DosenDetailExtra {
  user_id: number;
  dosen_id: number;
  name: string;
  email: string;
  npp?: string | null;
  nidn?: string | null;
  gelar_depan?: string | null;
  gelar_belakang?: string | null;
  jabatan_fungsional?: string | null;
  bidang_kajian?: string | null;
  scholar_link?: string | null;
  telepon?: string | null;
  email_alternatif?: string | null;
  golongan?: string | null;
  prodi_homebase?: {
    id: number;
    nama: string;
    kode_prodi: string;
  } | null;
  prodi_tugas?: any;
}

export interface EwsProfileData {
  mahasiswa: {
    nama: string;
    nim: string;
    email: string;
    semester_aktif: number;
    tahun_masuk: string;
  };
  dosen_wali: {
    nama: string;
    npp: string;
  } | null;
  akademik: {
    ipk: string;
    sks_lulus: number;
    sks_tempuh: number;
    sks_now: number;
  };
  ews: {
    status: "tepat_waktu" | "normal" | "perhatian" | "kritis";
    status_kelulusan: "eligible" | "noneligible";
    alasan_tidak_eligible: string[];
  };
  ips: Array<{ semester: number; ips: number }>;
  matakuliah_nilai_de: Array<{
    kode_mk: string;
    nama_mk: string;
    sks: number | string;
    nilai: string;
  }>;
  progress_mk: {
    mk_nasional: "yes" | "no";
    mk_fakultas: "yes" | "no";
    mk_prodi: "yes" | "no";
  };
}

interface User {
  id?: number;
  name: string;
  email: string;
  roles: string;
  permissions: string[];
  foto?: string;
  // Data dosen lengkap dari response /profile
  dosen?: DosenProfile;
  prodi?: {
    id: number;
    nama: string;
    kode_prodi: string;
  };
  daftar_prodi?: {
    id: number;
    nama: string;
    kode_prodi: string;
  }[];
  mahasiswa?: {
    id: number;
    nim: string;
    ipk: number;
    telepon: string;
    transkrip: string;
    is_completed: boolean;
    minat: string;
  };
  ews?: EwsProfileData | null;
}

interface ProfileContextType {
  profile: User | null;
  setProfile: (profile: User | null) => void;
  isLoading: boolean;
  hasHasilSurvei: boolean;
  setHasHasilSurvei: (has: boolean) => void;
  activeProdiId: number | null;
  setActiveProdiId: (id: number | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasHasilSurvei, setHasHasilSurvei] = useState<boolean>(false);
  const [activeProdiId, setActiveProdiId] = useState<number | null>(null);

  const setActiveProdiIdWithSync = (id: number | null) => {
    setActiveProdiId(id);
    if (id !== null) {
      localStorage.setItem("active_prodi_id", String(id));
    } else {
      localStorage.removeItem("active_prodi_id");
    }
  };

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        const token = getCookie(SITE_COOKIES.TOKEN);
        if (token) {
          const response = await AuthService.getProfile();
          if (response.success && response.data.user) {
            const { user, mahasiswa, dosen, daftar_prodi, prodi } = response.data;

            const profileData: User = {
              ...user,
              roles: user.roles,
              // â”€â”€ Simpan data dosen lengkap jika role dosen â”€â”€
              ...(dosen && { dosen }),
              ...(prodi && { prodi }),
              ...(daftar_prodi && { daftar_prodi }),
              ...(mahasiswa && { mahasiswa }),
              ews: null,
            };

            setProfile(profileData);
            if (
              profileData?.daftar_prodi &&
              profileData.daftar_prodi.length > 0
            ) {
              const savedId = localStorage.getItem("active_prodi_id");
              const savedProdiId = savedId ? parseInt(savedId) : null;
              const isValid =
                savedProdiId !== null &&
                profileData.daftar_prodi.some(
                  (p: { id: number }) => p.id === savedProdiId,
                );
              setActiveProdiIdWithSync(
                isValid ? savedProdiId! : profileData.daftar_prodi[0].id,
              );
            } else if (profileData?.prodi) {
              setActiveProdiIdWithSync(profileData.prodi.id);
            }

            // Fetch EWS profile data for mahasiswa
            if (profileData.roles === "mahasiswa") {
              try {
                const ewsRes = await EWSMahasiswaService.getProfile();
                if (ewsRes?.success && ewsRes.data) {
                  setProfile((prev) =>
                    prev ? { ...prev, ews: ewsRes.data as EwsProfileData } : prev,
                  );
                }
              } catch (error) {
                console.error("Failed to fetch EWS profile:", error);
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to initialize profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        isLoading,
        hasHasilSurvei,
        setHasHasilSurvei,
        activeProdiId,
        setActiveProdiId: setActiveProdiIdWithSync,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
