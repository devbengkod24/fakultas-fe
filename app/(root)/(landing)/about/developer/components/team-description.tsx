"use client";

interface TeamDescriptionProps {
  year: string;
}

const descriptions: Record<string, { title: string; paragraphs: string[] }> = {
  "2023": {
    title: "Tim Bengkel Koding 2023",
    paragraphs: [
      "Tim developer kami terdiri dari mahasiswa berbakat Program Studi Teknik Informatika angkatan 2023 yang terbagi dalam 5 aplikasi utama: FIK General, Tugas Akhir, Kerja Praktek, Bimbingan Karir, dan Early Warning System.",
      "Dengan konsep multi-tenant untuk Fakultas Ilmu Komputer, setiap aplikasi dikembangkan untuk melayani berbagai Program Studi di bawah naungan FIK UDINUS. Tim yang terdiri dari Frontend dan Backend Developer bekerja sama secara sinergis.",
      "FIK General menyediakan infrastruktur umum yang mendukung seluruh ekosistem aplikasi FIK, sedangkan Early Warning System (EWS) menjadi aplikasi unggulan yang membantu memantau kondisi akademik mahasiswa secara real-time.",
    ],
  },
  "2022": {
    title: "Tim Bengkel Koding 2022",
    paragraphs: [
      "Tim developer kami terdiri dari mahasiswa berbakat Program Studi Teknik Informatika yang terbagi dalam 5 aplikasi utama: Tugas Akhir, Kerja Praktek, Bimbingan Karir, Alumni, dan STI General.",
      "Setiap aplikasi dikembangkan oleh tim yang terdiri dari Frontend dan Backend Developer yang bekerja sama secara sinergis. Dengan pembagian peran yang jelas antara Frontend dan Backend Developer, setiap aplikasi dapat dikembangkan dengan fokus yang optimal.",
      "Kolaborasi antar tim aplikasi juga memungkinkan sharing knowledge dan best practices, sehingga menghasilkan ekosistem aplikasi yang terintegrasi dan berkualitas tinggi untuk mendukung kebutuhan Program Studi Teknik Informatika.",
    ],
  },
};

export default function TeamDescription({ year }: TeamDescriptionProps) {
  const data = descriptions[year] || descriptions["2023"];

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-primary-500/5 rounded-full -z-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 md:w-96 md:h-96 bg-orange-500/5 rounded-full -z-10 blur-3xl"></div>

          {/* Header */}
          <div className="mb-4 md:mb-6 pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-1 w-6 md:w-10 bg-primary-600 rounded-full"></div>
              <h3 className="text-primary-600 font-semibold text-sm md:text-base">
                TENTANG TIM
              </h3>
              <div className="h-1 w-6 md:w-10 bg-primary-600 rounded-full"></div>
            </div>
            <h2 className="text-xl md:text-2xl text-center font-semibold text-gray-800">
              {data.title}
            </h2>
          </div>

          {/* Description paragraphs */}
          <div className="space-y-4 md:space-y-5">
            {data.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-gray-700 leading-relaxed text-sm md:text-base text-justify"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
