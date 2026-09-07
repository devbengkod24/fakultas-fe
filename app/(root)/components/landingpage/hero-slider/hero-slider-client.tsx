"use client";

import { useState, useEffect } from "react";
import type { HeroSlider } from "@/types/admin/landing-page/hero-slider/hero-slider";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

type Props = {
  images: HeroSlider[];
};

function CountUp({
  end,
  suffix = "",
  duration = 2000,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      // easing lambat di akhir (easeOut)
      const easeOutQuart =
        1 - Math.pow(1 - Math.min(progress / duration, 1), 4);
      const current = Math.floor(easeOutQuart * end);

      if (progress < duration) {
        setCount(current);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
}

export default function HeroSliderClient({ images }: Props) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const renderSlider = (isMobile: boolean) => (
    <div
      className={`relative ${isMobile ? "my-4 block w-full px-4 md:px-0 lg:hidden" : "hidden lg:mt-0 lg:block"}`}
    >
      <div
        className={`group relative overflow-hidden shadow-2xl ${isMobile ? "rounded-2xl md:rounded-3xl" : "lg:rounded-3xl"}`}
      >
        <div
          className={`relative w-full ${isMobile ? "aspect-video" : "lg:aspect-[4/3]"}`}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentImage
                  ? "scale-100 opacity-100"
                  : "scale-105 opacity-0"
              }`}
            >
              <Image
                src={image.image}
                alt={image.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                className="object-cover transition-all duration-1000 ease-out"
                priority={index === 0}
              />
            </div>
          ))}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>

          {/* Floating Card */}
          {images.length > 0 && (
            <div
              className={`absolute rounded-xl bg-white/95 shadow-lg backdrop-blur-sm transition-all duration-500 ease-out group-hover:scale-105 ${
                isMobile
                  ? "bottom-4 left-4 min-w-36 p-2 md:bottom-6 md:left-6 md:min-w-52 md:p-4"
                  : "lg:bottom-6 lg:left-6 lg:min-w-52 lg:p-4"
              }`}
            >
              <h3
                className={`font-bold text-slate-900 ${isMobile ? "text-xs md:text-base" : "lg:text-base"}`}
              >
                {images[currentImage]?.title}
              </h3>
              <p
                className={`mt-0.5 font-medium text-slate-500 ${isMobile ? "text-[10px] md:text-xs" : "lg:text-xs"}`}
              >
                {images[currentImage]?.subtitle}
              </p>
            </div>
          )}

          {/* Slider Dots */}
          <div
            className={`absolute flex gap-2 ${isMobile ? "bottom-6 right-4 md:bottom-8 md:right-6" : "lg:bottom-8 lg:right-6"}`}
          >
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-2.5 rounded-full shadow-sm transition-all duration-300 ease-out hover:scale-110 ${
                  index === currentImage
                    ? "w-8 bg-white"
                    : "w-2.5 bg-white/60 hover:bg-white/90"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative min-h-0 overflow-hidden bg-gradient-to-br from-primary-800 to-primary-500 pb-6 pt-8 md:py-10 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:py-12">
      {/* Main Hero Container */}
      <main className="mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        <div className="relative z-10 grid grid-cols-1 items-center gap-2 lg:grid-cols-2 lg:gap-6 xl:gap-8">
          {/* Left Content */}
          <div className="flex flex-col items-start gap-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <span className="text-sm font-semibold text-white">Fakultas Ilmu Komputer</span>
            </div>

            {/* Typography */}
            <div className="w-full space-y-0.5 md:space-y-1 xl:space-y-2">
              <h1 className="text-center text-4xl font-light leading-tight sm:text-5xl md:text-left xl:text-6xl">
                <span className="block font-semibold text-white">
                  Universitas
                </span>
                <span className="block font-semibold text-secondary">
                  Dian Nuswantoro
                </span>
              </h1>
            </div>

            {/* Render Slider for Mobile */}
            {renderSlider(true)}

            {/* Divider lines */}
            <div className="my-1 flex gap-1.5 lg:my-2 lg:gap-2">
              <div className="h-1 w-12 rounded-full bg-white lg:h-1.5 lg:w-16"></div>
              <div className="h-1 w-8 rounded-full bg-white/60 lg:h-1.5 lg:w-12"></div>
              <div className="h-1 w-6 rounded-full bg-white/40 lg:h-1.5 lg:w-8"></div>
            </div>

            <h2 className="mt-3 text-base font-bold leading-snug text-white md:mt-4 md:text-xl lg:mt-0 lg:text-xl xl:text-2xl">
              Membangun Masa Depan Digital Bersama Fakultas Ilmu Komputer UDINUS
            </h2>

            <p className="max-w-none text-xs leading-snug text-blue-100 md:text-sm lg:max-w-md lg:text-sm xl:text-lg">
              Mencetak talenta digital unggul yang berdaya saing tinggi di era
              industri 4.0. Bergabunglah dengan ribuan alumni sukses di seluruh
              dunia.
            </p>

            {/* CTA */}
            <div className="grid w-full grid-cols-2 items-center gap-2 pt-4 md:gap-4 md:pt-5 lg:flex lg:w-auto lg:flex-wrap lg:pt-4">
              <button
                className="w-full rounded-full border-2 border-white px-1 py-2 text-center text-[11px] font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-primary-800 sm:text-sm lg:w-auto lg:px-8 lg:py-3.5 lg:text-base"
                onClick={() => (window.location.href = "/pendaftaran")}
              >
                Daftar Sekarang
              </button>
              <button
                className="group flex w-full items-center justify-center gap-1 rounded-full bg-secondary px-1 py-2 text-[11px] font-semibold text-white shadow-md transition-all duration-300 hover:bg-secondary-400 hover:shadow-lg sm:text-sm lg:w-auto lg:gap-2 lg:px-8 lg:py-3.5 lg:text-base"
                onClick={() => (window.location.href = "/program-unggulan")}
              >
                <span className="whitespace-nowrap">Jelajahi Program</span>
                <ArrowRight className="h-3 w-3 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1 lg:h-5 lg:w-5" />
              </button>
            </div>
          </div>

          {/* Right Content - Render Slider for Desktop */}
          {renderSlider(false)}
        </div>

        {/* Stats Section Bottom */}
        <div className="mt-16 flex flex-wrap items-center justify-start gap-8 z-10 relative border-t border-white/20 pt-8">
          <div className="grid grid-cols-3 gap-4 lg:gap-24">
            <div className="flex flex-col gap-1">
              <span className="text-4xl md:text-5xl font-extrabold text-secondary">
                <CountUp end={15} suffix="K+" duration={2000} />
              </span>
              <span className="text-blue-100 font-medium text-sm md:text-base">Alumni Sukses</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-4xl md:text-5xl font-extrabold text-white">
                <CountUp end={95} suffix="%" duration={2000} />
              </span>
              <span className="text-blue-100 font-medium text-sm md:text-base">Tingkat Kelulusan</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-4xl md:text-5xl font-extrabold text-white">
                <CountUp end={150} suffix="+" duration={2000} />
              </span>
              <span className="text-blue-100 font-medium text-sm md:text-base">Mitra Industri</span>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
