"use client";

import type React from "react";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

const BeritaSearchBar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchFromUrl = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(searchFromUrl);

  const updateSearchUrl = useCallback((query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("search", query.trim());
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  useEffect(() => {
    if (searchQuery === searchFromUrl) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      updateSearchUrl(searchQuery);
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, searchFromUrl, updateSearchUrl]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setSearchQuery(searchFromUrl);
  }, [searchFromUrl]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateSearchUrl(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    updateSearchUrl("");
  };

  return (
    <div className="h-full w-full">
      <div className="h-full w-full flex items-center bg-white rounded-[10px] px-4 py-2 text-gray-500 transition-all border border-gray-300 hover:border-primary focus-within:border-primary focus-within:outline-none focus-within:shadow-none focus-within:ring-0 shadow-none">
        <Search className="w-5 h-5 flex-shrink-0 mr-3 text-gray-400" />
        <div className="flex-1 px-1 py-0 bg-white">
          <Input
            type="text"
            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus:shadow-none focus-visible:shadow-none active:shadow-none text-sm font-medium p-0 m-0 h-6 leading-none placeholder-gray-400"
            placeholder="Cari berita..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="flex items-center ml-3 flex-shrink-0 rounded-full p-1 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BeritaSearchBar;
