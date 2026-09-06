"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CTAClient() {
  return (
    <section className="py-8 md:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/landingpage/img/background/udinus-overlay.png"
              alt="Gedung UDINUS"
              fill
              className="object-cover object-center"
              quality={90}
            />
            {/* overlay */}
            <div className="absolute inset-0 bg-[#0F172A]/25 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 via-[#0F172A]/30 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 px-6 py-16 md:py-24 flex flex-col items-center text-center w-full">
            
            {/* Badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[2px] w-6 bg-yellow-500"></div>
              <span className="text-yellow-500 font-bold text-xs md:text-sm uppercase tracking-widest">
                Penerimaan Mahasiswa Baru
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl drop-shadow-md">
              Siap Bergabung dengan <br className="hidden md:block" /> FIK UDINUS?
            </h2>

            {/* Subtitle */}
            <p className="text-slate-200 text-base md:text-lg mb-10 max-w-2xl font-light drop-shadow-sm">
              Jadilah bagian dari komunitas digital yang inovatif dan berdampak. Pendaftaran mahasiswa baru sudah dibuka!
            </p>

            {/* Button */}
            <Link 
              href="https://pmb.dinus.ac.id/"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20"
            >
              Daftar Sekarang
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

          </div>
        </div>
        
      </div>
    </section>
  );
}