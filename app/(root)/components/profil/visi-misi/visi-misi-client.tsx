"use client";

import { useEffect, useMemo, useState } from "react";
import { VisiMisiFakultasService } from "@/api/fakultas";
import type { VisiMisi } from "@/types/fakultas/profile-page/visi-misi/visi-misi";
import VisiMisiSkeleton from "./visi-misi-skeleton";
import { sanitizeHtml } from "@/lib/sanitize-html";

const VisiMisiClient = () => {
  const [data, setData] = useState<VisiMisi | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await VisiMisiFakultasService.getAllVisiMisi();
        const result = response.data?.data || response.data || response;

        const visiMisiData = Array.isArray(result) ? result[0] : result;

        if (visiMisiData) {
          setData(visiMisiData);
        }
      } catch (error) {
        console.error("Gagal mengambil data Visi Misi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const { misiItems, misiIsList, misiRawHtml } = useMemo(() => {
    const html = Array.isArray(data?.misi)
      ? (data?.misi as string[]).join("")
      : data?.misi || "";
    if (typeof window === "undefined") {
      return { misiItems: [html], misiIsList: false, misiRawHtml: html };
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const listItems = doc.querySelectorAll("li");
    if (listItems.length > 1) {
      return {
        misiItems: Array.from(listItems).map((li) => li.innerHTML),
        misiIsList: true,
        misiRawHtml: html,
      };
    }
    return { misiItems: [html], misiIsList: false, misiRawHtml: html };
  }, [data]);

  if (isLoading) {
    return <VisiMisiSkeleton />;
  }

  if (!data) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#114D91] to-primary-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 md:w-12 bg-white/40"></div>
            <span className="text-blue-200 font-bold text-xs md:text-sm tracking-widest uppercase">
              Arah & Tujuan
            </span>
            <div className="h-px w-8 md:w-12 bg-white/40"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            <span className="bg-[#F3BC45] bg-clip-text text-transparent">
              Visi &{" "}
            </span>
            <span className="text-white">Misi</span>
          </h2>
        </div>

        <div className="flex flex-col gap-6 lg:gap-8 items-stretch">          
          {/* Visi Card */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl font-bold text-[#0f2441] group-hover:text-[#114D91] transition-colors">
                  Visi
                </h3>
              </div>
              <div className="w-12 h-1.5 bg-[#F3BC45] rounded-full"></div>
            </div>
            <div className="text-sm md:text-base text-slate-600 text-justify leading-relaxed">
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(Array.isArray(data.visi)
                    ? data.visi.join("")
                    : data.visi || ""),
                }}
              />
            </div>
          </div>

          {/* Misi Card */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl font-bold text-[#0f2441] group-hover:text-[#114D91] transition-colors">
                  Misi
                </h3>
              </div>
              <div className="w-12 h-1.5 bg-[#F3BC45] rounded-full"></div>
            </div>
            {misiIsList ? (
              <ul className="space-y-4 text-sm md:text-base text-slate-600 text-justify leading-relaxed">
                {misiItems.map((item, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F3BC45] flex-shrink-0" />
                    <span
                      className="flex-1"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(item) }}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div
                className="text-sm md:text-base text-slate-600 text-justify leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(misiRawHtml) }}
              />
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default VisiMisiClient;