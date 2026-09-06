"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Users, Sparkles } from "lucide-react";
import type { StrukturOrganisasi } from "@/types/admin/profile-page/struktur-organisasi/struktur-organisasi";

interface ProfilDosenClientProps {
  strukturOrganisasi: StrukturOrganisasi[];
  isEmpty?: boolean;
  prodiNama?: string;
}

const ProfilDosenClient = ({ strukturOrganisasi, isEmpty, prodiNama }: ProfilDosenClientProps) => {
  const checkEmpty =
    isEmpty ||
    !strukturOrganisasi?.length ||
    (strukturOrganisasi.length === 1 && (strukturOrganisasi[0] as any).name === "Belum Ada Data Dosen");

  if (checkEmpty) {
    return (
      <div className="max-w-6xl mx-auto py-4 px-0 sm:px-12">
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-prodi-start/5 rounded-full blur-3xl -ml-32 -mt-32" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-prodi-end/5 rounded-full blur-3xl -mr-32 -mb-32" />
          
          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-prodi-subtle flex items-center justify-center text-prodi-start mb-6 shadow-inner">
              <Users className="w-8 h-8" />
            </div>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-prodi-subtle text-prodi-start mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Tenaga Pengajar & Staf Akademik
            </span>
            
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Struktur Organisasi {prodiNama ? `Prodi ${prodiNama}` : ""}
            </h3>
            
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Daftar dosen pengampu serta struktur organisasi program studi sedang dalam proses pengkinian data resmi. Seluruh kegiatan akademik dibimbing langsung oleh tenaga pengajar kompeten dan berpengalaman di bidangnya.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const [imageSources, setImageSources] = useState<{ [key: number]: string }>({});

  const handleImageError = (id: number) => {
    setImageSources((prev) => ({
      ...prev,
      [id]: "/assets/landingpage/img/default-dosen-photo.png",
    }));
  };

  useEffect(() => {
    const initialImageSources: { [key: number]: string } = {};
    strukturOrganisasi.forEach((item: StrukturOrganisasi) => {
      if (item.id !== undefined) {
        initialImageSources[item.id] =
          item.image && item.image.trim() !== ""
            ? item.image
            : "/assets/landingpage/img/default-dosen-photo.png";
      }
    });
    setImageSources(initialImageSources);
  }, [strukturOrganisasi]);

  const sortedData = strukturOrganisasi.sort((a: StrukturOrganisasi, b: StrukturOrganisasi) => {
    if (a.order_no && b.order_no) {
      return Number.parseInt(a.order_no) - Number.parseInt(b.order_no);
    }
    return (a.id || 0) - (b.id || 0);
  });

  return (
    <div className="max-w-7xl mx-auto px-0 md:px-12 lg:px-20 pb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
        {sortedData.map((dosen, index) => {
          const fallbackPhoto = "/assets/landingpage/img/default-dosen-photo.png";
          const photoSrc =
            (dosen.id !== undefined && imageSources[dosen.id]) ||
            (dosen.image && dosen.image.trim() !== "" ? dosen.image : fallbackPhoto);

          return (
            <div key={dosen.id || index} className="group">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-md hover:-translate-y-1 h-full flex flex-row md:flex-col items-stretch p-0 min-h-[100px] md:min-h-0">
                <div className="relative overflow-hidden flex-shrink-0 w-[84px] md:w-full h-auto md:aspect-[3/4] bg-slate-100">
                  <Image
                    src={photoSrc}
                    alt={dosen.name || "Dosen"}
                    fill
                    sizes="(max-width: 640px) 84px, (max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover object-top group-hover:scale-110 transition-transform duration-500"
                    onError={() => {
                      if (dosen.id !== undefined) handleImageError(dosen.id);
                    }}
                  />
                  <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                </div>
                <div className="flex flex-col flex-grow p-3 sm:p-4 md:p-3 lg:p-4 justify-center md:justify-start">
                  <div className="mb-0.5 md:mb-2 md:min-h-[3rem] lg:min-h-[3.5rem] flex items-center md:items-start">
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">
                      {dosen.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 mt-0 md:mt-auto leading-relaxed">{dosen.position}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfilDosenClient;
