"use client";

import SearchControl from "@/components/search-control";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function FilterSyncDosen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md">
      <SearchControl
        placeholder="Cari nama dosen..."
        className="w-full"
        value={searchQuery}
        onChange={(value) => setSearchQuery(value)}
      />
    </form>
  );
}
