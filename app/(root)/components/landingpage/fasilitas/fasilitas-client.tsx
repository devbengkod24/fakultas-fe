"use client";

import React, { useEffect, useState, useRef } from "react";
import { PublicFakultasFasilitasService } from "@/api/admin-fakultas";
import { FasilitasFakultas } from "@/types/admin-fakultas/fasilitas/fasilitas";
import { FasilitasSkeleton } from "./fasilitas-skeleton";
import { Building2 } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function FasilitasClient() {
  const [data, setData] = useState<FasilitasFakultas[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Carousel API mobile
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Plugin untuk autoplay di mobile (ganti-ganti tiap 4 detik)
  const pluginDesktop = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );
  const pluginMobile = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await PublicFakultasFasilitasService.getAllFasilitas();
        const actualData = response.data?.data || response.data || [];
        
        if (Array.isArray(actualData) && actualData.length > 0) {
          setData(actualData);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching fasilitas", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!api) return;
    
    setCurrent(api.selectedScrollSnap());
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (loading) {
    return <FasilitasSkeleton />;
  }

  if (data.length === 0) {
    return null;
  }

  const fallbackSvg =
    "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12px' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

  const renderCard = (item: FasilitasFakultas, index: number, customClass = "") => (
    <div
      key={item.id || index}
      className={`relative group overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 w-full h-full min-h-[250px] ${customClass}`}
    >
      <div className="absolute inset-0 bg-slate-200">
        {item.gambar ? (
          <img
            src={item.gambar}
            alt={item.judul}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).src = fallbackSvg;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-12 h-12 text-slate-400" />
          </div>
        )}
      </div>
      
      {/* Overlay & Text */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-6 md:p-8">
        <h3 className="text-white font-bold mb-2 text-xl md:text-2xl">
          {item.judul}
        </h3>
        {item.deskripsi && (
          <p className="text-slate-200 line-clamp-2 text-sm md:text-base">
            {item.deskripsi.replace(/<[^>]*>?/gm, '')}
          </p>
        )}
      </div>
    </div>
  );

  // Desktop Logic based on data.length (>= 768px)
  const renderDesktopGrid = () => {
    const len = data.length;
    
    if (len === 1) {
      return (
        <div className="grid grid-cols-1 gap-3">
          {renderCard(data[0], 0, "aspect-video md:aspect-[21/9]")}
        </div>
      );
    }
    if (len === 2) {
      return (
        <div className="grid grid-cols-2 gap-3">
          {data.map((item, i) => renderCard(item, i, "aspect-video"))}
        </div>
      );
    }
    if (len === 3) {
      return (
        <div className="grid grid-cols-3 gap-3">
          {data.map((item, i) => renderCard(item, i, "aspect-[4/3] md:aspect-video"))}
        </div>
      );
    }
    if (len === 4) {
      return (
        <div className="grid grid-cols-2 gap-3">
          {data.map((item, i) => renderCard(item, i, "aspect-video"))}
        </div>
      );
    }
    
    // >= 5 (Aturan 5: Selalu 2 di atas, sisanya di bawah)
    return (
      <div className="flex flex-col gap-3">
        {/* Baris Atas: Pasti 2 kartu membagi 50:50 */}
        <div className="grid grid-cols-2 gap-3">
          {data.slice(0, 2).map((item, i) => renderCard(item, i, "aspect-video"))}
        </div>
        
        {/* Baris Bawah: Statis jika sisanya 3, Slider jika sisanya >= 4 */}
        {len === 5 ? (
          <div className="grid grid-cols-3 gap-3">
            {data.slice(2).map((item, i) => renderCard(item, i + 2, "aspect-[4/3] md:aspect-video"))}
          </div>
        ) : (
          <div 
            className="relative group"
            onMouseEnter={() => pluginDesktop.current.stop()} 
            onMouseLeave={() => pluginDesktop.current.play()}
          >
            <Carousel
              opts={{ align: "start", loop: true }}
              plugins={[pluginDesktop.current]}
              className="w-full"
            >
              <CarouselContent className="-ml-3">
                {data.slice(2).map((item, i) => (
                  <CarouselItem key={item.id || i + 2} className="pl-3 md:basis-1/3">
                    {renderCard(item, i + 2, "aspect-[4/3] md:aspect-video")}
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious variant="ghost" className="hidden md:flex -left-12 w-10 h-10 bg-transparent text-slate-400 hover:text-primary-800 hover:bg-transparent shadow-none opacity-0 disabled:opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:disabled:opacity-50 group-hover:translate-x-0 transition-all duration-300 [&_svg]:!w-8 [&_svg]:!h-8 after:content-[''] after:absolute after:-right-12 after:w-12 after:h-full" />
              <CarouselNext variant="ghost" className="hidden md:flex -right-12 w-10 h-10 bg-transparent text-slate-400 hover:text-primary-800 hover:bg-transparent shadow-none opacity-0 disabled:opacity-0 translate-x-4 group-hover:opacity-100 group-hover:disabled:opacity-50 group-hover:translate-x-0 transition-all duration-300 [&_svg]:!w-8 [&_svg]:!h-8 after:content-[''] after:absolute after:-left-12 after:w-12 after:h-full" />
            </Carousel>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-8 md:py-20 overflow-hidden relative bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            <span className="bg-[#F3BC45] bg-clip-text text-transparent">Fasilitas</span> Unggulan
          </h2>
          <p className="text-slate-500 mt-4 text-sm md:text-base max-w-2xl mx-auto">
            Didukung fasilitas modern dan layanan akademik terintegrasi untuk mendukung perjalanan studimu.
          </p>
        </div>

        {/* Desktop View (md and up) */}
        <div className="hidden md:block">
          {renderDesktopGrid()}
        </div>

        {/* Mobile View (< md) */}
        <div className="block md:hidden relative mt-4" onMouseEnter={() => pluginMobile.current.stop()} onMouseLeave={() => pluginMobile.current.play()}>
          <Carousel
            setApi={setApi}
            plugins={[pluginMobile.current]}
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {data.map((item, i) => (
                <CarouselItem key={item.id || i} className="pl-4 basis-full">
                  {renderCard(item, i, "aspect-[4/3]")}
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          {/* Dots Indicator */}
          <div className="flex items-center justify-center w-full gap-1.5 mt-6">
            {data.map((_, idx) => (
              <button
                key={`dot-${idx}`}
                onClick={() => api?.scrollTo(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  current === idx ? "w-6 bg-secondary" : "w-1.5 bg-slate-200 hover:bg-slate-300"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}