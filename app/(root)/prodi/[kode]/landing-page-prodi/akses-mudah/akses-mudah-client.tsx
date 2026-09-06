"use client";

import { BookOpen, Briefcase, Code, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const allServices = [
  {
    icon: BookOpen,
    title: "Tugas Akhir",
    description: "Manajemen tugas akhir mahasiswa secara efektif",
    gradient: "from-blue-600 to-blue-500",
    bgGradient: "from-blue-50 to-blue-100",
    url: "/apps",
  },
  {
    icon: Briefcase,
    title: "Kerja Praktek",
    description: "Sistem pengelolaan kerja praktek terintegrasi",
    gradient: "from-emerald-600 to-emerald-500",
    bgGradient: "from-emerald-50 to-emerald-100",
    url: "/apps",
  },
  {
    icon: Code,
    title: "Bimbingan Karir",
    description: "Layanan bimbingan dan konseling karir",
    gradient: "from-yellow-500 to-yellow-400",
    bgGradient: "from-yellow-50 to-yellow-100",
    url: "/apps",
  },
];

export default function AksesMudahClient() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setFeaturedIndex((prev) => (prev + 1) % allServices.length);
        setIsFading(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (url: string) => {
    window.location.href = url;
  };

  const featuredService = allServices[featuredIndex];

  return (
    <div className="bg-white overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 -left-32 w-64 h-64" />
        <div className="absolute bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">

          {/* ── Featured Card ── */}
          <div className="w-full lg:w-[38%] flex-shrink-0">
            <div
              onMouseEnter={() => setHoveredIndex(-1)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                group relative bg-gradient-to-br ${featuredService.gradient}
                rounded-3xl p-8 lg:p-12 text-white overflow-hidden
                h-full min-h-[400px] flex flex-col justify-between cursor-pointer
                transition-all duration-700 ease-in-out
                ${isFading ? "opacity-50" : "opacity-100"}
              `}
              onClick={() => handleClick(featuredService.url)}
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10 transition-opacity duration-700 ease-out group-hover:opacity-20 pointer-events-none">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full "></div>
                <div
                  className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full"
                  style={{
                    transform: "translate(-20%, 20%)",
                  }}
                ></div>
              </div>

              {/* Animated Particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-white/20 rounded-full"
                    style={{
                      left: `${20 + i * 10}%`,
                      top: `${10 + i * 10}%`,
                      transitionDelay: `${i * 100}ms`,
                    }}
                  />
                ))}
              </div>

              {/* Content with Animations */}
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-transform duration-500 ${
                      hoveredIndex === -1 ? "scale-110" : "scale-100"
                    }`}
                  >
                    <featuredService.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles
                      className={`w-5 h-5 text-yellow-300 fill-current transition-all duration-500 ease-out ${
                        hoveredIndex === -1 ? "scale(1.2)" : "scale(1)"
                      }`}
                    />
                    <span
                      className="bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 ease-out"
                      style={{
                        transform: hoveredIndex === -1 ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      Featured
                    </span>
                  </div>
                </div>

                <h3 className="text-3xl lg:text-4xl font-bold mb-4">{featuredService.title}</h3>
                <p className="text-white/90 text-lg leading-relaxed mb-8">{featuredService.description}</p>
              </div>

              {/* Animated CTA */}
              <div className="relative z-10">
                <button
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 ease-out flex items-center gap-2"
                  style={{
                    transform: hoveredIndex === -1 ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  Akses Sekarang
                  <ArrowRight
                    className="w-5 h-5 transition-all duration-300 ease-out"
                    style={{
                      transform: hoveredIndex === -1 ? "translateX(4px)" : "translateX(0)",
                    }}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* ── Grid 2x2 ── */}
          <div className="w-full lg:flex-1 grid grid-cols-2 gap-4">
            {allServices.map((service, i) => {
              const Icon = service.icon;
              const isHovered = hoveredIndex === i;
              return (
                <div
                  key={i}
                  onClick={() => handleClick(service.url)}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`
                    relative bg-white border border-gray-100 rounded-2xl p-5 sm:p-6
                    flex flex-col items-center justify-center text-center gap-3 cursor-pointer
                    transition-all duration-500 ease-out
                    ${isHovered ? "shadow-md -translate-y-2 scale-[1.02]" : "shadow-sm"}
                  `}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} rounded-2xl transition-all duration-500 ease-out`}
                    style={{ opacity: isHovered ? 1 : 0, transform: isHovered ? "scale(1)" : "scale(0.95)" }}
                  />
                  <div className={`relative z-10 w-12 h-12 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center transition-all duration-500 ease-out ${isHovered ? "scale-110 shadow-lg" : "scale-100"}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`relative z-10 transition-transform duration-300 ${isHovered ? "-translate-y-0.5" : ""}`}>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">{service.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{service.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
