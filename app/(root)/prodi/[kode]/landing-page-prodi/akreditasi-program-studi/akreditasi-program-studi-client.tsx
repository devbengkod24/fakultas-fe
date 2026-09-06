"use client";

import { ChevronLeft, ChevronRight, ShieldCheck, Award } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import type { Akreditasi } from "@/types/admin/profile-page/akreditasi/akreditasi";

interface AkreditasiClientProps {
  akreditasi: Akreditasi[];
  isEmpty?: boolean;
  prodiNama?: string;
}

const AkreditasiClient = ({ akreditasi, isEmpty, prodiNama }: AkreditasiClientProps) => {
  const checkEmpty =
    isEmpty ||
    !akreditasi?.length ||
    (akreditasi.length === 1 && (akreditasi[0] as any).grade === "Belum Ada Data");

  if (checkEmpty) {
    return (
      <div className="max-w-6xl mx-auto py-4 px-6 sm:px-12">
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-prodi-start/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-prodi-end/5 rounded-full blur-3xl -ml-32 -mb-32" />
          
          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-prodi-subtle flex items-center justify-center text-prodi-start mb-6 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-prodi-subtle text-prodi-start mb-3">
              <Award className="w-3.5 h-3.5" />
              Sertifikasi & Akreditasi
            </span>
            
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Status Akreditasi {prodiNama ? `Prodi ${prodiNama}` : ""}
            </h3>
            
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Data sertifikat akreditasi resmi program studi saat ini sedang dalam proses sinkronisasi dan verifikasi dokumen resmi. Untuk verifikasi status akreditasi terkini atau keperluan administrasi, silakan menghubungi sekretariat program studi terkait.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isSlider = akreditasi.length > 2;
  const isOdd = akreditasi.length % 2 !== 0;

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [akreditasi]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount =
        direction === "left" ? -(current.offsetWidth - 50) : current.offsetWidth - 50;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Pisah item pertama (solo) dan sisanya kalau isOdd, untuk layout grid di desktop
  const firstItem = isOdd ? akreditasi[0] : null;
  const restItems = isOdd ? akreditasi.slice(1) : akreditasi;

  const CardItem = ({ item, index, tall = false }: { item: Akreditasi; index: number; tall?: boolean }) => (
    <div
      key={item.id || index}
      className={`snap-start shrink-0 w-full md:w-[calc(50%-16px)] lg:w-auto group flex flex-col`}
    >
      <div className="overflow-hidden rounded-xl shadow-md border bg-white p-3 sm:p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-2 h-full flex flex-col">
        <div className={`relative ${tall ? "h-64 sm:h-72 md:h-80 lg:h-[400px]" : "h-56 sm:h-64 md:h-72"} overflow-hidden rounded-lg`}>
          <Image
            src={item.image || "/placeholder.svg"}
            alt="Akreditasi Program Studi"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <div className="text-center p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {item.description}
              </p>
              <div className="mt-4 inline-block px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-semibold">
                {item.accred}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 p-2 flex-grow flex flex-col justify-end">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-500 transition-colors duration-200">
              {item.title}
            </h3>
            <span className="px-2 sm:px-3 py-1 rounded-full bg-primary-100 text-primary-500 text-xs font-bold">
              {item.accred}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative py-4">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 relative">

        {/* Mobile/Tablet: scrollable slider untuk isSlider, biasa untuk lainnya */}
        <div className="lg:hidden">
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
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className={`flex items-stretch gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 scrollbar-hide ${akreditasi.length === 1 ? "justify-center" : ""}`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {akreditasi.map((item, index) => (
              <CardItem key={item.id || index} item={item} index={index} />
            ))}
          </div>
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

        {/* Desktop: grid layout, kalau ganjil item pertama col-span-2 di tengah */}
        <div className="hidden lg:block">
          {isOdd && firstItem && (
            <div className="flex justify-center mb-6">
              <div className="w-1/2">
                <CardItem item={firstItem} index={0} tall />
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-6 md:gap-8">
            {restItems.map((item, index) => (
              <CardItem key={item.id || index} item={item} index={isOdd ? index + 1 : index} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AkreditasiClient;