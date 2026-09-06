import {
  BookCheck,
  Briefcase,
  GraduationCap,
  LayoutGrid,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTabCategory } from "@/lib/landing-page/pengumuman/announcement-utils";

// ─── Loading (inline, bukan Suspense) ────────────────────────────────────────

export const PengumumanTerbaruLoadingState = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-sm p-4 animate-pulse border-l-4 border-l-gray-200"
        >
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
          <div className="h-5 bg-gray-200 rounded-full w-20 mb-3" />
          <div className="space-y-1 mb-3">
            <div className="h-3 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
            <div className="h-3 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Error ────────────────────────────────────────────────────────────────────

interface PengumumanTerbaruErrorStateProps {
  onRetry?: () => void;
}

export const PengumumanTerbaruErrorState = ({ onRetry }: PengumumanTerbaruErrorStateProps) => {
  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="bg-[#fff5f5] border border-[#feb2b2] rounded-2xl shadow-sm p-12 text-center">
        <div className="w-24 h-24 mx-auto mb-8 bg-[#fed7d7] rounded-full flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-[#e53e3e]" />
        </div>
        <h3 className="text-2xl font-bold text-[#9b2c2c] mb-4">Terjadi Kesalahan</h3>
        <p className="text-[#c53030] mb-8 max-w-lg mx-auto leading-relaxed text-lg">
          Gagal memuat data pengumuman. Silakan coba lagi atau hubungi administrator jika masalah berlanjut.
        </p>
        {onRetry && (
          <Button
            onClick={onRetry}
            className="bg-[#e53e3e] hover:bg-[#c53030] text-white px-8 h-12 rounded-full font-semibold shadow-md transition-all hover:scale-105 active:scale-95 border-none"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Coba Lagi
          </Button>
        )}
      </div>
    </div>
  );
};

// ─── Empty ────────────────────────────────────────────────────────────────────

interface PengumumanTerbaruEmptyStateProps {
  activeTab: string;
  searchQuery?: string;
  onRefresh?: () => void;
}

const TAB_ICON_MAP: Record<string, React.ReactNode> = {
  ta: <BookCheck className="w-12 h-12 text-primary" />,
  kp: <Briefcase className="w-12 h-12 text-primary" />,
  bk: <GraduationCap className="w-12 h-12 text-primary" />,
};

export const PengumumanTerbaruEmptyState = ({
  activeTab,
  searchQuery,
  onRefresh,
}: PengumumanTerbaruEmptyStateProps) => {
  const icon = TAB_ICON_MAP[activeTab] ?? (
    <LayoutGrid className="w-12 h-12 text-primary" />
  );
  const kategori = activeTab === "semua" ? "apapun" : getTabCategory(activeTab);

  return (
    <div className="max-w-6xl mx-auto space-y-4 py-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-24 h-24 mx-auto mb-8 bg-prodi-subtle rounded-full flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {searchQuery ? "Tidak Ditemukan" : "Belum Ada Pengumuman"}
        </h3>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed text-lg">
          {searchQuery
            ? `Tidak ada hasil untuk pencarian "${searchQuery}"${
                activeTab !== "semua"
                  ? ` pada kategori ${getTabCategory(activeTab)}`
                  : ""
              }.`
            : `Belum ada pengumuman ${kategori} yang tersedia saat ini.`}
        </p>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            className="bg-primary hover:bg-primary-600 text-white px-8 h-12 rounded-full font-semibold shadow-md transition-all hover:scale-105 active:scale-95 border-none"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Muat Ulang
          </Button>
        )}
      </div>
    </div>
  );
};
