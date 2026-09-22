/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import Image from "next/image";
import { Loader2, User } from "lucide-react";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface AlumniData {
  id: number;
  nama: string;
  kisah: string;
  angkatan: string;
  posisi: string | null;
  perusahaan: string | null;
  foto_url: string;
  created_at: string;
}

export default function AlumniStoriesClient() {
  const [alumni, setAlumni] = React.useState<AlumniData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [api, setApi] = React.useState<any>();
  const [isMobile, setIsMobile] = React.useState(false);
  const [imgErrors, setImgErrors] = React.useState<Record<number, boolean>>({});

  React.useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await fetch("https://api-alumni.dieseltrack.site/api/v1/public/kisah-alumni");
        const res = await response.json();
        if (res.success) {
          setAlumni(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch alumni stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  const plugin = React.useRef(
    AutoScroll({ speed: 1, direction: "forward", stopOnInteraction: false })
  );

  const displayAlumni = alumni.length > 0 ? [...alumni, ...alumni, ...alumni, ...alumni] : [];

  return (
    <section className="py-8 md:py-20 overflow-hidden relative bg-gradient-to-br from-[#114D91] to-primary-500">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Kisah Sukses <span className="bg-secondary bg-clip-text text-transparent">Alumni</span>
          </h2>
          <p className="text-blue-200 mt-4 text-sm md:text-base max-w-2xl mx-auto">
            Dengarkan cerita inspiratif mereka yang telah bertransformasi dan sukses berkarier di industri.
          </p>
        </div>
      </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
        ) : alumni.length > 0 ? (
          <div
            className="w-full relative group"
            onMouseEnter={() => plugin.current?.stop?.()}
            onMouseLeave={() => plugin.current?.play?.()}
          >
            <Carousel
              setApi={setApi}
              plugins={isMobile ? [] : [plugin.current]}
              opts={{
                align: "start",
                loop: true,
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent className="ml-0 pt-2 pb-8">
                {displayAlumni.map((item, index) => (
                  <CarouselItem
                    key={`${item.id}-${index}`}
                    className="pl-4 md:pl-6 basis-[80%] sm:basis-[70%] md:basis-[85%] lg:basis-[70%] xl:basis-[60%]"
                  >
                    <div className="bg-transparent rounded-2xl md:rounded-[1.5rem] shadow-lg overflow-hidden flex flex-col md:flex-row items-stretch h-full hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-500 ease-out group">

                      {/* Bagian Foto (Editorial Portrait) */}
                      <div className="relative w-full md:w-1/3 h-[280px] md:h-auto shrink-0 overflow-hidden bg-white flex items-center justify-center">
                        {imgErrors[item.id] || !item.foto_url ? (
                          <User className="w-20 h-20 text-slate-300" />
                        ) : (
                          <Image
                            src={item.foto_url}
                            alt={item.nama}
                            fill
                            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            unoptimized
                            onError={() => setImgErrors((prev) => ({ ...prev, [item.id]: true }))}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent md:hidden" />
                      </div>

                      {/* Bagian Teks (Corporate Elegant) */}
                      <div className="flex flex-col flex-grow p-4 md:p-6 lg:p-8 relative bg-white md:w-2/3">
                        <div className="relative z-10 flex flex-col h-full">
                          <p className="order-2 md:order-1 text-slate-700 text-sm md:text-base font-light leading-relaxed mb-0 md:mb-4 italic">
                            &quot;{item.kisah}&quot;
                          </p>
                          
                          <div className="order-1 md:order-2 md:mt-auto mb-3 md:mb-0 border-t border-transparent md:border-slate-100 pt-0 md:pt-4">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="font-bold text-primary text-base md:text-lg uppercase tracking-wide">
                                {item.nama}
                              </h4>
                              <span className="text-[10px] md:text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md border border-slate-200">
                                {item.angkatan}
                              </span>
                            </div>
                            <div className="text-slate-600 font-medium text-xs md:text-sm leading-snug">
                              <span className="text-secondary font-semibold">{item.posisi || "Alumni"}</span>
                              {item.perusahaan && (
                                <>
                                  <span className="mx-1.5 text-slate-300">•</span>
                                  <span className="text-slate-500">{item.perusahaan}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[300px]">
            <p className="text-white text-lg">Belum ada kisah alumni.</p>
          </div>
        )}

    </section>
  );
}
