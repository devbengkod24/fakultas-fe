"use client";

import Image from "next/image";
import type { Akreditasi } from "@/types/admin/profile-page/akreditasi/akreditasi";

interface AkreditasiClientProps {
  akreditasi: Akreditasi[];
}

const AkreditasiClient = ({ akreditasi }: AkreditasiClientProps) => {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {akreditasi.map((item, index) => (
        <div key={item.id || index} className="group">
          <div className="overflow-hidden rounded-xl shadow-md border bg-white p-3 sm:p-4 transition-all duration-300 hover:shadow-lg hover:scale-102 hover:-translate-y-2">
            <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden rounded-lg hover:scale-105 transition-transform duration-300">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay hanya muncul saat hover */}
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <div className="text-center p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-4 inline-block px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-semibold">
                    {item.accred}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 p-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 hover:text-blue-500 transition-colors duration-200">
                  {item.title}
                </h3>
                <span className="px-2 sm:px-3 py-1 rounded-full bg-primary-100 text-primary-500 text-xs font-bold hover:scale-110 hover:bg-blue-500 hover:text-white transition-all duration-200">
                  {item.accred}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AkreditasiClient;
