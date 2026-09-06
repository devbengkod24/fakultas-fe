"use client";

import type { VisiMisi } from "@/types/admin/profile-page/visi-misi/visi-misi";
import { sanitizeHtml } from "@/lib/sanitize-html";

interface Props {
  deskripsi: string;
  visiMisi: VisiMisi;
  prodiNama?: string;
}

const stripHtmlTags = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
};

const bgPatternCircle = {
  backgroundImage:
    'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="none" stroke="%23fff" stroke-width="2"/></svg>\')',
  backgroundSize: "40px 40px",
};

const bgPatternRect = {
  backgroundImage:
    'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="25" y="25" width="50" height="50" fill="none" stroke="%23fff" stroke-width="2"/></svg>\')',
  backgroundSize: "35px 35px",
};

const ProfilProgramStudiClient = ({ deskripsi, visiMisi, prodiNama }: Props) => {
  return (
    <div className="flex flex-col gap-12 max-w-6xl mx-auto py-8">
      {/* ── Deskripsi ── */}
      <div className="relative bg-prodi-subtle rounded-3xl px-8 py-12 sm:px-12 sm:py-16 overflow-hidden group">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-prodi-start/10 rounded-full blur-3xl group-hover:bg-prodi-start/20 transition-all duration-700" />
        <div className="absolute top-8 left-8 hidden sm:block">
          <svg width="40" height="32" viewBox="0 0 36 30" fill="none" className="text-primary-600">
            <path d="M0 30V18.75C0 13.75 1.375 9.625 4.125 6.375C6.875 3.125 10.75 1 15.75 0L17.25 2.625C14.75 3.375 12.75 4.75 11.25 6.75C9.75 8.75 9 11 9 13.5H15.75V30H0ZM19.5 30V18.75C19.5 13.75 20.875 9.625 23.625 6.375C26.375 3.125 30.25 1 35.25 0L36.75 2.625C34.25 3.375 32.25 4.75 30.75 6.75C29.25 8.75 28.5 11 28.5 13.5H35.25V30H19.5Z" fill="currentColor" />
          </svg>
        </div>

        <div
          className="relative text-gray-700 leading-relaxed text-center px-4 sm:px-16 font-medium [&_p]:!text-xs [&_p]:sm:!text-sm"
          style={{ fontSize: "0.75rem" }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(deskripsi || "Deskripsi program studi belum tersedia.") }}
        />

        <div className="absolute bottom-8 right-8 hidden sm:block">
          <svg width="40" height="32" viewBox="0 0 36 30" fill="none" className="text-primary-600 rotate-180">
            <path d="M0 30V18.75C0 13.75 1.375 9.625 4.125 6.375C6.875 3.125 10.75 1 15.75 0L17.25 2.625C14.75 3.375 12.75 4.75 11.25 6.75C9.75 8.75 9 11 9 13.5H15.75V30H0ZM19.5 30V18.75C19.5 13.75 20.875 9.625 23.625 6.375C26.375 3.125 30.25 1 35.25 0L36.75 2.625C34.25 3.375 32.25 4.75 30.75 6.75C29.25 8.75 28.5 11 28.5 13.5H35.25V30H19.5Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* ── Visi & Misi ── */}
      <div className="max-w-6xl mx-auto w-full">
        {/* Title Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 tracking-tight leading-tight">Visi & Misi</h2>
            <div className="flex items-center justify-center pt-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
              <div className="w-1.5 h-1.5 bg-prodi-start rounded-full mx-4 shadow-prodi-start/50 hover:scale-150 transition-transform duration-300"></div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full">
          {/* Visi Section */}
          <div className="w-full">
            <div className="bg-gradient-to-r from-prodi-start to-prodi-end py-4 sm:py-6 px-4 sm:px-6 md:px-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={bgPatternCircle}></div>
              <h3 className="text-xl sm:text-2xl font-bold text-white relative z-10">VISI</h3>
            </div>
            <div className="p-4 sm:p-6 md:p-8 border-b border-gray-100">
              <div 
                className="text-sm sm:text-base md:text-base text-justify leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(visiMisi?.visi || "Visi belum tersedia.") }}
              />
            </div>
          </div>

          {/* Misi Section */}
          <div className="w-full">
            <div className="bg-gradient-to-r from-prodi-start to-prodi-end py-4 sm:py-6 px-4 sm:px-6 md:px-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={bgPatternRect}></div>
              <h3 className="text-xl sm:text-2xl font-bold text-white relative z-10">MISI</h3>
            </div>
            <div className="p-4 sm:p-6 md:p-8">
              <div className="text-sm sm:text-base md:text-base text-justify leading-relaxed prose prose-blue max-w-none text-gray-700">
                {Array.isArray(visiMisi?.misi) && visiMisi.misi.length > 0 ? (
                  visiMisi.misi.map((item, index) => (
                    <div key={index} className="mb-2 last:mb-0 flex items-start">
                      <span className="font-bold mr-1 shrink-0">{index + 1}.</span>
                      <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(item) }} />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">Misi belum tersedia.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilProgramStudiClient;
