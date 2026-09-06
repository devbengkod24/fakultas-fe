"use client";

import { useProfile } from "@/context/profileUseContext";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  GraduationCap,
  ExternalLink,
  BookCheck,
  ShieldCheck,
  Landmark,
  AlertTriangle,
} from "lucide-react";
import withAuth from "../hoc/withAuth";
import HeroSection from "../components/hero-section";
import { EWS_ALLOWED_ROLES } from "@/lib/constant";

const apps = [
  {
    title: "Tugas Akhir",
    description: "Kelola tugas akhir mahasiswa dengan mudah dan terstruktur.",
    url: "/tugas-akhir",
    icon: (
      <BookCheck size={32} strokeWidth={1.5} className="text-primary-600" />
    ),
    permission: "tugas-akhir",
    bgColor: "bg-primary-50",
  },
  {
    title: "Kerja Praktek",
    description: "Pantau dan kelola kerja praktek mahasiswa dengan efisien.",
    url: "/kerja-praktek",
    icon: (
      <Briefcase size={32} strokeWidth={1.5} className="text-primary-600" />
    ),
    permission: "kerja-praktek",
    bgColor: "bg-primary-50",
  },
  {
    title: "Bimbingan Karir",
    description: "Dukungan mahasiswa dalam persiapan dan pengembangan karir.",
    url: "/bimbingan-karir",
    icon: (
      <GraduationCap size={32} strokeWidth={1.5} className="text-primary-600" />
    ),
    permission: "bimbingan-karir",
    bgColor: "bg-primary-50",
  },
  {
    title: "Admin",
    description: "Kelola aplikasi secara menyeluruh.",
    url: "/admin",
    icon: <ShieldCheck size={32} strokeWidth={1.5} className="text-primary-600" />,
    permission: "admin",
    bgColor: "bg-primary-50",
  },
  {
    title: "Admin Fakultas",
    description: "Kelola aplikasi secara menyeluruh.",
    url: "/admin-fakultas",
    icon: <ShieldCheck size={32} strokeWidth={1.5} className="text-primary-600" />,
    permission: "admin-fakultas",
    bgColor: "bg-primary-50",
  },
  {
    title: "Fakultas",
    description: "Kelola dan pantau seluruh status program studi.",
    url: "/fakultas",
    icon: <Landmark size={32} strokeWidth={1.5} className="text-primary-600" />,
    permission: "fakultas",
    bgColor: "bg-primary-50",
  },
  {
    title: "Early Warning System",
    description:
      "Monitoring dan analisis performa akademik mahasiswa secara terintegrasi.",
    url: "/ews",
    icon: (
      <AlertTriangle
        size={32}
        strokeWidth={1.5}
        className="text-primary-600"
      />
    ),
    permission: "ews",
    bgColor: "bg-primary-50",
  },
];

function AppsDashboard() {
  const { profile } = useProfile();
  const router = useRouter();

  const permissions = profile?.permissions || [];
  const userRole = profile?.roles;

  const hasPermission = (permission: string) => {
    if (userRole === "super_fakultas") {
      return true;
    }

    if (permission === "ews") {
      return (EWS_ALLOWED_ROLES as readonly string[]).includes(userRole || "");
    }

    // admin_fakultas otherwise ONLY sees the 'admin-fakultas' card
    if (userRole === "admin_fakultas") return permission === "admin-fakultas";
    
    // Other roles rely on the permissions array from backend
    return permissions.includes(permission);
  };

  const handleCardClick = (permission: string, url: string) => {
    const mahasiswa = profile?.mahasiswa;

    // Onboarding Mahasiswa (TA & KP)
    if (
      (permission === "tugas-akhir" || permission === "kerja-praktek") &&
      mahasiswa?.is_completed === false
    ) {
      router.push("/onboarding");
      return;
    }

    // Role-based Redirection
    // Note: super_fakultas will go to 'url' (e.g., /fakultas or /admin-fakultas) 
    // depending on which card they click. admin_fakultas only sees admin-fakultas card.
    
    localStorage.setItem("selected_permission", permission);
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 flex flex-col">
      {/* Header Section */}
      <HeroSection
        variant="apps"
        title="Selamat Datang di FIK-Apps"
        subtitle={
          profile?.prodi
            ? `Program Studi ${profile.prodi.nama} (${profile.prodi.kode_prodi}). Silahkan pilih aplikasi yang ingin Anda akses.`
            : "Silahkan pilih aplikasi yang ingin Anda akses."
        }
      />

      {/* Main Content */}
      <div className="flex-1 flex items-center">
        <div className="container mx-auto px-6 py-16">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {apps.map((app, index) => {
              const isDisabled = !hasPermission(app.permission);

              return (
                <div
                  key={index}
                  className={`group relative bg-white rounded-xl border border-gray-200 p-8 transition-all duration-200 ${isDisabled
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:shadow hover:-translate-y-1 cursor-pointer hover:border-primary-300"
                    }`}
                  onClick={
                    !isDisabled
                      ? () => handleCardClick(app.permission, app.url)
                      : undefined
                  }
                >
                  <div className="flex flex-col items-center text-center h-full">
                    {/* Icon */}
                    <div
                      className={`mb-6 p-4 ${app.bgColor
                        } rounded-xl transition-all duration-200 ${!isDisabled ? "group-hover:scale-105" : ""
                        }`}
                    >
                      {app.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {app.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {app.description}
                      </p>
                    </div>

                    {/* Button */}
                    {isDisabled ? (
                      <div className="inline-flex items-center px-5 py-2.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-500">
                        Tidak Ada Akses
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-5 py-2.5  bg-primary text-white rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary-600 hover:shadow">
                        Buka Aplikasi
                        <ExternalLink size={14} strokeWidth={2} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <div className="border-t border-gray-200 bg-white mt-auto">
        <div className="container mx-auto px-6 py-6">
          <p className="text-center text-gray-500 text-sm">
            © 2023-2025 STI Universitas Dian Nuswantoro
          </p>
        </div>
      </div>
    </div>
  );
}

export default withAuth(AppsDashboard);
