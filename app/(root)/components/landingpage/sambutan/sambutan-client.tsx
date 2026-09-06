"use client";

import { useEffect, useState } from "react";
import { Quote, ArrowRight } from "lucide-react";
import { SambutanFakultasService } from "@/api/fakultas";
import type { SambutanDekan } from "@/types/admin-fakultas/sambutan-dekan/sambutan-dekan";
import { sanitizeHtml } from "@/lib/sanitize-html";

const SambutanClient = () => {
  const [data, setData] = useState<SambutanDekan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await SambutanFakultasService.getAllSambutan();
        const result = response.data?.data || response.data || response;

        const sambutanData = Array.isArray(result) ? result[0] : result;

        if (sambutanData) {
          setData(sambutanData);
        }
      } catch (error) {
        console.error("Gagal mengambil data sambutan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section className="py-5 md:py-4">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4">
          <div className="bg-[#F3F5F8] rounded-[2.5rem] p-8 md:p-12 lg:p-16 h-[500px] flex items-center justify-center animate-pulse">
            <span className="text-primary font-medium">
              Memuat Sambutan Dekan...
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const Dekan = {
    name: data.name || "Dekan FIK",
    jabatan: "Dekan Fakultas Ilmu Komputer",
    image: data.image || "/assets/landingpage/img/dosen/dekan.png",
    quote:
      '"FIK UDINUS berperan penting dalam mencetak generasi muda yang inovatif, berdaya saing, dan siap menghadapi perkembangan teknologi."',
    paragraph: data.paragraph || "",
  };

  return (
    <section className="py-8 md:py-20 overflow-hidden relative ">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="relative">
          
          {/* BAGIAN ATAS: MOTTO (Tengah) */}
          <div className="w-full flex flex-col items-center justify-center text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              FIK UDINUS <br />
              <span className="text-secondary text-2xl md:text-3xl lg:text-4xl">Semangat, Inovatif, Unggul!</span>
            </h2>
          </div>

          {/* BAGIAN BAWAH: GRID KIRI (Foto) & KANAN (Teks) */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* KOLOM KIRI - Foto */}
            <div className="lg:col-span-5 flex flex-col w-full max-w-md mx-auto">
              
              {/* Foto Dekan */}
              <div className="relative h-[320px] md:h-[450px] lg:h-[500px] w-full mb-10">
                <div className="absolute inset-0 bg-[#F3F5F8] shadow-sm rounded-full"></div>
                <div className="relative w-full h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={Dekan.image}
                    alt={Dekan.name}
                    className="w-full h-full object-contain object-bottom drop-shadow-md z-10 absolute inset-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).onerror = null;
                      (e.target as HTMLImageElement).src =
                        "/assets/landingpage/img/dosen/dekan.png";
                    }}
                  />
                </div>

                {/* Lencana Nama */}
                <div className="absolute -bottom-6 left-0 right-0 z-20 mx-auto w-[95%] bg-primary text-white rounded-xl py-3 px-4 text-center shadow-lg">
                  <h3 className="font-semibold text-sm md:text-base">
                    {Dekan.name}
                  </h3>
                  <p className="text-primary-100 text-xs mt-0.5">
                    {Dekan.jabatan}
                  </p>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN - Header, Kutipan, Paragraf, CTA */}
            <div className="lg:col-span-7 flex flex-col">
              
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-secondary"></div>
                <span className="text-primary font-bold text-base uppercase tracking-wider">
                  Sambutan Dekan
                </span>
                <Quote className="w-4 h-4 text-secondary" />
              </div>

              {/* Paragraf Dinamis */}
              <div className="space-y-4 text-slate-600 leading-relaxed text-justify text-sm md:text-base mb-4">
                <div
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(Dekan.paragraph) }}
                  className="prose prose-slate max-w-none text-justify"
                />
              </div>

              {/* Kutipan */}
              <div className="w-full border-l-4 border-secondary pl-5 py-2 mb-6">
                <p className="text-lg md:text-xl text-primary font-medium italic leading-relaxed">
                  {Dekan.quote}
                </p>
              </div>

              {/* Tombol CTA */}
              <div className="pt-6 flex justify-center lg:justify-end">
                <button
                  className="group inline-flex w-full md:w-auto justify-center items-center gap-3 px-8 py-3.5 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 ease-out shadow-md hover:shadow-lg hover:-translate-y-1"
                  onClick={() => (window.location.href = "/profil")}
                >
                  <span>Pelajari Lebih Lanjut</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SambutanClient;
