"use client";

import type { Pengertian } from "@/types/admin/profile-page/pengertian/pengertian";

interface PengertianClientProps {
  pengertian: Pengertian | null;
}

const PengertianClient = ({ pengertian }: PengertianClientProps) => {
  // Function to strip HTML tags from text
  const stripHtmlTags = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="bg-gradient-to-r from-primary to-primary-500 py-4 sm:py-6 px-4 sm:px-6 md:px-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,0 100,50 50,100 0,50" fill="%23fff" opacity="0.1"/></svg>\')',
            backgroundSize: "30px 30px",
          }}
        />

        <h3 className="text-xl sm:text-2xl font-bold text-white relative z-10">
          Pengertian
        </h3>
      </div>

      <div className="p-4 sm:p-6 md:p-8 border-b border-gray-100">
        <p className="text-sm sm:text-base md:text-base text-justify leading-relaxed">
          {pengertian?.pengertian ? stripHtmlTags(pengertian.pengertian) : ""}
        </p>
      </div>
    </div>
  );
};

export default PengertianClient;
