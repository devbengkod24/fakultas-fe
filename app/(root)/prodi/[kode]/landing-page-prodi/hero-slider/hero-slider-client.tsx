"use client";

import { useState, useEffect, useRef } from "react";
import type { HeroSlider } from "@/types/admin/landing-page/hero-slider/hero-slider";
import Image from "next/image";

type Props = {
  images: HeroSlider[];
  prodiName?: string;
};

export default function HeroSlide({ images, prodiName }: Props) {
  const [currentImage, setCurrentImage] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imgErrors, setImgErrors] = useState<{ [key: number]: boolean }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto relative h-full w-full flex items-center bg-white">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Teks */}
          <div className="space-y-4 lg:space-y-6 order-2 lg:order-1">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-2 tracking-tight">
                <span className="bg-gradient-to-r from-prodi-start to-prodi-end bg-clip-text text-transparent">
                  {prodiName}
                </span>
              </h1>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
                Fakultas Ilmu Komputer
              </h2>
            </div>

            <p className="text-slate-600 leading-relaxed text-sm sm:text-base lg:text-lg max-w-xl">
              Selamat datang di {prodiName}! Kami dengan bangga menyambut Anda untuk memulai perjalanan luar biasa dalam dunia ilmu komputer. Bersama kami, Anda akan tumbuh menjadi profesional yang siap menghadapi tantangan era digital.
            </p>
          </div>

          {/* Slider Gambar */}
          <div
            className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 group shadow-lg order-1 lg:order-2"
            onMouseMove={handleMouseMove}
          >
            {images && images.map((image, index) => {
              const srcToRender =
                imgErrors[index] || !image.image || image.image.includes("bg-home2.png")
                  ? "/assets/landingpage/img/building-udinus.png"
                  : image.image;

              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentImage ? "opacity-100 scale-100" : "opacity-0 scale-105"
                    }`}
                >
                  <Image
                    src={srcToRender}
                    alt={image.title || "Hero Image"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority={index === 0}
                    onError={() => setImgErrors((prev) => ({ ...prev, [index]: true }))}
                  />
                </div>
              );
            })}

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 pointer-events-none"></div>

            {images && images.length > 0 && (
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-white/95 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-xl border border-white/20 transition-transform duration-300 group-hover:-translate-y-1 z-10">
                <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">
                  {images[currentImage]?.title || "Garuda Ace"}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-600 mt-0.5">
                  {images[currentImage]?.subtitle || "Riset Internasional"}
                </p>
              </div>
            )}

            {images && images.length > 1 && (
              <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-6 flex gap-2 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 shadow-sm ${index === currentImage
                      ? "w-6 sm:w-8 bg-white"
                      : "w-2 sm:w-2.5 bg-white/60 hover:bg-white"
                      }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            )}

            <div
              className="absolute rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500 ease-out blur-3xl pointer-events-none z-20 hidden lg:block"
              style={{
                background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)",
                width: "300px",
                height: "300px",
                left: mousePosition.x - 150,
                top: mousePosition.y - 150,
                transform: "scale(1)",
              }}
            ></div>

          </div>

        </div>
      </div>
    </div>
  );
}