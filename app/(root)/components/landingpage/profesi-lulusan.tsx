"use client";

import type React from "react";

import {
  Code2,
  Wifi,
  Cpu,
  Server,
  Sparkles,
  Gamepad2,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const careers = [
  {
    icon: Code2,
    title: "Software Engineer",
    desc: "Membangun aplikasi yang memecahkan masalah dunia nyata",
    highlight: "Full Stack",
    color: "primary",
    bgColor: "bg-primary-50",
    iconColor: "text-primary-600",
    badgeColor: "bg-primary-100 text-primary-700",
    hoverColor: "hover:bg-primary-100",
    stats: "85% Job Growth",
    salary: "Rp. 6.000.000 - Rp. 15.000.000",
  },
  {
    icon: Wifi,
    title: "Network Engineer",
    desc: "Merancang dan memelihara infrastruktur digital yang aman",
    highlight: "Infrastructure",
    color: "orange",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
    badgeColor: "bg-orange-100 text-orange-700",
    hoverColor: "hover:bg-orange-100",
    stats: "Cloud Native",
    salary: "Rp. 5.000.000 - Rp. 12.000.000",
  },
  {
    icon: Cpu,
    title: "IOT Engineer",
    desc: "Menghubungkan dunia fisik dengan teknologi pintar",
    highlight: "Internet of Things",
    color: "yellow",
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
    badgeColor: "bg-yellow-100 text-yellow-700",
    hoverColor: "hover:bg-yellow-100",
    stats: "High Demand",
    salary: "Rp. 6.000.000 - Rp. 14.000.000",
  },
  {
    icon: Server,
    title: "System Administrator",
    desc: "Jaga sistem tetap berjalan lancar dan aman",
    highlight: "Operations",
    color: "primary",
    bgColor: "bg-primary-50",
    iconColor: "text-primary-600",
    badgeColor: "bg-primary-100 text-primary-700",
    hoverColor: "hover:bg-primary-100",
    stats: "DevOps Ready",
    salary: "Rp. 5.000.000 - Rp. 12.000.000",
  },
  {
    icon: Sparkles,
    title: "AI Developer",
    desc: "Buat sistem cerdas dan otomatisasi",
    highlight: "Machine Learning",
    color: "orange",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
    badgeColor: "bg-orange-100 text-orange-700",
    hoverColor: "hover:bg-orange-100",
    stats: "Future Tech",
    salary: "Rp. 7.000.000 - Rp. 16.000.000",
  },
  {
    icon: Gamepad2,
    title: "Game Developer",
    desc: "Ciptakan pengalaman digital yang imersif",
    highlight: "Interactive",
    color: "yellow",
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
    badgeColor: "bg-yellow-100 text-yellow-700",
    hoverColor: "hover:bg-yellow-100",
    stats: "Creative Tech",
    salary: "Rp. 6.000.000 - Rp. 14.000.000",
  },
];

export default function CareerProspects() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle mouse movement for interactive effects
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMounted) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      ref={sectionRef}
      className="py-6 md:py-12 bg-white overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        {/* Header with Enhanced Animation */}
        <div className={`text-center mb-8`}>
          <h2 className="text-3xl font-light text-slate-900 mb-4">
            <span className="font-semibold">Karir</span>{" "}
            <span className="font-semibold bg-blue-700">
              Masa Depan
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Berbagai peluang karir menanti lulusan Program Studi Teknik
            Informatika
          </p>
        </div>

        {/* Enhanced Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* First row - 3 cards */}
          {careers.slice(0, 3).map((career, index) => {
            const CareerIcon = career.icon;
            const cardIndex = index;

            return (
              <div
                key={index}
                className={`group cursor-pointer`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
                onMouseEnter={() => setHoveredCard(cardIndex)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={`relative bg-white border  rounded-2xl p-4 transition-all duration-500 ease-out hover:shadow-sm hover:-translate-y-2 hover:scale-105 overflow-hidden ${career.hoverColor}`}
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-${
                      career.color
                    }-50/50 to-${
                      career.color === "primary"
                        ? "purple"
                        : career.color === "green"
                        ? "emerald"
                        : career.color
                    }-50/50 rounded-2xl transition-all duration-500 ease-out`}
                    style={{
                      opacity: hoveredCard === cardIndex ? 1 : 0,
                      transform:
                        hoveredCard === cardIndex ? "scale(1)" : "scale(0.95)",
                    }}
                  ></div>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                    <div
                      className={`w-8 h-8 bg-${
                        career.color === "primary" ? "primary" : career.color
                      }-100 rounded-full flex items-center justify-center`}
                    >
                      <TrendingUp
                        className={`w-4 h-4 text-${
                          career.color === "primary" ? "primary" : career.color
                        }-600`}
                      />
                    </div>
                  </div>

                  <div className="relative z-10">
                    <div
                      className={`w-10 h-10 ${career.bgColor} rounded-lg flex items-center justify-center mb-3 transition-all duration-500 ease-out`}
                      style={{
                        transform:
                          hoveredCard === cardIndex ? "scale(1.1)" : "scale(1)",
                        boxShadow:
                          hoveredCard === cardIndex
                            ? "0 10px 20px -5px rgba(0, 0, 0, 0.2)"
                            : "none",
                      }}
                    >
                      <CareerIcon
                        className={`w-5 h-5 ${career.iconColor} transition-all duration-500 ease-out`}
                        style={{
                          transform:
                            hoveredCard === cardIndex
                              ? "scale(1.1)"
                              : "scale(1)",
                        }}
                      />
                    </div>

                    <span
                      className={`px-2 py-1 ${career.badgeColor} text-xs rounded-full mb-2 inline-block transition-all duration-300 ease-out`}
                      style={{
                        transform:
                          hoveredCard === cardIndex
                            ? "scale(1.05)"
                            : "scale(1)",
                      }}
                    >
                      {career.highlight}
                    </span>

                    <h3
                      className="text-lg font-medium text-gray-900 mb-1 transition-all duration-300 ease-out"
                      style={{
                        transform:
                          hoveredCard === cardIndex
                            ? "translateX(3px)"
                            : "translateX(0)",
                      }}
                    >
                      {career.title}
                    </h3>

                    <p
                      className="text-sm text-gray-600 mb-2 transition-all duration-300 ease-out"
                      style={{
                        transform:
                          hoveredCard === cardIndex
                            ? "translateX(3px)"
                            : "translateX(0)",
                        transitionDelay: "50ms",
                      }}
                    >
                      {career.desc}
                    </p>

                    {/* Stats */}
                    <div
                      className="text-xs text-gray-500 transition-all duration-500 ease-out"
                      style={{
                        opacity: hoveredCard === cardIndex ? 1 : 0,
                        transform:
                          hoveredCard === cardIndex
                            ? "translateY(0)"
                            : "translateY(10px)",
                      }}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">{career.stats}</span>
                      </div>
                      <div>{career.salary}</div>
                    </div>
                  </div>

                  {/* Interactive Glow Effect */}
                  {isMounted && (
                    <div
                      className="absolute rounded-full opacity-0 group-hover:opacity-10 transition-all duration-700 ease-out blur-2xl"
                      style={{
                        background: `radial-gradient(circle, rgba(${
                          career.color === "primary"
                            ? "59, 130, 246"
                            : career.color === "green"
                            ? "34, 197, 94"
                            : career.color === "purple"
                            ? "139, 92, 246"
                            : "59, 130, 246"
                        }, 0.8) 0%, rgba(${
                          career.color === "primary"
                            ? "59, 130, 246"
                            : career.color === "green"
                            ? "34, 197, 94"
                            : career.color === "purple"
                            ? "139, 92, 246"
                            : "59, 130, 246"
                        }, 0) 70%)`,
                        width: "200px",
                        height: "200px",
                        left: mousePosition.x - 100,
                        top: mousePosition.y - 100,
                        transform:
                          hoveredCard === cardIndex ? "scale(1)" : "scale(0)",
                      }}
                    ></div>
                  )}

                  {/* Pulse Effect */}
                  <div
                    className="absolute inset-0 rounded-2xl transition-all duration-700 ease-out"
                    style={{
                      boxShadow:
                        hoveredCard === cardIndex
                          ? "0 0 0 2px rgba(203, 213, 225, 0.3)"
                          : "none",
                      opacity: hoveredCard === cardIndex ? 1 : 0,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}

          {/* Second row - 3 cards */}
          {careers.slice(3).map((career, index) => {
            const CareerIcon = career.icon;
            const cardIndex = index + 3;

            return (
              <div
                key={index}
                className={`group cursor-pointer`}
                style={{
                  transitionDelay: `${500 + index * 100}ms`,
                }}
                onMouseEnter={() => setHoveredCard(cardIndex)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={`relative bg-white border rounded-2xl p-4 transition-all duration-500 ease-out hover:shadow-sm hover:-translate-y-2 hover:scale-105 overflow-hidden ${career.hoverColor}`}
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${career.bgColor}/50 rounded-2xl transition-all duration-500 ease-out`}
                    style={{
                      opacity: hoveredCard === cardIndex ? 1 : 0,
                      transform:
                        hoveredCard === cardIndex ? "scale(1)" : "scale(0.95)",
                    }}
                  ></div>

                  <div className="relative z-10">
                    <div
                      className={`w-10 h-10 ${career.bgColor} rounded-lg flex items-center justify-center mb-3 transition-all duration-500 ease-out`}
                      style={{
                        transform:
                          hoveredCard === cardIndex ? "scale(1.1)" : "scale(1)",
                        boxShadow:
                          hoveredCard === cardIndex
                            ? "0 10px 20px -5px rgba(0, 0, 0, 0.2)"
                            : "none",
                      }}
                    >
                      <CareerIcon
                        className={`w-5 h-5 ${career.iconColor} transition-all duration-500 ease-out`}
                        style={{
                          transform:
                            hoveredCard === cardIndex
                              ? "scale(1.1)"
                              : "scale(1)",
                        }}
                      />
                    </div>

                    <span
                      className={`px-2 py-1 ${career.badgeColor} text-xs rounded-full mb-2 inline-block transition-all duration-300 ease-out`}
                      style={{
                        transform:
                          hoveredCard === cardIndex
                            ? "scale(1.05)"
                            : "scale(1)",
                      }}
                    >
                      {career.highlight}
                    </span>

                    <h3
                      className="text-lg font-medium text-gray-900 mb-1 transition-all duration-300 ease-out"
                      style={{
                        transform:
                          hoveredCard === cardIndex
                            ? "translateX(3px)"
                            : "translateX(0)",
                      }}
                    >
                      {career.title}
                    </h3>

                    <p
                      className="text-sm text-gray-600 mb-2 transition-all duration-300 ease-out"
                      style={{
                        transform:
                          hoveredCard === cardIndex
                            ? "translateX(3px)"
                            : "translateX(0)",
                        transitionDelay: "50ms",
                      }}
                    >
                      {career.desc}
                    </p>

                    {/* Stats */}
                    <div
                      className="text-xs text-gray-500 transition-all duration-500 ease-out"
                      style={{
                        opacity: hoveredCard === cardIndex ? 1 : 0,
                        transform:
                          hoveredCard === cardIndex
                            ? "translateY(0)"
                            : "translateY(10px)",
                      }}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">{career.stats}</span>
                      </div>
                      <div>{career.salary}</div>
                    </div>
                  </div>

                  {/* Pulse Effect */}
                  <div
                    className="absolute inset-0 rounded-2xl transition-all duration-700 ease-out"
                    style={{
                      boxShadow:
                        hoveredCard === cardIndex
                          ? "0 0 0 2px rgba(203, 213, 225, 0.3)"
                          : "none",
                      opacity: hoveredCard === cardIndex ? 1 : 0,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA with Animation */}
        <div className={`text-center mt-8`}>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md border ">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-700 font-medium">
              90% Tingkat Penempatan Kerja
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Floating keyframes animation */}
        <style jsx global>{`
          @keyframes floatCareer {
            0% {
              transform: translateY(0) translateX(0) rotate(0deg);
            }
            50% {
              transform: translateY(-15px) translateX(10px) rotate(180deg);
            }
            100% {
              transform: translateY(0) translateX(0) rotate(360deg);
            }
          }
        `}</style>
      </div>
    </section>
  );
}
