"use client";

import Image from "next/image";
import { useState } from "react";
import type { Pengertian } from "@/types/fakultas/profile-page/pengenalan/pengenalan";
import { sanitizeHtml } from "@/lib/sanitize-html";

interface PengenalancClientProps {
  pengertian?: Pengertian | null;
}

const PengenalancClient = ({ pengertian }: PengenalancClientProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-start py-4 md:py-6">
      {/* Left Column - Image */}
      <div className="md:col-span-2 relative md:pt-24">
        <div
          className="rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 aspect-[4/3]"
          style={{
            transform: isHovered ? "scale(1.05)" : "scale(1)",
            boxShadow: isHovered
              ? "0 30px 60px -12px rgba(0, 0, 0, 0.4)"
              : "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src="/assets/landingpage/img/building-udinus.png"
            alt="FIK UDINUS"
            width={900}
            height={675}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{
              transform: isHovered ? "scale(1.08)" : "scale(1)",
            }}
            priority
          />
        </div>
      </div>

      {/* Right Column - Content */}
      <div className="md:col-span-3 flex flex-col justify-start">
        {/* Label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-gradient-to-br from-[#114D91] to-primary-500"></div>
          <span className="bg-gradient-to-br from-[#114D91] to-primary-500 bg-clip-text text-transparent font-bold text-xs md:text-sm uppercase tracking-widest">
            Pengenalan
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
          Mengenal{" "}
          <span className="font-semibold bg-gradient-to-br from-[#114D91] to-primary-500 bg-clip-text text-transparent">
            FIK UDINUS
          </span>
        </h2>

        {/* Description From API */}
        {pengertian ? (
          <div
            className="text-sm md:text-base text-slate-600 leading-relaxed text-justify prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(pengertian.pengertian) }}
          />
        ) : (
          <div className="space-y-4">
            <p className="text-sm md:text-base text-slate-600 leading-relaxed text-justify">
              Fakultas Ilmu Komputer (FIK) Universitas Dian Nuswantoro adalah
              salah satu fakultas terkemuka di Indonesia yang berfokus pada
              pendidikan dan penelitian di bidang teknologi informasi dan
              komputer.
            </p>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed text-justify">
              Berdiri sejak tahun 1986, FIK UDINUS telah meluluskan ribuan
              profesional digital yang berkiprah di berbagai perusahaan
              teknologi ternama, baik di tingkat nasional maupun internasional.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PengenalancClient;