import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import KegiatanGalleryDetail from "./kegiatan-gallery-detail";
import { API_URL } from "@/lib/constant";
import { AktivitasProgramUnggulanSuperAdminService, AktivitasProgramUnggulanPublicService } from "@/api/superadmin";
import useSWR from "swr";

const ITEMS_PER_PAGE = 4;

// Helper function to construct image URLs
const getImageUrl = (imagePath: string | null): string => {
  if (!imagePath || imagePath === "null") {
    return "/placeholder.svg";
  }

  const cleanPath = imagePath.replace(/\\/g, "/");

  if (cleanPath.startsWith("http")) {
    return cleanPath;
  }

  const baseUrl =
    API_URL?.replace("/api/v1", "") || "https://api-dev-sti.dinus.id";

  if (cleanPath.startsWith("/storage/")) {
    return `${baseUrl}${cleanPath}`;
  } else {
    return `${baseUrl}/storage/${cleanPath}`;
  }
};

// Types
interface Kegiatan {
  id: number;
  program_id?: number;
  title: string;
  description: string;
  image: string;
  date: string;
  program_name: string;
  period_label: string;
  location?: string;
}

interface KegiatanGalleryProps {
  programName: string;
  programId?: number;
  prodiId?: number;
  dummyData?: Kegiatan[]; // Keep for fallback or initial render
  isAdmin?: boolean;
  showFilter?: boolean;
}

// Extract unique periods for filter
const extractPeriods = (data: Kegiatan[]): string[] => {
  const periods = [...new Set(data.map((item) => item.period_label))];
  return periods.sort((a, b) => b.localeCompare(a)); // Sort descending (newest first)
};

export default function KegiatanGallery({
  programName,
  programId,
  prodiId,
  dummyData = [],
  isAdmin = false,
  showFilter = true,
}: KegiatanGalleryProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKegiatan, setSelectedKegiatan] = useState<Kegiatan | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data from API
  const { data: apiResponse, isLoading, mutate } = useSWR(
    [`program-photos`, programId || "all", prodiId],
    async () => {
      const service = isAdmin ? AktivitasProgramUnggulanSuperAdminService : AktivitasProgramUnggulanPublicService;
      const res = programId
        ? await service.getProgramUnggulanPhotosByProgramId(
            programId,
            1,
            100
          )
        : await service.getProgramUnggulanActivitiesAll(
            1,
            100,
            prodiId
          );
      return res.success ? res.data : [];
    }
  );

  // Map API data to Kegiatan interface
  const getActivitiesArray = (response: any) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    // Handle res = { total: 4, data: [...] } structure mapping directly
    if (response.data && Array.isArray(response.data)) return response.data;
    // Handle nested response.data.data
    if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
    return [];
  };

  const activities: Kegiatan[] = apiResponse 
    ? getActivitiesArray(apiResponse).map((item: any) => ({
        id: item.id,
        program_id: item.program_id,
        title: item.title,
        description: item.description,
        image: item.image,
        date: item.created_at,
        program_name: item.program_name || programName,
        period_label: item.period_label || "Umum", // Fallback if missing
        location: item.location || "",
      }))
    : dummyData;

  const periods = extractPeriods(activities);

  // Filter data by selected period AND search query
  const filteredData = activities.filter((item) => {
    // If the backend doesn't have period_label, we just skip period filtering 
    // unless they explicitly chose something else
    const matchesPeriod = selectedPeriod === "all" || item.period_label === selectedPeriod;
    const matchesSearch = searchQuery === "" ||
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // If we're inside a specific program detail, maybe only show that program's photos
    const matchesProgram = programId ? Number(item.program_id) === Number(programId) : true;

    return matchesPeriod && matchesSearch && matchesProgram;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page when filter changes
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setCurrentPage(1);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading && !activities.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-gray-500">Memuat galeri kegiatan...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Filter & Count Row */}
        {showFilter && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left: Period Filter & Search */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari kegiatan..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 w-[200px]"
                />
              </div>

              {/* Period Select */}
              {periods.length > 1 || (periods.length === 1 && periods[0] !== "Umum") ? (
                <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Semua Periode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Periode</SelectItem>
                    {periods.map((period) => (
                      <SelectItem key={period} value={period}>
                        {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}
            </div>

            {/* Activities Count */}
            <div className="text-sm text-gray-500">
              Ditemukan{" "}
              <span className="font-semibold text-primary-600">
                {filteredData.length}
              </span>{" "}
              kegiatan
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {paginatedData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paginatedData.map((kegiatan) => (
              <div
                key={kegiatan.id}
                onClick={() => setSelectedKegiatan(kegiatan)}
                className="group cursor-pointer bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
                  <Image
                    src={getImageUrl(kegiatan.image)}
                    alt={kegiatan.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                  {/* Period Badge */}
                  {kegiatan.period_label && kegiatan.period_label !== "Umum" && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary-100/90 backdrop-blur-sm text-primary-700 border-primary-200 transition-colors text-[10px] md:text-xs px-2 py-1">
                        {kegiatan.period_label}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {kegiatan.title}
                  </h4>

                  {/* Meta info - Tanggal only */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(kegiatan.date)}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {kegiatan.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 py-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm text-gray-500 px-2">
                Halaman {currentPage} dari {totalPages}
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">
              Belum Ada Kegiatan
            </h4>
            <p className="text-sm text-gray-500">
              Tidak ada kegiatan untuk periode{" "}
              <span className="font-semibold">{selectedPeriod}</span>
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 text-primary-600 border-primary-200"
              onClick={() => handlePeriodChange("all")}
            >
              Lihat Semua Periode
            </Button>
          </div>
        )}

        {/* Detail Modal */}
        <KegiatanGalleryDetail
          kegiatan={selectedKegiatan}
          isOpen={!!selectedKegiatan}
          onClose={() => setSelectedKegiatan(null)}
          getImageUrl={getImageUrl}
          formatDate={formatDate}
          isAdmin={isAdmin}
          onDeleteSuccess={() => mutate()}
        />
      </div>
    </>
  );
}
