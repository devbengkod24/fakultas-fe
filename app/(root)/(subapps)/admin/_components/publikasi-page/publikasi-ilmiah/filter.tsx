"use client";

import SearchControl from "@/components/search-control";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const PRODI_OPTIONS = [
  "Teknik Informatika S1",
  "Sistem Informasi S1",
  "Ilmu Komunikasi S1",
  "Desain Komunikasi Visual S1",
  "PJJ Informatika S1",
  "Teknik Informatika S2",
  "Ilmu Komputer S3",
  "Film dan Televisi D4",
  "Animasi D4",
  "Teknik Informatika D3",
];

interface FilterPublikasiProps {
  isLoading?: boolean;
  rightSlot?: React.ReactNode;
  showProdiFilter?: boolean;
}

const DEBOUNCE_MS = 500;
const DEFAULT_SEARCH_TYPE = "title";

export function FilterPublikasi({
  isLoading,
  rightSlot,
  showProdiFilter,
}: FilterPublikasiProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<string>(DEFAULT_SEARCH_TYPE);
  const [selectedProdi, setSelectedProdi] = useState("");
  const isFirstRender = useRef(true);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync form state from URL on initial load (e.g. saat reload halaman)
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    const urlSearchType = searchParams.get("searchType");
    const urlProdi = searchParams.get("prodi");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
    if (urlSearchType) {
      setSearchType(urlSearchType);
    }
    if (urlProdi) {
      setSelectedProdi(urlProdi);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushSearch = (value: string, type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("search", value.trim());
      params.set("searchType", type);
    } else {
      params.delete("search");
      params.delete("searchType");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleSearchTypeChange = (value: string) => {
    setSearchType(value);
    pushSearch(searchQuery, value);
  };

  const handleProdiChange = (value: string) => {
    const prodi = value === "all" ? "" : value;
    setSelectedProdi(prodi);
    const params = new URLSearchParams(searchParams.toString());
    if (prodi) {
      params.set("prodi", prodi);
    } else {
      params.delete("prodi");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  // Auto-search dengan debounce setiap kali searchQuery berubah
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      pushSearch(searchQuery, searchType);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleClearFilter = () => {
    setSearchQuery("");
    setSearchType(DEFAULT_SEARCH_TYPE);
    setSelectedProdi("");
    router.push(window.location.pathname);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex gap-3 w-full flex-wrap">
        <SearchControl
          placeholder={
            searchType === "author"
              ? "Cari berdasarkan penulis..."
              : "Cari berdasarkan judul..."
          }
          className="flex-1 min-w-[200px]"
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <Select
          value={searchType}
          onValueChange={handleSearchTypeChange}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Berdasarkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Judul</SelectItem>
            <SelectItem value="author">Penulis</SelectItem>
          </SelectContent>
        </Select>

        {showProdiFilter && (
          <Select
            value={selectedProdi || "all"}
            onValueChange={handleProdiChange}
          >
            <SelectTrigger className="w-[210px]">
              <SelectValue placeholder="Semua Prodi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Prodi</SelectItem>
              {PRODI_OPTIONS.map((prodi) => (
                <SelectItem key={prodi} value={prodi}>
                  {prodi}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {(searchQuery.trim() ||
          searchParams.get("search") ||
          selectedProdi) && (
          <Button
            type="button"
            variant="outline"
            onClick={handleClearFilter}
            disabled={isLoading}
          >
            Reset
          </Button>
        )}
        {rightSlot}
      </div>
    </div>
  );
}