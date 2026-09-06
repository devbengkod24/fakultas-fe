"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { StrukturOrganisasi } from "@/types/admin/profile-page/struktur-organisasi/struktur-organisasi";

interface ProfilDosenClientProps {
  strukturOrganisasi: StrukturOrganisasi[];
}

const ProfilDosenClient = ({ strukturOrganisasi }: ProfilDosenClientProps) => {
  // Handle Image Dosen
  const [imageSources, setImageSources] = useState<{ [key: number]: string }>(
    {}
  );

  // Handler for when an image fails to load
  const handleImageError = (id: number) => {
    setImageSources((prev) => ({
      ...prev,
      [id]: "/assets/landingpage/img/default-dosen-photo.png",
    }));
  };

  useEffect(() => {
    // Initialize image sources
    const initialImageSources: { [key: number]: string } = {};
    strukturOrganisasi.forEach((item: StrukturOrganisasi) => {
      if (item.id) {
        initialImageSources[item.id] =
          item.image || "/assets/landingpage/img/default-dosen-photo.png";
      }
    });
    setImageSources(initialImageSources);
  }, [strukturOrganisasi]);

  // Sort data by order_no
  const sortedData = strukturOrganisasi.sort(
    (a: StrukturOrganisasi, b: StrukturOrganisasi) => {
      if (a.order_no && b.order_no) {
        return Number.parseInt(a.order_no) - Number.parseInt(b.order_no);
      }
      return (a.id || 0) - (b.id || 0);
    }
  );

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
      {sortedData.map((dosen) => (
        <div key={dosen.id} className="group">
          <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col">
            <div className="aspect-[3/4] relative overflow-hidden">
              <Image
                src={imageSources[dosen.id || 0] || "/placeholder.svg"}
                alt={dosen.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover object-top group-hover:scale-110 transition-transform duration-500"
                onError={() => dosen.id && handleImageError(dosen.id)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <div className="p-3 sm:p-4 flex flex-col flex-grow">
              <div className="min-h-[3rem] sm:min-h-[3.5rem] mb-2">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                  {dosen.name}
                </h3>
              </div>
              <p className="text-xs text-gray-600 mt-auto leading-relaxed">
                {dosen.position}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfilDosenClient;
