"use client";

import { ChevronLeft, ChevronRight, Sparkles, Layers } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import type { ProgramUnggulan } from "@/types/admin/program-unggulan/program-unggulan/program-unggulan";

interface Props {
  programs: ProgramUnggulan[];
  isEmpty?: boolean;
  prodiNama?: string;
}

export default function ProgramUnggulanClient({ programs, isEmpty, prodiNama }: Props) {
  const checkEmpty =
    isEmpty ||
    !programs?.length ||
    (programs.length === 1 && (programs[0] as any).title === "Program Unggulan Belum Tersedia");

  if (checkEmpty) {
    return (
      <div className="max-w-6xl mx-auto py-4 px-0 sm:px-12">
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-prodi-start/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-prodi-end/5 rounded-full blur-3xl -ml-32 -mb-32" />
          
          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-prodi-subtle flex items-center justify-center text-prodi-start mb-6 shadow-inner">
              <Layers className="w-8 h-8" />
            </div>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-prodi-subtle text-prodi-start mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Inovasi & Pengembangan
            </span>
            
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Program Unggulan {prodiNama ? `Prodi ${prodiNama}` : ""}
            </h3>
            
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Daftar program unggulan, sertifikasi profesional, serta kerjasama industri untuk program studi ini sedang dalam pembaruan berkala agar selaras dengan kebutuhan dunia kerja dan teknologi terkini.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isSlider = programs.length > 3;

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(0);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    if (isSlider) {
      checkScroll();
      window.addEventListener("resize", checkScroll);
      return () => window.removeEventListener("resize", checkScroll);
    }
  }, [isSlider]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === "left" ? -(current.offsetWidth - 50) : (current.offsetWidth - 50);
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative py-4">
      {/* Program Unggulan Section Content */}
      <div className="max-w-6xl mx-auto px-0 sm:px-12 relative">

        {/* Navigation Controls */}
        {isSlider && (
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`absolute left-0 sm:-left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-[#E5F0FF] text-[#0056B3] backdrop-blur-sm shadow-sm transition-all duration-300
              ${!canScrollLeft ? "opacity-40 cursor-not-allowed" : "hover:bg-blue-200 hover:scale-105 active:scale-95"}
            `}
            aria-label="Geser ke kiri"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Program Cards Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className={`
            ${!isSlider 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 scrollbar-hide"}
          `}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {programs.map((program, index) => {
            const mainStat =
              program.statistics && program.statistics.length > 0
                ? `${program.statistics[0].pivot.value}+ ${program.statistics[0].name}`
                : "Tersedia";
            const imageUrl =
              program.image && program.image !== ""
                ? program.image
                : "/placeholder.svg";
            
            const isCompact = index !== expandedIndex;

            return (
              <div
                key={program.id || index}
                className={`${
                  isSlider
                    ? "snap-start shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                    : "w-full"
                } flex flex-col cursor-pointer md:cursor-default`}
                onClick={() => setExpandedIndex(index)}
              >
                <div className="relative flex-1">
                  {/* Card Container */}
                  <div className={`relative bg-white rounded-3xl overflow-hidden h-full flex transition-all duration-500 ease-in-out shadow-sm border hover:shadow-md hover:-translate-y-1 ${
                    isCompact ? "flex-row p-3 md:flex-col md:p-6" : "flex-col p-6"
                  }`}>
                    {/* Background Decoration */}
                    <div className="absolute inset-0 opacity-3 pointer-events-none transition-opacity duration-500">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-100 rounded-full translate-y-12 -translate-x-12"></div>
                    </div>

                    <div className={`relative z-10 flex h-full transition-all duration-500 ease-in-out ${
                      isCompact ? "flex-row items-center w-full gap-4 md:flex-col md:items-start" : "flex-col"
                    }`}>
                      {/* Logo Section */}
                      <div className={`transition-all duration-500 ease-in-out ${isCompact ? "flex-shrink-0 mb-0 md:mb-4" : "mb-4"}`}>
                        <div className={`relative rounded-2xl flex items-center justify-center border bg-white shadow-sm transition-all duration-500 ease-in-out ${
                          isCompact ? "w-24 h-24 md:w-28 md:h-18" : "w-28 h-18"
                        }`}>
                          <div className={`relative transition-all duration-500 ease-in-out ${isCompact ? "w-20 h-20 p-1 md:w-20 md:h-14 md:p-2" : "w-20 h-14 p-2"}`}>
                            <Image
                              src={imageUrl}
                              alt={program.title}
                              fill
                              className="object-contain drop-shadow-sm transition-all duration-500 ease-in-out"
                              style={{ borderRadius: 4 }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className={`flex-grow flex flex-col transition-all duration-500 ease-in-out ${isCompact ? "py-1 min-w-0" : ""}`}>
                        <div className={`space-y-1 md:space-y-3 transition-all duration-500 ease-in-out ${isCompact ? "mb-1 md:mb-3" : "mb-3"}`}>
                          <h3 className={`font-bold text-slate-900 transition-all duration-500 ease-in-out ${
                            isCompact ? "text-base md:text-xl line-clamp-2 md:line-clamp-none leading-tight" : "text-xl"
                          }`}>
                            {program.title}
                          </h3>
                          <div 
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                              isCompact ? "max-h-0 opacity-0 md:max-h-40 md:opacity-100" : "max-h-40 opacity-100"
                            }`}
                          >
                            <p className="text-gray-600 leading-relaxed text-justify line-clamp-3">
                              {program.short_desc}
                            </p>
                          </div>
                        </div>

                        {/* Main Stat */}
                        <div className={`border-gray-200 mt-auto transition-all duration-500 ease-in-out ${
                          isCompact ? "border-0 pt-1 md:border-t md:pt-4 md:mt-4" : "border-t pt-4 mt-4"
                        }`}>
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
                            <span className={`text-slate-700 font-medium transition-all duration-500 ease-in-out ${
                              isCompact ? "text-xs md:text-sm truncate" : "text-sm"
                            }`}>
                              {mainStat}
                            </span>
                          </div>
                        </div>

                        {/* Partner Info */}
                        <div 
                          className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            isCompact ? "max-h-0 opacity-0 mt-0 md:max-h-24 md:opacity-100 md:mt-4" : "max-h-24 opacity-100 mt-4"
                          }`}
                        >
                          <div className="w-full h-20 bg-gray-50/50 rounded-xl flex items-center justify-center border border-gray-200 px-2 py-1">
                            <div className="text-center w-full">
                              <p className="text-xs text-gray-500 mb-1">Partner:</p>
                              <p className="text-[13px] md:text-sm font-bold text-slate-700 px-1 line-clamp-2 leading-tight">
                                {program.partner}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Controls */}
        {isSlider && (
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`absolute right-0 sm:-right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-[#E5F0FF] text-[#0056B3] backdrop-blur-sm shadow-sm transition-all duration-300
              ${!canScrollRight ? "opacity-40 cursor-not-allowed" : "hover:bg-blue-200 hover:scale-105 active:scale-95"}
            `}
            aria-label="Geser ke kanan"
          >
            <ChevronRight size={24} />
          </button>
        )}

      </div>
    </div>
  );
}
