"use client";

import { useState, useEffect } from "react";
import { ChevronDown, BookOpen, Clock, Award } from "lucide-react";
import { MataKuliahSuperAdminService } from "@/api/superadmin";
import type { MataKuliahItem } from "@/types/admin/akademik-page/daftar-mata-kuliah/daftar-mata-kuliah";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorStateMataKuliah from "./error-state-mata-kuliah";
import EmptyStateMataKuliah from "./empty-state-mata-kuliah";

interface SemesterData {
  title: string;
  semester: number;
  matkul: MataKuliahItem[];
  jumlah: number;
}

const AnimatedMataKuliah = () => {
  const [activeSemester, setActiveSemester] = useState("semester-1");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [semesterData, setSemesterData] = useState<SemesterData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllSemesters = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Generate semester list (1-8)
      const semesterNumbers = Array.from({ length: 8 }, (_, i) => i + 1);
      let hasErrors = false;
      const errorMessages: string[] = [];
      // Fetch data for all semesters
      const semesterPromises = semesterNumbers.map(async (semesterNum) => {
        try {
          const response = await MataKuliahSuperAdminService.getMataKuliahAll(
            semesterNum.toString()
          );

          if (response.success && response.data) {
            const matkul = Array.isArray(response.data) ? response.data : [];
            const totalSKS = matkul.reduce(
              (sum: number, mk: MataKuliahItem) => sum + (mk.sks || 0),
              0
            );

            return {
              title: `Semester ${semesterNum}`,
              semester: semesterNum,
              matkul: matkul,
              jumlah: totalSKS,
            };
          } else {
            // Return empty semester data if no courses found
            return {
              title: `Semester ${semesterNum}`,
              semester: semesterNum,
              matkul: [],
              jumlah: 0,
            };
          }
        } catch (err) {
          hasErrors = true;
          errorMessages.push(
            `Semester ${semesterNum}: ${
              err instanceof Error ? err.message : "Unknown error"
            }`
          );
          console.error(`Error fetching semester ${semesterNum}:`, err); // Return empty semester data on error
          return {
            title: `Semester ${semesterNum}`,
            semester: semesterNum,
            matkul: [],
            jumlah: 0,
          };
        }
      });

      const results = await Promise.all(semesterPromises);
      setSemesterData(results);

      // Set error jika ada kesalahan pada semester manapun
      if (hasErrors) {
        setError(`Gagal memuat beberapa semester: ${errorMessages.join(", ")}`);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memuat data mata kuliah"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSemesters();
  }, []);

  const currentSemester = semesterData.find(
    (_, index) => activeSemester === `semester-${index + 1}`
  );

  // Loading State
  if (isLoading) {
    return (
      <div>
        <div className="max-w-6xl mx-auto">
          {/* Navigation Skeleton */}
          <div className="mb-6 md:mb-8">
            {/* Mobile Navigation Skeleton */}
            <div className="md:hidden">
              <Skeleton className="w-full h-12 rounded-lg" />
            </div>

            {/* Desktop Navigation Skeleton */}
            <div className="hidden md:flex space-x-2 lg:space-x-4">
              {[...Array(8)].map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-10 w-24 rounded-lg flex-shrink-0"
                />
              ))}
            </div>
          </div>

          {/* Content Skeleton */}
          {/* Desktop Table Skeleton */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden border">
            <div className="bg-gradient-to-r from-primary to-primary-500 py-4 px-6">
              <div className="flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-white" />
                <Skeleton className="h-6 w-32 bg-white/20" />
              </div>
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
                  {[...Array(8)].map((_, index) => (
                    <tr key={index}>
                      <td className="py-3 px-6 border-b border-gray-200 text-center">
                        <Skeleton className="w-6 h-6 rounded-full mx-auto" />
                      </td>
                      <td className="py-3 px-6 border-b border-gray-200">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="py-3 px-6 border-b border-gray-200">
                        <Skeleton className="h-4 w-full" />
                      </td>
                      <td className="py-3 px-6 border-b border-gray-200 text-center">
                        <Skeleton className="h-6 w-12 rounded-full mx-auto" />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-primary-50">
                    <td className="py-3 px-6 font-bold text-right" colSpan={3}>
                      <span className="flex items-center justify-end">
                        <Award className="w-4 h-4 mr-2" />
                        Total SKS
                      </span>
                    </td>
                    <td className="py-3 px-6 font-bold text-center">
                      <Skeleton className="h-8 w-12 rounded-full mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Skeleton */}
          <div className="md:hidden space-y-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary-500 px-4 py-3">
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-white" />
                  <Skeleton className="h-5 w-24 bg-white/20" />
                </div>
              </div>
              <div className="p-4 space-y-3">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-sm font-semibold text-gray-700 flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Total SKS
                  </span>
                  <Skeleton className="h-8 w-16 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return <ErrorStateMataKuliah onRetry={fetchAllSemesters} />;
  }

  // Empty State - No semester data at all
  if (
    semesterData.length === 0 ||
    semesterData.every((semester) => semester.matkul.length === 0)
  ) {
    return (
      <EmptyStateMataKuliah
        title="Belum Ada Data Mata Kuliah"
        description="Saat ini belum ada data mata kuliah yang tersedia untuk semua semester. Silakan hubungi administrator untuk menambahkan data mata kuliah."
        onRefresh={fetchAllSemesters}
        onUseDummyData={(dummyData) => {
          // Transform dummyData to match SemesterData interface
          const transformedData: SemesterData[] = dummyData.map(semester => ({
            ...semester,
            matkul: semester.matkul.map(mk => ({
              ...mk,
              semester: semester.semester // Ensure semester property exists
            }))
          }));
          setSemesterData(transformedData);
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
                <span>{currentSemester?.title}</span>
                <div
                  className={`transform transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-sm z-10">
                  {semesterData.map((semester, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveSemester(`semester-${index + 1}`);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                        activeSemester === `semester-${index + 1}`
                          ? "bg-primary-50 text-primary-600"
                          : ""
                      }`}
                    >
                      {semester.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop: Tab Style Navigation */}
          <div className="hidden md:flex overflow-x-auto py-2 scrollbar-hide">
            <div className="flex space-x-2 lg:space-x-4 min-w-full">
              {semesterData.map((semester, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSemester(`semester-${index + 1}`)}
                  className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 hover:scale-105 transform ${
                    activeSemester === `semester-${index + 1}`
                      ? "bg-primary-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {semester.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {semesterData.map(
          (semester, index) =>
            activeSemester === `semester-${index + 1}` && (
              <div
                key={`semester-${index + 1}`}
                className="transition-all duration-500 ease-in-out"
              >
                {/* Desktop Table View */}
                <div className="hidden border md:block bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-primary to-primary-500 py-4 px-6 relative overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="none" stroke="%23fff" strokeWidth="2"/></svg>\')',
                        backgroundSize: "40px 40px",
                      }}
                    />

                    <h3 className="text-xl font-bold text-white relative z-10 flex items-center">
                      <BookOpen className="w-6 h-6 mr-3" />
                      {semester.title}
                    </h3>
                  </div>

                  <div className="overflow-x-auto scrollbar-hide">
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
                        {semester.matkul.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-12 px-6 text-center">
                              <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                  <BookOpen className="w-8 h-8 text-gray-400" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-900 mb-2">
                                  Belum Ada Mata Kuliah
                                </h4>
                                <p className="text-gray-600 max-w-sm">
                                  Belum ada mata kuliah yang tersedia untuk{" "}
                                  {semester.title}.
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          semester.matkul.map((matkul, i) => (
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
                        <tr className="bg-primary-50">
                          <td
                            className="py-3 px-6 font-bold text-right text-sm lg:text-base"
                            colSpan={3}
                          >
                            <span className="flex items-center justify-end">
                              <Award className="w-4 h-4 mr-2" />
                              Total SKS
                            </span>
                          </td>
                          <td className="py-3 px-6 font-bold text-center text-sm lg:text-base">
                            <span className="inline-flex items-center px-3 py-1 bg-primary-500 text-white rounded-full">
                              {semester.jumlah}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-gradient-to-r from-primary to-primary-500 px-4 py-3">
                      <h3 className="text-lg font-bold text-white flex items-center">
                        <BookOpen className="w-5 h-5 mr-2" />
                        {semester.title}
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {semester.matkul.length === 0 ? (
                        <div className="flex flex-col items-center py-8 text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="w-8 h-8 text-gray-400" />
                          </div>
                          <h4 className="text-base font-medium text-gray-900 mb-2">
                            Belum Ada Mata Kuliah
                          </h4>
                          <p className="text-sm text-gray-600">
                            Belum ada mata kuliah yang tersedia untuk{" "}
                            {semester.title}.
                          </p>
                        </div>
                      ) : (
                        semester.matkul.map((matkul, i) => (
                          <div
                            key={i}
                            className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:scale-[1.02] hover:bg-gray-100 transition-all duration-200"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-100 text-primary-500 text-xs font-bold rounded-full hover:scale-110 hover:rotate-12 transition-all duration-300">
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
                              <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-500 text-xs font-medium rounded-full hover:scale-105 transition-transform">
                                <Clock className="w-3 h-3 mr-1" />
                                {matkul.sks} SKS
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                        <span className="text-sm font-semibold text-gray-700 flex items-center">
                          <Award className="w-4 h-4 mr-2" />
                          Total SKS
                        </span>
                        <span className="inline-flex items-center px-3 py-1 bg-primary-500 text-white text-sm font-bold rounded-full hover:scale-105 transition-transform">
                          {semester.jumlah} SKS
                        </span>
                      </div>
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

export default AnimatedMataKuliah;
