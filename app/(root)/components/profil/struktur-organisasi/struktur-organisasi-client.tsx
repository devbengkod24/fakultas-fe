"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { StrukturOrganisasi } from "@/types/admin/profile-page/struktur-organisasi/struktur-organisasi";

interface StrukturOrganisasiClientProps {
  strukturOrganisasi: StrukturOrganisasi[];
}

const StrukturOrganisasiClient = ({
  strukturOrganisasi,
}: StrukturOrganisasiClientProps) => {
  const [imageSources, setImageSources] = useState<{ [key: number]: string }>(
    {}
  );
  const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);

  const handleImageError = (id: number) => {
    setImageSources((prev) => ({
      ...prev,
      [id]: "/assets/landingpage/img/default-dosen-photo.png",
    }));
  };

  useEffect(() => {
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
  const sortedData = [...strukturOrganisasi].sort((a, b) => {
    if (a.order_no && b.order_no) {
      return Number.parseInt(a.order_no) - Number.parseInt(b.order_no);
    }
    return (a.id || 0) - (b.id || 0);
  });

  return (
    <div className="w-full py-2 md:py-4 lg:py-6">
      {/* Header Section */}
      <div className="text-center mb-20 px-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-8 bg-gradient-to-br from-[#114D91] to-primary-500"></div>
          <span className="bg-gradient-to-br from-[#114D91] to-primary-500 bg-clip-text text-transparent font-bold text-[20px] uppercase tracking-wide">
            Tim Kepemimpinan
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          <span className="text-[#114D91]">Struktur</span> Organisasi
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-xl md:text-2xl">
          Dipimpin oleh tenaga akademik berpengalaman dan berkomitmen tinggi terhadap kemajuan FIK UDINUS.
        </p>
      </div>

      {/* Leadership Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 lg:gap-20 px-4 max-w-7xl mx-auto">
        {sortedData.map((dosen, index) => (
          <div key={dosen.id || index} className="flex flex-col items-center">
            {/* Position Title */}
            <h3 className="text-center font-bold text-gray-900 mb-6 text-lg md:text-2xl h-14 flex items-center justify-center">
              {dosen.position}
            </h3>

            {/* Image Container */}
            <div className="w-full mb-8 flex justify-center">
              <div
                className="relative w-full max-w-md transition-transform duration-300 rounded-2xl"
                style={{
                  aspectRatio: "3/4",
                  transform:
                    hoveredImageId === dosen.id ? "scale(1.03)" : "scale(1)",
                }}
                onMouseEnter={() => setHoveredImageId(dosen.id || null)}
                onMouseLeave={() => setHoveredImageId(null)}
              >
                {/* Image */}
                <div
                  className="relative w-full h-full overflow-hidden rounded-2xl"
                  style={{
                    boxShadow:
                      hoveredImageId === dosen.id
                        ? "0 15px 35px -10px rgba(0, 0, 0, 0.35)"
                        : "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Image
                    src={
                      imageSources[dosen.id || 0] ||
                      "/assets/landingpage/img/default-dosen-photo.png"
                    }
                    alt={dosen.name}
                    fill
                    sizes="(max-width: 768px) 100%, (max-width: 1024px) 320px, 384px"
                    className="object-cover object-top transition-transform duration-300"
                    style={{
                      transform:
                        hoveredImageId === dosen.id
                          ? "scale(1.02)"
                          : "scale(1)",
                    }}
                    priority={index === 0}
                    onError={() => dosen.id && handleImageError(dosen.id)}
                  />
                </div>
              </div>
            </div>

            {/* Name and Title Card */}
            <div className="bg-gradient-to-br from-[#114D91] to-primary-500 rounded-lg px-6 py-3 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-sm mx-auto h-16 flex items-center justify-center">
              <p className="text-white font-semibold leading-tight text-center break-words text-base md:text-lg">
                {dosen.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

      export default StrukturOrganisasiClient;
