"use client";

import { useState } from "react";
import Image from "next/image";
import type { SambutanKaprodi as SambutanType } from "@/types/admin/landing-page/sambutan-kaprodi/sambutan-kaprodi";
import { sanitizeHtml } from "@/lib/sanitize-html";

interface SambutanClientProps {
  sambutan: SambutanType;
  slogan?: string;
  prodiNama?: string;
}

const SambutanClient = ({ sambutan, slogan, prodiNama }: SambutanClientProps) => {
  const [imgError, setImgError] = useState(false);
  const photoSrc =
    !imgError &&
      (sambutan.image || (sambutan as any).photo) &&
      (sambutan.image || (sambutan as any).photo).trim() !== ""
      ? sambutan.image || (sambutan as any).photo
      : "/assets/landingpage/img/default-kaprodi.png";
  const displayQuote = slogan || (sambutan as any).quote || `Membangun Masa Depan Unggul Bersama Program Studi ${prodiNama || ""}`;
  const displayParagraph = sambutan.paragraph || (sambutan as any).message;

  return (
    <div className="max-w-6xl mx-auto py-10 md:py-16 px-6 md:px-10 overflow-hidden bg-prodi-subtle rounded-2xl">
      <div className="px-2 sm:px-6">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-center">

          {/* ── Photo Side ── */}
          <div className="relative md:col-span-1">
            <div className="relative h-[400px] max-w-sm mx-auto group">
              <div className="absolute inset-0 bg-white rounded-full transition-all duration-700 ease-out" />
              <div className="relative h-full">
                <Image
                  src={photoSrc}
                  alt={sambutan.name || "Ketua Program Studi"}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain object-bottom"
                  onError={() => setImgError(true)}
                />
                <div className="absolute bottom-0 left-0 right-0">
                  <div className="bg-gradient-to-r from-prodi-start to-prodi-end text-white rounded-xl w-full">
                    <div className="px-4 py-3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                      <div className="relative z-10">
                        <h3 className="font-semibold text-sm text-center">
                          {sambutan.name || "Ketua Program Studi"}
                        </h3>
                        <p className="text-white/80 text-xs text-center">Ketua Program Studi</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Text Side ── */}
          <div className="space-y-5 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-4 bg-slate-400" />
              <span className="text-prodi-start font-bold text-xs uppercase tracking-widest">Sambutan</span>
            </div>

            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-prodi-start to-prodi-end bg-clip-text text-transparent">
              &ldquo;{displayQuote}&rdquo;
            </span>

            <div className="text-slate-600 text-sm leading-relaxed text-justify">
              {displayParagraph ? (
                <div
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(displayParagraph) }}
                  className="prose prose-slate max-w-none"
                />
              ) : (
                <p className="text-slate-600 italic">
                  Pesan sambutan dari Ketua Program Studi sedang dalam proses pengkinian data resmi.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SambutanClient;
