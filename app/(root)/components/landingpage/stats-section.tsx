"use client";

import { Users, Award, Building, Briefcase } from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "15,000+",
    label: "Alumni Sukses",
    description: "Di berbagai perusahaan teknologi",
    color: "primary",
    gradient: "from-primary to-primary-500",
    bgGradient: "from primary-10 to-primary-100",
  },
  {
    icon: Award,
    number: "95%",
    label: "Tingkat Kelulusan",
    description: "Dengan IPK di atas 3.0",
    color: "yellow",
    gradient: "from-orange-500 to-orange-400",
    bgGradient: "from-orange-50 to-orange-100",
  },
  {
    icon: Building,
    number: "150+",
    label: "Mitra Industri",
    description: "Perusahaan dan startup teknologi",
    color: "purple",
    gradient: "from-yellow-500 to-yellow-400",
    bgGradient: "from-yellow-50 to-yellow-100",
  },
  {
    icon: Briefcase,
    number: "90%",
    label: "Penempatan Kerja",
    description: "Dalam 6 bulan setelah lulus",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
  },
];

export default function StatsSection() {


  return (
    <section
      id="stats-section"
      className="py-8 md:py-20 bg-white overflow-hidden relative"
    >
      {/* Background Decorative Elements */}

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        {/* Header */}
        <div
          className={`text-center mb-16`}
        >
          <h2
            className="text-4xl font-light text-slate-900 mb-4 "
          >
            <span className="font-semibold">Prestasi yang</span>{" "}
            <span className="font-semibold bg-blue-700">
              Membanggakan
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Angka-angka yang menunjukkan komitmen kami dalam menghasilkan
            lulusan berkualitas
          </p>
        </div>

        {/* Stats Grid - Creative Layout */}
        <div className="relative">
          {/* Main Stats Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 items-center">
            {stats.map((stat, index) => {
              const StatIcon = stat.icon;

              return (
                <div
                  key={index}
                  className={`group cursor-pointer}`}
                >
                  <div
                    className={`relative bg-white backdrop-blur-sm rounded-3xl p-8`}
                  >
                    {/* Gradient Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-3xl opacity-0`}
                    ></div>

                    {/* Floating Icon */}
                    <div className="relative z-10 mb-6">
                      <div
                        className={`w-20 h-20 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto`}
                      >
                        <StatIcon className="w-10 h-10 text-white" />
                      </div>

                      {/* Floating Accent */}
                      
                    </div>

                    {/* Content */}
                    <div className="relative z-10 text-center space-y-4">
                      <div
                        className={`text-4xl md:text-5xl font-bold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}
                      >
                        {stat.number}
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 transition-colors duration-300 group-hover:text-slate-800">
                          {stat.label}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed transition-colors duration-300 group-hover:text-slate-700">
                          {stat.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="relative z-10 mt-6">
                      <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                        <div
                          className={`h-1 bg-gradient-to-r ${
                            stat.gradient
                          }`}
                        ></div>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 ease-out blur-sm`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Achievement Badge */}
        <div
          className={`text-center mt-16`}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border rounded-full shadow-md">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-500 rounded-full flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-700 font-medium">
              Terakreditasi Unggul oleh BAN-PT
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
