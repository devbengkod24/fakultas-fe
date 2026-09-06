"use client";

import {
  BookOpen,
  Briefcase,
  Users,
  Calendar,
  Code,
  Settings,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const services = [
  {
    icon: BookOpen,
    title: "Tugas Akhir",
    description: "Manajemen tugas akhir mahasiswa secara efektif",
    color: "primary",
    gradient: "from-primary to-primary-500",
    bgGradient: "from-primary-50 to-primary-100",
    size: "large",
    featured: true,
    url: "/apps", // Internal link
  },
  {
    icon: Settings,
    title: "Bengkel Koding",
    description: "Platform learning coding interaktif dan workshop",
    color: "orange",
    gradient: "from-orange-500 to-orange-400",
    bgGradient: "from-orange-50 to-orange-100",
    size: "small",
    url: "https://bengkelkoding.dinus.id/", // Internal link
  },
  {
    icon: Calendar,
    title: "Reservasi",
    description: "Sistem reservasi ruang dan fasilitas kampus H6",
    color: "yellow",
    gradient: "from-yellow-500 to-yellow-400",
    bgGradient: "from-yellow-50 to-yellow-100",
    size: "medium",
    url: "https://reservasi.bengkelkoding.dinus.id/", // External link
  },
  {
    icon: Briefcase,
    title: "Kerja Praktek",
    description: "Sistem pengelolaan kerja praktek terintegrasi",
    color: "primary",
    gradient: "from-primary to-primary-500",
    bgGradient: "from-primary-50 to-primary-100",
    size: "medium",
    url: "/apps", // Internal link
  },
  {
    icon: Users,
    title: "Alumni",
    description: "Portal jejaring dan informasi alumni",
    color: "orange",
    gradient: "from-orange-500 to-orange-400",
    bgGradient: "from-orange-50 to-orange-100",
    size: "small",
    url: "/apps", // Internal link
  },
  {
    icon: Code,
    title: "Bimbingan Karir",
    description: "Layanan bimbingan dan konseling karir",
    color: "yellow",
    gradient: "from-yellow-500 to-yellow-400",
    bgGradient: "from-yellow-50 to-yellow-100",
    size: "small",
    url: "/apps", // Internal link
  },
];

export default function ServicesGrid() {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true); // mulai fade-out

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % services.length); // ganti konten
        setIsFading(false); // mulai fade-in
      }, 500); // waktu fade-out sebelum ganti konten
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle navigation for service cards
  const handleServiceClick = (url: string) => {
    window.location.href = url;
  };

  const featuredService = services[index];
  const regularServices = services;

  return (
    <section
      id="services-section"
      ref={sectionRef}
      className="py-8 md:py-20 bg-white overflow-hidden relative"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 -left-32 w-64 h-64 bg-gradient-to-br from-primary-100/30 to-purple-100/30 rounded-full blur-3xl transition-all duration-1000 ease-out"></div>
        <div className="absolute bottom-32 -right-32 w-80 h-80 bg-gradient-to-br from-emerald-100/30 to-cyan-100/30 rounded-full blur-3xl transition-all duration-1000 ease-out"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        {/* Header with Animation */}
        <div className={`text-center mb-16`}>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            <span className="font-semibold">Akses</span>{" "}
            <span className="font-semibold bg-blue-700">
              Mudah
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Berbagai layanan akademik dan fasilitas kampus dalam satu platform
            terintegrasi
          </p>
        </div>
        {/* Creative Layout */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Featured Service - Large Card */}
          <div className={`lg:col-span-5`} style={{ transitionDelay: "200ms" }}>
            <div
              className="group cursor-pointer h-full"
              onMouseEnter={() => setHoveredService(0)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <div
                className={`relative bg-gradient-to-br ${
                  featuredService.gradient
                } rounded-3xl p-8 lg:p-12 text-white overflow-hidden h-full min-h-[400px] flex flex-col justify-between
                  transition-opacity duration-700 ease-in-out ${
                    isFading ? "opacity-50" : "opacity-100"
                  }`}
              >
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10 transition-opacity duration-700 ease-out group-hover:opacity-20">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full "></div>
                  <div
                    className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full"
                    style={{
                      transform:
                        hoveredService === 0
                          ? "translate(-20%, 20%)"
                          : "translate(-20%, 20%)",
                    }}
                  ></div>
                </div>

                {/* Animated Particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute w-2 h-2 bg-white/20 rounded-full`}
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
                  <div className={`flex items-center gap-4 mb-6`}>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <featuredService.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles
                        className="w-5 h-5 text-yellow-300 fill-current transition-all duration-500 ease-out"
                        style={{
                          transform:
                            hoveredService === 0 ? " scale(1.2)" : " scale(1)",
                        }}
                      />
                      <span
                        className="bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 ease-out"
                        style={{
                          transform:
                            hoveredService === 0 ? "scale(1.05)" : "scale(1)",
                        }}
                      >
                        Featured
                      </span>
                    </div>
                  </div>

                  <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                    {featuredService.title}
                  </h3>
                  <p className="text-white/90 text-lg leading-relaxed mb-8">
                    {featuredService.description}
                  </p>
                </div>

                {/* Animated CTA */}
                <div className="relative z-10">
                  <button
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 ease-out flex items-center gap-2"
                    style={{
                      transform:
                        hoveredService === 0 ? "scale(1.05)" : "scale(1)",
                    }}
                    onClick={() => handleServiceClick(featuredService.url)}
                  >
                    Akses Sekarang
                    <ArrowRight
                      className="w-5 h-5 transition-all duration-300 ease-out"
                      style={{
                        transform:
                          hoveredService === 0
                            ? "translateX(4px)"
                            : "translateX(0)",
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Regular Services - Creative Grid */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Row - 3 Medium Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
              {regularServices.slice(0, 3).map((service, index) => {
                const ServiceIcon = service.icon;
                const serviceIndex = index + 1;

                return (
                  <div
                    key={index}
                    onClick={() => handleServiceClick(service.url)}
                  >
                    <div
                      className="group cursor-pointer h-full"
                      onMouseEnter={() => setHoveredService(serviceIndex)}
                      onMouseLeave={() => setHoveredService(null)}
                    >
                      <div
                        className={`relative bg-white border rounded-2xl p-6 transition-all duration-500 ease-out hover:shadow-sm hover:-translate-y-2 hover:scale-[1.02] h-full min-h-[160px] `}
                      >
                        {/* Gradient Background with Animation */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} rounded-2xl transition-all duration-500 ease-out`}
                          style={{
                            opacity: hoveredService === serviceIndex ? 1 : 0,
                            transform:
                              hoveredService === serviceIndex
                                ? "scale(1)"
                                : "scale(0.95)",
                          }}
                        ></div>
                        {/* Content with Animations */}
                        <div className="relative z-10 text-center">
                          <div
                            className={`w-12 h-12 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-500 ease-out`}
                            style={{
                              transform:
                                hoveredService === serviceIndex
                                  ? "scale(1.1) "
                                  : "scale(1) ",
                              boxShadow:
                                hoveredService === serviceIndex
                                  ? "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                                  : "none",
                            }}
                          >
                            <ServiceIcon
                              className="w-6 h-6 text-white transition-all duration-500 ease-out"
                              style={{
                                transform:
                                  hoveredService === serviceIndex
                                    ? "scale(1.1)"
                                    : "scale(1)",
                              }}
                            />
                          </div>
                          <h3
                            className="text-sm font-bold text-gray-900 mb-2 transition-all duration-300 ease-out"
                            style={{
                              transform:
                                hoveredService === serviceIndex
                                  ? "translateY(-2px)"
                                  : "translateY(0)",
                              color:
                                hoveredService === serviceIndex
                                  ? "#1e293b"
                                  : "",
                            }}
                          >
                            {service.title}
                          </h3>
                          <p
                            className="text-gray-600 text-xs leading-relaxed transition-all duration-300 ease-out"
                            style={{
                              transform:
                                hoveredService === serviceIndex
                                  ? "translateY(-2px)"
                                  : "translateY(0)",
                              color:
                                hoveredService === serviceIndex
                                  ? "#475569"
                                  : "",
                              transitionDelay: "50ms",
                            }}
                          >
                            {service.description}
                          </p>
                        </div>

                        {/* Pulse Effect on Hover */}
                        <div
                          className="absolute inset-0 rounded-2xl transition-all duration-700 ease-out"
                          style={{
                            boxShadow:
                              hoveredService === serviceIndex
                                ? "0 0 0 2px rgba(203, 213, 225, 0.3)"
                                : "none",
                            opacity: hoveredService === serviceIndex ? 1 : 0,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Row - Remaining Cards with Consistent Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
              {regularServices.slice(3).map((service, index) => {
                const ServiceIcon = service.icon;
                const serviceIndex = index + 4;

                return (
                  <div
                    key={index}
                    onClick={() => handleServiceClick(service.url)}
                  >
                    <div
                      className="group cursor-pointer h-full"
                      onMouseEnter={() => setHoveredService(serviceIndex)}
                      onMouseLeave={() => setHoveredService(null)}
                    >
                      <div
                        className={`relative bg-white border rounded-2xl p-6 transition-all duration-500 ease-out hover:shadow-sm hover:-translate-y-2 hover:scale-[1.02] h-full min-h-[160px]`}
                      >
                        {" "}
                        {/* Gradient Background with Animation */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} rounded-2xl transition-all duration-500 ease-out`}
                          style={{
                            opacity: hoveredService === serviceIndex ? 1 : 0,
                            transform:
                              hoveredService === serviceIndex
                                ? "scale(1)"
                                : "scale(0.95)",
                          }}
                        ></div>
                        {/* Content with Animations */}
                        <div className="relative z-10 text-center">
                          <div
                            className={`w-12 h-12 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-500 ease-out`}
                            style={{
                              transform:
                                hoveredService === serviceIndex
                                  ? "scale(1.1)"
                                  : "scale(1)",
                              boxShadow:
                                hoveredService === serviceIndex
                                  ? "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                                  : "none",
                            }}
                          >
                            <ServiceIcon
                              className="w-6 h-6 text-white transition-all duration-500 ease-out"
                              style={{
                                transform:
                                  hoveredService === serviceIndex
                                    ? "scale(1.1)"
                                    : "scale(1)",
                              }}
                            />
                          </div>

                          <h3
                            className="text-sm font-bold text-gray-900 mb-2 transition-all duration-300 ease-out"
                            style={{
                              transform:
                                hoveredService === serviceIndex
                                  ? "translateY(-2px)"
                                  : "translateY(0)",
                              color:
                                hoveredService === serviceIndex
                                  ? "#1e293b"
                                  : "",
                            }}
                          >
                            {service.title}
                          </h3>
                          <p
                            className="text-gray-600 text-xs leading-relaxed transition-all duration-300 ease-out"
                            style={{
                              transform:
                                hoveredService === serviceIndex
                                  ? "translateY(-2px)"
                                  : "translateY(0)",
                              color:
                                hoveredService === serviceIndex
                                  ? "#475569"
                                  : "",
                              transitionDelay: "50ms",
                            }}
                          >
                            {service.description}
                          </p>
                        </div>
                        {/* Pulse Effect on Hover */}
                        <div
                          className="absolute inset-0 rounded-2xl transition-all duration-700 ease-out"
                          style={{
                            boxShadow:
                              hoveredService === serviceIndex
                                ? "0 0 0 2px rgba(203, 213, 225, 0.3)"
                                : "none",
                            opacity: hoveredService === serviceIndex ? 1 : 0,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Add floating keyframes animation */}
        <style jsx global>{`
          @keyframes float {
            0% {
              transform: translateY(0) translateX(0);
            }
            50% {
              transform: translateY(-10px) translateX(5px);
            }
            100% {
              transform: translateY(0) translateX(0);
            }
          }
        `}</style>
      </div>
    </section>
  );
}
