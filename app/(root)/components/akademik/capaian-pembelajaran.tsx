"use client";

import { Target, CheckCircle, Star } from "lucide-react";

const CapaianPembelajaran = [
  {
    kode: "CPL01",
    deskripsi:
      "Bertakwa kepada Tuhan Yang Maha Esa, taat hukum, dan disiplin dalam kehidupan bermasyarakat dan bernegara.",
  },
  {
    kode: "CPL02",
    deskripsi:
      "Menunjukkan sikap profesional dalam bentuk kepatuhan pada etika profesi, kemampuan bekerjasama dalam tim multidisiplin, pemahaman tentang pembelajaran sepanjang hayat, dan respon terhadap isu sosial dan perkembangan teknologi.",
  },
  {
    kode: "CPL03",
    deskripsi:
      "Mampu menjelaskan cara kerja sistem komputer dan mampu menerapkan/menggunakan berbagai algoritma/metode untuk memecahkan masalah pada suatu organisasi.",
  },
  {
    kode: "CPL04",
    deskripsi:
      "Mampu menganalisis persoalan computing yang kompleks untuk mengidentifikasi solusi pengelolaan proyek teknologi bidang informatika dengan mempertimbangkan wawasan perkembangan ilmu transdisiplin.",
  },
  {
    kode: "CPL05",
    deskripsi:
      "Mampu menjelaskan konsep teoritis bidang pengetahuan Informatika dalam mendesain, mengimplementasi, dan mengevaluasi solusi berbasis computing multi-platform yang memenuhi kebutuhan-kebutuhan computing pada sebuah organisasi.",
  },
  {
    kode: "CPL06",
    deskripsi:
      "Memiliki kemampuan manajerial tim dan kerja sama (team work), manajemen diri, mampu berkomunikasi baik lisan maupun tertulis dengan baik dan mampu melakukan presentasi.",
  },
  {
    kode: "CPL07",
    deskripsi:
      "Menyusun deskripsi saintifik hasil kajian implikasi pengembangan atau implementasi ilmu pengetahuan teknologi dalam bentuk skripsi atau laporan tugas akhir atau artikel ilmiah.",
  },
  {
    kode: "CPL08",
    deskripsi:
      "Mampu mengimplementasikan kebutuhan computing dengan mempertimbangkan berbagai metode/algoritma yang sesuai.",
  },
  {
    kode: "CPL09",
    deskripsi:
      "Mampu menganalisis, merancang, membuat, dan mengevaluasi user interface dan aplikasi interaktif dengan mempertimbangkan kebutuhan pengguna dan perkembangan ilmu transdisiplin.",
  },
  {
    kode: "CPL10",
    deskripsi:
      "Mampu membangun dan mengimplementasi solusi berbasis sistem cerdas sesuai dengan kebutuhan pengguna dan perkembangan ilmu pengetahuan.",
  },
  {
    kode: "CPL11",
    deskripsi:
      "Mampu mendesain solusi berbasis inovasi dan kreatifitas untuk menjadi seorang wirausaha di bidang teknologi informasi.",
  },
];

const CapaianPembelajaranComponent = () => {
  return (
    <div className="max-w-6xl mx-auto ">
      {/* Desktop Table View */}
      <div className="hidden md:block border bg-white rounded-2xl hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-primary to-primary-500 text-white">
                <th className="py-4 px-6 text-left font-semibold w-24 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Kode
                </th>
                <th className="py-4 px-6 text-left font-semibold">Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {CapaianPembelajaran.map((item, index) => (
                <tr
                  key={index}
                >
                  <td className="py-4 px-6 border-b border-gray-200">
                    <span className="font-medium text-primary-600 px-3 py-1 bg-primary-100 rounded-full text-sm flex items-center w-fit">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {item.kode}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200 text-sm lg:text-base">
                    <p>{item.deskripsi}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {CapaianPembelajaran.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            <div className="bg-gradient-to-r from-primary to-primary-500 px-4 py-3">
              <h3 className="text-white font-semibold text-lg flex items-center">
                <Star className="w-5 h-5 mr-2" />
                {item.kode}
              </h3>
            </div>
            <div className="p-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {item.deskripsi}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CapaianPembelajaranComponent;
