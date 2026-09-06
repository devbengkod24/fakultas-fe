"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { ChevronDown, Clock, Star, Zap, Shield, BookOpen } from "lucide-react";
import {
  MataKuliahPeminatanSuperAdminService,
  PeminatanSuperAdminService,
} from "@/api/superadmin";
import type {
  MataKuliahPeminatanItem,
  Peminatan,
} from "@/types/admin/akademik-page/mata-kuliah-peminatan/mata-kuliah-peminatan";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorStateMataKuliah from "./error-state-mata-kuliah";
import EmptyStateMataKuliah from "./empty-state-mata-kuliah";

interface PeminatanData {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  matkul: MataKuliahPeminatanItem[];
  peminatanName: string;
}

// Static icon mapping for each peminatan
const peminatanConfig = {
  RPLD: { icon: Zap, color: "from-primary to-primary-500" },
  "Sistem Cerdas": { icon: Star, color: "from-primary to-primary-500" },
  SKKKD: { icon: Shield, color: "from-primary to-primary-500" },
};

const MataKuliahPeminatan = () => {
  const [activePeminatan, setActivePeminatan] = useState("peminatan-0");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [peminatanData, setPeminatanData] = useState<PeminatanData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPeminatanData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First, get all peminatan
      const peminatanResponse = await PeminatanSuperAdminService.getPeminatan();

      if (peminatanResponse.success && peminatanResponse.data) {
        const peminatanList = Array.isArray(peminatanResponse.data)
          ? peminatanResponse.data
          : [];

        // Then fetch mata kuliah for each peminatan
        const peminatanPromises = peminatanList.map(
          async (peminatan: Peminatan) => {
            try {
              const mataKuliahResponse =
                await MataKuliahPeminatanSuperAdminService.getMataKuliahPeminatanAll(
                  peminatan.peminatan
                );

              const matkul =
                mataKuliahResponse.success && mataKuliahResponse.data
                  ? Array.isArray(mataKuliahResponse.data)
                    ? mataKuliahResponse.data
                    : []
                  : [];

              // Get icon and color config for this peminatan
              const config = peminatanConfig[
                peminatan.peminatan as keyof typeof peminatanConfig
              ] || {
                icon: Star,
                color: "from-primary to-primary-500",
              };

              return {
                id: peminatan.id || 0,
                title: `Mata Kuliah Peminatan ${peminatan.peminatan}`,
                icon: config.icon,
                color: config.color,
                matkul: matkul,
                peminatanName: peminatan.peminatan,
              };
            } catch (err) {
              console.error(
                `Error fetching mata kuliah for ${peminatan.peminatan}:`,
                err
              );

              const config = peminatanConfig[
                peminatan.peminatan as keyof typeof peminatanConfig
              ] || {
                icon: Star,
                color: "from-primary to-primary-500",
              };

              return {
                id: peminatan.id || 0,
                title: `Mata Kuliah Peminatan ${peminatan.peminatan}`,
                icon: config.icon,
                color: config.color,
                matkul: [],
                peminatanName: peminatan.peminatan,
              };
            }
          }
        );

        const results = await Promise.all(peminatanPromises);
        setPeminatanData(results);
      } else {
        setPeminatanData([]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memuat data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPeminatanData();
  }, []);

  const currentPeminatan = peminatanData.find(
    (_, index) => activePeminatan === `peminatan-${index}`
  );

  // Loading State
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        {/* Navigation Skeleton */}
        <div className="mb-6 md:mb-8">
          {/* Mobile Navigation Skeleton */}
          <div className="md:hidden">
            <Skeleton className="w-full h-12 rounded-lg" />
          </div>

          {/* Desktop Navigation Skeleton */}
          <div className="hidden md:flex space-x-2 lg:space-x-4">
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                className="h-10 w-32 rounded-lg flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden border">
          <div className="bg-gradient-to-r from-primary to-primary-500 py-4 px-6">
            <Skeleton className="h-6 w-48 bg-white/20" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary-50">
                  <th className="py-3 px-6 text-left w-16">No</th>
                  <th className="py-3 px-6 text-left w-32 lg:w-40">Kode</th>
                  <th className="py-3 px-6 text-left">Mata Kuliah</th>
                  <th className="py-3 px-6 text-center w-20">SKS</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(6)].map((_, index) => (
                  <tr key={index}>
                    <td className="py-3 px-6 border-b border-gray-200">
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </td>
                    <td className="py-3 px-6 border-b border-gray-200">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="py-3 px-6 border-b border-gray-200">
                      <Skeleton className="h-4 w-64" />
                    </td>
                    <td className="py-3 px-6 border-b border-gray-200">
                      <Skeleton className="h-6 w-12 rounded-full mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card Skeleton */}
        <div className="md:hidden space-y-4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary-500 px-4 py-3">
              <Skeleton className="h-5 w-32 bg-white/20" />
            </div>
            <div className="p-4 space-y-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return <ErrorStateMataKuliah onRetry={fetchPeminatanData} />;
  }

  // Empty State - No peminatan data at all
  if (peminatanData.length === 0) {
    return (
      <EmptyStateMataKuliah
        title="Belum Ada Data Peminatan"
        description="Saat ini belum ada data mata kuliah peminatan yang tersedia. Silakan hubungi administrator untuk menambahkan data peminatan."
        onRefresh={fetchPeminatanData}
        onUseDummyData={(dummyData) => {
          // Transform dummyData to match PeminatanData interface
          const transformedData: PeminatanData[] = dummyData.map((semester) => {
            // Find corresponding peminatan config or use default
            const peminatanName = semester.title.includes("RPLD")
              ? "RPLD"
              : semester.title.includes("Sistem Cerdas")
              ? "Sistem Cerdas"
              : semester.title.includes("SKKKD")
              ? "SKKKD"
              : "RPLD";

            const config = peminatanConfig[
              peminatanName as keyof typeof peminatanConfig
            ] || {
              icon: Star,
              color: "from-primary to-primary-500",
            };

            return {
              id: semester.semester,
              title: semester.title,
              icon: config.icon,
              color: config.color,
              matkul: semester.matkul.map((mk) => ({
                ...mk,
                id: parseInt(mk.kode) || 0, // Convert kode to number for id
                peminatan: peminatanName,
                peminatan_id: semester.semester,
                // Ensure all required fields are present
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })),
              peminatanName: peminatanName,
            };
          });
          setPeminatanData(transformedData);
          setError(null);
          setIsLoading(false);
        }}
      />
    );
  }

  return (
    <div>
      {/* Navigation */}
      <div className="max-w-6xl mx-auto mb-6 md:mb-8">
        <div className="relative">
          {/* Mobile: Dropdown Style Navigation */}
          <div className="md:hidden">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 font-medium flex items-center justify-between"
              >
                <span>
                  {currentPeminatan?.title.replace(
                    "Mata Kuliah Peminatan ",
                    ""
                  )}
                </span>
                <div
                  className={`transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-sm z-10">
                  {peminatanData.map((peminatan, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActivePeminatan(`peminatan-${index}`);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                        activePeminatan === `peminatan-${index}`
                          ? "bg-primary-50 text-primary-600"
                          : ""
                      }`}
                    >
                      {peminatan.title.replace("Mata Kuliah Peminatan ", "")}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop: Tab Style Navigation */}
          <div className="hidden md:flex py-2">
            <div className="flex space-x-2 lg:space-x-4">
              {peminatanData.map((peminatan, index) => {
                const IconComponent = peminatan.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setActivePeminatan(`peminatan-${index}`)}
                    className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center space-x-2 hover:scale-105 hover:-translate-y-0.5 ${
                      activePeminatan === `peminatan-${index}`
                        ? "bg-primary-500 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>
                      {peminatan.title.replace("Mata Kuliah Peminatan ", "")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {peminatanData.map(
          (peminatan, index) =>
            activePeminatan === `peminatan-${index}` && (
              <div key={`peminatan-${index}`}>
                {/* Desktop Table View */}
                <div className="hidden border md:block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${peminatan.color} py-4 px-6 relative overflow-hidden`}
                  >
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="25" y="25" width="50" height="50" fill="none" stroke="%23fff" strokeWidth="2"/></svg>\')',
                        backgroundSize: "35px 35px",
                      }}
                    />

                    <h3 className="text-xl font-bold text-white relative z-10 flex items-center">
                      <peminatan.icon className="w-6 h-6 mr-3" />
                      {peminatan.title}
                    </h3>
                  </div>
                  <div>
                    <table className="w-full">
                      <thead>
                        <tr className="bg-primary-50">
                          <th className="py-3 px-6 text-left font-semibold text-gray-700 w-16">
                            No
                          </th>
                          <th className="py-3 px-6 text-left font-semibold text-gray-700 w-32 lg:w-40">
                            Kode
                          </th>
                          <th className="py-3 px-6 text-left font-semibold text-gray-700">
                            Mata Kuliah
                          </th>
                          <th className="py-3 px-6 text-center font-semibold text-gray-700 w-20">
                            SKS
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {peminatan.matkul.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-12 px-6 text-center">
                              <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                                  <BookOpen className="w-8 h-8 text-primary-600" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-800 mb-2">
                                  Belum Ada Mata Kuliah
                                </h4>
                                <p className="text-gray-500 max-w-sm">
                                  Belum ada mata kuliah yang tersedia untuk
                                  peminatan {peminatan.peminatanName}.
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          peminatan.matkul.map((matkul, i) => (
                            <tr key={i}>
                              <td className="py-3 px-6 border-b border-gray-200 text-center text-sm">
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-100 text-primary-600 rounded-full text-xs font-bold">
                                  {i + 1}
                                </span>
                              </td>
                              <td className="py-3 px-6 border-b border-gray-200 font-medium text-sm">
                                <span className="text-primary-600">
                                  {matkul.kode}
                                </span>
                              </td>
                              <td className="py-3 px-6 border-b border-gray-200 text-sm lg:text-base">
                                {matkul.name}
                              </td>
                              <td className="py-3 px-6 border-b border-gray-200 text-center text-sm">
                                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {matkul.sks}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${peminatan.color} px-4 py-3`}
                    >
                      <h3 className="text-lg font-bold text-white flex items-center">
                        <peminatan.icon className="w-5 h-5 mr-2" />
                        {peminatan.title}
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {peminatan.matkul.length === 0 ? (
                        <div className="flex flex-col items-center py-8 text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="w-8 h-8 text-gray-400" />
                          </div>
                          <h4 className="text-base font-medium text-gray-900 mb-2">
                            Belum Ada Mata Kuliah
                          </h4>
                          <p className="text-sm text-gray-600">
                            Belum ada mata kuliah yang tersedia untuk peminatan{" "}
                            {peminatan.peminatanName}.
                          </p>
                        </div>
                      ) : (
                        peminatan.matkul.map((matkul, i) => (
                          <div
                            key={i}
                            className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-100 text-primary-500 text-xs font-bold rounded-full">
                                  {i + 1}
                                </span>
                                <span className="text-xs font-medium text-gray-600 truncate">
                                  {matkul.kode}
                                </span>
                              </div>
                              <h4 className="text-sm font-medium text-gray-900 leading-tight">
                                {matkul.name}
                              </h4>
                            </div>
                            <div className="ml-3 flex-shrink-0">
                              <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-500 text-xs font-medium rounded-full">
                                <Clock className="w-3 h-3 mr-1" />
                                {matkul.sks} SKS
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default MataKuliahPeminatan;
