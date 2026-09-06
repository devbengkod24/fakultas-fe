"use client";

import {
  Briefcase,
  TrendingUp,
  Code2,
  Sparkles,
  Gamepad2,
  Server,
  Cpu,
  Wifi,
} from "lucide-react";

const ProfilLulusan = {
  deskripsi: [
    {
      kode: "PL01",
      deskripsi:
        "Lulusan memiliki kemampuan menganalisis persoalan computing serta menerapkan prinsip-prinsip computing dan disiplin ilmu relevan lainnya untuk mengidentifikasi solusi bagi organisasi.",
    },
    {
      kode: "PL02",
      deskripsi:
        "Lulusan memiliki kemampuan mendesain, mengimplementasi dan mengevaluasi solusi berbasis computing yang memenuhi kebutuhan pengguna dengan pendekatan yang sesuai.",
    },
    {
      kode: "PL03",
      deskripsi:
        "Lulusan memiliki kemampuan berpikir logis, kritis serta sistematis dalam memanfaatkan ilmu pengetahuan informatika untuk menyelesaikan masalah nyata.",
    },
    {
      kode: "PL04",
      deskripsi:
        "Lulusan memiliki kemampuan menunjukkan sikap: religius, disiplin, bertanggung jawab, menjunjung tinggi nilai kemanusiaan, saling menghormati, dan taat hukum dalam kehidupan bermasyarakat, berbangsa dan bernegara berdasarkan nilai-nilai Pancasila.",
    },
    {
      kode: "PL05",
      deskripsi:
        "Lulusan memiliki kemampuan menganalisis kebutuhan dan mendesain solusi menggunakan teknologi informasi dan komunikasi untuk menjalankan bisnis secara digital.",
    },
  ],
  profesiLulusan: [
    { name: "Software Engineer", icon: Code2 },
    { name: "Network Engineer", icon: Wifi },
    { name: "IOT Engineer", icon: Cpu },
    { name: "System Administrator", icon: Server },
    { name: "AI Developer", icon: Sparkles },
    { name: "Game Developer", icon: Gamepad2 },
  ],
};

const ProfesiLulusan = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-primary to-primary-500 text-white">
                <th className="py-4 px-6 text-left font-semibold w-24">Kode</th>
                <th className="py-4 px-6 text-left font-semibold">Deskripsi</th>
                <th className="py-4 px-6 text-left font-semibold w-64">
                  Profesi Lulusan
                </th>
              </tr>
            </thead>
            <tbody>
              {ProfilLulusan.deskripsi.map((item, index) => (
                <tr key={index}>
                  <td className="py-4 px-6 border-b border-gray-200">
                    <span className="font-medium text-primary-600 px-3 py-1 bg-primary-100 rounded-full text-sm">
                      {item.kode}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200 text-sm">
                    <p>{item.deskripsi}</p>
                  </td>
                  {index === 0 && (
                    <td
                      className="py-4 px-6 border-b border-gray-200"
                      rowSpan={5}
                    >
                      <div className="space-y-3">
                        {ProfilLulusan.profesiLulusan.map((profesi, i) => {
                          const IconComponent = profesi.icon;
                          return (
                            <div
                              key={i}
                              className="flex items-center p-3 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                            >
                              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center mr-3">
                                <IconComponent className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm font-medium text-gray-800">
                                {profesi.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile and Tablet Card View */}
      <div className="lg:hidden space-y-6">
        {/* Profile Descriptions */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Briefcase className="w-6 h-6 mr-2 text-primary-600" />
            Profil Lulusan
          </h3>
          <div className="space-y-4">
            {ProfilLulusan.deskripsi.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-4 py-3">
                  <h4 className="text-white font-semibold text-lg">
                    {item.kode}
                  </h4>
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

        {/* Career Prospects */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="bg-gradient-to-r from-green-600 to-green-800 px-4 py-3">
            <h3 className="text-white font-semibold text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Prospek Karir Lulusan
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ProfilLulusan.profesiLulusan.map((profesi, i) => {
                const IconComponent = profesi.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mr-3">
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {profesi.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfesiLulusan;
