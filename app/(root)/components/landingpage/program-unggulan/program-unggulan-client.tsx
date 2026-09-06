"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import type { ProgramUnggulan } from "@/types/admin/program-unggulan/program-unggulan/program-unggulan";

interface Props {
  programs: ProgramUnggulan[];
}

export default function ProgramUnggulanClient({ programs }: Props) {
  // Tampilkan semua data jika < 3, atau slice 3 jika lebih
  const displayedPrograms =
    programs.length > 3 ? programs.slice(0, 3) : programs;

  return (
    <section className="py-4 md:py-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-light mb-4">
            <span className="font-semibold">Program </span>
            <span className="font-semibold bg-blue-700">
              Unggulan
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Program khusus yang dirancang untuk mempersiapkan Anda menghadapi
            industri teknologi masa depan
          </p>
        </div>

        {/* Balanced Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {displayedPrograms.map((program, index) => {
            const mainStat =
              program.statistics && program.statistics.length > 0
                ? `${program.statistics[0].pivot.value}+ ${program.statistics[0].name}`
                : "Tersedia";
            const imageUrl =
              program.image && program.image !== ""
                ? program.image
                : "/placeholder.svg";
            return (
              <div key={program.id || index}>
                <div className="relative h-full">
                  <div className="relative bg-white rounded-3xl p-6 overflow-hidden h-full flex flex-col transition-transform duration-300 shadow-sm border">
                    <div className="absolute inset-0 opacity-3">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-100 rounded-full translate-y-12 -translate-x-12"></div>
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <div className="relative w-28 h-18 rounded-2xl flex items-center justify-center border bg-white">
                          <Image
                            src={imageUrl}
                            alt={program.title}
                            width={80}
                            height={56}
                            className="object-contain drop-shadow-sm"
                            unoptimized
                          />
                          <div className="absolute inset-0 rounded-2xl border border-gray-300 transition-colors duration-300"></div>
                        </div>
                      </div>
                      <div className="flex-grow space-y-3">
                        <h3 className="text-xl font-bold text-slate-900">
                          {program.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-justify">
                          {program.short_desc}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-slate-700 font-medium text-sm">
                              {mainStat}
                            </span>
                          </div>
                          <button
                            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 border border-gray-200"
                            aria-label={`Lihat detail ${program.title}`}
                            onClick={() =>
                              (window.location.href = "/program-unggulan")
                            }
                          >
                            <ArrowRight className="w-5 h-5 text-slate-600" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="w-full h-20 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Partner</p>
                            <p className="text-sm font-medium text-gray-700">
                              {program.partner}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <button
            className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-primary-500 text-white rounded-xl font-medium hover:from-primary hover:to-primary-400 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg"
            onClick={() => (window.location.href = "/program-unggulan")}
          >
            <span>Jelajahi Semua Program</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
