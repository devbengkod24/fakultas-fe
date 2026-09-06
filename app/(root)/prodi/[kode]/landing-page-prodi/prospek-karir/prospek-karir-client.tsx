"use client";

import {
  Briefcase,
  TrendingUp,
  Code2,
  Sparkles,
  Gamepad2,
  Server,
  Cpu,
  Wifi,
  Megaphone,
  Video,
  Newspaper,
  Palette,
  UserCircle,
  Smartphone,
  Clapperboard,
  Camera,
  Scissors,
  Move,
  Zap,
  Smile,
} from "lucide-react";

// Mapping string icon name to Lucide component
const IconMap: Record<string, any> = {
  Briefcase,
  TrendingUp,
  Code2,
  Sparkles,
  Gamepad2,
  Server,
  Cpu,
  Wifi,
  Megaphone,
  Video,
  Newspaper,
  Palette,
  UserCircle,
  Smartphone,
  Clapperboard,
  Camera,
  Scissors,
  Move,
  Zap,
  Smile,
};

const DefaultProfilLulusan = {
  deskripsi: [],
  profesiLulusan: [],
};

interface ProspekKarirClientProps {
  data?: any;
  isEmpty?: boolean;
  prodiNama?: string;
}

const ProspekKarirClient = ({ data, isEmpty, prodiNama }: ProspekKarirClientProps) => {
  const ProfilLulusan = data || DefaultProfilLulusan;

  const checkEmpty =
    isEmpty ||
    (!ProfilLulusan.deskripsi?.length && !ProfilLulusan.profesiLulusan?.length) ||
    (ProfilLulusan.deskripsi?.length === 1 && ProfilLulusan.deskripsi[0]?.kode === "P01" && ProfilLulusan.deskripsi[0]?.deskripsi?.includes("Belum ada"));

  if (checkEmpty) {
    return (
      <div className="max-w-6xl mx-auto py-4">
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm text-center relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-prodi-start/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-prodi-end/5 rounded-full blur-2xl" />
          
          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-prodi-subtle flex items-center justify-center text-prodi-start mb-6 shadow-inner">
              <Briefcase className="w-8 h-8" />
            </div>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-prodi-subtle text-prodi-start mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Dalam Proses Pendataan
            </span>
            
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Prospek Karir & Profil Lulusan {prodiNama ? `Prodi ${prodiNama}` : ""}
            </h3>
            
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Informasi lengkap mengenai profil lulusan dan prospek karir program studi ini sedang dalam tahap pendataan resmi oleh tim akademik. Kunjungi kembali secara berkala untuk mendapatkan informasi terbaru mengenai peluang masa depan Anda.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-prodi-start to-prodi-end text-white">
                <th className="py-4 px-6 text-left font-semibold w-24">Kode</th>
                <th className="py-4 px-6 text-left font-semibold">Deskripsi</th>
                <th className="py-4 px-6 text-left font-semibold w-64">Profesi Lulusan</th>
              </tr>
            </thead>
            <tbody>
              {ProfilLulusan.deskripsi.map((item: any, index: number) => (
                <tr key={index}>
                  <td className="py-4 px-6 border-b border-gray-200">
                    <span className="font-medium text-prodi-start px-3 py-1 bg-prodi-subtle rounded-full text-sm">
                      {item.kode}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200 text-sm">
                    <p>{item.deskripsi}</p>
                  </td>
                  {index === 0 && (
                    <td className="py-4 px-6 border-b border-gray-200" rowSpan={ProfilLulusan.deskripsi.length}>
                      <div className="space-y-3">
                        {ProfilLulusan.profesiLulusan.map((profesi: any, i: number) => {
                          const IconComponent = IconMap[profesi.icon] || Briefcase;
                          return (
                            <div
                              key={i}
                              className="flex items-center p-3 bg-prodi-subtle rounded-lg transition-colors duration-200"
                            >
                              <div className="w-8 h-8 rounded-full bg-prodi-start flex items-center justify-center mr-3">
                                <IconComponent className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm font-medium text-gray-800">{profesi.nama_profesi || profesi.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile and Tablet Card View */}
      <div className="lg:hidden space-y-6">
        {/* Profil Deskripsi */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Briefcase className="w-6 h-6 mr-2 text-prodi-start" />
            Profil Lulusan
          </h3>
          <div className="space-y-4">
            {ProfilLulusan.deskripsi.map((item: any, index: number) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="bg-gradient-to-r from-prodi-start to-prodi-end px-4 py-3">
                  <h4 className="text-white font-semibold text-lg">{item.kode}</h4>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 text-sm leading-relaxed">{item.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prospek Karir */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="bg-gradient-to-r from-prodi-start to-prodi-end px-4 py-3">
            <h3 className="text-white font-semibold text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Prospek Karir Lulusan
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ProfilLulusan.profesiLulusan.map((profesi: any, i: number) => {
                const IconComponent = IconMap[profesi.icon] || Briefcase;
                return (
                  <div
                    key={i}
                    className="flex items-center p-3 bg-prodi-subtle rounded-lg transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-prodi-start flex items-center justify-center mr-3">
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">{profesi.nama_profesi || profesi.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProspekKarirClient;
