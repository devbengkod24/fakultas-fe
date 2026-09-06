"use client";

import SearchControl from "@/components/search-control";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface FilterRisetProps {
  isLoading?: boolean;
  rightSlot?: React.ReactNode;
  showProdiFilter?: boolean;
}

const DEBOUNCE_MS = 500;
const DEFAULT_SEARCH_TYPE = "title";

export function FilterRiset({
  isLoading,
  rightSlot,
  showProdiFilter,
}: FilterRisetProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<string>(DEFAULT_SEARCH_TYPE);
  const [termahal, setTermahal] = useState(false);
  const [selectedProdi, setSelectedProdi] = useState("");
  const isFirstRender = useRef(true);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync form state from URL on initial load (e.g. saat reload halaman)
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    const urlTermahal = searchParams.get("termahal") === "true";
    const urlSearchType = searchParams.get("searchType");
    const urlProdi = searchParams.get("prodi");

    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
    if (searchParams.has("termahal")) {
      setTermahal(urlTermahal);
    }
    if (urlSearchType) {
      setSearchType(urlSearchType);
    }
    if (urlProdi) {
      setSelectedProdi(urlProdi);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushParams = (value: string, termahalValue: boolean, type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("search", value.trim());
      params.set("searchType", type);
    } else {
      params.delete("search");
      params.delete("searchType");
    }
    if (termahalValue) {
      params.set("termahal", "true");
    } else {
      params.delete("termahal");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleSearchTypeChange = (value: string) => {
    setSearchType(value);
    pushParams(searchQuery, termahal, value);
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
      pushParams(searchQuery, termahal, searchType);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Termahal langsung trigger navigasi tanpa debounce
  const handleTermahalChange = (checked: boolean) => {
    setTermahal(checked);
    pushParams(searchQuery, checked, searchType);
  };

  const handleClearFilter = () => {
    setSearchQuery("");
    setSearchType(DEFAULT_SEARCH_TYPE);
    setTermahal(false);
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

        <div className="flex items-center space-x-2">
          <Checkbox
            id="termahal"
            checked={termahal}
            onCheckedChange={handleTermahalChange}
          />
          <label
            htmlFor="termahal"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Termahal
          </label>
        </div>

        {(searchQuery.trim() ||
          searchParams.get("search") ||
          termahal ||
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
