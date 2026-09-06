"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BeritaItem } from "../berita-kegiatan-client";
import { sanitizeHtml } from "@/lib/sanitize-html";

interface AllNewsListProps {
  berita: BeritaItem[];
}

export default function AllNewsList({ berita }: AllNewsListProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  if (!berita || berita.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {berita.map((item) => (
        <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
          
          <div className="relative h-56 w-full overflow-hidden">
            <Image 
              src={item.image || "/placeholder.svg"} 
              alt={item.title}
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#114D91] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              {item.category}
            </div>
          </div>

          <div className="p-6 flex flex-col flex-grow">
            <p className="text-xs text-slate-500 mb-2">{formatDate(item.date)}</p>
            <h4 className="font-bold text-slate-900 text-lg mb-3 leading-snug line-clamp-2 group-hover:text-[#114D91] transition-colors">
              {item.title}
            </h4>
            <div 
              className="text-sm text-slate-600 mb-6 flex-grow leading-relaxed line-clamp-3 text-justify"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.excerpt || "") }}
            />
            
            <div className="mt-auto flex justify-end pt-2 border-t border-slate-100">
              <Link href={`/berita/${item.id}`} className="inline-flex items-center gap-2 text-[#114D91] font-medium text-sm hover:text-blue-800 transition-colors mt-4">
                Baca Selengkapnya <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}