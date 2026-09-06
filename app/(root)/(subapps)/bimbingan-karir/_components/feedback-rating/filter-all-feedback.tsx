"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SummaryDialog } from "@/app/(root)/(subapps)/bimbingan-karir/_components/feedback-rating/summary"
import { useRouter, useSearchParams } from "next/navigation";

interface KegiatanItem {
  id: number;
  nama_kegiatan: string;
}

interface FilterAllFeedbackProps {
  kegiatanList: KegiatanItem[];
}

const ratingOptions = [
  { value: "all", label: "Semua Rating" },
  { value: "5", label: "⭐ 5" },
  { value: "4", label: "⭐ 4" },
  { value: "3", label: "⭐ 3" },
  { value: "2", label: "⭐ 2" },
  { value: "1", label: "⭐ 1" },
];

export function FilterAllFeedback({ kegiatanList }: FilterAllFeedbackProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentId = searchParams.get("id") || "";
  const currentRating = searchParams.get("rating") || "";

  const handleKegiatanChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set("id", value);
    } else {
      params.delete("id");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleRatingChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set("rating", value);
    } else {
      params.set("rating", "");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const selectedKegiatanId = searchParams.get("id");
  const selectedKegiatan = kegiatanList.find(k => k.id === Number(selectedKegiatanId));

  return (
    <div className="flex flex-col md:flex-row gap-2 items-end md:items-center justify-between">
      <div className="flex gap-2 flex-1">
        {/* Filter by Rating */}
        <Select
          onValueChange={handleRatingChange}
          value={currentRating || "all"}
        >
          <SelectTrigger className="w-[155px] h-full">
            <SelectValue placeholder="Pilih Rating" />
          </SelectTrigger>
          <SelectContent>
            {ratingOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Filter by Kegiatan */}
        <Select
          onValueChange={handleKegiatanChange}
          value={currentId || "all"}
        >
          <SelectTrigger className="w-[180px] h-full">
            <SelectValue placeholder="Pilih Kegiatan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Pilih Kegiatan</SelectItem>
            {kegiatanList.map((kegiatan) => (
              <SelectItem key={kegiatan.id} value={kegiatan.id.toString()}>
                {kegiatan.nama_kegiatan}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Button Summary - hanya muncul jika ada kegiatan yang dipilih */}
      {selectedKegiatan && (
        <SummaryDialog
          kegiatanId={selectedKegiatan.id}
          kegiatanName={selectedKegiatan.nama_kegiatan}
        />
      )}
    </div>
  )
}
