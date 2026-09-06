"use client";

import { useEffect, useState } from "react";
import { BookCheck, Briefcase, GraduationCap } from "lucide-react";

const quotes = [
  {
    text: "Pendidikan adalah senjata paling ampuh yang dapat Anda gunakan untuk mengubah dunia.",
    author: "Nelson Mandela",
  },
  {
    text: "Jangan takut akan kegagalan. Ini adalah bagian penting dari perjalanan menuju keberhasilan.",
    author: "Barack Obama",
  },
  {
    text: "Semua impian dapat terwujud jika kita memiliki keberanian untuk mengejarnya.",
    author: "Walt Disney",
  },
  {
    text: "Pressure Is A Privilege",
    author: "UG-23",
  },
];

export function AppShowcase() {
  const [activeAppIndex, setActiveAppIndex] = useState(0);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [isQuoteFading, setIsQuoteFading] = useState(false);

  const stiApps = [
    {
      name: "Tugas Akhir",
      icon: BookCheck,
      color: "bg-orange-500",
      description: "Kelola progres dan data Tugas Akhir mahasiswa dengan mudah dan terstruktur!",
    },
    {
      name: "Kerja Praktek",
      icon: Briefcase,
      color: "bg-blue-500",
      description: "Atur dan pantau pelaksanaan Kerja Praktek mahasiswa secara efisien!",
    },
    {
      name: "Bimbingan Karir",
      icon: GraduationCap,
      color: "bg-yellow-500",
      description: "Kelola kegiatan bimbingan karir seperti seminar, workshop, dan lainnya secara praktis!",
    },
  ];

  // Auto-rotate carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAppIndex((prev) => (prev === stiApps.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [stiApps.length]);

  // Auto-rotate quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsQuoteFading(true);
      setTimeout(() => {
        setActiveQuoteIndex((prev) => (prev + 1) % quotes.length);
        setIsQuoteFading(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-[#114D91] to-primary-500 p-12 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 h-full flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-4">
            Fakultas Ilmu Komputer
          </h2>
          <p className="mb-6 opacity-90">Universitas Dian Nuswantoro</p>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 shadow-xl mb-8">
            <p className={`text-sm leading-relaxed transition-opacity duration-300 ${isQuoteFading ? "opacity-0" : "opacity-100"}`}>
              &quot;{quotes[activeQuoteIndex].text}&quot;
            </p>
            <p className={`text-xs mt-2 text-right italic transition-opacity duration-300 ${isQuoteFading ? "opacity-0" : "opacity-100"}`}>
              - {quotes[activeQuoteIndex].author}
            </p>
          </div>
        </div>

        <div className="w-full">
          <div className="relative h-24 overflow-hidden">
            {stiApps.map((app, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${index === activeAppIndex
                    ? "translate-x-0 opacity-100"
                    : index < activeAppIndex
                      ? "-translate-x-full opacity-0"
                      : "translate-x-full opacity-0"
                  }`}
              >
                <div className="flex items-center">
                  <div
                    className={`${app.color} w-14 h-12 rounded-lg flex items-center justify-center mr-4 shadow-lg`}
                  >
                    <app.icon />
                  </div>
                  <div>
                    <h4
                      className="font-bold text-lg"
                    >
                      {app.name}
                    </h4>
                    <p className="text-sm text-white/80">{app.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-2">
            {stiApps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveAppIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === activeAppIndex
                    ? "bg-white scale-125"
                    : "bg-white/30"
                  }`}
                aria-label={`Go to app ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
