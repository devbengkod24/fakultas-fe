"use client";
import { useState, useEffect, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ManajemenProdiPublicService } from "@/api/public/manajemen-prodi";
import type { ProdiData, ProdiCategory } from "@/types/fakultas/manajemen-prodi/manajemen-prodi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProdiCategoryResponse = {
  id: number;
  nama: string;
};

const colorMap: Record<string, { badge: string; circle: string }> = {
  blue: { badge: "bg-gradient-to-r from-primary to-primary-500 text-white", circle: "bg-blue-50" },
  orange: { badge: "bg-gradient-to-r from-orange-500 to-orange-400 text-white", circle: "bg-orange-50" },
  yellow: { badge: "bg-gradient-to-r from-yellow-500 to-yellow-400 text-white", circle: "bg-yellow-50" },
  emerald: { badge: "bg-gradient-to-r from-emerald-500 to-emerald-400 text-white", circle: "bg-emerald-50" },
};

const getColorForIndex = (index: number): string => {
  const colors = ["blue", "orange", "yellow", "emerald"];
  return colors[index % colors.length];
};

export default function ProgramStudiClient() {
  const [programsData, setProgramsData] = useState<ProdiData[]>([]);
  const [categories, setCategories] = useState<ProdiCategoryResponse[]>([]);
  const [activeTab, setActiveTab] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodiRes, categoryRes] = await Promise.all([
          ManajemenProdiPublicService.getAll({ limit: 100 }),
          ManajemenProdiPublicService.getCategories(),
        ]);

        console.log("Prodi Response:", prodiRes);
        console.log("Category Response:", categoryRes);

        // Extract categories
        const rawCategories = categoryRes?.data?.data ?? categoryRes?.data ?? categoryRes ?? [];
        const categoryList: ProdiCategoryResponse[] = Array.isArray(rawCategories) ? rawCategories : [];
        setCategories(categoryList);

        // Map prodi data with category names
        const rawProdiData = prodiRes?.data?.data ?? prodiRes?.data ?? prodiRes ?? [];
        const prodiList = Array.isArray(rawProdiData) ? rawProdiData : [];

        console.log("Prodi List:", prodiList);
        console.log("Category List:", categoryList);

        const mappedProdi = prodiList.map((prodi: ProdiData & { category?: ProdiCategory | string }) => {
          let categoryName = "";
          if (prodi.category) {
            categoryName = typeof prodi.category === "object" ? prodi.category.nama : String(prodi.category);
          } else if (prodi.category_id) {
            const foundCat = categoryList.find((c) => c.id === prodi.category_id);
            categoryName = foundCat?.nama || "";
          }
          return { ...prodi, category: categoryName };
        });

        setProgramsData(mappedProdi);
        if (categoryList.length > 0) {
          setActiveTab(categoryList[0].nama);
        }
      } catch (error) {
        console.error("Gagal mengambil data program studi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabs = useMemo(() => {
    return categories.map((c) => c.nama);
  }, [categories]);

  const filteredPrograms = useMemo(() => {
    return programsData.filter((p) => {
      const categoryName = typeof p.category === "object" ? p.category?.nama : p.category;
      return categoryName === activeTab;
    });
  }, [programsData, activeTab]);

  if (isLoading) {
    return (
      <section className="py-8 md:py-20 overflow-hidden relative bg-gradient-to-br from-[#114D91] to-primary-500">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              <span className="bg-[#F3BC45] bg-clip-text text-transparent">Program Studi</span> Fakultas<br />Ilmu Komputer <span className="bg-[#F3BC45] bg-clip-text text-transparent">UDINUS</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 h-[320px] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-20 overflow-hidden relative bg-gradient-to-br from-[#114D91] to-primary-500">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            <span className="bg-[#F3BC45] bg-clip-text text-transparent">Program Studi</span> Fakultas<br/>Ilmu Komputer <span className="bg-[#F3BC45] bg-clip-text text-transparent">UDINUS</span>
          </h2>
          <p className="text-blue-200 mt-4 text-sm md:text-base max-w-2xl mx-auto">
            Fakultas Ilmu Komputer (FIK) UDINUS menawarkan beragam program pendidikan unggulan yang telah terakreditasi nasional dan internasional.
          </p>
        </div>

        {/* Mobile Dropdown Navigation */}
        <div className="md:hidden mb-6 relative z-20 w-full">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full bg-white/10 border-white/20 text-white font-semibold h-12 rounded-xl backdrop-blur-sm shadow-sm focus:ring-[#F3BC45] data-[state=open]:bg-white/20">
              <SelectValue placeholder="Pilih Program Studi" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/20 bg-white shadow-xl">
              {tabs.map((tab) => (
                <SelectItem key={tab} value={tab} className="font-medium cursor-pointer focus:bg-slate-100 focus:text-[#114D91]">
                  {tab}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Tabs Navigation */}
        <div className="hidden md:flex border-b border-white/20 mb-10 gap-8 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-4 text-[15px] font-semibold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab ? "border-[#F3BC45] text-[#F3BC45]" : "border-transparent text-blue-200 hover:text-white hover:border-white/30"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {filteredPrograms.length === 0 ? (
            <div className="col-span-full text-center text-white py-12">
              <p className="text-blue-200">Tidak ada program studi dalam kategori ini.</p>
            </div>
          ) : (
            filteredPrograms.map((program, index) => (
              <div
                key={program.id}
                className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group md:min-h-[320px]"
              >
                {/* Decorative Background Circles */}
                <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full transition-transform duration-500 group-hover:scale-110 z-0 ${colorMap[getColorForIndex(index)].circle}`}></div>
                <div className={`absolute -bottom-8 -left-8 w-28 h-28 rounded-full transition-transform duration-500 group-hover:scale-110 z-0 ${colorMap[getColorForIndex(index)].circle}`}></div>
                
                {/* Content */}
                <div className="p-4 md:p-6 flex-grow relative z-10 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0">
                  
                  {/* Badge/Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 md:w-11 md:h-11 rounded-[0.6rem] flex items-center justify-center font-bold text-lg md:mb-5 shadow-sm ${colorMap[getColorForIndex(index)].badge}`}>
                    {program.gelar || "S1"}
                  </div>

                  {/* Text Container */}
                  <div className="flex flex-col flex-grow min-w-0">
                    <h3 className="text-[16px] md:text-xl font-bold text-slate-800 mb-1 md:mb-3 pr-2 md:pr-4 leading-snug">{program.nama}</h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed text-left md:text-justify line-clamp-2 md:line-clamp-none">
                      Program studi berkualitas dengan kurikulum terkini dan tenaga pengajar profesional.
                    </p>
                  </div>

                  {/* Mobile Arrow Link */}
                  <Link
                    href={`/prodi/${program.kode_prodi}`}
                    className="md:hidden flex-shrink-0 w-9 h-9 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 group-hover:text-primary group-hover:bg-primary-50 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Desktop Footer Link */}
                <div className="hidden md:flex p-5 border-t border-slate-100 justify-end relative z-10 bg-white/40 backdrop-blur-[2px]">
                  <Link
                    href={`/prodi/${program.kode_prodi}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#114D91] hover:text-primary-600"
                  >
                    Baca selengkapnya <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}