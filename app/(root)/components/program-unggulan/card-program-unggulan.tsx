/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { API_URL } from "@/lib/constant";
import EmptyStateProgramUnggulan from "./empty-state-program-unggulan";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

// Helper function to construct image URLs
const getImageUrl = (imagePath: string | null): string => {
  if (!imagePath || imagePath === "null") {
    return "/placeholder.svg";
  }

  const cleanPath = imagePath.replace(/\\/g, "/");

  if (cleanPath.startsWith("http")) {
    return cleanPath;
  }

  // Get base URL without /api/v1
  const baseUrl =
    API_URL?.replace("/api/v1", "") || "https://api-dev-sti.dinus.id";

  if (cleanPath.startsWith("/storage/")) {
    return `${baseUrl}${cleanPath}`;
  } else {
    return `${baseUrl}/storage/${cleanPath}`;
  }
};

interface CardProgramUnggulanProps {
  programs: Array<{
    id: number;
    image: string;
    title: string;
    shortDesc: string;
  }>;
  activeProgram: {
    id: number;
    image: string;
    title: string;
    shortDesc: string;
  } | null;
  onProgramSelect: (program: { id: number }) => void;
  onRefresh?: () => void;
}

const CardProgramUnggulan = ({
  programs,
  activeProgram,
  onProgramSelect,
  onRefresh,
}: CardProgramUnggulanProps) => {
  const [api, setApi] = React.useState<any>();
  
  // Setup Plugin AutoScroll
  const plugin = React.useRef(
    AutoScroll({ speed: 1, stopOnInteraction: false })
  );

  // Gandakan data jika <= 3 agar loop bisa berjalan mengalir tanpa ruang kosong
  const displayPrograms =
    programs && programs.length > 0 && programs.length <= 4
      ? [...programs, ...programs, ...programs, ...programs]
      : programs;

  // If no programs available, show enhanced empty state
  if (!programs || programs.length === 0) {
    return <EmptyStateProgramUnggulan onRefresh={onRefresh} />;
  }

  return (
    <>
      <div className="relative max-w-6xl mx-auto">
        {/* Navigation Buttons */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-primary-600/10 hover:bg-primary-600/20 rounded-full p-2 md:p-3 backdrop-blur-sm transition-all duration-300 hidden md:block"
          onClick={() => api?.scrollPrev()}
        >
          <ChevronRight className="h-4 w-4 md:h-6 md:w-6 text-primary-600 rotate-180" />
        </button>

        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-primary-600/10 hover:bg-primary-600/20 rounded-full p-2 md:p-3 backdrop-blur-sm transition-all duration-300 hidden md:block"
          onClick={() => api?.scrollNext()}
        >
          <ChevronRight className="h-4 w-4 md:h-6 md:w-6 text-primary-600" />
        </button>

        {/* Program Cards dengan Auto Slider Teleprompter */}
        <div className="pb-4 md:pb-8">
          <Carousel
            setApi={setApi}
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            className="w-full"
            onMouseEnter={() => plugin.current.stop()} // Berhenti saat kursor masuk
            onMouseLeave={() => plugin.current.play()} // Lanjut jalan saat kursor keluar
          >
            <CarouselContent className="-ml-3 md:-ml-6 py-2 md:py-4 px-2 md:px-4">
              {displayPrograms.map((program, index) => (
                <CarouselItem
                  key={`${program.id}-${index}`}
                  className="pl-3 md:pl-6 basis-auto"
                >
                  <div
                    onClick={() => onProgramSelect(program)}
                    className={`cursor-pointer transition-all duration-300 rounded-xl ${
                      activeProgram?.id === program.id
                        ? "scale-105 "
                        : "hover:-translate-y-1"
                    }`}
                  >
                    <Card
                      className={`w-[300px] h-[200px] flex flex-col items-center justify-center p-4 md:p-6 shadow-none ${
                        activeProgram?.id === program.id
                          ? "bg-gradient-to-br from-white to-primary-50 border-primary/20"
                          : "border border-gray-200"
                      }`}
                    >
                      <div className="h-12 md:h-16 flex items-center justify-center mb-3 md:mb-4">
                        {program.image && program.image !== "null" ? (
                          <Image
                            src={getImageUrl(program.image)}
                            alt={program.title || "Program Unggulan"}
                            width={120}
                            height={80}
                            className="h-14 md:h-12 w-auto object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                                    <span class="text-xs text-gray-500">No Image</span>
                                  </div>
                                `;
                              }
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-xs text-gray-500">No Image</span>
                          </div>
                        )}
                      </div>
                      <h3 className="md:text-lg font-semibold text-center mb-2">
                        {program.title || "Program Unggulan"}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 text-center line-clamp-2 md:line-clamp-3 leading-relaxed">
                        {program.shortDesc || "Deskripsi program tidak tersedia"}
                      </p>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Gradient fades */}
        <div className="absolute left-12 md:left-14 top-0 bottom-0 w-8 md:w-12 pointer-events-none hidden md:block bg-gradient-to-r from-white/50 to-transparent z-10"></div>
        <div className="absolute right-12 md:right-14 top-0 bottom-0 w-8 md:w-12 pointer-events-none hidden md:block bg-gradient-to-l from-white/50 to-transparent z-10"></div>
      </div>

      {/* Mobile scroll indicator */}
      <div className="flex justify-center mt-4 md:hidden">
        <div className="flex space-x-2">
          {programs.map((program, index) => (
            <div
              key={program.id || index}
              className={`w-2 h-2 rounded-full transition-colors ${
                activeProgram?.id === program.id
                  ? "bg-primary-600"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CardProgramUnggulan;