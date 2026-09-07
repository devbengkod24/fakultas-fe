"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export interface BeritaItem {
  id: string;
  title: string;
  date: string;
  category: "PRESTASI" | "KEGIATAN";
  excerpt: string;
  image?: string;
  author?: string;
  isFeatured?: boolean;
}

export default function BeritaKegiatanClient({ berita }: { berita: BeritaItem[] }) {
  const [activeFilter, setActiveFilter] = useState<"Semua" | "Prestasi" | "Kegiatan kampus">("Semua");
  const [currentSlide, setCurrentSlide] = useState(0);

  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, '');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    // Format to "April 2, 2026"
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Gunakan data dari props (dari fetch API server component)
  const featuredNews = berita.filter(b => b.isFeatured);
  const listNews = berita.filter(b => !b.isFeatured);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? featuredNews.length - 1 : prev - 1));

  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    setIsPaused(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Auto-slide effect untuk kemudahan user awam
  useEffect(() => {
    if (featuredNews.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
    }, 8000); // Diperlambat jadi 8 detik agar user sempat membaca
    return () => clearInterval(timer);
  }, [featuredNews.length, isPaused]);

  const activeFeatured = featuredNews[currentSlide];

  const filteredGridNews = listNews.filter(item => {
    if (activeFilter === "Semua") return true;
    if (activeFilter === "Prestasi" && item.category === "PRESTASI") return true;
    if (activeFilter === "Kegiatan kampus" && item.category === "KEGIATAN") return true;
    return false;
  }).slice(0, 3);

  return (
    <>
      {/* ==================== SECTION BERITA (White Background) ==================== */}
      <section className="py-8 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">

          {/* HEADER */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
              <span className="bg-secondary bg-clip-text text-transparent">Berita </span><span className="text-slate-900">Terbaru</span>
              <br />
              <span className="text-slate-900">FIK </span><span className="bg-secondary bg-clip-text text-transparent">UDINUS</span>
            </h2>
            <p className="text-slate-500 mt-4 text-sm md:text-base max-w-2xl mx-auto">
              Ikuti perkembangan terbaru seputar kegiatan akademik, prestasi, dan inovasi mahasiswa FIK UDINUS.
            </p>
          </div>

          {/*   UPDATE TERBARU (SLIDER)   */}
          {activeFeatured && (
            <div
              className="relative group/slider_container"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEndHandler}
              onTouchCancel={() => setIsPaused(false)}
            >

              <div className="relative">
                {/* Arrow Left */}
                <button
                  onClick={prevSlide}
                  className="absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary-800 transition-all duration-300 opacity-0 -translate-x-4 group-hover/slider_container:opacity-100 group-hover/slider_container:translate-x-0 hidden md:flex z-20"
                >
                  <ArrowLeft className="w-8 h-8" />
                </button>

                <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-6 lg:gap-12">
                  {/* Left Side: Image */}
                  <div className="w-full md:w-1/2 relative aspect-video md:aspect-video rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                    <Image
                      src={activeFeatured.image || "/placeholder.svg"}
                      alt={activeFeatured.title}
                      fill
                      unoptimized
                      className="object-cover object-center transition-transform duration-700 hover:scale-105"
                    />
                  </div>

                  {/* Right Side: Content */}
                  <div className="w-full md:w-1/2 flex flex-col py-2">
                    {/* Dots Indicator (Mobile & Tablet) */}
                    <div className="flex lg:hidden items-center justify-center w-full gap-1.5 mb-4">
                      {featuredNews.map((_, idx) => (
                        <button
                          key={`mob-${idx}`}
                          onClick={() => setCurrentSlide(idx)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? "w-6 bg-secondary" : "w-1.5 bg-slate-200 hover:bg-slate-300"
                            }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>

                    <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-slate-900 mb-2 md:mb-3 leading-snug uppercase tracking-normal line-clamp-3 md:line-clamp-4">
                      {activeFeatured.title}
                    </h3>

                    <p className="text-xs text-secondary-500 mb-3 md:mb-5 font-bold">
                      oleh Humas Udinus | {formatDate(activeFeatured.date)} | Berita Terbaru
                    </p>

                    {/* Strip HTML to prevent hydration mismatch from unclosed tags */}
                    <div className="text-slate-500 text-sm md:text-base leading-relaxed mb-4 md:mb-6 line-clamp-3 md:line-clamp-6 text-justify">
                      {stripHtml(activeFeatured.excerpt || "")}
                    </div>

                    <div className="flex items-center justify-end lg:justify-between mt-auto pt-4 border-t border-slate-100">
                      {/* Dots Indicator (Desktop) */}
                      <div className="hidden lg:flex items-center gap-1.5">
                        {featuredNews.map((_, idx) => (
                          <button
                            key={`desk-${idx}`}
                            onClick={() => setCurrentSlide(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? "w-6 bg-secondary" : "w-1.5 bg-slate-200 hover:bg-slate-300"
                              }`}
                            aria-label={`Go to slide ${idx + 1}`}
                          />
                        ))}
                      </div>

                      <Link
                        href={`/berita/${activeFeatured.id}`}
                        className="inline-flex items-center justify-center px-6 py-2.5 border-2 border-primary-800 text-primary-800 font-bold text-xs md:text-sm rounded-full hover:bg-primary-800 hover:text-white transition-all duration-300 gap-2"
                      >
                        Baca selengkapnya <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Arrow Right */}
                <button
                  onClick={nextSlide}
                  className="absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary-800 transition-all duration-300 opacity-0 translate-x-4 group-hover/slider_container:opacity-100 group-hover/slider_container:translate-x-0 hidden md:flex z-20"
                >
                  <ArrowRight className="w-8 h-8" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================== SECTION KEGIATAN (Blue Background) ==================== */}
      <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-br from-primary-800 to-primary-500">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">

          {/*   PRESTASI & KEGIATAN (GRID)  */}
          <div>
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                <span className="bg-secondary bg-clip-text text-transparent">Kegiatan </span><span className="text-white">Terbaru</span>
                <br />
                <span className="text-white">FIK </span><span className="bg-secondary bg-clip-text text-transparent">UDINUS</span>
              </h2>
              <p className="text-blue-200 mt-4 text-sm md:text-base max-w-2xl mx-auto">
                Dapatkan informasi lengkap tentang kegiatan akademik dan kemahasiswaan di FIK UDINUS.
              </p>
            </div>

            {/* <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-white"></div>
              <span className="text-white font-bold text-sm tracking-widest uppercase">
                PRESTASI & KEGIATAN
              </span>
            </div> */}

            {/* Filter Pills & Button Selengkapnya (Horizontal Scroll) */}
            <div className="w-full overflow-x-auto scrollbar-hidden pb-2 mb-10">
              <div className="flex items-center gap-3 w-max min-w-full justify-start sm:justify-center px-4">
                {(["Semua", "Prestasi", "Kegiatan kampus"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-6 py-2.5 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      activeFilter === filter
                        ? "bg-secondary text-white border-transparent"
                        : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                    }`}
                  >
                    {filter}
                  </button>
                ))}

                <Link
                  href="/berita"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary hover:bg-secondary-400 text-white text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0"
                >
                  Lihat semuanya <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* 50:50 Grid & List Layout (Mobile & Tablet) */}
            {filteredGridNews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4 md:gap-6">
                {/* Left Side: Big Card (First Item) */}
                <Card 
                  key={filteredGridNews[0].id}
                  className="overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300 group shadow-md rounded-2xl bg-white border-0 h-full"
                >
                  <div className="relative overflow-hidden bg-slate-100 flex-shrink-0 h-56 md:h-72 w-full">
                    <Image
                      src={filteredGridNews[0].image || "/placeholder.svg"}
                      alt={filteredGridNews[0].title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bg-white text-primary-800 text-xs font-extrabold uppercase tracking-wider shadow-sm top-4 left-4 px-3.5 py-1.5 rounded-full">
                      {filteredGridNews[0].category}
                    </div>
                  </div>
                  <CardHeader className="px-6 pt-6 pb-2 flex-grow">
                    <p className="text-slate-400 font-medium text-xs mb-2">
                      {formatDate(filteredGridNews[0].date)}
                    </p>
                    <CardTitle className="font-bold leading-snug group-hover:text-primary-800 transition-colors line-clamp-2 text-slate-900 text-lg md:text-2xl">
                      {filteredGridNews[0].title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-4">
                    <div className="text-sm text-slate-500 leading-relaxed line-clamp-3 text-justify">
                      {stripHtml(filteredGridNews[0].excerpt || "")}
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 pt-2 pb-6 flex justify-end">
                    <Link
                      href={`/berita/${filteredGridNews[0].id}`}
                      className="inline-flex items-center gap-1.5 text-primary-800 font-semibold text-sm hover:text-blue-800 transition-colors"
                    >
                      Baca Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </CardFooter>
                </Card>

                {/* Right Side: List of Cards + Button */}
                <div className="flex flex-col gap-4 md:gap-6">
                  {filteredGridNews.slice(1).map((item) => (
                    <Card 
                      key={item.id} 
                      className="overflow-hidden flex flex-row items-stretch hover:-translate-y-1 transition-all duration-300 group shadow-md rounded-2xl bg-white border-0 h-32 md:h-36"
                    >
                      <div className="relative overflow-hidden bg-slate-100 flex-shrink-0 w-32 md:w-40 h-full rounded-l-2xl">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Hidden badge on mobile */}
                        <div className="hidden md:block absolute bg-white/90 text-primary-800 text-[10px] font-extrabold uppercase tracking-wider shadow-sm top-3 left-3 px-2.5 py-1 rounded-full">
                          {item.category}
                        </div>
                      </div>
                      <div className="flex flex-col justify-center flex-grow py-3 px-4 md:px-5 min-w-0">
                        {/* Mobile Category */}
                        <div className="md:hidden flex items-center gap-1.5 text-[10px] font-extrabold text-primary-800 uppercase tracking-wider mb-1">
                          <span>{item.category}</span>
                        </div>
                        
                        <p className="hidden md:block text-slate-400 font-medium text-xs mb-1.5">
                          {formatDate(item.date)}
                        </p>
                        
                        <h4 className="font-bold leading-tight group-hover:text-primary-800 transition-colors line-clamp-2 md:line-clamp-3 text-slate-900 text-sm md:text-base mb-2">
                          {item.title}
                        </h4>
                        
                        {/* Mobile Date & Link */}
                        <div className="md:hidden mt-auto flex items-center justify-between">
                          <span className="text-slate-400 font-medium text-[10px]">
                            {formatDate(item.date)}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary-800">
                            Baca <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>

                        {/* Tablet Link */}
                        <div className="hidden md:flex mt-auto justify-end">
                          <Link
                            href={`/berita/${item.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary-800 hover:text-blue-800 transition-colors"
                          >
                            Baca Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  {/* Lihat Semuanya Button */}
                  <div className="pt-2 w-full">
                    <Link
                      href="/berita"
                      className="flex w-full justify-center items-center gap-2 px-6 py-3.5 rounded-2xl bg-secondary hover:bg-secondary-400 text-white text-sm md:text-base font-bold transition-all hover:-translate-y-1 shadow-md"
                    >
                      Lihat semuanya <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Layout (3 Columns) */}
            {filteredGridNews.length > 0 && (
              <div className="hidden lg:grid lg:grid-cols-3 gap-6">
                {filteredGridNews.map((item) => (
                  <Card 
                    key={item.id} 
                    className="overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300 group shadow-md rounded-2xl bg-white border-0 h-full"
                  >
                    {/* Image Section */}
                    <div className="relative overflow-hidden bg-slate-100 flex-shrink-0 h-56 w-full">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute bg-white text-primary-800 text-xs font-extrabold uppercase tracking-wider shadow-sm top-4 left-4 px-3.5 py-1.5 rounded-full">
                        {item.category}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-col flex-grow min-w-0">
                      <CardHeader className="px-6 pt-6 pb-2">
                        <p className="text-slate-400 font-medium text-xs mb-2">
                          {formatDate(item.date)}
                        </p>
                        <CardTitle className="font-bold leading-snug group-hover:text-primary-800 transition-colors line-clamp-2 text-slate-900 text-lg">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow px-6 pb-4">
                        <div className="text-sm text-slate-500 leading-relaxed line-clamp-3 text-justify">
                          {stripHtml(item.excerpt || "")}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end px-6 pt-2 pb-6">
                        <Link
                          href={`/berita/${item.id}`}
                          className="inline-flex items-center gap-1.5 text-primary-800 font-semibold text-sm hover:text-blue-800 transition-colors"
                        >
                          Baca Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </CardFooter>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredGridNews.length === 0 && (
              <div className="text-center text-white/70 py-10">
                Tidak ada data berita untuk kategori ini.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
