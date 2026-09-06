"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  Star,
  Zap,
  Shield,
  Library,
  Bookmark,
  Award,
} from "lucide-react";
import {
  MataKuliahSuperAdminService,
  MataKuliahPeminatanSuperAdminService,
  PeminatanSuperAdminService,
} from "@/api/superadmin";
import type { MataKuliahItem } from "@/types/admin/akademik-page/daftar-mata-kuliah/daftar-mata-kuliah";
import type {
  MataKuliahPeminatanItem,
  Peminatan,
} from "@/types/admin/akademik-page/mata-kuliah-peminatan/mata-kuliah-peminatan";
import { DaftarMataKuliahErrorState as ErrorStateMataKuliah } from "./daftar-mata-kuliah-empty-state";
import { DaftarMataKuliahEmptyState as EmptyStateMataKuliah } from "./daftar-mata-kuliah-empty-state";
import DaftarMataKuliahSkeleton from "./daftar-mata-kuliah-skeleton";

const TableSkeleton = DaftarMataKuliahSkeleton;

// ─── Types ────────────────────────────────────────────────────────────────────

interface SemesterData {
  title: string;
  semester: number;
  matkul: MataKuliahItem[];
  jumlah: number;
}

interface PeminatanData {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  matkul: MataKuliahPeminatanItem[];
  peminatanName: string;
}

type TabType = "umum" | "peminatan";

// ─── Config ───────────────────────────────────────────────────────────────────

const peminatanConfig = {
  RPLD: { icon: Zap, color: "from-prodi-start to-prodi-end" },
  "Sistem Cerdas": { icon: Star, color: "from-prodi-start to-prodi-end" },
  SKKKD: { icon: Shield, color: "from-prodi-start to-prodi-end" },
};

// ─── Table Content ─────────────────────────────────────────────────────────────

interface TableContentProps {
  title: string;
  matkul: (MataKuliahItem | MataKuliahPeminatanItem)[];
  jumlah?: number;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  peminatanName?: string;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

const TableContent: React.FC<TableContentProps> = ({
  title,
  matkul,
  jumlah,
  color = "from-prodi-start to-prodi-end",
  peminatanName,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  icon: Icon = BookOpen,
}) => {
  const totalSKS = jumlah ?? matkul.reduce((sum, mk) => sum + (mk.sks || 0), 0);

  return (
    <>
      <div className="hidden border md:block bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 mb-4 w-full">
        {/* Daftar Mata Kuliah Table View Content */}
        <div className={`bg-gradient-to-r ${color} py-4 px-6 relative overflow-hidden flex items-center justify-between text-white`}>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="none" stroke="%23fff" strokeWidth="2"/></svg>\')',
              backgroundSize: "40px 40px",
            }}
          />

          {onPrev !== undefined ? (
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              className="relative z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          ) : (
            <div className="w-8 h-8"></div>
          )}

          <h3 className="text-xl font-bold relative z-10 flex items-center justify-center flex-1">
            <Icon className="w-6 h-6 mr-3" />
            {title}
          </h3>

          {onNext !== undefined ? (
            <button
              onClick={onNext}
              disabled={!hasNext}
              className="relative z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          ) : (
            <div className="w-8 h-8"></div>
          )}
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full min-w-full">
            <thead>
              <tr className="bg-prodi-subtle">
                <th className="py-3 px-6 text-left font-semibold text-gray-700 w-16">No</th>
                <th className="py-3 px-6 text-left font-semibold text-gray-700 w-32 lg:w-40">Kode</th>
                <th className="py-3 px-6 text-left font-semibold text-gray-700">Mata Kuliah</th>
                <th className="py-3 px-6 text-center font-semibold text-gray-700 w-20">SKS</th>
              </tr>
            </thead>
            <tbody>
              {matkul.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 px-6 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Mata Kuliah</h4>
                      <p className="text-gray-600 max-w-sm">
                        Belum ada mata kuliah yang tersedia untuk {peminatanName ?? title}.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                matkul.map((mk, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-6 border-b border-gray-200 text-center text-sm">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-prodi-subtle text-primary-600 rounded-full text-xs font-bold">
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-3 px-6 border-b border-gray-200 font-medium text-sm">
                      <span className="text-primary-600">
                        {mk.kode}
                      </span>
                    </td>
                    <td className="py-3 px-6 border-b border-gray-200 text-sm lg:text-base text-gray-800">
                      {mk.name}
                    </td>
                    <td className="py-3 px-6 border-b border-gray-200 text-center text-sm">
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                        <Clock className="w-3 h-3 mr-1" />
                        {mk.sks}
                      </span>
                    </td>
                  </tr>
                ))
              )}
              <tr className="bg-prodi-subtle">
                <td className="py-3 px-6 font-bold text-right text-sm lg:text-base text-gray-700" colSpan={3}>
                  <span className="flex items-center justify-end">
                    <Award className="w-4 h-4 mr-2" />
                    Total SKS
                  </span>
                </td>
                <td className="py-3 px-6 font-bold text-center text-sm lg:text-base">
                  <span className="inline-flex items-center px-3 py-1 bg-primary text-white rounded-full">
                    {totalSKS}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-4 mb-4 w-full">
        {/* Mobile Card View Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full">
          <div className={`bg-gradient-to-r ${color} px-4 py-3 flex items-center justify-between text-white`}>
            {onPrev !== undefined ? (
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 disabled:opacity-40"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
            ) : (
              <div className="w-8 h-8"></div>
            )}
            
            <h3 className="text-lg font-bold flex items-center justify-center flex-1">
              <Icon className="w-5 h-5 mr-2" />
              {title}
            </h3>

            {onNext !== undefined ? (
              <button
                onClick={onNext}
                disabled={!hasNext}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 disabled:opacity-40"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            ) : (
              <div className="w-8 h-8"></div>
            )}
          </div>

          <div className="p-4 space-y-3">
            {matkul.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-base font-medium text-gray-900 mb-2">Belum Ada Mata Kuliah</h4>
                <p className="text-sm text-gray-600">
                  Belum ada mata kuliah yang tersedia untuk {peminatanName ?? title}.
                </p>
              </div>
            ) : (
              matkul.map((mk, i) => (
                <div key={i} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:scale-[1.02] hover:bg-gray-100 transition-all duration-200">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-prodi-subtle text-primary text-xs font-bold rounded-full hover:scale-110 hover:rotate-12 transition-all duration-300">
                        {i + 1}
                      </span>
                      <span className="text-xs font-medium text-gray-600 truncate">
                        {mk.kode}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 leading-tight">
                      {mk.name}
                    </h4>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <span className="inline-flex items-center px-2 py-1 bg-prodi-subtle text-primary text-xs font-medium rounded-full hover:scale-105 transition-transform">
                      <Clock className="w-3 h-3 mr-1" />
                      {mk.sks} SKS
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
                <span className="inline-flex items-center px-3 py-1 bg-primary text-white text-sm font-bold rounded-full hover:scale-105 transition-transform">
                    {totalSKS} SKS
                </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

const DaftarMataKuliahClient = ({ prodiId }: { prodiId?: number }) => {
  const [activeTab, setActiveTab] = useState<TabType>("umum");


  // Umum state
  const [semesterData, setSemesterData] = useState<SemesterData[]>([]);
  const [activeSemesterIndex, setActiveSemesterIndex] = useState(0);
  const [isLoadingUmum, setIsLoadingUmum] = useState(true);
  const [errorUmum, setErrorUmum] = useState<string | null>(null);

  // Peminatan state
  const [peminatanData, setPeminatanData] = useState<PeminatanData[]>([]);
  const [activePeminatanIndex, setActivePeminatanIndex] = useState(0);
  const [isLoadingPeminatan, setIsLoadingPeminatan] = useState(true);
  const [errorPeminatan, setErrorPeminatan] = useState<string | null>(null);

  // ── Fetch Umum ──────────────────────────────────────────────────────────────

  const fetchAllSemesters = async () => {
    try {
      setIsLoadingUmum(true);
      setErrorUmum(null);
      const semesterNumbers = Array.from({ length: 8 }, (_, i) => i + 1);
      const results = await Promise.all(
        semesterNumbers.map(async (semesterNum) => {
          try {
            const response = await MataKuliahSuperAdminService.getMataKuliahAll(
              semesterNum.toString(),
              prodiId
            );
            if (response.success && response.data) {
              const matkul = Array.isArray(response.data) ? response.data : [];
              const totalSKS = matkul.reduce(
                (sum: number, mk: MataKuliahItem) => sum + (mk.sks || 0),
                0
              );
              return {
                title: `Semester ${toRoman(semesterNum)}`,
                semester: semesterNum,
                matkul,
                jumlah: totalSKS,
              };
            }
          } catch (err) {
            console.error(`Error fetching semester ${semesterNum}:`, err);
          }
          return {
            title: `Semester ${toRoman(semesterNum)}`,
            semester: semesterNum,
            matkul: [],
            jumlah: 0,
          };
        })
      );
      setSemesterData(results);
    } catch (err) {
      setErrorUmum(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data");
    } finally {
      setIsLoadingUmum(false);
    }
  };

  // ── Fetch Peminatan ─────────────────────────────────────────────────────────

  const fetchPeminatanData = async () => {
    try {
      setIsLoadingPeminatan(true);
      setErrorPeminatan(null);
      const peminatanResponse = await PeminatanSuperAdminService.getPeminatan();
      if (peminatanResponse.success && peminatanResponse.data) {
        const list: Peminatan[] = Array.isArray(peminatanResponse.data) ? peminatanResponse.data : [];
        const results = await Promise.all(
          list.map(async (peminatan) => {
            try {
              const mkResponse =
                await MataKuliahPeminatanSuperAdminService.getMataKuliahPeminatanAll(
                  peminatan.peminatan,
                  prodiId
                );
              const matkul =
                mkResponse.success && mkResponse.data
                  ? Array.isArray(mkResponse.data)
                    ? mkResponse.data
                    : []
                  : [];
              const config = peminatanConfig[peminatan.peminatan as keyof typeof peminatanConfig] ?? { icon: Star, color: "from-primary to-primary-500" };
              return {
                id: peminatan.id ?? 0,
                title: `Peminatan ${peminatan.peminatan}`,
                icon: config.icon,
                color: config.color,
                matkul,
                peminatanName: peminatan.peminatan,
              };
            } catch {
              const config = peminatanConfig[peminatan.peminatan as keyof typeof peminatanConfig] ?? { icon: Star, color: "from-primary to-primary-500" };
              return {
                id: peminatan.id ?? 0,
                title: `Peminatan ${peminatan.peminatan}`,
                icon: config.icon,
                color: config.color,
                matkul: [],
                peminatanName: peminatan.peminatan,
              };
            }
          })
        );
        setPeminatanData(results);
      } else {
        setPeminatanData([]);
      }
    } catch (err) {
      setErrorPeminatan(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data");
    } finally {
      setIsLoadingPeminatan(false);
    }
  };

  useEffect(() => {
    fetchAllSemesters();
    fetchPeminatanData();
  }, [prodiId]);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const toRoman = (n: number) =>
    ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"][n - 1] ?? n.toString();

  const currentSemester = semesterData[activeSemesterIndex];
  const currentPeminatan = peminatanData[activePeminatanIndex];

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* ── Top Tab Navigation ─────────────────────────────────────────────── */}
      <div className="flex justify-center mb-4">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setActiveTab("umum")}
            className={`
              inline-flex items-center gap-1.5 px-6 py-2.5 rounded-md text-sm font-medium
              border transition-all duration-200
              ${
                activeTab === "umum"
                  ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-primary-400 hover:text-primary-600"
              }
            `}
          >
            <Library className="w-4 h-4" />
            Umum
          </button>
          <button
            onClick={() => setActiveTab("peminatan")}
            className={`
              inline-flex items-center gap-1.5 px-6 py-2.5 rounded-md text-sm font-medium
              border transition-all duration-200
              ${
                activeTab === "peminatan"
                  ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-primary-400 hover:text-primary-600"
              }
            `}
          >
            <Bookmark className="w-4 h-4" />
            Peminatan
          </button>
        </div>
      </div>

      {/* ── TAB: UMUM ──────────────────────────────────────────────────────── */}
      {activeTab === "umum" && (
        <div className="w-full">
          {isLoadingUmum ? (
            <TableSkeleton />
          ) : errorUmum ? (
            <ErrorStateMataKuliah onRetry={fetchAllSemesters} />
          ) : semesterData.length === 0 || semesterData.every((s) => s.matkul.length === 0) ? (
            <EmptyStateMataKuliah
              type="umum"
              onRefresh={fetchAllSemesters}
            />
          ) : currentSemester ? (
            <TableContent
              title={currentSemester.title}
              matkul={currentSemester.matkul}
              jumlah={currentSemester.jumlah}
              onPrev={() => setActiveSemesterIndex((i) => Math.max(0, i - 1))}
              onNext={() => setActiveSemesterIndex((i) => Math.min(semesterData.length - 1, i + 1))}
              hasPrev={activeSemesterIndex > 0}
              hasNext={activeSemesterIndex < semesterData.length - 1}
            />
          ) : null}
        </div>
      )}

      {/* ── TAB: PEMINATAN ─────────────────────────────────────────────────── */}
      {activeTab === "peminatan" && (
        <div className="w-full">
          {isLoadingPeminatan ? (
            <TableSkeleton />
          ) : errorPeminatan ? (
            <ErrorStateMataKuliah onRetry={fetchPeminatanData} />
          ) : peminatanData.length === 0 || peminatanData.every((p) => p.matkul.length === 0) ? (
            <EmptyStateMataKuliah
              type="peminatan"
              onRefresh={fetchPeminatanData}
            />
          ) : (
            <>
              {/* Peminatan Table Content Content */}
              {currentPeminatan && (
                <TableContent
                  title={currentPeminatan.title}
                  matkul={currentPeminatan.matkul}
                  icon={currentPeminatan.icon}
                  color={currentPeminatan.color}
                  peminatanName={currentPeminatan.peminatanName}
                  onPrev={() => setActivePeminatanIndex((i) => Math.max(0, i - 1))}
                  onNext={() => setActivePeminatanIndex((i) => Math.min(peminatanData.length - 1, i + 1))}
                  hasPrev={activePeminatanIndex > 0}
                  hasNext={activePeminatanIndex < peminatanData.length - 1}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DaftarMataKuliahClient;
